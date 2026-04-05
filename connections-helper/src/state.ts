import { Tile } from "./tileParser.js";

export type PersistedState = {
    v: 1;
    tiles: {
        i: number;
        t: string;
        c: number[];
    }[];
    guesses: {
        i: number;
        t: number[];
        r: 0 | 1 | 2;
    }[];
};

export function saveState(tiles: Tile[], guesses: any[] = []) {
    const state: PersistedState = {
        v: 1,
        tiles: tiles.map(t => ({
            i: t.id,
            t: t.text,
            c: Array.from(t.categories),
        })),
        guesses: guesses.map(g => ({
            i: g.id,
            t: g.tileIds,
            r: g.result,
        })),
    };

    const encoded = encodeURIComponent(JSON.stringify(state));
    history.replaceState(null, "", `?s=${encoded}`);
}

export function loadState(): { tiles: Tile[]; guesses: any[] } | null {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("s");
    if (!encoded) return null;

    try {
        const parsed: PersistedState = JSON.parse(decodeURIComponent(encoded));

        if (parsed.v !== 1) return null;

        const tiles: Tile[] = parsed.tiles.map(t => ({
            id: t.i,
            text: t.t,
            categories: new Set(t.c),
        }));

        const guesses = parsed.guesses.map(g => ({
            id: g.i,
            tileIds: g.t,
            result: g.r,
        }));

        return { tiles, guesses };
    } catch {
        console.warn("Failed to parse state from URL");
        return null;
    }
}