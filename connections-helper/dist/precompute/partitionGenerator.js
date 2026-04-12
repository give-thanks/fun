// partitionGenerator.ts
export class PartitionGenerator {
    constructor(tiles) {
        this.tiles = tiles;
    }
    generate() {
        // returns array of partitions, each partition = array of groups, each group = array of 4 tile IDs
        const partitions = [];
        this._backtrack(this.tiles, [], partitions, new Set());
        return partitions;
    }
    _backtrack(remaining, currentPartition, output, seen) {
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
        if (remaining.length % 4 !== 0)
            return; // impossible
        const first = remaining[0];
        const rest = remaining.slice(1);
        const combos = this._combinations(rest, 3);
        for (const combo of combos) {
            const group = [first, ...combo];
            const newRemaining = rest.filter(x => !combo.includes(x));
            this._backtrack(newRemaining, [...currentPartition, group], output, seen);
        }
    }
    _combinations(arr, k) {
        if (k === 0)
            return [[]];
        if (arr.length < k)
            return [];
        const [first, ...rest] = arr;
        const combsWithFirst = this._combinations(rest, k - 1).map(c => [first, ...c]);
        const combsWithoutFirst = this._combinations(rest, k);
        return [...combsWithFirst, ...combsWithoutFirst];
    }
}
