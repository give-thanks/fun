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
export function bindBoardEvents(pensContainer, newBoardButton) {
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
    newBoardButton.addEventListener('click', () => {
        dispatch({ type: "NEW_BOARD" });
    });
}
