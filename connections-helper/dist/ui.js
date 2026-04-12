"use strict";
// // ui.ts
// import { parseTiles, formatTiles, Tile } from "./model/tileParser.js";
// import { saveState, loadState } from "./state.js";
// type MarkId = 1 | 2 | 3 | 4;
// interface TileState {
//     tile: Tile;
//     marks: MarkId[];
// }
// /* ===== STATE ===== */
// interface AppState {
//     tiles: TileState[];
//     activePen: MarkId;
// }
// /* ===== ACTIONS ===== */
// type Action =
//     | { type: "INIT_LOADED"; state: AppState }
//     | { type: "SET_TILES"; tiles: Tile[] }
//     | { type: "TOGGLE_MARK"; tileId: number; mark: MarkId }
//     | { type: "SET_ACTIVE_PEN"; mark: MarkId };
// /* ===== INITIAL STATE ===== */
// let appState: AppState = {
//     tiles: [],
//     activePen: 1,
// };
// /* ===== DOM ===== */
// const inputField = document.getElementById("tile-input") as HTMLTextAreaElement;
// const formatButton = document.getElementById("format-button") as HTMLButtonElement;
// const finalizeButton = document.getElementById("finalize-button") as HTMLButtonElement;
// const tilesContainer = document.getElementById("tiles-container") as HTMLDivElement;
// const setsContainer = document.createElement("div");
// setsContainer.id = "sets-container";
// document.body.appendChild(setsContainer);
// /* ===== REDUCER ===== */
// function reducer(state: AppState, action: Action): AppState {
//     switch (action.type) {
//         case "INIT_LOADED":
//             return action.state;
//         case "SET_TILES":
//             return {
//                 ...state,
//                 tiles: action.tiles.map(t => { return { tile: t, marks: [] } }),
//                 marks: {},
//             };
//         case "TOGGLE_MARK": {
//             const marks = { ...state.marks };
//             const list = marks[action.tileId] ? [...marks[action.tileId]] : [];
//             const idx = list.indexOf(action.mark);
//             if (idx >= 0) {
//                 list.splice(idx, 1);
//             } else {
//                 if (list.length < 4) list.push(action.mark);
//             }
//             marks[action.tileId] = list;
//             return {
//                 ...state,
//                 marks,
//             };
//         }
//         case "SET_ACTIVE_PEN":
//             return {
//                 ...state,
//                 activePen: action.mark,
//             };
//         default:
//             return state;
//     }
// }
// /* ===== DISPATCH ===== */
// function dispatch(action: Action) {
//     appState = reducer(appState, action);
//     renderAll();
// }
// /* ===== INIT ===== */
// export function initUI() {
//     const loaded = loadState();
//     if (loaded) {
//         const state: AppState = {
//             tiles: loaded.tiles.map(t => { return { tile: t, marks: [] } }),
//             activePen: 1,
//         };
//         dispatch({ type: "INIT_LOADED", state });
//         inputField.parentElement!.style.display = "none";
//         return;
//     }
//     finalizeButton.disabled = true;
//     inputField.addEventListener("input", () => {
//         const tiles = parseTiles(inputField.value) || [];
//         finalizeButton.disabled = !isValid(tiles.length);
//         renderPreview(tiles);
//     });
//     formatButton.onclick = () => {
//         const tiles = parseTiles(inputField.value) || [];
//         inputField.value = formatTiles(tiles);
//     };
//     finalizeButton.onclick = () => {
//         const tiles = parseTiles(inputField.value) || [];
//         if (!isValid(tiles.length)) return;
//         dispatch({ type: "SET_TILES", tiles });
//         saveState(tiles, []);
//         inputField.parentElement!.style.display = "none";
//     };
//     window.addEventListener("keydown", (e) => {
//         if (e.key >= "1" && e.key <= "4") {
//             dispatch({
//                 type: "SET_ACTIVE_PEN",
//                 mark: Number(e.key) as MarkId,
//             });
//         }
//     });
// }
// function isValid(n: number) {
//     return n === 8 || n === 12 || n === 16;
// }
// /* ===== RENDER ===== */
// function renderAll() {
//     renderTiles(appState.tiles, true);
//     renderSetsView();
// }
// /* ===== PREVIEW ===== */
// function renderPreview(tiles: Tile[]) {
//     renderTiles(tiles.map(t => { return { tile: t, marks: [] } }), false);
// }
// /* ===== TILE RENDERING ===== */
// function renderTiles(tileList: TileState[], interactive: boolean) {
//     tilesContainer.innerHTML = "";
//     tileList.forEach(tile => {
//         const div = document.createElement("div");
//         div.className = "tile";
//         div.dataset.id = String(tile.tile.id);
//         const word = document.createElement("div");
//         word.className = "word";
//         word.textContent = tile.tile.text;
//         div.appendChild(word);
//         const marks = appState.marks[tile.tile.id] || [];
//         marks.forEach(m => {
//             const markEl = document.createElement("div");
//             markEl.className = `mark mark-m${m}`;
//             div.appendChild(markEl);
//         });
//         if (interactive) {
//             div.onclick = () =>
//                 dispatch({
//                     type: "TOGGLE_MARK",
//                     tileId: tile.tile.id,
//                     mark: appState.activePen,
//                 });
//         }
//         tilesContainer.appendChild(div);
//     });
// }
// /* ===== SETS VIEW ===== */
// function renderSetsView() {
//     const sets: Record<number, string[]> = {
//         1: [],
//         2: [],
//         3: [],
//         4: [],
//     };
//     for (const tile of appState.tiles) {
//         const marks = appState.marks[tile.tile.id] || [];
//         for (const m of marks) {
//             sets[m].push(tile.tile.text);
//         }
//     }
//     const order: MarkId[] = [2, 4, 3, 1];
//     setsContainer.innerHTML = "";
//     order.forEach(m => {
//         const row = document.createElement("div");
//         row.className = "set-row";
//         row.style.borderLeft = `6px solid var(--mark-${m}, #999)`;
//         row.textContent = sets[m].length ? sets[m].join(" · ") : "—";
//         setsContainer.appendChild(row);
//     });
// }
