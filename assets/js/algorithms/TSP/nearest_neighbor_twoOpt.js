/**
 * 2-opt swap: reverse segment between i and k
 */
function twoOptSwap(order, i, k) {
    const newOrder = order.slice(0, i);
    const reversed = order.slice(i, k + 1).reverse();
    return newOrder.concat(reversed).concat(order.slice(k + 1));
}
/**
 * Compute total distance of a tour given order indices and distance matrix
 */
function tourDistance(order, dist) {
    let total = 0;
    for (let i = 0; i < order.length - 1; i++) {
        total += dist[order[i]][order[i + 1]];
    }
    return total;
}
/**
 * Nearest Neighbor + 2-opt TSP
 */
export function nearestNeighbor2OptTSP(graph, targets, shortestPathFunc) {
    const n = targets.length;
    // 1. Compute distance matrix and path segments
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const paths = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j)
                continue;
            const res = shortestPathFunc(graph, targets[i], targets[j]);
            dist[i][j] = res.distance;
            paths[i][j] = res.path;
        }
    }
    // 2. Initial tour using Nearest Neighbor
    const order = [];
    const visited = new Set();
    let current = 0;
    order.push(current);
    visited.add(current);
    while (order.length < n) {
        let nearest = -1;
        let nearestDist = Infinity;
        for (let i = 0; i < n; i++) {
            if (!visited.has(i) && dist[current][i] < nearestDist) {
                nearest = i;
                nearestDist = dist[current][i];
            }
        }
        current = nearest;
        order.push(current);
        visited.add(current);
    }
    // 3. Apply 2-opt improvement
    let improved = true;
    while (improved) {
        improved = false;
        for (let i = 1; i < n - 1; i++) {
            for (let k = i + 1; k < n; k++) {
                const newOrder = twoOptSwap(order, i, k);
                if (tourDistance(newOrder, dist) < tourDistance(order, dist)) {
                    order.splice(0, order.length, ...newOrder);
                    improved = true;
                }
            }
        }
    }
    // 4. Build full road-level path
    const fullPath = [];
    for (let i = 0; i < n - 1; i++) {
        const a = order[i];
        const b = order[i + 1];
        const segment = paths[a][b];
        if (i === 0) {
            fullPath.push(...segment);
        }
        else {
            fullPath.push(...segment.slice(1)); // avoid duplicates
        }
    }
    const resultOrder = order.map(i => targets[i]);
    const distance = tourDistance(order, dist);
    return { order: resultOrder, path: fullPath, distance };
}
