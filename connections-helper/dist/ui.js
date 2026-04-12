// ui.ts
import { parseTiles, formatTiles } from "./tileParser.js";
import { saveState, loadState } from "./state.js";
let appState = {
    tiles: [],
    guesses: [],
    remainingTiles: [],
    remainingCombinations: [],
};
const inputField = document.getElementById("tile-input");
const formatButton = document.getElementById("format-button");
const finalizeButton = document.getElementById("finalize-button");
const tilesContainer = document.getElementById("tiles-container");
const guessPanelContainer = document.createElement("div");
guessPanelContainer.id = "guess-panel-container";
document.body.appendChild(guessPanelContainer);
const resultToCode = { correct: 0, oneAway: 1, cold: 2 };
const codeToResult = { 0: "correct", 1: "oneAway", 2: "cold" };
let nextGuessIdCounter = 1;
function nextGuessId() { return nextGuessIdCounter++; }
export function initUI() {
    const loaded = loadState();
    if (loaded) {
        appState.tiles = loaded.tiles;
        appState.guesses = loaded.guesses.map(g => ({
            id: g.id,
            tileIds: g.tileIds,
            result: codeToResult[g.result],
        }));
        appState.remainingTiles = [...appState.tiles];
        inputField.parentElement.style.display = "none";
        renderTiles(appState.remainingTiles, false);
        nextGuessIdCounter = Math.max(0, ...appState.guesses.map(g => g.id)) + 1;
        return;
    }
    setTimeout(() => inputField.focus(), 0);
    inputField.addEventListener("input", () => {
        const tiles = parseTiles(inputField.value) || [];
        finalizeButton.disabled = !isValidTileCount(tiles.length);
        renderTiles(tiles, true);
    });
    finalizeButton.disabled = true;
    formatButton.addEventListener("click", () => {
        const tiles = parseTiles(inputField.value) || [];
        inputField.value = formatTiles(tiles);
    });
    finalizeButton.addEventListener("click", () => {
        const tiles = parseTiles(inputField.value) || [];
        if (!isValidTileCount(tiles.length))
            return;
        appState.tiles = tiles;
        appState.remainingTiles = [...appState.tiles];
        saveState(appState.tiles, []);
        inputField.parentElement.style.display = "none";
        renderTiles(appState.remainingTiles, false);
    });
}
function isValidTileCount(count) {
    return count === 8 || count === 12 || count === 16;
}
function renderTiles(tileList, readonly = true) {
    tilesContainer.innerHTML = "";
    tileList.forEach(tile => {
        const div = document.createElement("div");
        div.classList.add("tile");
        div.id = tile.id.toString();
        const word = document.createElement("div");
        word.classList.add("word");
        word.textContent = tile.text;
        div.appendChild(word);
        tilesContainer.appendChild(div);
    });
}
