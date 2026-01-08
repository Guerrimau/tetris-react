import { COLUMNS, MEMORY_ROWS } from "./config";

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;   

export const generateGameStateMatrix = (): null[][] => {
    return Array(MEMORY_ROWS).fill(Array(COLUMNS).fill(null));
  };