import { useState } from "react";

const CheckIcon = () => (
  <svg
    viewBox="0 0 10 10"
    fill="none"
    stroke="#fff"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-2.5 h-2.5">
    <path d="M2 5l2 2 4-4" />
  </svg>
);

const ArrowRight = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const StudyIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="#1d4ed8"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M10 2L2 6l8 4 8-4-8-4z" />
    <path d="M2 6v6" />
    <path d="M6 8.5v4.5c0 1.1 1.8 2 4 2s4-.9 4-2V8.5" />
  </svg>
);

const WorkIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="#15803d"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5">
    <rect x="3" y="7" width="14" height="10" rx="1.5" />
    <path d="M7 7V5.5A1.5 1.5 0 018.5 4h3A1.5 1.5 0 0113 5.5V7" />
    <path d="M3 11h14" />
  </svg>
);

const HomeIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="#7e22ce"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5">
    <circle cx="10" cy="10" r="8" />
    <path d="M2 10h16" />
    <path d="M10 2c-2.5 2.5-4 5-4 8s1.5 5.5 4 8" />
    <path d="M10 2c2.5 2.5 4 5 4 8s-1.5 5.5-4 8" />
  </svg>
);

const OPTIONS = [
  {
    id: "study",
    title: "In Canada on a study permit",
    desc: "You are currently studying at a Canadian institution",
    tag: "Study permit holder",
    iconBg: "bg-blue-50",
    tagStyle: "bg-blue-50 text-blue-800",
    Icon: StudyIcon,
  },
  {
    id: "work",
    title: "In Canada on a work permit",
    desc: "You are currently employed in Canada on a valid work permit",
    tag: "Work permit holder",
    iconBg: "bg-green-50",
    tagStyle: "bg-green-50 text-green-800",
    Icon: WorkIcon,
  },
  {
    id: "home",
    title: "Outside Canada",
    desc: "You are applying from your home country or a third country",
    tag: "Overseas applicant",
    iconBg: "bg-purple-50",
    tagStyle: "bg-purple-50 text-purple-800",
    Icon: HomeIcon,
  },
];

export default function PathSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    onSelect?.(selected);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
          Step 1 of 4
        </span>
      </div>

      <h1
        className="text-3xl md:text-4xl font-semibold text-gray-900 text-center leading-snug mb-3 max-w-md"
        style={{ fontFamily: "'Georgia', serif" }}>
        Where are you right now?
      </h1>
      <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed mb-10">
        Your current status changes which pathway is fastest for you. Pick the
        one that applies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
        {OPTIONS.map(({ id, title, desc, tag, iconBg, tagStyle, Icon }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`relative flex flex-col items-start gap-3 p-5 rounded-xl border text-left transition-all duration-200
                ${
                  isSelected
                    ? "border-red-500 bg-red-50"
                    : "border-gray-100 bg-white hover:border-red-300 hover:bg-red-50/40 hover:-translate-y-0.5"
                }`}>
              {isSelected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                  <CheckIcon />
                </span>
              )}

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon />
              </div>

              <div>
                <p className="text-[15px] font-medium text-gray-900 leading-snug mb-1">
                  {title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>

              <span
                className={`mt-auto text-[11px] px-2.5 py-1 rounded-full font-medium ${tagStyle}`}>
                {tag}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full max-w-2xl mt-6">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
            ${
              selected
                ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}>
          Continue
          {selected && <ArrowRight />}
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Your answer shapes the questions ahead — no wrong choice
      </p>
    </div>
  );
}
