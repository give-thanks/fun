import { dispatch, getState } from "../state/store.js";
export function bindInputEvents(inputField, formatButton, finalizeButton, dispatch) {
    inputField.addEventListener("input", () => {
        dispatch({ type: "INPUT_CHANGED", input: inputField.value });
    });
    formatButton.addEventListener("click", () => {
        dispatch({ type: "FORMAT_INPUT", input: inputField.value });
    });
    finalizeButton.addEventListener("click", () => {
        dispatch({ type: "FINALIZE_INPUT", input: inputField.value });
    });
}
export function onTileToggle(id, dispatch) {
    const state = getState();
    dispatch({
        type: "TOGGLE_MARK",
        tileId: id,
        mark: state.activePen,
    });
}
export function bindBoardEvents(pensContainer, rowsContainer, guessesContainer, partitionsContainer, newBoardButton) {
    pensContainer.addEventListener("change", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLInputElement))
            return;
        if (target.name !== "pen")
            return;
        dispatch({
            type: "SET_ACTIVE_PEN",
            mark: Number(target.value),
        });
    });
    const rows = rowsContainer.querySelectorAll('.row');
    rows.forEach((row) => {
        const markId = Number(row.dataset.pen);
        const buttons = row.querySelectorAll(".icon-btn");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                let guessType = null;
                if (button.classList.contains("correct"))
                    guessType = "correct";
                else if (button.classList.contains("close"))
                    guessType = "close";
                else if (button.classList.contains("cold"))
                    guessType = "cold";
                if (!guessType)
                    return; // safety
                dispatch({
                    type: "RECORD_GUESS",
                    mark: markId,
                    guessType
                });
            });
        });
    });
    guessesContainer.addEventListener('dblclick', () => {
        dispatch({ type: "CLEAR_GUESSES" });
    });
    partitionsContainer.addEventListener('click', () => {
        dispatch({ type: "TOGGLE_DEBUG_PARTITIONS" });
    });
    newBoardButton.addEventListener('click', () => {
        dispatch({ type: "NEW_BOARD" });
    });
}
