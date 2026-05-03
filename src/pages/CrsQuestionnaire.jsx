import { useMemo, useState } from "react";
import {
  celpipMap,
  ieltsMap,
  tefMap,
  tcfMap,
  convertCELPIP,
  convertIELTS,
  convertTEF,
  convertTCF,
  calculateBonusCELPIPPoints,
  calculateBonusIELTSPoints,
  spouseClbPoints,
} from "../constants/languageConstants";

import {
  agePoints,
  martialPoints,
  eduWithSpouseMap,
  eduWithoutSpouseMap,
  foreignWeMap,
  spouseEdu,
} from "../constants/otherPointsConstants";

import QuestionCard from "../components/QuestionCard";

import OptionGrid from "../components/OptionGrid";

// Step graph
// Each key is a step name. `next` returns the name of the next step (or null at
// the end). `prev` is optional; when omitted, the history stack handles back
// navigation automatically. Add or remove steps here without touching any other
// logic.

const stepGraph = {
  age: {
    next: () => "marital",
  },
  marital: {
    next: () => "edu",
  },
  edu: {
    next: () => "lang-describe",
  },
  "lang-describe": {
    next: (form) =>
      form.langDescribe === "french-speaker" ? "lang-french" : "lang-english",
  },

  // ── English-first path ──────────────────────────────────────────────────────
  "lang-english": {
    next: () => "lang-english-scores",
  },
  "lang-english-scores": {
    // English speaker → ask about French bonus
    // French speaker using English as bonus → ask about French bonus scores (already done), go to foreign-we
    next: (form) =>
      form.langDescribe === "english-speaker" ? "french-bonus" : "foreign-we",
  },

  // ── French-first path ───────────────────────────────────────────────────────
  "lang-french": {
    next: () => "lang-scores-french",
  },
  "lang-scores-french": {
    // French speaker → ask about English bonus
    // English speaker using French as bonus → go to foreign-we
    next: (form) =>
      form.langDescribe === "french-speaker" ? "english-bonus" : "foreign-we",
  },

  // ── Bonus questions ─────────────────────────────────────────────────────────
  "french-bonus": {
    // English speaker took a French test → collect scores
    next: (form) => (form.frenchBonus === "yes" ? "lang-french" : "foreign-we"),
  },
  "english-bonus": {
    // French speaker took an English test → collect scores
    next: (form) =>
      form.englishBonus === "yes" ? "lang-english" : "foreign-we",
  },

  // ── Downstream ──────────────────────────────────────────────────────────────
  "foreign-we": {
    next: (form) => (form.isSpouseAccompanying ? "lang-describe-spouse" : null),
  },
  "lang-describe-spouse": {
    next: (form) =>
      form.spouseLangDescribe === "celpip" ||
      form.spouseLangDescribe === "ielts"
        ? "lang-english-scores-spouse"
        : "lang-french-scores-spouse",
  },
  "lang-english-scores-spouse": {
    next: () => "edu-spouse", // end of wizard
  },
  "lang-french-scores-spouse": {
    next: () => null, // end of wizard
  },
  "edu-spouse": {
    next: () => null,
  },
};

// Ordered list of all possible steps — used only for the progress bar.
const ALL_STEPS = Object.keys(stepGraph);

// Options for every question
const options = {
  marital: [
    { value: "single", label: "Single" },
    { value: "married", label: "Married / Common-law" },
  ],
  edu: [
    { value: "secondary", label: "Secondary school" },
    { value: "1yr", label: "1-year post-secondary" },
    { value: "2yr", label: "2-year post-secondary" },
    { value: "bachelor", label: "Bachelor's degree" },
    { value: "two-cred", label: "Two or more credentials" },
    { value: "masters", label: "Master's degree" },
    { value: "phd", label: "PhD" },
  ],
  eca: [
    { value: "yes", label: "Yes I have an ECA", badge: "15 pts" },
    { value: "no", label: "No I do not have an ECA" },
  ],
  langDescribe: [
    { value: "english-speaker", label: "I speak English better" },
    { value: "french-speaker", label: "I speak French better" },
  ],
  langEnglish: [
    { value: "ielts", label: "IELTS General Training" },
    { value: "celpip", label: "CELPIP General" },
  ],
  langFrench: [
    { value: "tef", label: "TEF Canada: Test d'évaluation de français" },
    { value: "tcf", label: "TCF Canada: Test de connaissance du français" },
  ],
  frenchBonus: [
    { value: "yes", label: "Yes I took a french test", badge: "bonus pts" },
    { value: "no", label: "No skip this step" },
  ],
  englishBonus: [
    { value: "yes", label: "Yes I took an english test", badge: "bonus pts" },
    { value: "no", label: "No skip this step" },
  ],
  foreignWe: [
    { value: "0", label: "None", badge: "0 pts" },
    { value: "1", label: "1 year", badge: "13 pts" },
    { value: "2", label: "2 years", badge: "25 pts" },
    { value: "3", label: "3 or more years", badge: "36 pts" },
  ],
  spouseLangDescribe: [
    { value: "ielts", label: "IELTS General Training" },
    { value: "celpip", label: "CELPIP General" },
    { value: "tef", label: "TEF Canada: Test d'évaluation de français" },
    { value: "tcf", label: "TCF Canada: Test de connaissance du français" },
  ],
  spouseEdu: [
    { value: "secondary", label: "Secondary school" },
    { value: "1yr", label: "1-year post-secondary" },
    { value: "2yr", label: "2-year post-secondary" },
    { value: "bachelor", label: "Bachelor's degree" },
    { value: "two-cred", label: "Two or more credentials" },
    { value: "masters", label: "Master's degree" },
    { value: "phd", label: "PhD" },
  ],
};

