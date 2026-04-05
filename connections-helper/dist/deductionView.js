/**
 * Generate all 4-tile combinations from a set of tiles
 */
function combinations(arr, k) {
    const result = [];
    const n = arr.length;
    const helper = (start, combo) => {
        if (combo.length === k) {
            result.push([...combo]);
            return;
        }
        for (let i = start; i < n; i++) {
            combo.push(arr[i]);
            helper(i + 1, combo);
            combo.pop();
        }
    };
    helper(0, []);
    return result;
}
/**
 * Generate candidate rows with elimination status
 */
export function generateCandidates(appState) {
    const tiles = appState.remainingTiles;
    const guesses = appState.guesses;
    const allCombos = combinations(tiles, 4);
    const candidateRows = allCombos.map(combo => {
        const tileIds = combo.map(t => t.id);
        let status = "Nothing";
        // Exact guesses override all
        for (const guess of guesses) {
            if (arraysEqual(guess.tileIds, tileIds)) {
                if (guess.result === "oneAway")
                    status = "oneAwayGuess";
                else if (guess.result === "cold")
                    status = "coldGuess";
                break;
            }
        }
        if (status === "Nothing") {
            // Violates 1-away? candidate must contain ≥3 tiles of each 1-away guess
            for (const guess of guesses.filter(g => g.result === "oneAway")) {
                const matchCount = countIntersection(tileIds, guess.tileIds);
                if (matchCount < 3) {
                    status = "violates1Away";
                    break;
                }
            }
        }
        if (status === "Nothing") {
            // Violates cold? candidate must contain <3 tiles of each cold guess
            for (const guess of guesses.filter(g => g.result === "cold")) {
                const matchCount = countIntersection(tileIds, guess.tileIds);
                if (matchCount >= 3) {
                    status = "violatesCold";
                    break;
                }
            }
        }
        return { tileIds, status };
    });
    return candidateRows;
}
/**
 * Filter candidates: show only valid (Nothing) or show all
 */
export function filterCandidates(candidates, possibleOnly) {
    if (!possibleOnly)
        return candidates;
    return candidates.filter(c => c.status === "Nothing");
}
/**
 * Sort candidates by number of tiles matching a selected category
 */
export function sortByCategoryMatch(candidates, tiles, categoryId) {
    if (categoryId === undefined)
        return candidates;
    return candidates.slice().sort((a, b) => {
        const countA = a.tileIds.filter(id => { var _a; return (_a = tiles.find(t => t.id === id)) === null || _a === void 0 ? void 0 : _a.categories.has(categoryId); }).length;
        const countB = b.tileIds.filter(id => { var _a; return (_a = tiles.find(t => t.id === id)) === null || _a === void 0 ? void 0 : _a.categories.has(categoryId); }).length;
        return countB - countA; // descending
    });
}
/**
 * Helper: count overlapping IDs between two arrays
 */
function countIntersection(a, b) {
    const s = new Set(b);
    return a.filter(x => s.has(x)).length;
}
/**
 * Helper: check if two arrays have same elements (ignores order)
 */
function arraysEqual(a, b) {
    if (a.length !== b.length)
        return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((v, i) => v === sortedB[i]);
}
/**
 * Render the candidate list as a read-only table in the DOM
 */
export function renderCandidates(container, appState, possibleOnly = true, focusCategory) {
    container.innerHTML = "";
    let candidates = generateCandidates(appState);
    candidates = filterCandidates(candidates, possibleOnly);
    candidates = sortByCategoryMatch(candidates, appState.tiles, focusCategory);
    candidates.forEach(row => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.gap = "10px";
        div.style.marginBottom = "2px";
        row.tileIds.forEach(id => {
            const tile = appState.tiles.find(t => t.id === id);
            const span = document.createElement("span");
            span.textContent = tile.text;
            if (focusCategory !== undefined && tile.categories.has(focusCategory)) {
                span.style.backgroundColor = getCategoryColor(focusCategory);
                span.style.opacity = "0.3";
                span.style.padding = "2px 4px";
                span.style.borderRadius = "3px";
            }
            div.appendChild(span);
        });
        container.appendChild(div);
    });
}
/**
 * Map category to UI color (reuse your triangle colors)
 */
function getCategoryColor(idx) {
    switch (idx) {
        case 0: return "#007bff"; // blue
        case 1: return "#28a745"; // green
        case 2: return "#6f42c1"; // purple
        case 3: return "#fd7e14"; // orange
        default: return "#ccc";
    }
}
