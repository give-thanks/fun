// ui/render.ts
import { validatePartition } from "../model/partitionLogic.js";
import { PartitionGenerator } from "../precompute/partitionGenerator.js";
import { dispatch, getState } from "../state/store.js";
import { GuessType } from "../state/types.js";
export function renderInput(inputContainer, inputField, finalizeButton) {
    const state = getState();
    if (inputField.value != state.input) {
        inputField.value = state.input;
    }
    finalizeButton.disabled = !isValid(state.tiles.length);
    inputContainer.classList.toggle("hidden", !state.inputMode);
}
function isValid(tileCount) {
    return tileCount == 8 || tileCount == 12 || tileCount == 16;
}
export function renderTiles(tilesContainer, pensContainer, rowsContainer, guessesContainer, partitionsContainer, boardControls, onToggle) {
    const state = getState();
    pensContainer.classList.toggle("hidden", state.inputMode);
    rowsContainer.classList.toggle("hidden", state.inputMode);
    guessesContainer.classList.toggle("hidden", state.inputMode);
    partitionsContainer.classList.toggle("hidden", state.inputMode);
    boardControls.classList.toggle("hidden", state.inputMode);
    const remainingTiles = state.tiles.filter(ts => {
        const correctGuesses = state.guesses.filter(g => g.result == GuessType.Correct && g.tileIds.indexOf(ts.tile.id) >= 0);
        return correctGuesses.length == 0;
    });
    const rows = rowsContainer.querySelectorAll('.row');
    rows.forEach((row) => {
        const chips = row.querySelectorAll('.chips');
        chips.forEach(c => c.innerHTML = '');
    });
    tilesContainer.innerHTML = "";
    remainingTiles
        .forEach(ts => {
        const div = document.createElement("div");
        div.className = "tile";
        div.id = `tile-${ts.tile.id}`;
        const word = document.createElement("div");
        word.className = "word";
        word.textContent = ts.tile.text;
        div.appendChild(word);
        ts.marks.forEach(m => {
            const markEl = document.createElement("div");
            markEl.className = `mark mark-m${m}`;
            div.appendChild(markEl);
            const rowEl = rowsContainer.querySelector(`[data-pen="${m}"]`);
            const chipsEl = rowEl.querySelector('.chips');
            const chipEl = document.createElement("div");
            chipEl.className = "chip";
            chipEl.textContent = ts.tile.text;
            chipsEl.appendChild(chipEl);
        });
        if (!state.inputMode) {
            div.onclick = () => onToggle(ts.tile.id, dispatch);
        }
        const correctGuesses = state.guesses.filter(g => g.result == GuessType.Correct && g.tileIds.indexOf(ts.tile.id) >= 0);
        div.classList.toggle("hidden", correctGuesses.length > 0);
        tilesContainer.appendChild(div);
    });
    guessesContainer.innerHTML = '';
    state.guesses.forEach(g => {
        if (g.result == GuessType.Correct)
            return;
        const div = document.createElement("div");
        div.className = `guess ${g.result}`;
        const chips = document.createElement("div");
        chips.className = 'chips';
        div.appendChild(chips);
        state.tiles.filter(t => g.tileIds.indexOf(t.tile.id) >= 0)
            .forEach(t => {
            const chip = document.createElement("div");
            chip.className = `chip`;
            chip.textContent = t.tile.text;
            chips.appendChild(chip);
        });
        guessesContainer.appendChild(div);
    });
    rows.forEach((row) => {
        const buttons = row.querySelectorAll('.icon-btn');
        const chips = row.querySelectorAll('.chip');
        const selectedFour = chips.length === 4;
        buttons.forEach(b => b.disabled = !selectedFour);
    });
    // console.log(remainingTiles);
    partitionsContainer.innerHTML = '<div id="count"></div>';
    if (remainingTiles.length < 16) {
        // console.time('build partitions');
        const gen = new PartitionGenerator(remainingTiles.map(t => t.tile.id));
        const result = gen.generate();
        const idToTile = new Map(remainingTiles.map(t => [t.tile.id, t.tile]));
        const partitions = result.map(partition => partition.map(group => group.map(id => idToTile.get(id))
            .sort((a, b) => a.text.localeCompare(b.text)))).sort((a, b) => {
            var _a, _b, _c, _d;
            const aText = (_b = (_a = a[0][0]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
            const bText = (_d = (_c = b[0][0]) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : "";
            return aText.localeCompare(bText);
        });
        // console.timeEnd('build partitions');
        // console.time('validate partitions');
        const partitionValidity = partitions.map(p => validatePartition(p, state.guesses));
        const validPartitionCount = partitionValidity.filter(v => v).length;
        // console.timeEnd('validate partitions');
        // console.log(`${validPartitionCount} valid options out of ${partitions.length} possible solutions`);
        // console.time('filter partitions');
        const selectedTiles = state.tiles.filter(ts => ts.marks.some((m) => (m == state.activePen)));
        // console.log(`selected tiles count ${selectedTiles.length}`);
        // If there are 2 or 3 selected tiles, filter partitions to only those containing all the selected tiles in one group.
        const showBasedOnSelected = selectedTiles.length == 2 || selectedTiles.length == 3;
        const partitionsForSelected = partitions.map(p => p.some(group => group.filter(t => selectedTiles.some(st => st.tile.id == t.id)).length == selectedTiles.length));
        // console.timeEnd('filter partitions');
        // If there are 2 or 3 selected tiles, let's show what works based on those tiles
        if (showBasedOnSelected)
            remainingTiles.forEach(ts => {
                var _a;
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
                    (_a = tileDiv === null || tileDiv === void 0 ? void 0 : tileDiv.classList) === null || _a === void 0 ? void 0 : _a.toggle('invalid', !valid);
                }
            });
        if (validPartitionCount < 1000) {
            partitions.forEach((p, i) => {
                const partitionDiv = document.createElement("div");
                partitionDiv.classList = 'partition';
                const validPartition = partitionValidity[i];
                if (!validPartition) {
                    if (state.guesses.some(g => g.result == GuessType.Cold))
                        partitionDiv.classList.add('invalid-cold');
                    if (state.guesses.some(g => g.result == GuessType.Close))
                        partitionDiv.classList.add('invalid-warm');
                    if (!state.debugPartitions) {
                        partitionDiv.classList.add('hidden');
                    }
                }
                else {
                    if (showBasedOnSelected) {
                        const selectedPartition = partitionsForSelected[i];
                        if (selectedPartition) {
                            if (state.debugPartitions)
                                partitionDiv.classList.add('selected');
                        }
                        else {
                            if (!state.debugPartitions) {
                                partitionDiv.classList.add('hidden');
                            }
                        }
                    }
                }
                p.forEach(set => {
                    const setDiv = document.createElement("div");
                    setDiv.className = 'group';
                    partitionDiv.appendChild(setDiv);
                    set.forEach(t => {
                        const chip = document.createElement("div");
                        chip.className = `element`;
                        chip.textContent = t.text;
                        setDiv.appendChild(chip);
                    });
                });
                partitionsContainer.appendChild(partitionDiv);
            });
            const countDiv = partitionsContainer.querySelector("#count");
            if (countDiv)
                countDiv.innerHTML = `${validPartitionCount}/${partitions.length}`;
        }
    }
}
