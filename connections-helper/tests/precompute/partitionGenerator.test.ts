import { PartitionGenerator } from "../../src/precompute/partitionGenerator";

describe("Basic Correctness", () => {

  it("generates one partition for exactly 4 tiles", () => {
    const gen = new PartitionGenerator([1, 2, 3, 4]);
    const result = gen.generate();

    expect(result).toEqual([
      [[1, 2, 3, 4]]
    ]);
  });

  it("generates all unique partitions for 8 tiles", () => {
    const gen = new PartitionGenerator([1, 2, 3, 4, 5, 6, 7, 8]);
    const result = gen.generate();

    // Known count: 35 distinct partitions for splitting 8 items into groups of 4
    expect(result.length).toBe(35);

    // sanity: each partition has 2 groups of 4
    for (const partition of result) {
      expect(partition.length).toBe(2);
      partition.forEach(group => expect(group.length).toBe(4));
    }
  });

  it("generates all unique partitions for 8 random tiles", () => {
    const gen = new PartitionGenerator([16, 2, 14, 4, 12, 6, 7, 8]);
    const result = gen.generate();

    // Known count: 35 distinct partitions for splitting 8 items into groups of 4
    expect(result.length).toBe(35);

    // sanity: each partition has 2 groups of 4
    for (const partition of result) {
      expect(partition.length).toBe(2);
      partition.forEach(group => expect(group.length).toBe(4));
    }
  });
});

describe("Edge Cases", () => {

  it("returns empty partition for empty input", () => {
    const gen = new PartitionGenerator([]);
    const result = gen.generate();

    expect(result).toEqual([[]]);
  });

  it("returns no partitions if tile count is not divisible by 4", () => {
    const gen = new PartitionGenerator([1, 2, 3, 4, 5]);
    const result = gen.generate();

    expect(result).toEqual([]);
  });

  it("returns no partitions for less than 4 tiles", () => {
    const gen = new PartitionGenerator([1, 2, 3]);
    expect(gen.generate()).toEqual([]);
  });
});

describe("Deduplication Correctness", () => {

  it("does not generate duplicate partitions", () => {
    const gen = new PartitionGenerator([1, 2, 3, 4, 5, 6, 7, 8]);
    const result = gen.generate();

    const keys = new Set(
      result.map(part =>
        part.map(g => g.join(",")).join("|")
      )
    );

    expect(keys.size).toBe(result.length);
  });

  it("produces same partitions regardless of input order", () => {
    const gen1 = new PartitionGenerator([1, 2, 3, 4, 5, 6, 7, 8]);
    const gen2 = new PartitionGenerator([8, 7, 6, 5, 4, 3, 2, 1]);

    const res1 = gen1.generate();
    const res2 = gen2.generate();

    expect(res1).toEqual(res2);
  });
});

describe("Structural Integrity", () => {

  it("uses all tiles exactly once per partition", () => {
    const tiles = [1, 2, 3, 4, 5, 6, 7, 8];
    const gen = new PartitionGenerator(tiles);
    const result = gen.generate();

    for (const partition of result) {
      const flattened = partition.flat();
      expect(flattened.sort((a, b) => a - b)).toEqual(tiles);
    }
  });

  it("has no overlapping tiles between groups", () => {
    const gen = new PartitionGenerator([1, 2, 3, 4, 5, 6, 7, 8]);
    const result = gen.generate();

    for (const partition of result) {
      const seen = new Set<number>();
      for (const group of partition) {
        for (const tile of group) {
          expect(seen.has(tile)).toBe(false);
          seen.add(tile);
        }
      }
    }
  });
});

describe('Unit Isolation', () => { 
  it("generates correct combinations", () => {
    const gen = new PartitionGenerator([]);
    const combos = (gen as any)._combinations([1, 2, 3, 4], 2);

    expect(combos).toEqual([
      [1, 2], [1, 3], [1, 4],
      [2, 3], [2, 4],
      [3, 4]
    ]);
  });
});
