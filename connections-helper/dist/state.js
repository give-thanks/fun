export function saveState(tiles, guesses = []) {
    const state = {
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
export function loadState() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("s");
    if (!encoded)
        return null;
    try {
        const parsed = JSON.parse(decodeURIComponent(encoded));
        if (parsed.v !== 1)
            return null;
        const tiles = parsed.tiles.map(t => ({
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
    }
    catch (_a) {
        console.warn("Failed to parse state from URL");
        return null;
    }
}
