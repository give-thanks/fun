// state/types.ts

import { Tile } from "../model/tileParser.js";


export type MarkId = 1 | 2 | 3 | 4;

export interface TileState {
    tile: Tile;
    marks: MarkId[];
}

export const GuessType = {
    Correct: "correct",
    Cold: "cold",
    Close: "close",
} as const;

export type GuessType = typeof GuessType[keyof typeof GuessType];

export interface Guess {
    id: number;
    tileIds: number[];
    result: GuessType;
}
export interface AppState {
    input: string;
    inputMode: boolean;
    tiles: TileState[];
    activePen: MarkId;
    guesses: Guess[];
}

export type Unsubscribe = () => void;

