// state.ts

import { MarkId, TileState } from "../state/types.js";
import { Tile } from "./tileParser.js";

export type PersistedState = {
    tiles: {
        i: number;
        t: string;
        m: MarkId[];
    }[];
};

export function saveState(tiles: TileState[]) {
    const state: PersistedState = {
        tiles: tiles.map(t => ({
            i: t.tile.id,
            t: t.tile.text,
            m: t.marks,
        })),
    };

    const encoded = encodeURIComponent(JSON.stringify(state));
    history.pushState(null, "", `?v=1&s=${encoded}`);
}

export function loadState(): TileState[] | null {
    const params = new URLSearchParams(window.location.search);
    const version = params.get("v");
    if (version != '1') return null;
    const encoded = params.get("s");
    if (!encoded) return null;

    try {
        const parsed: PersistedState = JSON.parse(decodeURIComponent(encoded));

        const tiles: TileState[] = parsed.tiles.map(t => ({
            tile: {
                id: t.i,
                text: t.t,
            },
            marks: t.m,
        }));

        return tiles;
    } catch {
        console.warn("Failed to parse state from URL");
        return null;
    }
}