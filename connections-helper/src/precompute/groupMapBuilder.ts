// groupMapBuilder.ts
export class GroupMapBuilder {
    partitions: number[][][];

    constructor(partitions: number[][][]) {
        this.partitions = partitions;
    }

    private encodeGroup(group: number[]): number {
        // Encode group of 4 tiles as a bitmask
        return group.reduce((mask, tile) => mask | (1 << tile), 0);
    }

    buildMap(): Record<number, Uint8Array> {
        // Step 1: Collect indices in JS arrays first
        const tempMap: Record<number, number[]> = {};

        this.partitions.forEach((partition, idx) => {
            partition.forEach(group => {
                const key = this.encodeGroup(group);
                if (!tempMap[key]) tempMap[key] = [];
                tempMap[key].push(idx);
            });
        });

        // Step 2: Convert JS arrays to compact Uint8Array
        const finalMap: Record<number, Uint8Array> = {};
        for (const key in tempMap) {
            finalMap[key] = new Uint8Array(tempMap[key]);
        }

        return finalMap;
    }
}