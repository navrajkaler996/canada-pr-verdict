import { useMemo, useState } from "react";

const steps = [
  "age", //0
  "marital", //1
  "edu", //2
  //   "eca",
  "lang-describe", //3
  "lang-english", //4
  "lang-english-scores", //5
  "lang-french", //6
  "lang-scores-french", //7
  "french-bonus", //8
  "english-bonus", //9
  "foreign-we", //10
];

const agePoints = (age) => {
  if (age <= 17) return 0;
  if (age === 18) return 99;
  if (age === 19) return 105;
  if (age >= 20 && age <= 29) return 110;
  if (age === 30) return 105;
  if (age === 31) return 99;
  if (age === 32) return 94;
  if (age === 33) return 88;
  if (age === 34) return 83;
  if (age === 35) return 77;
  if (age === 36) return 72;
  if (age === 37) return 66;
  if (age === 38) return 61;
  if (age === 39) return 55;
  if (age === 40) return 50;
  if (age === 41) return 39;
  if (age === 42) return 28;
  if (age === 43) return 17;
  if (age === 44) return 6;
  if (age >= 45) return 0;
  return 0;
};

const martialPoints = (age) => {
  if (age <= 17) return 0;
  if (age === 18) return 9;
  if (age === 19) return 10;
  if (age >= 20 && age <= 29) return 10;
  if (age === 30) return 10;
  if (age === 31) return 9;
  if (age === 32) return 9;
  if (age === 33) return 8;
  if (age === 34) return 8;
  if (age === 35) return 7;
  if (age === 36) return 7;
  if (age === 37) return 6;
  if (age === 38) return 6;
  if (age === 39) return 5;
  if (age === 40) return 5;
  if (age === 41) return 4;
  if (age === 42) return 3;
  if (age === 43) return 2;
  if (age === 44) return 1;
  if (age >= 45) return 0;
  return 0;
};

const eduWithSpouseMap = {
  secondary: 28,
  "1yr": 84,
  "2yr": 91,
  bachelor: 112,
  "two-cred": 119,
  masters: 126,
  phd: 140,
};

const eduWithoutSpouseMap = {
  secondary: 30,
  "1yr": 90,
  "2yr": 98,
  bachelor: 120,
  "two-cred": 128,
  masters: 135,
  phd: 150,
};

const foreignWeMap = {
  0: 0,
  1: 13,
  2: 25,
  3: 36,
};

const celpipMap = (form) => {
  const pointsMapping = {
    1: 0,
    2: 0,
    3: 0,
    4: 6,
    5: 6,
    6: 9,
    7: 17,
    8: 23,
    9: 31,
    10: 34,
    11: 34,
    12: 34,
  };

  let totalPoints = 0;

  const abilities = ["listening", "speaking", "reading", "writing"];

  abilities.forEach((skill) => {
    const level = form[skill];
    // Add points if the level exists in our mapping
    if (level && pointsMapping[level] !== undefined) {
      totalPoints += pointsMapping[level];
    }
  });

  return totalPoints;
};

const ieltsMap = (form) => {
  const abilities = ["listening", "speaking", "reading", "writing"];

  // 1. Ensure all four scores are provided
  const allFieldsProvided = abilities.every(
    (skill) =>
      form[skill] !== undefined && form[skill] !== null && form[skill] !== "",
  );

  if (!allFieldsProvided) return 0;

  // 2. Map IELTS Band Scores to CRS Points per skill
  const ieltsPointsTable = {
    listening: [
      { min: 8.5, pts: 34 }, // CLB 10+
      { min: 8.0, pts: 31 }, // CLB 9
      { min: 7.5, pts: 23 }, // CLB 8
      { min: 6.0, pts: 17 }, // CLB 7
      { min: 5.5, pts: 9 }, // CLB 6
      { min: 5.0, pts: 6 }, // CLB 5
      { min: 4.5, pts: 6 }, // CLB 4
    ],
    reading: [
      { min: 8.0, pts: 34 },
      { min: 7.0, pts: 31 },
      { min: 6.5, pts: 23 },
      { min: 6.0, pts: 17 },
      { min: 5.0, pts: 9 },
      { min: 4.0, pts: 6 },
      { min: 3.5, pts: 6 },
    ],
    writing: [
      { min: 7.5, pts: 34 },
      { min: 7.0, pts: 31 },
      { min: 6.5, pts: 23 },
      { min: 6.0, pts: 17 },
      { min: 5.5, pts: 9 },
      { min: 5.0, pts: 6 },
      { min: 4.0, pts: 6 },
    ],
    speaking: [
      { min: 7.5, pts: 34 },
      { min: 7.0, pts: 31 },
      { min: 6.5, pts: 23 },
      { min: 6.0, pts: 17 },
      { min: 5.5, pts: 9 },
      { min: 5.0, pts: 6 },
      { min: 4.0, pts: 6 },
    ],
  };

  // 3. Calculate total
  return abilities.reduce((total, skill) => {
    const score = parseFloat(form[skill]);
    // Find the first threshold the score meets or exceeds
    const match = ieltsPointsTable[skill].find(
      (threshold) => score >= threshold.min,
    );
    return total + (match ? match.pts : 0);
  }, 0);
};

