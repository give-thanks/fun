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
const guessesContainer = document.getElementById("guesses-container");
const partitionsContainer = document.getElementById("partitions-container");
const boardControls = document.getElementById("board-controls");
const newBoardButton = document.getElementById("new-board-button");
export function initUI() {
    const loaded = loadState();
    const state = loaded ? {
        input: '',
        inputMode: false,
        tiles: loaded.tiles,
        activePen: 1,
        guesses: loaded.guesses,
        debugPartitions: false,
    } : getState();
    // console.log(JSON.stringify(state))
    subscribe(() => {
        renderTiles(tilesContainer, pensContainer, rowsContainer, guessesContainer, partitionsContainer, boardControls, onTileToggle);
    });
    const unsubscribeRenderInput = subscribe(() => {
        renderInput(inputContainer, inputField, finalizeButton);
    });
    bindInputEvents(inputField, formatButton, finalizeButton, dispatch);
    bindBoardEvents(pensContainer, rowsContainer, guessesContainer, partitionsContainer, newBoardButton);
    dispatch({ type: "INIT_LOADED", state });
}
