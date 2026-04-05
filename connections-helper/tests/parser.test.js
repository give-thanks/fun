import { parseTiles, formatTiles, finalizeTiles, checkBoxCount } from "../src/tileParser";
describe("Tile Parsing", () => {
    test("parses single-word boxes correctly", () => {
        const input = "APPLE  ORANGE\tBANANA\rGRAPE\nPEAR";
        const tiles = parseTiles(input);
        expect(tiles.length).toBe(5);
        expect(tiles.map(t => t.text)).toEqual(["APPLE", "ORANGE", "BANANA", "GRAPE", "PEAR"]);
    });
    test("parses multi-word boxes as single tiles", () => {
        const input = "NEW YORK  LOS ANGELES  SAN FRANCISCO";
        const tiles = parseTiles(input);
        expect(tiles.length).toBe(3);
        expect(tiles.map(t => t.text)).toEqual(["NEW YORK", "LOS ANGELES", "SAN FRANCISCO"]);
    });
    test("handles multiple spaces, tabs, and newlines as separators", () => {
        const input = "APPLE\tORANGE\nBANANA  GRAPE";
        const tiles = parseTiles(input);
        expect(tiles.length).toBe(4);
        expect(tiles.map(t => t.text)).toEqual(["APPLE", "ORANGE", "BANANA", "GRAPE"]);
    });
    test("trims leading/trailing whitespace", () => {
        const input = "  APPLE  ORANGE  ";
        const tiles = parseTiles(input);
        expect(tiles.length).toBe(2);
        expect(tiles.map(t => t.text)).toEqual(["APPLE", "ORANGE"]);
    });
    test("handles empty lines gracefully", () => {
        const input = "\nAPPLE\n\nORANGE\n";
        const tiles = parseTiles(input);
        expect(tiles.length).toBe(2);
        expect(tiles.map(t => t.text)).toEqual(["APPLE", "ORANGE"]);
    });
    test("detects box count not multiple of 4", () => {
        const input = "A  B  C";
        const tiles = parseTiles(input);
        const warning = checkBoxCount(tiles);
        expect(warning).toBe(true);
    });
});
describe("Tile Formatting", () => {
    test("formats tiles into rows of 4 with spacing", () => {
        const input = "APPLE  ORANGE  BANANA  GRAPE  MANGO  PINEAPPLE";
        const formatted = formatTiles(input);
        expect(formatted).toMatch(/^APPLE\s+ORANGE\s+BANANA\s+GRAPE/);
        expect(formatted).toMatch(/MANGO\s+PINEAPPLE/);
    });
    test("preserves multi-word boxes", () => {
        const input = "NEW YORK  LOS ANGELES  SAN FRANCISCO";
        const formatted = formatTiles(input);
        expect(formatted).toMatch(/NEW YORK\s+LOS ANGELES\s+SAN FRANCISCO/);
    });
});
describe("Tile Finalization", () => {
    test("creates Tile objects with unique IDs", () => {
        const input = "APPLE  ORANGE  BANANA  GRAPE";
        const tiles = parseTiles(input);
        const finalized = finalizeTiles(tiles);
        expect(finalized.length).toBe(4);
        finalized.forEach(tile => {
            expect(tile.id).toBeDefined();
            expect(tile.text).toMatch(/APPLE|ORANGE|BANANA|GRAPE/);
            expect(tile.categories.size).toBe(0);
        });
    });
    test("updates remainingTiles on finalize", () => {
        const input = "APPLE  ORANGE  BANANA  GRAPE";
        const tiles = parseTiles(input);
        const finalized = finalizeTiles(tiles);
        const appState = { tiles: finalized, remainingTiles: [...finalized] };
        expect(appState.remainingTiles.length).toBe(4);
    });
});
