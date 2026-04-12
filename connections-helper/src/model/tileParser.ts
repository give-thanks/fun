// tileParser.ts
export interface Tile {
    id: number;
    text: string;
}

export function parseTiles(input: string): Tile[] {
    const tiles: Tile[] = [];
    const cleanedInput = input.replace(/\r\n|\r/g, "\n");
    const lines = cleanedInput.split("\n");

    let idCounter = 0;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const boxes = trimmedLine.split(/ {2,}|\t+/);

        for (const box of boxes) {
            const text = box.trim();
            if (!text) continue;

            tiles.push({
                id: idCounter++,
                text,
            });
        }
    }

    return tiles;
}

export function formatTiles(tiles: Tile[]): string {
    const rows: string[][] = [];

    // Step 1: chunk into rows of 4
    for (let i = 0; i < tiles.length; i += 4) {
        rows.push(tiles.slice(i, i + 4).map(t => t.text));
    }

    // Step 2: compute max width per column
    const colWidths: number[] = [];
    for (const row of rows) {
        row.forEach((cell, i) => {
            colWidths[i] = Math.max(colWidths[i] || 0, cell.length);
        });
    }

    // Step 3: build formatted rows
    const formattedRows = rows.map(row =>
        row
            .map((cell, i, array) => {
                const padded = (i + 1 == array.length) ? cell : cell.padEnd(colWidths[i], " ");
                return i < row.length - 1 ? padded + "  " : padded; // spacing between cols
            })
            .join("")
    );

    return formattedRows.join("\n").trim();
}

export function checkBoxCount(tiles: Tile[]): boolean {
    return tiles.length % 4 === 0;
}