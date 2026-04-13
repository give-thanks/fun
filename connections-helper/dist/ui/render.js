// ui/render.ts
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
export function renderTiles(tilesContainer, pensContainer, rowsContainer, guessesContainer, boardControls, onToggle) {
    const state = getState();
    pensContainer.classList.toggle("hidden", state.inputMode);
    rowsContainer.classList.toggle("hidden", state.inputMode);
    guessesContainer.classList.toggle("hidden", state.inputMode);
    boardControls.classList.toggle("hidden", state.inputMode);
    tilesContainer.innerHTML = "";
    const rows = rowsContainer.querySelectorAll('.row');
    rows.forEach((row) => {
        const chips = row.querySelectorAll('.chips');
        chips.forEach(c => c.innerHTML = '');
    });
    state.tiles
        .forEach(ts => {
        const div = document.createElement("div");
        div.className = "tile";
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
    rows.forEach((row) => {
        const buttons = row.querySelectorAll('.icon-btn');
        const chips = row.querySelectorAll('.chip');
        const selectedFour = chips.length === 4;
        buttons.forEach(b => b.disabled = !selectedFour);
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
}
