// groupMapBuilder.ts
export class GroupMapBuilder {
    constructor(partitions) {
        this.partitions = partitions;
    }
    encodeGroup(group) {
        // Encode group of 4 tiles as a bitmask
        return group.reduce((mask, tile) => mask | (1 << tile), 0);
    }
    buildMap() {
        // Step 1: Collect indices in JS arrays first
        const tempMap = {};
        this.partitions.forEach((partition, idx) => {
            partition.forEach(group => {
                const key = this.encodeGroup(group);
                if (!tempMap[key])
                    tempMap[key] = [];
                tempMap[key].push(idx);
            });
        });
        // Step 2: Convert JS arrays to compact Uint8Array
        const finalMap = {};
        for (const key in tempMap) {
            finalMap[key] = new Uint8Array(tempMap[key]);
        }
        return finalMap;
    }
}
