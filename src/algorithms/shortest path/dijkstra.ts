import { Graph, Node, PathResult } from "@/utils/types";

// Pathfinding Algorithms
interface QueueItem {
    id: string;
    distance: number;
  }

/**
 * Dijkstra's Algorithm
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @param endNode - End node
 * @returns Path, visited order, and distance
 */
async function dijkstra(graph: Graph, startNode: Node, endNode: Node): Promise<PathResult> {
const distances: Record<string, number> = {};
const previous: Record<string, string> = {};
const visited = new Set<string>();
const pq: QueueItem[] = [];

Object.keys(graph.nodes).forEach(nodeId => {
    distances[nodeId] = Infinity;
});
distances[startNode.id] = 0;
pq.push({ id: startNode.id, distance: 0 });

const visitedOrder: string[] = [];

while (pq.length > 0) {
    pq.sort((a, b) => a.distance - b.distance);
    const current = pq.shift();
    
    if (!current) break;

    if (visited.has(current.id)) continue;
    
    visited.add(current.id);
    visitedOrder.push(current.id);

    if (current.id === endNode.id) break;

    const neighbors = graph.edges.filter(e => e.from == current.id);
    
    for (const edge of neighbors) {
    if (!visited.has(edge.to)) {
        const newDist = distances[current.id] + edge.distance;
        
        if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
        previous[edge.to] = current.id;
        pq.push({ id: edge.to, distance: newDist });
        }
    }
    }
}

const path: string[] = [];
let current: string | undefined = endNode.id;
while (current) {
    path.unshift(current);
    current = previous[current];
}

return { path, visitedOrder, distance: distances[endNode.id] };
}