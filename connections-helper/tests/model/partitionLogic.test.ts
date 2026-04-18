import { Guess, GuessType } from "../../src/state/types";
import { Tile } from "../../src/model/tileParser";
import { validatePartition } from "../../src/model/partitionLogic"

describe('validatePartition two groups', () => {
    test('returns valid when no guesses', () => {
        const partition = makeTwoGroupPartition();
        const result = validatePartition(partition, []);
        expect(result).toEqual(true);
    });

    describe('Cold guesses', () => {
        test('cold guess makes partition invalid when any group matches the guess', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 2, 3, 4], GuessType.Cold)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(false);
        });

        test('cold guess makes partition valid because the guess is not 1 away', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 3, 5, 7], GuessType.Cold)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(true);
        });

        test('cold guess makes partition invalid when any group has 3 matches', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 2, 3, 5], GuessType.Cold)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(false);
        });

        test('second cold guess makes partition invalid when any group has 3 matches', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 2, 5, 6], GuessType.Cold),
                guess([1, 2, 3, 5], GuessType.Cold)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(false);
        });

    });

    describe('Warm guesses', () => {

        test('warm guess makes partition invalid when any group matches the guess', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 2, 3, 4], GuessType.Close)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(false);
        });

        test('warm guess makes partition valid when at least one group has 3 matches', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 2, 3, 8], GuessType.Close)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(true);
        });

        test('warm guess invalid when no group has 3 matches', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 3, 5, 7], GuessType.Close)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(false);
        });
    });

    describe('Other guesses', () => {

        test('ignores correct guesses', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 2, 3, 4], GuessType.Correct)
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(true);
        });

        test('can be invalid for both cold and warm simultaneously', () => {
            const partition = makeTwoGroupPartition();
            const guesses = [
                guess([1, 2, 3, 6], GuessType.Cold),   // invalid cold
                guess([1, 2, 4, 6], GuessType.Close)   // invalid warm
            ];
            const result = validatePartition(partition, guesses);
            expect(result).toEqual(false);
        });

        test('multiple guesses accumulate correctly', () => {
            const partition = makePartition([[1, 2, 7, 8], [3, 4, 5, 6]]);
            const guesses = [
                guess([1, 2, 3, 4], GuessType.Cold),
                guess([1, 2, 5, 6], GuessType.Close)
            ];

            const result = validatePartition(partition, guesses);
            expect(result).toBe(false);
        });
    });
});

// describe('Three-group partitions', () => {
//     describe('Warm guesses', () => {

//         test('warm guess makes partition invalid when it matches some group', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([5, 6, 7, 8], GuessType.Close)
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: false, invalidWarm: true });
//         });

//         test('warm guess makes partition invalid when at least one group has 3 matches', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([1, 2, 3, 8], GuessType.Close) // matches 3 tiles in group 1
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: false, invalidWarm: true });
//         });

//         test('warm guess valid when no group has 3 matches', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([1, 3, 5, 7], GuessType.Close) // no group has 3 matching tiles
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: false, invalidWarm: false });
//         });

//         test('warm guess makes partition invalid when only 2 matches in a group', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([1, 2, 8, 9], GuessType.Close) // only 2 matches in group 1
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: false, invalidWarm: false });
//         });

//         test('warm guess makes partition valid when 3 matches in a different group', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([5, 6, 7, 9], GuessType.Close) // matches 3 tiles in group 2
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: false, invalidWarm: true });
//         });
//     });

//     describe('Cold guesses', () => {
//         test('cold guess invalidates partition when it exactly matches a group', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([1, 2, 3, 4], GuessType.Cold)  // exact match with group 1
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: true, invalidWarm: false });
//         });

//         test('cold guess does not invalidate partition if not exact match. three match', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([1, 2, 3, 5], GuessType.Cold)  // does not match exactly any group
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: false, invalidWarm: false });
//         });

//         test('cold guess does not invalidate partition if not exact match. two match', () => {
//             const partition = makeThreeGroupPartition();
//             const guesses = [
//                 guess([1, 2, 5, 6], GuessType.Cold)  // does not match exactly any group
//             ];
//             const result = validatePartition(partition, guesses);
//             expect(result).toEqual({ invalidCold: false, invalidWarm: false });
//         });
//     });

// });


const makeTwoGroupPartition = (): Tile[][] =>
    makePartition([[1, 2, 3, 4], [5, 6, 7, 8]]);

const makeThreeGroupPartition = (): Tile[][] =>
    makePartition([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);

const tile = (id: number): Tile => ({ id, text: `T${id}` });

const makePartition = (groups: number[][]): Tile[][] =>
    groups.map(group => group.map(tile));

let nextId = 1;

const guess = (tileIds: number[], result: GuessType): Guess => ({
    id: nextId++,
    tileIds,
    result
});

