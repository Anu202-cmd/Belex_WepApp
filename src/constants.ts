export const CAMEROON_REGIONS = [
  "Adamawa",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "North West",
  "South",
  "South West",
  "West"
];

export const CAMEROON_CITIES = [
  "Douala",
  "Yaoundé",
  "Garoua",
  "Bamenda",
  "Maroua",
  "Bafoussam",
  "Ngaoundéré",
  "Bertoua",
  "Loum",
  "Kumba",
  "Buea",
  "Limbe",
  "Dschang",
  "Foumban",
  "Nkongsamba",
  "Ebolowa",
  "Guider",
  "Meiganga",
  "Yagoua",
  "Mbalmayo"
];

export const CAMEROON_LOCATIONS = [
  ...CAMEROON_REGIONS.map(r => `${r} Region`),
  ...CAMEROON_CITIES
].sort();
