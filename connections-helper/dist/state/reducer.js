// state/reducer.ts
import { saveState } from "../model/state.js";
import { formatTiles, parseTiles } from "../model/tileParser.js";
export function reducer(state, action) {
    switch (action.type) {
        case "INPUT_CHANGED":
            {
                const tiles = parseTiles(action.input);
                return Object.assign(Object.assign({}, state), { input: action.input, tiles: tiles.map(t => { return { tile: t, marks: [] }; }) });
            }
        case "FORMAT_INPUT":
            {
                const tiles = parseTiles(action.input);
                return Object.assign(Object.assign({}, state), { input: formatTiles(tiles), tiles: tiles.map(t => { return { tile: t, marks: [] }; }) });
            }
        case "FINALIZE_INPUT":
            {
                const tiles = parseTiles(action.input).map(t => { return { tile: t, marks: [] }; });
                saveState(tiles);
                return Object.assign(Object.assign({}, state), { input: '', inputMode: false, tiles: tiles });
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
                if (!wasMarked)
                    marks.push(action.mark);
                return Object.assign(Object.assign({}, t), { marks });
            });
            saveState(tiles);
            return Object.assign(Object.assign({}, state), { tiles });
        }
        case "SET_ACTIVE_PEN":
            return Object.assign(Object.assign({}, state), { activePen: action.mark });
        case "NEW_BOARD":
            saveState([]);
            return {
                activePen: 1,
                input: '',
                inputMode: true,
                tiles: [],
            };
        default:
            return state;
    }
}