const tefMap = (form) => {
  const abilities = ["listening", "speaking", "reading", "writing"];

  // 1. Ensure all four scores are provided (using french_ prefix for safety)
  const allFieldsProvided = abilities.every((skill) => {
    const val = form[`french_${skill}`];
    return val !== undefined && val !== null && val !== "";
  });

  if (!allFieldsProvided) return 0;

  // 2. Map TEF Scores to CRS Points per skill
  // These ranges correspond to CLB 4 through CLB 10+
  const tefPointsTable = {
    listening: [
      { min: 316, pts: 34 }, // CLB 10+
      { min: 298, pts: 31 }, // CLB 9
      { min: 280, pts: 23 }, // CLB 8
      { min: 249, pts: 17 }, // CLB 7
      { min: 217, pts: 9 }, // CLB 6
      { min: 181, pts: 6 }, // CLB 5
      { min: 145, pts: 6 }, // CLB 4
    ],
    reading: [
      { min: 263, pts: 34 },
      { min: 248, pts: 31 },
      { min: 233, pts: 23 },
      { min: 207, pts: 17 },
      { min: 181, pts: 9 },
      { min: 151, pts: 6 },
      { min: 121, pts: 6 },
    ],
    writing: [
      { min: 393, pts: 34 },
      { min: 371, pts: 31 },
      { min: 349, pts: 23 },
      { min: 310, pts: 17 },
      { min: 271, pts: 9 },
      { min: 226, pts: 6 },
      { min: 181, pts: 6 },
    ],
    speaking: [
      { min: 393, pts: 34 },
      { min: 371, pts: 31 },
      { min: 349, pts: 23 },
      { min: 310, pts: 17 },
      { min: 271, pts: 9 },
      { min: 226, pts: 6 },
      { min: 181, pts: 6 },
    ],
  };

  // 3. Calculate total
  return abilities.reduce((total, skill) => {
    const score = parseFloat(form[`french_${skill}`]);
    const match = tefPointsTable[skill].find(
      (threshold) => score >= threshold.min,
    );
    return total + (match ? match.pts : 0);
  }, 0);
};

const tcfMap = (form) => {
  const abilities = ["listening", "speaking", "reading", "writing"];

  // 1. Ensure all four scores are provided
  const allFieldsProvided = abilities.every((skill) => {
    const val = form[`french_${skill}`];
    return val !== undefined && val !== null && val !== "";
  });

  if (!allFieldsProvided) return 0;

  // 2. Map TCF Scores to CRS Points per skill
  // Ranges correspond to CLB 4 through CLB 10+
  const tcfPointsTable = {
    listening: [
      { min: 549, pts: 34 }, // NCLC 10+
      { min: 523, pts: 31 }, // NCLC 9
      { min: 503, pts: 23 }, // NCLC 8
      { min: 458, pts: 17 }, // NCLC 7 (Score of 500 lands here)
    ],
    reading: [
      { min: 549, pts: 34 },
      { min: 524, pts: 31 },
      { min: 499, pts: 23 }, // NCLC 8 (Score of 500 lands here)
      { min: 453, pts: 17 },
    ],
    writing: [
      { min: 16, pts: 34 },
      { min: 14, pts: 31 }, // NCLC 9 (Score of 15 lands here)
      { min: 12, pts: 23 },
    ],
    speaking: [
      { min: 16, pts: 34 },
      { min: 14, pts: 31 }, // NCLC 9 (Score of 15 lands here)
      { min: 12, pts: 23 },
    ],
  };

  // 3. Calculate total
  return abilities.reduce((total, skill) => {
    const score = parseFloat(form[`french_${skill}`]);
    const match = tcfPointsTable[skill].find(
      (threshold) => score >= threshold.min,
    );
    return total + (match ? match.pts : 0);
  }, 0);
};

