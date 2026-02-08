import { Graph, PathResult, Node } from "@/utils/types";

/**
 * Held-Karp Algorithm for TSP
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @returns Path, visited order, and distance
 */
async function heldKarpTSP(graph: Graph, startNode: Node): Promise<PathResult> {
    const nodeIds = Object.keys(graph.nodes);
    const n = nodeIds.length;

    // Build adjacency matrix
    const dist: Record<string, Record<string, number>> = {};
    for (const from of nodeIds) {
        dist[from] = {};
        for (const to of nodeIds) {
            if (from === to) dist[from][to] = 0;
            else {
                const edge = graph.edges.find(e => e.from === from && e.to === to);
                dist[from][to] = edge ? edge.distance : Infinity;
            }
        }
    }

    const memo: Record<string, Record<string, number>> = {}; // memo[state][last]
    const parent: Record<string, Record<string, string>> = {};

    function tsp(mask: number, last: number): number {
        const key = mask + ',' + last;
        if (memo[key] !== undefined) return memo[key][last];

        if (mask === (1 << n) - 1) return dist[nodeIds[last]][startNode.id];

        let minCost = Infinity;
        let bestNext = -1;

        for (let next = 0; next < n; next++) {
            if (!(mask & (1 << next))) {
                const cost = dist[nodeIds[last]][nodeIds[next]] + tsp(mask | (1 << next), next);
                if (cost < minCost) {
                    minCost = cost;
                    bestNext = next;
                }
            }
        }

        if (!memo[key]) memo[key] = {};
        memo[key][last] = minCost;

        if (!parent[key]) parent[key] = {};
        parent[key][last] = bestNext >= 0 ? nodeIds[bestNext] : '';

        return minCost;
    }

    const startIndex = nodeIds.indexOf(startNode.id);
    const distance = tsp(1 << startIndex, startIndex);

    // Reconstruct path
    const visitedOrder: string[] = [];
    const path: string[] = [startNode.id];
    let mask = 1 << startIndex;
    let last = startIndex;

    while (true) {
        const key = mask + ',' + last;
        const nextNodeId = parent[key]?.[last];
        if (!nextNodeId) break;
        path.push(nextNodeId);
        visitedOrder.push(nextNodeId);
        last = nodeIds.indexOf(nextNodeId);
        mask |= 1 << last;
    }
    path.push(startNode.id); // return to start

    return { path, visitedOrder, distance };
}
