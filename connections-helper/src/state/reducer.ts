// state/reducer.ts

import { saveState } from "../model/state.js";
import { formatTiles, parseTiles, Tile } from "../model/tileParser.js";
import { AppState, MarkId } from "./types.js";

type Action =
    | { type: "INPUT_CHANGED", input: string }
    | { type: "FORMAT_INPUT", input: string }
    | { type: "FINALIZE_INPUT", input: string }
    | { type: "INIT_LOADED"; state: AppState }
    | { type: "TOGGLE_MARK"; tileId: number; mark: MarkId }
    | { type: "SET_ACTIVE_PEN"; mark: MarkId }
    | { type: "NEW_BOARD"; };

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case "INPUT_CHANGED":
            {
                const tiles = parseTiles(action.input);
                return {
                    ...state,
                    input: action.input,
                    tiles: tiles.map(t => { return { tile: t, marks: [] } })
                }
            }
        case "FORMAT_INPUT":
            {
                const tiles = parseTiles(action.input);
                return {
                    ...state,
                    input: formatTiles(tiles),
                    tiles: tiles.map(t => { return { tile: t, marks: [] } })
                }
            }
        case "FINALIZE_INPUT":
            {
                const tiles = parseTiles(action.input).map(t => { return { tile: t, marks: [] } });
                saveState(tiles);
                return {
                    ...state,
                    input: '',
                    inputMode: false,
                    tiles: tiles
                }
            }
        case "INIT_LOADED":
            return action.state;


        case "TOGGLE_MARK": {

            const tiles = state.tiles.map((t, i) => {
                if (i !== action.tileId) {
                    return t;
                }
                const wasMarked = t.marks.indexOf(action.mark) >= 0;
                const marks = t.marks.filter(m => m != action.mark);
                if (!wasMarked) marks.push(action.mark);
                return { ...t, marks }
            });


            saveState(tiles);
            return {
                ...state,
                tiles,
            };
        }

        case "SET_ACTIVE_PEN":
            return {
                ...state,
                activePen: action.mark,
            };

        case "NEW_BOARD":
            saveState([]);
            return {
                activePen: 1,
                input: '',
                inputMode: true,
                tiles: [],
            }

        default:
            return state;
    }
}