const CELPIP_TO_CLB = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
};

function celpipScoreToCLB(score) {
  return CELPIP_TO_CLB[score] ?? null;
}

function convertCELPIP(form) {
  const skills = ["listening", "reading", "writing", "speaking"];
  const result = {};

  for (const skill of skills) {
    const clb = celpipScoreToCLB(form[skill]);
    if (clb === null)
      return { error: `Invalid CELPIP score for ${skill}: ${form[skill]}` };
    result[skill] = clb;
  }

  result.overall = Math.min(...skills.map((s) => result[s]));
  return result;
}

function calculateBonusCELPIPPoints(clb) {
  if (clb <= 4) return 0;
  if (clb === 5 || clb === 6) return 1;
  if (clb === 7 || clb === 8) return 3;
  if (clb >= 9) return 6;
}

const IELTS_TO_CLB = {
  listening: {
    4.5: 4,
    5.0: 5,
    5.5: 6,
    6.0: 7,
    7.5: 8,
    8.0: 9,
    8.5: 10,
    9.0: 10,
  },
  reading: { 3.5: 4, 4.0: 5, 5.0: 6, 6.0: 7, 6.5: 8, 7.0: 9, 8.0: 10, 9.0: 10 },
  writing: { 4.0: 4, 5.0: 5, 5.5: 6, 6.0: 7, 6.5: 8, 7.0: 9, 7.5: 10, 8.0: 10 },
  speaking: {
    4.0: 4,
    5.0: 5,
    5.5: 6,
    6.0: 7,
    6.5: 8,
    7.0: 9,
    7.5: 10,
    8.0: 10,
  },
};

function ieltsScoreToCLB(skill, band) {
  const table = IELTS_TO_CLB[skill];
  if (!table) return null;

  const thresholds = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);

  let clb = null;
  for (const threshold of thresholds) {
    if (band >= threshold) clb = table[threshold];
  }
  return clb;
}

function convertIELTS(form) {
  const skills = ["listening", "reading", "writing", "speaking"];
  const result = {};

  for (const skill of skills) {
    const clb = ieltsScoreToCLB(skill, form[skill]);
    console.log(form[skill], "0000");
    if (clb === null)
      return {
        error: `Invalid or below-minimum IELTS band for ${skill}: ${form[skill]}`,
      };
    result[skill] = clb;
  }

  result.overall = Math.min(...skills.map((s) => result[s]));

  return result;
}

function calculateBonusIELTSPoints(clb) {
  if (clb <= 4) return 0;
  if (clb === 5 || clb === 6) return 1;
  if (clb === 7 || clb === 8) return 3;
  if (clb >= 9) return 6;
}

const TEF_TO_CLB = {
  french_listening: [
    { min: 546, max: 699, clb: 10 },
    { min: 503, max: 545, clb: 9 },
    { min: 462, max: 502, clb: 8 },
    { min: 434, max: 461, clb: 7 },
    { min: 393, max: 433, clb: 6 },
    { min: 352, max: 392, clb: 5 },
    { min: 306, max: 351, clb: 4 },
  ],
  french_reading: [
    { min: 263, max: 300, clb: 10 },
    { min: 248, max: 262, clb: 9 },
    { min: 233, max: 247, clb: 8 },
    { min: 207, max: 232, clb: 7 },
    { min: 181, max: 206, clb: 6 },
    { min: 151, max: 180, clb: 5 },
    { min: 121, max: 150, clb: 4 },
  ],
  french_writing: [
    { min: 393, max: 450, clb: 10 },
    { min: 371, max: 392, clb: 9 },
    { min: 349, max: 370, clb: 8 },
    { min: 309, max: 348, clb: 7 },
    { min: 271, max: 308, clb: 6 },
    { min: 226, max: 270, clb: 5 },
    { min: 181, max: 225, clb: 4 },
  ],
  french_speaking: [
    { min: 393, max: 450, clb: 10 },
    { min: 371, max: 392, clb: 9 },
    { min: 349, max: 370, clb: 8 },
    { min: 309, max: 348, clb: 7 },
    { min: 271, max: 308, clb: 6 },
    { min: 226, max: 270, clb: 5 },
    { min: 181, max: 225, clb: 4 },
  ],
};

