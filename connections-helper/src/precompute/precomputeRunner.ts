// precomputeRunner.ts

import fs from 'fs';
import path from 'path';
import { PartitionGenerator } from './partitionGenerator';
import { GroupMapBuilder } from './groupMapBuilder';

function run(N: number) {
    const tiles = Array.from({ length: N * 4 }, (_, i) => i);
    const generator = new PartitionGenerator(tiles);
    const partitions = generator.generate();

    const builder = new GroupMapBuilder(partitions);
    const groupMap = builder.buildMap();

    const dir = path.join(__dirname, '../../dist/data');

    // Ensure the folder exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(dir, `groupToPartitionMapN${N}.json`),
        JSON.stringify(
            Object.fromEntries(
                Object.entries(groupMap).map(([k, v]) => [k, Array.from(v)])
            )
        )
    );
    console.log(`Generated ${Object.keys(groupMap).length} groups for N=${N}`);
}

run(2);
run(3);