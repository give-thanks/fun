// partitionGenerator.ts

export class PartitionGenerator {
    tiles: number[];

    constructor(tiles: number[]) {
        this.tiles = tiles.sort();
    }

    /**
     * Generates all unique partitions of the input elements into disjoint groups of size 4.
     *
     * A partition is a complete division of the input set such that:
     * - Every element appears in exactly one group
     * - Each group (block) contains exactly 4 elements
     * - No groups overlap within a partition
     *
     * The result is an array of partitions, where:
     * - Each partition is an array of groups
     * - Each group is an array of 4 element IDs
     *
     * Partitions are returned in canonical form:
     * - Elements within each group are sorted
     * - Groups within each partition are sorted
     * - Duplicate partitions (ignoring ordering) are removed
     *
     * @returns Array of partitions (number[][][])
     */
    generate(): number[][][] {
        // returns array of partitions, each partition = array of groups, each group = array of 4 tile IDs
        const partitions: number[][][] = [];
        this._backtrack(this.tiles, [], partitions, new Set());
        return partitions;
    }

    private _backtrack(
        remaining: number[],
        currentPartition: number[][],
        output: number[][][],
        seen: Set<string>
    ) {
        if (remaining.length === 0) {
            const canonical = currentPartition.map(g => g.slice().sort((a, b) => a - b))
                .sort((a, b) => a[0] - b[0]);
            const key = canonical.map(g => g.join(',')).join('|');
            if (!seen.has(key)) {
                seen.add(key);
                output.push(canonical);
            }
            return;
        }
        if (remaining.length % 4 !== 0) return; // impossible

        const first = remaining[0];
        const rest = remaining.slice(1);
        const combos = this._combinations(rest, 3);

        for (const combo of combos) {
            const group = [first, ...combo];
            const newRemaining = rest.filter(x => !combo.includes(x));
            this._backtrack(newRemaining, [...currentPartition, group], output, seen);
        }
    }

    private _combinations(arr: number[], k: number): number[][] {
        if (k === 0) return [[]];
        if (arr.length < k) return [];
        const [first, ...rest] = arr;
        const combsWithFirst = this._combinations(rest, k - 1).map(c => [first, ...c]);
        const combsWithoutFirst = this._combinations(rest, k);
        return [...combsWithFirst, ...combsWithoutFirst];
    }
}