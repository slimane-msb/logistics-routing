import { Graph, PathResult , Node} from "@/utils/types";

/**
 * Branch and Bound for TSP
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @returns Path, visited order, and distance
 */
async function branchAndBoundTSP(graph: Graph, startNode: Node): Promise<PathResult> {
    const n = Object.keys(graph.nodes).length;
    const nodeIds = Object.keys(graph.nodes);
    
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

    let bestCost = Infinity;
    let bestPath: string[] = [];
    const visitedOrder: string[] = [];

    function dfs(path: string[], cost: number, visited: Set<string>) {
        const current = path[path.length - 1];
        visitedOrder.push(current);

        if (path.length === n) {
            const totalCost = cost + dist[current][startNode.id]; // return to start
            if (totalCost < bestCost) {
                bestCost = totalCost;
                bestPath = [...path, startNode.id];
            }
            return;
        }

        for (const next of nodeIds) {
            if (!visited.has(next) && cost + dist[current][next] < bestCost) {
                visited.add(next);
                path.push(next);
                dfs(path, cost + dist[current][next], visited);
                path.pop();
                visited.delete(next);
            }
        }
    }

    dfs([startNode.id], 0, new Set([startNode.id]));

    return { path: bestPath, visitedOrder, distance: bestCost };
}
