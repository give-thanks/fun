import { GuessType } from "../state/types.js";
/**
 * Validates a partition of possible solutions based on a set of guesses.
 *
 * A "close" (warm) guess means the guess is off by exactly 1 tile from a valid solution.
 * A "cold" guess means the guess was wrong and was not off by 1.
 *
 * @param partition - A 2D array representing possible solutions, where each sub-array is a group of tiles.
 * @param guesses - An array of guesses, where each guess includes the guessed tiles and its result (Correct, Close, or Cold).
 * @returns true if the partition is a possible solution
 */
export function validatePartition(partition, guesses) {
    let invalid = false;
    guesses.forEach(g => {
        if (g.result === GuessType.Correct)
            return;
        const countsOfElementsInGuess = partition.map(group => group.filter(t => g.tileIds.includes(t.id)).length);
        // console.log(`${JSON.stringify(partition)} ${countsOfElementsInGuess}`)
        if (g.result === GuessType.Cold) {
            invalid || (invalid = countsOfElementsInGuess.some(count => count >= (partition.length == 2 ? 3 : 4)));
        }
        if (g.result === GuessType.Close) {
            // A close guess means the guess is off by exactly 1 tile from a valid solution.
            // If the guess itself is in the partition, it's invalid.
            // If any group contains 3 tiles from the guess (off by one), that group is also invalid.
            invalid || (invalid = !countsOfElementsInGuess.some(count => count == 3) || countsOfElementsInGuess.some(count => count == 4));
            // console.log(`${JSON.stringify(countsOfElementsInGuess)} guess: ${JSON.stringify(g)} ${invalid} ${JSON.stringify(partition.map(x => x.map(y => y.id)))}`)
        }
    });
    return !invalid;
}
