import { Graph, Node, PathResult } from "@/utils/types";

function buildAdjacency(graph: Graph) {
    const adjacency: Record<string, Edge[]> = {};
    for (const nodeId in graph.nodes) {
        adjacency[nodeId] = [];
    }
    for (const edge of graph.edges) {
        adjacency[edge.from].push(edge);
    }
    graph.adjacency = adjacency;
}

// Dijkstra shortest path from start to end
function dijkstra(graph: Graph, start: string, end: string): { distance: number, path: string[] } {
    if (!graph.adjacency) buildAdjacency(graph);

    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const visited: Set<string> = new Set();

    for (const nodeId in graph.nodes) {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
    }

    distances[start] = 0;

    const queue: Set<string> = new Set(Object.keys(graph.nodes));

    while (queue.size > 0) {
        // Pick node with smallest distance
        let current: string | null = null;
        for (const nodeId of queue) {
        if (current === null || distances[nodeId] < distances[current]) {
            current = nodeId;
        }
        }

        if (current === null || distances[current] === Infinity) break;
        if (current === end) break; // Stop early if we reached the target

        queue.delete(current);
        visited.add(current);

        const neighbors = graph.adjacency![current];
        for (const edge of neighbors) {
        const neighbor = edge.to;
        if (visited.has(neighbor)) continue;

        const alt = distances[current] + edge.distance;
        if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;
        }
        }
    }

    // Reconstruct path
    const path: string[] = [];
    let u: string | null = end;
    while (u) {
        path.unshift(u);
        u = previous[u];
    }

    return {
        distance: distances[end],
        path: distances[end] === Infinity ? [] : path
    };
}
