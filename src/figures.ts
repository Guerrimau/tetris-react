const TRIADE_COORDINATES = [
  { x: 5, y: 15 },
  { x: 5, y: 15 - 1 },
  { x: 4, y: 15 - 1 },
  { x: 6, y: 15 - 1 },
];

const SQUARE_COORDINATES = [
  { x: 5, y: 15 },
  { x: 6, y: 15 },
  { x: 5, y: 14 },
  { x: 6, y: 14 },
];

const RECTANGLE_COORDINATES = [
  { x: 3, y: 15 },
  { x: 4, y: 15 },
  { x: 5, y: 15 },
  { x: 6, y: 15 },
];

const EL_COORDINATES = [
  { x: 5, y: 15 },
  { x: 5, y: 14 },
  { x: 5, y: 13 },
  { x: 6, y: 13 },
];

const ZIG_COORDINATES = [
  { x: 5, y: 15 },
  { x: 6, y: 15 },
  { x: 6, y: 14 },
  { x: 7, y: 14 },
];

export const ALL_FIGURES = [
  { coords: TRIADE_COORDINATES, color: "yellow" },
  { coords: SQUARE_COORDINATES, color: "red" },
  { coords: RECTANGLE_COORDINATES, color: "blue" },
  { coords: EL_COORDINATES, color: "green" },
  { coords: ZIG_COORDINATES, color: "purple" },
];
