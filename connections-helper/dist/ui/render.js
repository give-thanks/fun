// ui/render.ts
import { dispatch, getState } from "../state/store.js";
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
export function renderTiles(tilesContainer, pensContainer, onToggle) {
    const state = getState();
    pensContainer.classList.toggle("hidden", state.inputMode);
    tilesContainer.innerHTML = "";
    state.tiles.forEach(ts => {
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
        });
        if (!state.inputMode) {
            div.onclick = () => onToggle(ts.tile.id, dispatch);
        }
        tilesContainer.appendChild(div);
    });
}