const TCF_TO_CLB = {
  french_listening: [
    { min: 549, max: 699, clb: 10 },
    { min: 523, max: 548, clb: 9 },
    { min: 503, max: 522, clb: 8 },
    { min: 458, max: 502, clb: 7 },
    { min: 398, max: 457, clb: 6 },
    { min: 331, max: 397, clb: 5 },
    { min: 331, max: 368, clb: 4 },
  ],
  french_reading: [
    { min: 549, max: 699, clb: 10 },
    { min: 524, max: 548, clb: 9 },
    { min: 499, max: 523, clb: 8 },
    { min: 453, max: 498, clb: 7 },
    { min: 406, max: 452, clb: 6 },
    { min: 375, max: 405, clb: 5 },
    { min: 342, max: 374, clb: 4 },
  ],
  french_writing: [
    { min: 16, max: 20, clb: 10 },
    { min: 14, max: 15, clb: 9 },
    { min: 12, max: 13, clb: 8 },
    { min: 10, max: 11, clb: 7 },
    { min: 8, max: 9, clb: 6 },
    { min: 6, max: 7, clb: 5 },
    { min: 4, max: 5, clb: 4 },
  ],
  french_speaking: [
    { min: 16, max: 20, clb: 10 },
    { min: 14, max: 15, clb: 9 },
    { min: 12, max: 13, clb: 8 },
    { min: 10, max: 11, clb: 7 },
    { min: 8, max: 9, clb: 6 },
    { min: 6, max: 7, clb: 5 },
    { min: 4, max: 5, clb: 4 },
  ],
};

function lookupRange(table, score) {
  const entry = table.find(({ min, max }) => score >= min && score <= max);
  return entry ? entry.clb : null;
}

function convertTEF(form) {
  const skills = [
    "french_listening",
    "french_reading",
    "french_writing",
    "sfrench_peaking",
  ];
  const result = {};

  for (const skill of skills) {
    const clb = lookupRange(TEF_TO_CLB[skill], form[skill]);
    console.log("00000", skill);
    if (clb === null)
      return {
        error: `Invalid or below-minimum TEF score for ${skill}: ${form[skill]}`,
      };
    result[skill] = clb;
  }

  result.overall = Math.min(...skills.map((s) => result[s]));
  return result;
}

function convertTCF(form) {
  const skills = ["listening", "reading", "writing", "speaking"];
  const result = {};

  for (const skill of skills) {
    const clb = lookupRange(TCF_TO_CLB[skill], form[skill]);
    if (clb === null)
      return {
        error: `Invalid or below-minimum TCF score for ${skill}: ${form[skill]}`,
      };
    result[skill] = clb;
  }

  result.overall = Math.min(...skills.map((s) => result[s]));
  return result;
}

