// state.ts
export function saveState(tiles) {
    if ((tiles === null || tiles === void 0 ? void 0 : tiles.length) < 1) {
        history.pushState(null, "", "?v=1");
        return;
    }
    const state = {
        tiles: tiles.map(t => ({
            i: t.tile.id,
            t: t.tile.text,
            m: t.marks,
        })),
    };
    const encoded = encodeURIComponent(JSON.stringify(state));
    history.pushState(null, "", `?v=1&s=${encoded}`);
}
export function loadState() {
    const params = new URLSearchParams(window.location.search);
    const version = params.get("v");
    if (version != '1')
        return null;
    const encoded = params.get("s");
    if (!encoded)
        return null;
    try {
        const parsed = JSON.parse(decodeURIComponent(encoded));
        const tiles = parsed.tiles.map(t => ({
            tile: {
                id: t.i,
                text: t.t,
            },
            marks: t.m,
        }));
        return tiles;
    }
    catch (_a) {
        console.warn("Failed to parse state from URL");
        return null;
    }
}
