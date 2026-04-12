// ui/ui.ts
import { loadState } from "../model/state.js";
import { dispatch, getState, subscribe } from "../state/store.js";
import { bindBoardEvents, bindInputEvents, onTileToggle } from "./events.js";
import { renderInput, renderTiles } from "./render.js";
const inputContainer = document.getElementById("input-container");
const inputField = document.getElementById("tile-input");
const formatButton = document.getElementById("format-button");
const finalizeButton = document.getElementById("finalize-button");
const tilesContainer = document.getElementById("tiles-container");
const pensContainer = document.getElementById("pens-container");
const rowsContainer = document.getElementById("rows-container");
const boardControls = document.getElementById("board-controls");
const newBoardButton = document.getElementById("new-board-button");
export function initUI() {
    const loaded = loadState();
    const state = loaded ? {
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
    });
    if (!loaded) {
        bindInputEvents(inputField, formatButton, finalizeButton, dispatch);
    }
    bindBoardEvents(pensContainer, newBoardButton);
    dispatch({ type: "INIT_LOADED", state });
}