const options = {
  marital: [
    { value: "single", label: "Single" },
    { value: "married", label: "Married / Common-law" },
  ],
  edu: [
    // { value: "secondary", label: "Secondary school", badge: "28 pts" },
    // { value: "1yr", label: "1-year post-secondary", badge: "90 pts" },
    // { value: "2yr", label: "2-year post-secondary", badge: "119 pts" },
    // { value: "bachelor", label: "Bachelor's degree", badge: "126 pts" },
    // { value: "two-cred", label: "Two or more credentials", badge: "128 pts" },
    // { value: "masters", label: "Master's degree", badge: "135 pts" },
    // { value: "phd", label: "PhD", badge: "150 pts" },
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
};

function QuestionCard({
  stepIndex,
  title,
  subtitle,
  children,
  score,
  canContinue,
  onBack,
  onNext,
  nextLabel = "Continue",
  showBack = true,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-red-600">
        Step {stepIndex + 1}
      </p>
      <h2 className="mb-2 text-lg font-medium text-slate-900">{title}</h2>
      {subtitle && <p className="mb-5 text-sm text-slate-500">{subtitle}</p>}

      {children}

      <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-slate-600">Points so far</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-medium text-red-600">{score}</span>
          <span className="text-sm text-slate-400">/ 1200</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        {showBack ? (
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-40">
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-35">
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function OptionGrid({ items, value, onSelect }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
            value === item.value
              ? "border-red-600 bg-red-50"
              : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/40"
          }`}>
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
              value === item.value
                ? "border-red-600 bg-red-600"
                : "border-slate-300"
            }`}
          />
          <span className="text-sm text-slate-900">{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-700">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function CrsQuestionnaire() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ age: 28, isSpouseAccompanying: true });

  const score = useMemo(() => {
    let total = 0;

    total += agePoints(form.age);
    if (form.marital && form.marital == "married" && form.isSpouseAccompanying)
      total -= martialPoints(form.age);
    if (form?.edu) {
      if (form.marital != "single") total += eduWithSpouseMap[form.edu];
      else total += eduWithoutSpouseMap[form.edu];
    }
    if (form?.eca === "yes") total += 15;
    if (
      form.langEnglish === "celpip" &&
      form.langDescribe === "english-speaker"
    )
      total += celpipMap(form);
    if (form.langEnglish === "ielts" && form.langDescribe === "english-speaker")
      total += ieltsMap(form);
    if (form.langFrench === "tef" && form.langDescribe === "french-speaker")
      total += tefMap(form);
    if (form.langFrench === "tcf" && form.langDescribe === "french-speaker")
      total += tcfMap(form);

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
      console.log("----", CLB);
      total += calculateBonusCELPIPPoints(CLB.listening);
      total += calculateBonusCELPIPPoints(CLB.reading);
      total += calculateBonusCELPIPPoints(CLB.writing);
      total += calculateBonusCELPIPPoints(CLB.speaking);
    }

    if (form?.foreignWe) total += foreignWeMap[form.foreignWe];
    return total;
  }, [form]);

  const currentStep = steps[step];

  const canContinue = useMemo(() => {
    switch (currentStep) {
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
      case "lang-english-scores":
        return [
          form.listening,
          form.reading,
          form.writing,
          form.speaking,
        ].every((v) => typeof v === "number");
      case "lang-scores-french":
        return [
          form["french_listening"],
          form["french_reading"],
          form["french_writing"],
          form["french_speaking"],
        ].every((v) => typeof v === "number");

      case "french-bonus":
        return !!form.frenchBonus;
      case "english-bonus":
        return !!form.englishBonus;
      case "lang-french":
        return !!form.langFrench;
      case "foreign-we":
        return !!form.foreignWe;
      default:
        return false;
    }
  }, [currentStep, form]);

  const next = () => {
    //when user have submitted french score as first language and english as bonus
    //jump to forign experience
    if (
      step === 5 &&
      form.langDescribe === "french-speaker" &&
      form.englishBonus === "yes"
    ) {
      setStep((s) => s + 5);
      return;
    }

    //when user have submitted english score as first language and french as bonus
    //jump to forign experience
    if (
      step === 7 &&
      form.langDescribe === "english-speaker" &&
      form.frenchBonus === "yes"
    ) {
      setStep((s) => s + 3);
      return;
    }

    //jumping to french test question as first language
    if (step === 3 && form.langDescribe === "french-speaker") {
      setStep((s) => s + 3);
      return;
    }

    //when user is english speaker and submitted the language score.
    //jump to french bonus question
    if (step === 5 && form.langDescribe === "english-speaker") {
      setStep((s) => s + 3);
      return;
    }

    if (step === 7 && form.frenchBonus === "yes") {
      setStep((s) => s + 2);
      return;
    }

    //when user is french speaker and submitted the language score.
    //jump to english bonus question
    if (step === 7 && form.langDescribe === "french-speaker") {
      setStep((s) => s + 2);
      return;
    }

    //jumping to english bonus question
    if (step === 9 && form.englishBonus === "yes") {
      setStep((s) => s - 5);
      return;
    }

    //jumping to french bonus question
    if (step === 8 && form.frenchBonus === "yes") {
      setStep((s) => s - 2);
      return;
    }

    //jumping to forign exp when french bonus is no
    if (step === 8 && form.frenchBonus === "no") {
      setStep((s) => s + 2);
      return;
    }

    //jumping to forign exp when english bonus is no
    if (step === 9 && form.englishBonus === "no") {
      setStep((s) => s + 1);
      return;
    }

    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  // renderStep remains exactly same as yours (no TS needed)
  const renderStep = () => {
    switch (currentStep) {
      case "age":
        return (
          <QuestionCard
            stepIndex={step}
            title="What is your age?"
            subtitle="CRS points peak at age 29–30 and decrease after 35."
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}
            showBack={step > 0}>
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
          <QuestionCard
            stepIndex={step}
            title="What is your marital status?"
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
            <OptionGrid
              items={options.marital}
              value={form.marital}
              onSelect={(value) => setForm((f) => ({ ...f, marital: value }))}
            />
            {form?.marital && form?.marital != "single" && (
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
            stepIndex={step}
            title="What is your highest level of education?"
            subtitle="Select the credential you have completed, not currently studying."
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
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
            stepIndex={step}
            title="Do you have an Educational Credential Assessment?"
            subtitle="Required for foreign credentials to be recognized."
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
            <OptionGrid
              items={options.eca}
              value={form.eca}
              onSelect={(value) => setForm((f) => ({ ...f, eca: value }))}
            />
          </QuestionCard>
        );
      case "lang-describe":
        return (
          <QuestionCard
            stepIndex={step}
            title="Which describes you best?"
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
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
          <QuestionCard
            stepIndex={step}
            title="Which English test did you take?"
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
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
          <QuestionCard
            stepIndex={step}
            title="Which French test did you take?"
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
            <OptionGrid
              items={options.langFrench}
              value={form.langFrench}
              onSelect={(value) =>
                setForm((f) => ({ ...f, langFrench: value }))
              }
            />
          </QuestionCard>
        );

      case "lang-english-scores":
        return (
          <QuestionCard
            stepIndex={step}
            title="Enter your test scores"
            subtitle="Enter the band score for each skill."
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
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

      case "lang-scores-french":
        // Determine limits based on the specific French test
        // TEF and TCF have different score ranges
        const isTEF = form.frenchTest === "tef";
        const maxScore = isTEF ? 360 : 699; // Example ranges for TEF vs TCF

        return (
          <QuestionCard
            stepIndex={step}
            title="Enter your French test scores"
            subtitle={`Enter your results for the ${form.frenchTest?.toUpperCase()} Canada test.`}
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
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
                    step={1} // French tests usually use whole numbers
                    value={form[`french_${field}`] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [`french_${field}`]:
                          e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-600"
                    placeholder={`0-${maxScore}`}
                  />
                </label>
              ))}
            </div>
          </QuestionCard>
        );

      case "french-bonus":
        return (
          <QuestionCard
            stepIndex={step}
            title="Did you take a French language test?"
            subtitle="TEF Canada or TCF Canada adds bonus points."
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
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
            stepIndex={step}
            title="Did you take an English language test?"
            subtitle="IELTS or CELPIP Canada adds bonus points."
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}>
            <OptionGrid
              items={options.englishBonus}
              value={form.englishBonus}
              onSelect={(value) =>
                setForm((f) => ({ ...f, englishBonus: value }))
              }
            />
          </QuestionCard>
        );

      //   case "french-test":
      //     return (
      //       <QuestionCard
      //         stepIndex={step}
      //         title="Which French test did you take?"
      //         score={score}
      //         canContinue={canContinue}
      //         onBack={back}
      //         onNext={next}>
      //         <OptionGrid
      //           items={options.fre}
      //           value={form.langEnglish}
      //           onSelect={(value) =>
      //             setForm((f) => ({ ...f, langEnglish: value }))
      //           }
      //         />
      //       </QuestionCard>
      //     );

      case "foreign-we":
        return (
          <QuestionCard
            stepIndex={step}
            title="Years of skilled work outside Canada?"
            subtitle="Full-time 30 hrs/week, TEER 0–3 roles only."
            score={score}
            canContinue={canContinue}
            onBack={back}
            onNext={next}
            nextLabel="See my score">
            <OptionGrid
              items={options.foreignWe}
              value={form.foreignWe}
              onSelect={(value) => setForm((f) => ({ ...f, foreignWe: value }))}
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
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i < step
                    ? "bg-red-600"
                    : i === step
                      ? "bg-red-600/40"
                      : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">
            Step {step + 1} of {steps.length}
          </span>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
