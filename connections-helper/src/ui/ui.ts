// ui/ui.ts

import { loadState } from "../model/state.js";
import { dispatch, getState, subscribe } from "../state/store.js";
import { AppState } from "../state/types.js";
import { bindBoardEvents, bindInputEvents, onTileToggle } from "./events.js";
import { renderInput, renderTiles } from "./render.js";

const inputContainer = document.getElementById("input-container") as HTMLDivElement;
const inputField = document.getElementById("tile-input") as HTMLTextAreaElement;
const formatButton = document.getElementById("format-button") as HTMLButtonElement;
const finalizeButton = document.getElementById("finalize-button") as HTMLButtonElement;

const tilesContainer = document.getElementById("tiles-container") as HTMLDivElement;
const pensContainer = document.getElementById("pens-container") as HTMLDivElement;
const rowsContainer = document.getElementById("rows-container") as HTMLDivElement;
const boardControls = document.getElementById("board-controls") as HTMLDivElement;
const newBoardButton = document.getElementById("new-board-button") as HTMLButtonElement;

export function initUI() {
    const loaded = loadState();

    const state: AppState = loaded ? {
        input: '',
        inputMode: false,
        tiles: loaded,
        activePen: 1,
    } : getState();

    subscribe(() => {
        renderTiles(tilesContainer, pensContainer, rowsContainer, boardControls, onTileToggle);
    });

    const unsubscribeRenderInput = subscribe(() => {
        renderInput(inputContainer, inputField, finalizeButton);
    })

    if (!loaded) {
        bindInputEvents(inputField, formatButton, finalizeButton, dispatch);
    }

    bindBoardEvents(pensContainer, newBoardButton);

    dispatch({ type: "INIT_LOADED", state });
}

