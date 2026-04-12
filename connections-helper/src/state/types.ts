// state/types.ts

import { Tile } from "../model/tileParser.js";


export type MarkId = 1 | 2 | 3 | 4;

export interface TileState {
    tile: Tile;
    marks: MarkId[];
}

export interface AppState {
    input: string;
    inputMode: boolean;
    tiles: TileState[];
    activePen: MarkId;
}

export type Unsubscribe = () => void;