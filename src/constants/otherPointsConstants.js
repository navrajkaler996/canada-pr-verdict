export const agePoints = (age) => {
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

export const martialPoints = (age) => {
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

export const eduWithSpouseMap = {
  secondary: 28,
  "1yr": 84,
  "2yr": 91,
  bachelor: 112,
  "two-cred": 119,
  masters: 126,
  phd: 140,
};

export const spouseEducationMap = {
  secondary: 2,
  "1yr": 6,
  "2yr": 7,
  bachelor: 8,
  "two-cred": 9,
  masters: 10,
  phd: 10,
};

export const eduWithoutSpouseMap = {
  secondary: 30,
  "1yr": 90,
  "2yr": 98,
  bachelor: 120,
  "two-cred": 128,
  masters: 135,
  phd: 150,
};

export const foreignWeMap = {
  0: 0,
  1: 13,
  2: 25,
  3: 36,
};

export const spouseEdu = {
  secondary: 2,
  "1yr": 6,
  "2yr": 7,
  bachelor: 8,
  "two-cred": 9,
  masters: 10,
  phd: 10,
};
