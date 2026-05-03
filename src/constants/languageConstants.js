export const celpipMap = (form) => {
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
  const pointsMappingWithSpouse = {
    1: 0,
    2: 0,
    3: 0,
    4: 6,
    5: 6,
    6: 8,
    7: 16,
    8: 22,
    9: 29,
    10: 32,
    11: 32,
    12: 32,
  };
  let totalPoints = 0;
  const abilities = ["listening", "speaking", "reading", "writing"];
  const map = form.isSpouseAccompanying
    ? pointsMappingWithSpouse
    : pointsMapping;
  abilities.forEach((skill) => {
    const level = form[skill];
    if (level && map[level] !== undefined) totalPoints += map[level];
  });
  return totalPoints;
};

export const ieltsMap = (form) => {
  const abilities = ["listening", "speaking", "reading", "writing"];
  const allFieldsProvided = abilities.every(
    (skill) =>
      form[skill] !== undefined && form[skill] !== null && form[skill] !== "",
  );
  if (!allFieldsProvided) return 0;

  const ieltsPointsTable = {
    listening: [
      { min: 8.5, pts: 34 },
      { min: 8.0, pts: 31 },
      { min: 7.5, pts: 23 },
      { min: 6.0, pts: 17 },
      { min: 5.5, pts: 9 },
      { min: 5.0, pts: 6 },
      { min: 4.5, pts: 6 },
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
  const ieltsPointsTableWithSpouse = {
    listening: [
      { min: 8.5, pts: 32 },
      { min: 8.0, pts: 29 },
      { min: 7.5, pts: 22 },
      { min: 6.0, pts: 16 },
      { min: 5.5, pts: 8 },
      { min: 5.0, pts: 6 },
      { min: 4.5, pts: 6 },
    ],
    reading: [
      { min: 8.0, pts: 32 },
      { min: 7.0, pts: 29 },
      { min: 6.5, pts: 22 },
      { min: 6.0, pts: 16 },
      { min: 5.0, pts: 8 },
      { min: 4.0, pts: 6 },
      { min: 3.5, pts: 6 },
    ],
    writing: [
      { min: 7.5, pts: 32 },
      { min: 7.0, pts: 29 },
      { min: 6.5, pts: 22 },
      { min: 6.0, pts: 16 },
      { min: 5.5, pts: 8 },
      { min: 5.0, pts: 6 },
      { min: 4.0, pts: 6 },
    ],
    speaking: [
      { min: 7.5, pts: 32 },
      { min: 7.0, pts: 29 },
      { min: 6.5, pts: 22 },
      { min: 6.0, pts: 16 },
      { min: 5.5, pts: 8 },
      { min: 5.0, pts: 6 },
      { min: 4.0, pts: 6 },
    ],
  };

  const table = form.isSpouseAccompanying
    ? ieltsPointsTableWithSpouse
    : ieltsPointsTable;
  return abilities.reduce((total, skill) => {
    const score = parseFloat(form[skill]);
    const match = table[skill].find((t) => score >= t.min);
    return total + (match ? match.pts : 0);
  }, 0);
};

export const tefMap = (form) => {
  const abilities = ["listening", "speaking", "reading", "writing"];
  const allFieldsProvided = abilities.every((skill) => {
    const val = form[`french_${skill}`];
    return val !== undefined && val !== null && val !== "";
  });
  if (!allFieldsProvided) return 0;

  const tefPointsTable = {
    listening: [
      { min: 316, pts: 34 },
      { min: 298, pts: 31 },
      { min: 280, pts: 23 },
      { min: 249, pts: 17 },
      { min: 217, pts: 9 },
      { min: 181, pts: 6 },
      { min: 145, pts: 6 },
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
  const tefPointsTableWithSpouse = {
    listening: [
      { min: 316, pts: 32 },
      { min: 298, pts: 29 },
      { min: 280, pts: 22 },
      { min: 249, pts: 16 },
      { min: 217, pts: 8 },
      { min: 181, pts: 6 },
      { min: 145, pts: 6 },
    ],
    reading: [
      { min: 263, pts: 32 },
      { min: 248, pts: 29 },
      { min: 233, pts: 22 },
      { min: 207, pts: 16 },
      { min: 181, pts: 8 },
      { min: 151, pts: 6 },
      { min: 121, pts: 6 },
    ],
    writing: [
      { min: 393, pts: 32 },
      { min: 371, pts: 29 },
      { min: 349, pts: 22 },
      { min: 310, pts: 16 },
      { min: 271, pts: 8 },
      { min: 226, pts: 6 },
      { min: 181, pts: 6 },
    ],
    speaking: [
      { min: 393, pts: 32 },
      { min: 371, pts: 29 },
      { min: 349, pts: 22 },
      { min: 310, pts: 16 },
      { min: 271, pts: 8 },
      { min: 226, pts: 6 },
      { min: 181, pts: 6 },
    ],
  };

  const table = form.isSpouseAccompanying
    ? tefPointsTableWithSpouse
    : tefPointsTable;
  return abilities.reduce((total, skill) => {
    const score = parseFloat(form[`french_${skill}`]);
    const match = table[skill].find((t) => score >= t.min);
    return total + (match ? match.pts : 0);
  }, 0);
};

export const tcfMap = (form) => {
  // console.log(alert("yes"));
  const abilities = ["listening", "speaking", "reading", "writing"];
  const allFieldsProvided = abilities.every((skill) => {
    const val = form[`french_${skill}`];
    return val !== undefined && val !== null && val !== "";
  });
  if (!allFieldsProvided) return 0;

  const tcfPointsTable = {
    listening: [
      { min: 549, pts: 34 },
      { min: 523, pts: 31 },
      { min: 503, pts: 23 },
      { min: 458, pts: 17 },
    ],
    reading: [
      { min: 549, pts: 34 },
      { min: 524, pts: 31 },
      { min: 499, pts: 23 },
      { min: 453, pts: 17 },
    ],
    writing: [
      { min: 16, pts: 34 },
      { min: 14, pts: 31 },
      { min: 12, pts: 23 },
    ],
    speaking: [
      { min: 16, pts: 34 },
      { min: 14, pts: 31 },
      { min: 12, pts: 23 },
    ],
  };
  const tcfPointsTableWithSpouse = {
    listening: [
      { min: 549, pts: 32 },
      { min: 523, pts: 29 },
      { min: 503, pts: 22 },
      { min: 458, pts: 16 },
    ],
    reading: [
      { min: 549, pts: 32 },
      { min: 524, pts: 29 },
      { min: 499, pts: 22 },
      { min: 453, pts: 16 },
    ],
    writing: [
      { min: 16, pts: 32 },
      { min: 14, pts: 29 },
      { min: 12, pts: 22 },
    ],
    speaking: [
      { min: 16, pts: 32 },
      { min: 14, pts: 29 },
      { min: 12, pts: 22 },
    ],
  };

  const table = form.isSpouseAccompanying
    ? tcfPointsTableWithSpouse
    : tcfPointsTable;
  return abilities.reduce((total, skill) => {
    const score = parseFloat(form[`french_${skill}`]);
    const match = table[skill].find((t) => score >= t.min);
    return total + (match ? match.pts : 0);
  }, 0);
};

export const CELPIP_TO_CLB = {
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

export function celpipScoreToCLB(score) {
  return CELPIP_TO_CLB[score] ?? null;
}

export function convertCELPIP(form) {
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

export function calculateBonusCELPIPPoints(clb) {
  if (clb <= 4) return 0;
  if (clb === 5 || clb === 6) return 1;
  if (clb === 7 || clb === 8) return 3;
  if (clb >= 9) return 6;
}

export const IELTS_TO_CLB = {
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

export function ieltsScoreToCLB(skill, band) {
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

export function convertIELTS(form) {
  const skills = ["listening", "reading", "writing", "speaking"];
  const result = {};
  for (const skill of skills) {
    const clb = ieltsScoreToCLB(skill, form[skill]);
    if (clb === null)
      return {
        error: `Invalid or below-minimum IELTS band for ${skill}: ${form[skill]}`,
      };
    result[skill] = clb;
  }
  result.overall = Math.min(...skills.map((s) => result[s]));
  return result;
}

export function calculateBonusIELTSPoints(clb) {
  if (clb <= 4) return 0;
  if (clb === 5 || clb === 6) return 1;
  if (clb === 7 || clb === 8) return 3;
  if (clb >= 9) return 6;
}

export const TEF_TO_CLB = {
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

export const TCF_TO_CLB = {
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

export function lookupRange(table, score) {
  const entry = table.find(({ min, max }) => score >= min && score <= max);
  return entry ? entry.clb : null;
}

export function convertTEF(form) {
  const skills = [
    "french_listening",
    "french_reading",
    "french_writing",
    "french_speaking",
  ];
  const result = {};
  for (const skill of skills) {
    const clb = lookupRange(TEF_TO_CLB[skill], form[skill]);
    if (clb === null)
      return {
        error: `Invalid or below-minimum TEF score for ${skill}: ${form[skill]}`,
      };
    result[skill] = clb;
  }
  result.overall = Math.min(...skills.map((s) => result[s]));
  return result;
}

export function convertTCF(form) {
  const skills = [
    "french_listening",
    "french_reading",
    "french_writing",
    "french_speaking",
  ];
  const result = {};
  for (const skill of skills) {
    console.log(TCF_TO_CLB[skill]);
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

export function spouseClbPoints(clb) {
  if (clb >= 9) return 5;
  if (clb >= 7) return 3;
  if (clb >= 5) return 1;
  return 0;
}
