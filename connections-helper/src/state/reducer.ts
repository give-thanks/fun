// state/reducer.ts

import { saveState } from "../model/state.js";
import { formatTiles, parseTiles, Tile } from "../model/tileParser.js";
import { determineValidTiles } from "../model/validTiles.js";
import { AppState, GuessType, MarkId } from "./types.js";

type Action =
    | { type: "INPUT_CHANGED", input: string }
    | { type: "FORMAT_INPUT", input: string }
    | { type: "FINALIZE_INPUT", input: string }
    | { type: "INIT_LOADED"; state: AppState }
    | { type: "TOGGLE_MARK"; tileId: number; mark: MarkId }
    | { type: "SET_ACTIVE_PEN"; mark: MarkId }
    | { type: "RECORD_GUESS"; mark: MarkId; guessType: GuessType }
    | { type: "CLEAR_GUESSES"; }
    | { type: "TOGGLE_DEBUG_PARTITIONS"; }
    | { type: "NEW_BOARD"; }
    ;

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {

        case "INIT_LOADED":
            return action.state;

        case "INPUT_CHANGED":
            {
                const tiles = parseTiles(action.input);
                const validTileIds = tiles.map(t => t.id);
                return {
                    ...state,
                    input: action.input,
                    tiles: tiles.map(t => { return { tile: t, marks: [] } }),
                    validTileIds,
                }
            }
        case "FORMAT_INPUT":
            {
                const tiles = parseTiles(action.input);
                const validTileIds = tiles.map(t => t.id);
                return {
                    ...state,
                    input: formatTiles(tiles),
                    tiles: tiles.map(t => { return { tile: t, marks: [] } }),
                    validTileIds,
                }
            }
        case "FINALIZE_INPUT":
            {
                const tiles = parseTiles(action.input).map(t => { return { tile: t, marks: [] } });
                const validTileIds = determineValidTiles(tiles, state.activePen, state.guesses);
                saveState(tiles, state.guesses);
                return {
                    ...state,
                    input: '',
                    inputMode: false,
                    tiles,
                    validTileIds,
                }
            }

        case "TOGGLE_MARK": {

            const tiles = state.tiles.map((t, i) => {
                if (i + 1 !== action.tileId) {
                    return t;
                }
                const wasMarked = t.marks.indexOf(action.mark) >= 0;
                const marks = t.marks.filter(m => m != action.mark);
                if (!wasMarked) marks.push(action.mark);
                return { ...t, marks }
            });
            const validTileIds = determineValidTiles(tiles, state.activePen, state.guesses);

            saveState(tiles, state.guesses);
            return {
                ...state,
                tiles,
                validTileIds,
            };
        }

        case "SET_ACTIVE_PEN":
            {
                const validTileIds = determineValidTiles(state.tiles, state.activePen, state.guesses);
                return {
                    ...state,
                    activePen: action.mark,
                    validTileIds,
                };
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
                const tiles = (action.guessType == GuessType.Correct) ? state.tiles.map(t => ({
                    ...t,
                    marks: t.marks.filter(m => tileIds.indexOf(t.tile.id) < 0)
                })) : state.tiles;
                const validTileIds = determineValidTiles(tiles, state.activePen, guesses);

                saveState(tiles, guesses);
                return {
                    ...state,
                    guesses,
                    tiles,
                    validTileIds,
                };
            }

        case "CLEAR_GUESSES":
            return {
                ...state,
                guesses: [],
                validTileIds: [],
            };

        case "TOGGLE_DEBUG_PARTITIONS":
            return {
                ...state,
                debugPartitions: !state.debugPartitions,
            };

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
            }

        default:
            return state;
    }
}