export default function CrsQuestionnaire() {
  const [step, setStep] = useState("age");
  // history stack enables correct back navigation through branching paths
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ age: 28, isSpouseAccompanying: null });

  // Navigation
  const next = () => {
    const nextStep = stepGraph[step]?.next(form);
    if (nextStep) {
      setHistory((h) => [...h, step]);
      setStep(nextStep);
    }
  };

  const back = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
  };

  // Progress bar
  // Shows visited + current steps out of total possible steps.
  const visitedSteps = [...history, step];
  const progressIndex = ALL_STEPS.indexOf(step);

  // Score
  const score = useMemo(() => {
    let total = 0;

    total += agePoints(form.age);
    if (form.marital === "married" && form.isSpouseAccompanying)
      total -= martialPoints(form.age);
    if (form?.edu) {
      if (form.marital !== "single") total += eduWithSpouseMap[form.edu];
      else total += eduWithoutSpouseMap[form.edu];
    }
    if (form?.eca === "yes") total += 15;
    if (
      form.langEnglish === "celpip" &&
      form.langDescribe === "english-speaker"
    ) {
      total += celpipMap(form);
      form.clb = convertCELPIP(form);
      console.log(form.clb);
    }

    if (
      form.langEnglish === "ielts" &&
      form.langDescribe === "english-speaker"
    ) {
      total += ieltsMap(form);

      form.clb = convertIELTS(form);
    }
    if (form.langFrench === "tef" && form.langDescribe === "french-speaker") {
      total += tefMap(form);

      let clbFrench = convertTEF(form);

      form.clb = {
        listening: clbFrench.french_listening,
        reading: clbFrench.french_reading,
        writing: clbFrench.french_writing,
        speaking: clbFrench.french_speaking,
        overall: clbFrench.overall,
      };
    }
    if (form.langFrench === "tcf" && form.langDescribe === "french-speaker") {
      total += tcfMap(form);
      let clbFrench = convertTCF(form);

      form.clb = {
        listening: clbFrench.french_listening,
        reading: clbFrench.french_reading,
        writing: clbFrench.french_writing,
        speaking: clbFrench.french_speaking,
        overall: clbFrench.overall,
      };
      console.log(form.clb);
    }

    if (
      form.listening &&
      form.reading &&
      form.writing &&
      form.speaking &&
      form.langDescribe === "french-speaker" &&
      form.langEnglish === "celpip" &&
      form.englishBonus === "yes"
    ) {
      const CLB = convertCELPIP(form);
      total += calculateBonusCELPIPPoints(CLB.listening);
      total += calculateBonusCELPIPPoints(CLB.reading);
      total += calculateBonusCELPIPPoints(CLB.writing);
      total += calculateBonusCELPIPPoints(CLB.speaking);
    }

    if (
      form.listening &&
      form.reading &&
      form.writing &&
      form.speaking &&
      form.langDescribe === "french-speaker" &&
      form.langEnglish === "ielts" &&
      form.englishBonus === "yes"
    ) {
      const CLB = convertIELTS(form);
      total += calculateBonusIELTSPoints(CLB.listening);
      total += calculateBonusIELTSPoints(CLB.reading);
      total += calculateBonusIELTSPoints(CLB.writing);
      total += calculateBonusIELTSPoints(CLB.speaking);
    }

    if (
      form.french_listening &&
      form.french_reading &&
      form.french_speaking &&
      form.french_writing &&
      form.langDescribe === "english-speaker" &&
      form.langFrench === "tef" &&
      form.frenchBonus === "yes"
    ) {
      const CLB = convertTEF(form);
      total += calculateBonusCELPIPPoints(CLB.french_listening);
      total += calculateBonusCELPIPPoints(CLB.french_reading);
      total += calculateBonusCELPIPPoints(CLB.french_writing);
      total += calculateBonusCELPIPPoints(CLB.french_speaking);
    }

    if (
      form.french_listening &&
      form.french_reading &&
      form.french_speaking &&
      form.french_writing &&
      form.langDescribe === "english-speaker" &&
      form.langFrench === "tcf" &&
      form.frenchBonus === "yes"
    ) {
      const CLB = convertTCF(form);
      console.log(CLB);
      total += calculateBonusCELPIPPoints(CLB.french_listening);
      total += calculateBonusCELPIPPoints(CLB.french_reading);
      total += calculateBonusCELPIPPoints(CLB.french_writing);
      total += calculateBonusCELPIPPoints(CLB.french_speaking);
    }

    //skill transfer
    //foreign edu + language
    if (form?.foreignWe) {
      const { listening, reading, speaking, writing, overall } = form.clb;
      const years = Number(form.foreignWe);

      const allNinePlus = [listening, reading, speaking, writing].every(
        (v) => v >= 9,
      );
      const allSevenPlus = [listening, reading, speaking, writing].every(
        (v) => v >= 7,
      );

      if (allNinePlus) {
        // CLB 9+ on all four → max 50 pts column
        if (years >= 3) total += 50;
        else if (years >= 1) total += 25;
      } else if (allSevenPlus) {
        // CLB 7+ but at least one under 9 → max 25 pts column
        if (years >= 3) total += 25;
        else if (years >= 1) total += 13;
      }
      // below CLB 7 → 0 pts, nothing to add
    }

    //skill transfer
    //education + language
    if (form?.edu && form?.clb) {
      const { listening, reading, speaking, writing } = form.clb;

      const allNinePlus = [listening, reading, speaking, writing].every(
        (v) => v >= 9,
      );
      const allSevenPlus = [listening, reading, speaking, writing].every(
        (v) => v >= 7,
      );

      // Map edu values to their point tier
      // secondary → 0 pts regardless
      // 1yr       → 13 / 25
      // two-cred, masters, phd → 25 / 50
      const eduTier = {
        secondary: 0,
        "1yr": 1,
        "2yr": 1, // 2yr alone is still one credential — adjust if needed
        bachelor: 1,
        "two-cred": 2,
        masters: 2,
        phd: 2,
      }[form.edu];

      if (allNinePlus) {
        if (eduTier === 1) total += 25;
        else if (eduTier === 2) total += 50;
      } else if (allSevenPlus) {
        if (eduTier === 1) total += 13;
        else if (eduTier === 2) total += 25;
      }
    }

    if (
      form.spouseLangDescribe === "celpip" ||
      form.spouseLangDescribe === "ielts"
    ) {
      const spouseScores = {
        listening: form.spouse_listening,
        reading: form.spouse_reading,
        writing: form.spouse_writing,
        speaking: form.spouse_speaking,
      };

      const clb =
        form.spouseLangDescribe === "celpip"
          ? convertCELPIP(spouseScores)
          : convertIELTS(spouseScores);

      if (!clb.error) {
        const spouseClbPoints = (level) => {
          if (level >= 9) return 5;
          if (level >= 7) return 3;
          if (level >= 5) return 1;
          return 0;
        };

        total += spouseClbPoints(clb.listening);
        total += spouseClbPoints(clb.reading);
        total += spouseClbPoints(clb.writing);
        total += spouseClbPoints(clb.speaking);
      }
    }

    if (form?.spouseEdu) {
      total += spouseEducationMap[form.spouseEdu];
    }
    console.log(form);

    return total;
  }, [form]);

  const canContinue = useMemo(() => {
    switch (step) {
      case "age":
        return !!form.age;
      case "marital":
        return !!form.marital;
      case "edu":
        return !!form.edu;
      case "eca":
        return !!form.eca;
      case "lang-describe":
        return !!form.langDescribe;
      case "lang-english":
        return !!form.langEnglish;
      case "lang-french":
        return !!form.langFrench;
      case "lang-english-scores":
        return ["listening", "reading", "writing", "speaking"].every(
          (v) => typeof form[v] === "number",
        );
      case "lang-scores-french":
        return [
          "french_listening",
          "french_reading",
          "french_writing",
          "french_speaking",
        ].every((v) => typeof form[v] === "number");
      case "french-bonus":
        return !!form.frenchBonus;
      case "english-bonus":
        return !!form.englishBonus;
      case "foreign-we":
        return !!form.foreignWe;
      case "lang-describe-spouse":
        return !!form.spouseLangDescribe;
      case "lang-english-spouse":
        return !!form.spouseLangEnglish;
      case "lang-english-scores-spouse":
        return [
          "spouse_listening",
          "spouse_reading",
          "spouse_writing",
          "spouse_speaking",
        ].every((v) => typeof form[v] === "number");

      case "edu-spouse":
        return !!form.spouseEdu;
      default:
        return false;
    }
  }, [step, form]);

  const renderStep = () => {
    const stepIndex = visitedSteps.length - 1;
    const cardProps = {
      stepIndex,
      score,
      canContinue,
      onBack: back,
      onNext: next,
      showBack: history.length > 0,
    };

    switch (step) {
      case "age":
        return (
          <QuestionCard
            {...cardProps}
            title="What is your age?"
            subtitle="CRS points peak at age 29–30 and decrease after 35.">
            <div className="mb-5">
              <div className="mb-1 text-4xl font-medium text-red-600">
                {form.age}
              </div>
              <div className="mb-3 text-xs text-slate-500">
                {agePoints(form.age)} CRS points
              </div>
              <input
                type="range"
                min={18}
                max={55}
                step={1}
                value={form.age}
                onChange={(e) =>
                  setForm((f) => ({ ...f, age: Number(e.target.value) }))
                }
                className="w-full accent-red-600"
              />
            </div>
          </QuestionCard>
        );

      case "marital":
        return (
          <QuestionCard {...cardProps} title="What is your marital status?">
            <OptionGrid
              items={options.marital}
              value={form.marital}
              onSelect={(value) => setForm((f) => ({ ...f, marital: value }))}
            />
            {form?.marital && form?.marital !== "single" && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded"
                    checked={form.isSpouseAccompanying || false}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        isSpouseAccompanying: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Is your spouse or common-law partner accompanying you to
                    Canada?
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500 ml-8">
                  Note: This affects how your CRS points are distributed.
                </p>
              </div>
            )}
          </QuestionCard>
        );

      case "edu":
        return (
          <QuestionCard
            {...cardProps}
            title="What is your highest level of education?"
            subtitle="Select the credential you have completed, not currently studying.">
            <OptionGrid
              items={options.edu}
              value={form.edu}
              onSelect={(value) => setForm((f) => ({ ...f, edu: value }))}
            />
          </QuestionCard>
        );

      case "eca":
        return (
          <QuestionCard
            {...cardProps}
            title="Do you have an Educational Credential Assessment?"
            subtitle="Required for foreign credentials to be recognized.">
            <OptionGrid
              items={options.eca}
              value={form.eca}
              onSelect={(value) => setForm((f) => ({ ...f, eca: value }))}
            />
          </QuestionCard>
        );

      case "lang-describe":
        return (
          <QuestionCard {...cardProps} title="Which describes you best?">
            <OptionGrid
              items={options.langDescribe}
              value={form.langDescribe}
              onSelect={(value) =>
                setForm((f) => ({ ...f, langDescribe: value }))
              }
            />
          </QuestionCard>
        );

      case "lang-english":
        return (
          <QuestionCard {...cardProps} title="Which English test did you take?">
            <OptionGrid
              items={options.langEnglish}
              value={form.langEnglish}
              onSelect={(value) =>
                setForm((f) => ({ ...f, langEnglish: value }))
              }
            />
          </QuestionCard>
        );

      case "lang-french":
        return (
          <QuestionCard {...cardProps} title="Which French test did you take?">
            <OptionGrid
              items={options.langFrench}
              value={form.langFrench}
              onSelect={(value) =>
                setForm((f) => ({ ...f, langFrench: value }))
              }
            />
          </QuestionCard>
        );

      case "lang-english-scores": {
        const isCELPIP = form.langEnglish === "celpip";
        return (
          <QuestionCard
            {...cardProps}
            title="Enter your test scores"
            subtitle="Enter the band score for each skill.">
            <div className="grid grid-cols-2 gap-3">
              {["listening", "reading", "writing", "speaking"].map((field) => (
                <label key={field} className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.06em] text-slate-500">
                    {field}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={isCELPIP ? 12 : 9}
                    step={isCELPIP ? 1 : 0.5}
                    value={form[field] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [field]: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-600"
                  />
                </label>
              ))}
            </div>
          </QuestionCard>
        );
      }

      case "lang-scores-french": {
        const isTEF = form.langFrench === "tef";
        const maxScore = isTEF ? 360 : 699;
        return (
          <QuestionCard
            {...cardProps}
            title="Enter your French test scores"
            subtitle={`Enter your results for the ${form.langFrench?.toUpperCase()} Canada test.`}>
            <div className="grid grid-cols-2 gap-3">
              {["listening", "reading", "writing", "speaking"].map((field) => (
                <label key={field} className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.06em] text-slate-500">
                    {field}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={maxScore}
                    step={1}
                    value={form[`french_${field}`] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [`french_${field}`]:
                          e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-600"
                    placeholder={`0–${maxScore}`}
                  />
                </label>
              ))}
            </div>
          </QuestionCard>
        );
      }

      case "french-bonus":
        return (
          <QuestionCard
            {...cardProps}
            title="Did you take a French language test?"
            subtitle="TEF Canada or TCF Canada adds bonus points.">
            <OptionGrid
              items={options.frenchBonus}
              value={form.frenchBonus}
              onSelect={(value) =>
                setForm((f) => ({ ...f, frenchBonus: value }))
              }
            />
          </QuestionCard>
        );

      case "english-bonus":
        return (
          <QuestionCard
            {...cardProps}
            title="Did you take an English language test?"
            subtitle="IELTS or CELPIP Canada adds bonus points.">
            <OptionGrid
              items={options.englishBonus}
              value={form.englishBonus}
              onSelect={(value) =>
                setForm((f) => ({ ...f, englishBonus: value }))
              }
            />
          </QuestionCard>
        );

      case "foreign-we":
        return (
          <QuestionCard
            {...cardProps}
            title="Years of skilled work outside Canada?"
            subtitle="Full-time 30 hrs/week, TEER 0–3 roles only."
            nextLabel="See my score">
            <OptionGrid
              items={options.foreignWe}
              value={form.foreignWe}
              onSelect={(value) => setForm((f) => ({ ...f, foreignWe: value }))}
            />
          </QuestionCard>
        );

      case "lang-describe-spouse":
        return (
          <QuestionCard
            {...cardProps}
            title="Which language test did your spouse take?"
            subtitle="If applicable">
            <OptionGrid
              items={options.spouseLangDescribe}
              value={form.spouseLangDescribe}
              onSelect={(value) =>
                setForm((f) => ({ ...f, spouseLangDescribe: value }))
              }
            />
          </QuestionCard>
        );

      case "lang-english-spouse":
        return (
          <QuestionCard
            {...cardProps}
            title="Which English test did your spouse take?">
            <OptionGrid
              items={options.langEnglish}
              value={form.spouseLangEnglish}
              onSelect={(value) =>
                setForm((f) => ({ ...f, spouseLangEnglish: value }))
              }
            />
          </QuestionCard>
        );

      case "lang-english-scores-spouse":
        return (
          <QuestionCard
            {...cardProps}
            title="Enter your spouse's test scores"
            subtitle="Enter the band score for each skill.">
            <div className="grid grid-cols-2 gap-3">
              {["listening", "reading", "writing", "speaking"].map((field) => (
                <label key={field} className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.06em] text-slate-500">
                    {field}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    step={0.5}
                    value={form[`spouse_${field}`] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [`spouse_${field}`]: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-600"
                  />
                </label>
              ))}
            </div>
          </QuestionCard>
        );

      case "lang-french-scores-spouse": {
        const isTEF = form.langFrench === "tef";
        const maxScore = isTEF ? 360 : 699;
        return (
          <QuestionCard
            {...cardProps}
            title="Enter your spouse's French test scores"
            subtitle={`Enter your results for the ${form.langFrench?.toUpperCase()} Canada test.`}>
            <div className="grid grid-cols-2 gap-3">
              {["listening", "reading", "writing", "speaking"].map((field) => (
                <label key={field} className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.06em] text-slate-500">
                    {field}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={maxScore}
                    step={1}
                    value={form[`spouse_french_${field}`] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [`spouse_french_${field}`]:
                          e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-600"
                    placeholder={`0–${maxScore}`}
                  />
                </label>
              ))}
            </div>
          </QuestionCard>
        );
      }

      case "edu-spouse":
        return (
          <QuestionCard
            {...cardProps}
            title="What is your spouse's highest level of education?"
            subtitle="Select the credential your spouse has completed, not currently studying.">
            <OptionGrid
              items={options.spouseEdu}
              value={form.spouseEdu}
              onSelect={(value) => setForm((f) => ({ ...f, spouseEdu: value }))}
            />
          </QuestionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-16 flex items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1">
            {ALL_STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  history.includes(s)
                    ? "bg-red-600"
                    : s === step
                      ? "bg-red-600/40"
                      : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">
            Step {visitedSteps.length} of {ALL_STEPS.length}
          </span>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
