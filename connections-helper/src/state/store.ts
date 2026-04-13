// state/store.ts

import { saveState } from "../model/state.js";
import { reducer } from "./reducer.js";
import { AppState, Unsubscribe } from "./types.js";

let state: AppState = {
    input: '',
    inputMode: true,
    tiles: [],
    activePen: 1,
    guesses:[],
};

let listeners: Map<number, () => void> = new Map();
let nextId = 0;

export function getState() {
    return state;
}

export function dispatch(action: any) {
    state = reducer(state, action);
    listeners.forEach(l => l());
}

export function subscribe(listener: () => void):Unsubscribe {
    const id = nextId++;
    listeners.set(id, listener);

    return () => {
        listeners.delete(id);
    };
}