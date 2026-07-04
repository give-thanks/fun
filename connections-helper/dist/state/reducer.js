// state/reducer.ts
import { saveState } from "../model/state.js";
import { formatTiles, parseTiles } from "../model/tileParser.js";
import { determineValidTiles } from "../model/validTiles.js";
import { GuessType } from "./types.js";
export function reducer(state, action) {
    switch (action.type) {
        case "INIT_LOADED":
            return action.state;
        case "INPUT_CHANGED":
            {
                const tiles = parseTiles(action.input);
                const validTileIds = tiles.map(t => t.id);
                return Object.assign(Object.assign({}, state), { input: action.input, tiles: tiles.map(t => { return { tile: t, marks: [] }; }), validTileIds });
            }
        case "FORMAT_INPUT":
            {
                const tiles = parseTiles(action.input);
                const validTileIds = tiles.map(t => t.id);
                return Object.assign(Object.assign({}, state), { input: formatTiles(tiles), tiles: tiles.map(t => { return { tile: t, marks: [] }; }), validTileIds });
            }
        case "FINALIZE_INPUT":
            {
                const tiles = parseTiles(action.input).map(t => { return { tile: t, marks: [] }; });
                const validTileIds = determineValidTiles(tiles, state.activePen, state.guesses);
                saveState(tiles, state.guesses);
                return Object.assign(Object.assign({}, state), { input: '', inputMode: false, tiles,
                    validTileIds });
            }
        case "TOGGLE_MARK": {
            const tiles = state.tiles.map((t, i) => {
                if (i + 1 !== action.tileId) {
                    return t;
                }
                const wasMarked = t.marks.indexOf(action.mark) >= 0;
                const marks = t.marks.filter(m => m != action.mark);
                if (!wasMarked)
                    marks.push(action.mark);
                return Object.assign(Object.assign({}, t), { marks });
            });
            const validTileIds = determineValidTiles(tiles, state.activePen, state.guesses);
            saveState(tiles, state.guesses);
            return Object.assign(Object.assign({}, state), { tiles,
                validTileIds });
        }
        case "SET_ACTIVE_PEN":
            {
                const validTileIds = determineValidTiles(state.tiles, state.activePen, state.guesses);
                return Object.assign(Object.assign({}, state), { activePen: action.mark, validTileIds });
            }
        case "RECORD_GUESS":
            {
                const tileIds = state.tiles
                    .filter(t => t.marks.indexOf(action.mark) >= 0)
                    .map(t => t.tile.id);
                const guesses = [...state.guesses, {
                        id: state.guesses.length,
                        tileIds: tileIds,
                        result: action.guessType
                    }];
                const tiles = (action.guessType == GuessType.Correct) ? state.tiles.map(t => (Object.assign(Object.assign({}, t), { marks: t.marks.filter(m => tileIds.indexOf(t.tile.id) < 0) }))) : state.tiles;
                const validTileIds = determineValidTiles(tiles, state.activePen, guesses);
                saveState(tiles, guesses);
                return Object.assign(Object.assign({}, state), { guesses,
                    tiles,
                    validTileIds });
            }
        case "CLEAR_GUESSES":
            return Object.assign(Object.assign({}, state), { guesses: [], validTileIds: [] });
        case "TOGGLE_DEBUG_PARTITIONS":
            return Object.assign(Object.assign({}, state), { debugPartitions: !state.debugPartitions });
        case "NEW_BOARD":
            saveState([], []);
            return {
                activePen: 1,
                input: '',
                inputMode: true,
                tiles: [],
                guesses: [],
                validTileIds: [],
                debugPartitions: state.debugPartitions
            };
        default:
            return state;
    }
}
