// ui.ts
import { parseTiles, formatTiles, Tile } from "./tileParser.js";
import { saveState, loadState } from "./state.js";

type GuessResult = "correct" | "oneAway" | "cold";

interface Guess {
    id: number;
    tileIds: number[];
    result: GuessResult;
}

interface AppState {
    tiles: Tile[];
    guesses: Guess[];
    remainingTiles: Tile[];
    remainingCombinations: any[];
}

let appState: AppState = {
    tiles: [],
    guesses: [],
    remainingTiles: [],
    remainingCombinations: [],
};

const inputField = document.getElementById("tile-input") as HTMLTextAreaElement;
const formatButton = document.getElementById("format-button") as HTMLButtonElement;
const finalizeButton = document.getElementById("finalize-button") as HTMLButtonElement;
const tilesContainer = document.getElementById("tiles-container") as HTMLDivElement;

const guessPanelContainer = document.createElement("div");
guessPanelContainer.id = "guess-panel-container";
document.body.appendChild(guessPanelContainer);

const resultToCode: Record<GuessResult, 0 | 1 | 2> = { correct: 0, oneAway: 1, cold: 2 };
const codeToResult: Record<0 | 1 | 2, GuessResult> = { 0: "correct", 1: "oneAway", 2: "cold" };

let nextGuessIdCounter = 1;
function nextGuessId() { return nextGuessIdCounter++; }

export function initUI() {
    const loaded = loadState();
    if (loaded) {
        appState.tiles = loaded.tiles;
        appState.guesses = loaded.guesses.map(g => ({
            id: g.id,
            tileIds: g.tileIds,
            result: codeToResult[g.result as 0 | 1 | 2],
        }));
        appState.remainingTiles = [...appState.tiles];
        inputField.parentElement!.style.display = "none";
        renderTiles(appState.remainingTiles, false);
        renderGuessPanels();
        nextGuessIdCounter = Math.max(0, ...appState.guesses.map(g => g.id)) + 1;
        return;
    }

    setTimeout(() => inputField.focus(), 0);

    inputField.addEventListener("input", () => {
        const tiles = parseTiles(inputField.value) || [];
        renderTiles(tiles, true);
    });

    formatButton.addEventListener("click", () => {
        const tiles = parseTiles(inputField.value) || [];
        inputField.value = formatTiles(tiles);
    });

    finalizeButton.addEventListener("click", () => {
        appState.tiles = parseTiles(inputField.value) || [];
        appState.remainingTiles = [...appState.tiles];
        saveState(appState.tiles, []);
        inputField.parentElement!.style.display = "none";
        renderTiles(appState.remainingTiles, false);
    });
}

function renderTiles(tileList: Tile[], readonly = true) {
    tilesContainer.innerHTML = "";

    tileList.forEach(tile => {
        const div = document.createElement("div");
        div.classList.add("tile");
        div.id = tile.id.toString();

        const word = document.createElement("div");
        word.classList.add("word");
        word.textContent = tile.text;
        div.appendChild(word);

        ["tl", "tr", "bl", "br"].forEach((corner, idx) => {
            const tri = document.createElement("div");
            tri.classList.add("triangle", corner);
            tri.style.backgroundColor = getCategoryColor(idx);
            tri.style.opacity = tile.categories.has(idx) ? "1" : "0.3";
            div.appendChild(tri);

            if (!readonly) {
                const quad = document.createElement("div");
                quad.classList.add("quadrant", corner);
                quad.addEventListener("click", (e) => {
                    e.stopPropagation();
                    tile.categories.has(idx) ? tile.categories.delete(idx) : tile.categories.add(idx);
                    tri.style.opacity = tile.categories.has(idx) ? "1" : "0.3";
                    renderGuessPanels();
                    saveState(appState.tiles, appState.guesses.map(g => ({
                        id: g.id, tileIds: g.tileIds, result: resultToCode[g.result]
                    })));
                });
                div.appendChild(quad);
            }
        });

        const guessesForTile = appState.guesses.filter(g => g.tileIds.includes(tile.id));
        const guessContainer = document.createElement("div");
        guessContainer.classList.add("guess-numbers");
        guessesForTile.forEach(g => {
            const dot = document.createElement("div");
            dot.classList.add("result-dot", g.result);
            dot.textContent = g.id.toString();
            guessContainer.appendChild(dot);
        });
        div.appendChild(guessContainer);

        tilesContainer.appendChild(div);
    });
}

function getCategoryColor(idx: number) {
    switch (idx) {
        case 0: return "#007bff";
        case 1: return "#28a745";
        case 2: return "#6f42c1";
        case 3: return "#fd7e14";
        default: return "#000";
    }
}

function getActiveGuessPanels(): Map<number, Tile[]> {
    const panels: Map<number, Tile[]> = new Map();
    [0, 1, 2, 3].forEach(cat => {
        const tilesWithCat = appState.remainingTiles.filter(t => t.categories.has(cat));
        if (tilesWithCat.length === 4) panels.set(cat, tilesWithCat);
    });
    return panels;
}

function renderGuessPanels() {
    guessPanelContainer.innerHTML = "";
    const activePanels = getActiveGuessPanels();
    activePanels.forEach((tilesForGuess, catId) => {
        const panel = document.createElement("div");
        panel.classList.add("guess-panel");
        panel.style.borderLeftColor = getCategoryColor(catId);

        ["correct", "oneAway", "cold"].forEach(result => {
            const btn = document.createElement("button");
            let icon = "";
            let color = "";
            switch (result) {
                case "correct": icon = "✅ Correct"; color = "#28a745"; break;
                case "oneAway": icon = "❌ 1 Away"; color = "#dc3545"; break;
                case "cold": icon = "❄️ Wrong (cold)"; color = "#17a2b8"; break;
            }
            btn.innerHTML = `<span class="icon">${icon}</span>`;
            btn.style.backgroundColor = color;
            btn.addEventListener("click", () => applyCategoryGuess(catId, tilesForGuess, result as GuessResult));
            panel.appendChild(btn);
        });

        guessPanelContainer.appendChild(panel);
    });
}

function applyCategoryGuess(catId: number, tiles: Tile[], result: GuessResult) {
    const guess: Guess = { id: nextGuessId(), tileIds: tiles.map(t => t.id), result };
    appState.guesses.push(guess);

    if (result === "correct") {
        appState.remainingTiles = appState.remainingTiles.filter(t => !guess.tileIds.includes(t.id));
    }

    saveState(appState.tiles, appState.guesses.map(g => ({
        id: g.id, tileIds: g.tileIds, result: resultToCode[g.result]
    })));

    renderTiles(appState.remainingTiles, false);
    renderGuessPanels();
}