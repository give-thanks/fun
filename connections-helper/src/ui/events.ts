import { dispatch, getState } from "../state/store.js";
import { GuessType, MarkId } from "../state/types.js";

export function bindInputEvents(
    inputField: HTMLTextAreaElement,
    formatButton: HTMLButtonElement,
    finalizeButton: HTMLButtonElement,
    dispatch: (action: any) => void
) {
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

export function onTileToggle(
    id: number,
    dispatch: (action: any) => void
): void {
    const state = getState();
    dispatch({
        type: "TOGGLE_MARK",
        tileId: id,
        mark: state.activePen,
    });
}

export function bindBoardEvents(pensContainer: HTMLDivElement, rowsContainer: HTMLDivElement, newBoardButton: HTMLButtonElement) {
    pensContainer.addEventListener("change", (e) => {
        const target = e.target;

        if (!(target instanceof HTMLInputElement)) return;
        if (target.name !== "pen") return;

        dispatch({
            type: "SET_ACTIVE_PEN",
            mark: Number(target.value),
        });

    });

    const rows = rowsContainer.querySelectorAll<HTMLDivElement>('.row');
    rows.forEach((row) => {
        const markId = Number(row.dataset.pen) as MarkId;

        const buttons = row.querySelectorAll<HTMLButtonElement>(".icon-btn");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                let guessType: GuessType | null = null;

                if (button.classList.contains("correct")) guessType = "correct";
                else if (button.classList.contains("close")) guessType = "close";
                else if (button.classList.contains("cold")) guessType = "cold";

                if (!guessType) return; // safety

                dispatch({
                    type: "RECORD_GUESS",
                    mark:markId,
                    guessType
                });
            });
        });
    });

    newBoardButton.addEventListener('click', () => {
        dispatch({ type: "NEW_BOARD" })
    });
}
