import { parseTiles, formatTiles, checkBoxCount, Tile } from "../src/tileParser";

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

  test("assigns unique numeric IDs", () => {
    const input = "A  B  C  D";
    const tiles = parseTiles(input);
    const ids = tiles.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(tiles.length);
    ids.forEach(id => expect(typeof id).toBe("number"));
  });

  test("detects box count not multiple of 4", () => {
    const input = "A  B  C";
    const tiles = parseTiles(input);
    expect(tiles.length).toBe(3);
    expect(checkBoxCount(tiles)).toBe(false);
  });

  test("detects box count that is multiple of 4", () => {
    const input = "A  B  C  D  E  F  G  H";
    const tiles = parseTiles(input);
    expect(tiles.length).toBe(8);
    expect(checkBoxCount(tiles)).toBe(true);
  });

});

describe("Tile Formatting", () => {

  test("formats tiles into rows of 4 with spacing", () => {
    const input = "APPLE  ORANGE  BANANA  GRAPE  MANGO  PINEAPPLE";
    const tiles = parseTiles(input);
    const formatted = formatTiles(tiles);
    expect(formatted).toMatch(/^APPLE\s+ORANGE\s+BANANA\s+GRAPE/);
    expect(formatted).toMatch(/MANGO\s+PINEAPPLE$/);
  });

  test("preserves multi-word boxes", () => {
    const input = "NEW YORK  LOS ANGELES  SAN FRANCISCO";
    const tiles = parseTiles(input);
    const formatted = formatTiles(tiles);
    expect(formatted).toMatch(/NEW YORK\s+LOS ANGELES\s+SAN FRANCISCO/);
  });

  test("formats exactly 4 tiles into one row", () => {
    const input = "A  B  C  D";
    const tiles = parseTiles(input);
    const formatted = formatTiles(tiles);
    expect(formatted.trim()).toBe("A    B    C    D");
  });

  test("formats fewer than 4 tiles into one row", () => {
    const input = "A  B  C";
    const tiles = parseTiles(input);
    const formatted = formatTiles(tiles);
    expect(formatted.trim()).toBe("A    B    C");
  });

  test("formats more than 4 tiles into multiple rows", () => {
    const input = "A  B  C  D  E  F  G  H  I";
    const tiles = parseTiles(input);
    const formatted = formatTiles(tiles);
    const rows = formatted.split("\n");
    expect(rows.length).toBe(3);
    expect(rows[0]).toMatch(/A\s+B\s+C\s+D/);
    expect(rows[1]).toMatch(/E\s+F\s+G\s+H/);
    expect(rows[2]).toMatch(/I/);
  });

});