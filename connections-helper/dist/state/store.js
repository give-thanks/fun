// state/store.ts
import { reducer } from "./reducer.js";
let state = {
    input: '',
    inputMode: true,
    tiles: [],
    activePen: 1,
};
let listeners = new Map();
let nextId = 0;
export function getState() {
    return state;
}
export function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(l => l());
}
export function subscribe(listener) {
    const id = nextId++;
    listeners.set(id, listener);
    return () => {
        listeners.delete(id);
    };
}
