export interface Tile {
    id: number;
    text: string;
    categories: Set<number>;
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
                categories: new Set(),
            });
        }
    }

    return tiles;
}

export function formatTiles(tiles: Tile[]): string {
    const rows: string[] = [];
    for (let i = 0; i < tiles.length; i += 4) {
        const row = tiles.slice(i, i + 4).map(t => t.text);
        rows.push(row.join("    "));
    }
    return rows.join("\n");
}

export function checkBoxCount(tiles: Tile[]): boolean {
    return tiles.length % 4 === 0;
}