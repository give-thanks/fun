/*
    const remainingTiles = state.tiles.filter(ts => {
        const correctGuesses = state.guesses.filter(g => g.result == GuessType.Correct && g.tileIds.indexOf(ts.tile.id) >= 0);
        return correctGuesses.length == 0;
    });

        // If there are 2 or 3 selected tiles, let's show what works based on those tiles
        if (showBasedOnSelected)
            remainingTiles.forEach(ts => {
                // If the tile is not selected for the active pen,
                const markedForActivePen = ts.marks.some(m => m == state.activePen);
                if (!markedForActivePen) {
                    // If there are no valid partitions containing a group that includes both the selected tiles and this tile
                    // then this tile isn't a valid option
                    const valid = partitions.some((p, i) => partitionValidity[i] && p.some(group => group.filter(t => {
                        // tile is either selected or the current tile
                        return t.id == ts.tile.id || selectedTiles.some(t2 => t2.tile.id == t.id);
                    }).length == selectedTiles.length + 1));
                    // console.log(`${ts.tile.text} ${valid}`)
                    const tileDiv = tilesContainer.querySelector(`#tile-${ts.tile.id}`);
                    tileDiv?.classList?.toggle('invalid', !valid);
                }
            });

*/

import { Guess, GuessType, MarkId, TileState } from "../state/types.js";

export function determineValidTiles(tiles: TileState[], activePen: MarkId, guesses: Guess[]): number[] {
    const validTileIds = tiles.map(ts => ts.tile.id);
    const selectedTiles = tiles.filter(ts => ts.marks.some((m: MarkId) => (m == activePen)));
    // console.log(`selected tiles count ${selectedTiles.length}`);
    // If there are 2 or 3 selected tiles, filter partitions to only those containing all the selected tiles in one group.
    const showBasedOnSelected = selectedTiles.length == 2 || selectedTiles.length == 3;
    if (showBasedOnSelected) {
        // Remove any valid tile ids that are invalid
        tiles.forEach(ts => {
            // if the tile was in a correct guess, we don't care
            const correctGuesses = guesses.filter(g => g.result == GuessType.Correct && g.tileIds.indexOf(ts.tile.id) >= 0);
            if (correctGuesses.length > 0) return;

            // if the tile is already marked for the active pen, then we don't care
            const markedForActivePen = ts.marks.some(m => m == activePen);
            if (markedForActivePen) return;

            // See what we can conclude based on previous guesses
            guesses.forEach(g => {
                const allSelectedAreInThisGuess = selectedTiles.every(ts1 => g.tileIds.includes(ts1.tile.id));
                let invalid = false;
                switch (g.result) {
                    case GuessType.Close:
                        switch (selectedTiles.length) {
                            case 2: {
                                // If there was a close guess and we only have 2 selected, then
                                // the only valid selections are the other 2 from the close guess.
                                const currentTileIsInThisGuess = g.tileIds.includes(ts.tile.id);
                                invalid = allSelectedAreInThisGuess && !currentTileIsInThisGuess;
                                break;
                            }
                            case 3: {
                                // If there was a close guess and we have 3 selected, then
                                // the fourth is invalid and we need to process other guesses.
                                const currentTileIsInThisGuess = g.tileIds.includes(ts.tile.id);
                                invalid = allSelectedAreInThisGuess && currentTileIsInThisGuess;
                                break;
                            }
                        }
                        break;
                    case GuessType.Cold:
                        // No matter how many are selected, if there are two from the cold guess, 
                        // then then other two from the guess are invalid.
                        // this tile is invalid if it is in the guess and at least two tiles from the guess are also selected
                        const intersectionGuessAndSelected = g.tileIds.filter(item => selectedTiles.map(ts => ts.tile.id).includes(item));
                        invalid = g.tileIds.indexOf(ts.tile.id) > -1 && intersectionGuessAndSelected.length >= 2;
                        break;
                }
                if (invalid) {
                    const invalidIdIndex = validTileIds.indexOf(ts.tile.id);
                    if (invalidIdIndex > -1)
                        validTileIds.splice(invalidIdIndex, 1);
                }
            });
        });
    }

    console.log('cj3');
    console.log(validTileIds);
    return validTileIds;
}