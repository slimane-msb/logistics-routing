import { Node, Graph, PathResult, Point } from "./types";
import { getDistance } from "./utils";

// Pathfinding Algorithms
interface QueueItem {
  id: string;
  distance: number;
}

interface AStarQueueItem {
  id: string;
  fScore: number;
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

/**
 * A* Algorithm
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @param endNode - End node
 * @returns Path, visited order, and distance
 */
async function astar(graph: Graph, startNode: Node, endNode: Node): Promise<PathResult> {
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string> = {};
  const visited = new Set<string>();
  const openSet: AStarQueueItem[] = [];

  Object.keys(graph.nodes).forEach(nodeId => {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
  });

  gScore[startNode.id] = 0;
  fScore[startNode.id] = getDistance(
    { lat: startNode.lat, lng: startNode.lon },
    { lat: endNode.lat, lng: endNode.lon }
  );
  openSet.push({ id: startNode.id, fScore: fScore[startNode.id] });

  const visitedOrder: string[] = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift();
    
    if (!current) break;

    if (visited.has(current.id)) continue;

    visited.add(current.id);
    visitedOrder.push(current.id);

    if (current.id === endNode.id) break;

    const neighbors = graph.edges.filter(e => e.from == current.id);

    for (const edge of neighbors) {
      if (!visited.has(edge.to)) {
        const tentativeGScore = gScore[current.id] + edge.distance;

        if (tentativeGScore < gScore[edge.to]) {
          previous[edge.to] = current.id;
          gScore[edge.to] = tentativeGScore;
          const h = getDistance(
            { lat: graph.nodes[edge.to].lat, lng: graph.nodes[edge.to].lon },
            { lat: endNode.lat, lng: endNode.lon }
          );
          fScore[edge.to] = gScore[edge.to] + h;
          openSet.push({ id: edge.to, fScore: fScore[edge.to] });
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

  return { path, visitedOrder, distance: gScore[endNode.id] };
}

/**
 * Breadth-First Search Algorithm
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @param endNode - End node
 * @returns Path, visited order, and distance
 */
async function bfs(graph: Graph, startNode: Node, endNode: Node): Promise<PathResult> {
  const visited = new Set<string>();
  const previous: Record<string, string> = {};
  const distances: Record<string, number> = {};
  const queue: string[] = [startNode.id];
  visited.add(startNode.id);
  distances[startNode.id] = 0;

  const visitedOrder: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    
    if (!current) break;
    
    visitedOrder.push(current);

    if (current === endNode.id) break;

    const neighbors = graph.edges.filter(e => e.from == current);

    for (const edge of neighbors) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        previous[edge.to] = current;
        distances[edge.to] = distances[current] + edge.distance;
        queue.push(edge.to);
      }
    }
  }

  const path: string[] = [];
  let current: string | undefined = endNode.id;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return { path, visitedOrder, distance: distances[endNode.id] || Infinity };
}

// Route Optimization Algorithms

/**
 * Nearest Neighbor TSP approximation
 * @param points - Array of location points
 * @returns Order of indices
 */
function nearestNeighborTSP(points: Point[]): number[] {
  if (points.length <= 2) return points.map((_, i) => i);

  const visited = new Set<number>();
  const order: number[] = [0];
  visited.add(0);

  while (order.length < points.length) {
    const current = order[order.length - 1];
    let nearest = -1;
    let minDist = Infinity;

    for (let i = 0; i < points.length; i++) {
      if (!visited.has(i)) {
        const dist = getDistance(points[current], points[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
    }

    if (nearest !== -1) {
      order.push(nearest);
      visited.add(nearest);
    }
  }

  return order;
}

/**
 * 2-Opt optimization for TSP
 * @param points - Array of location points
 * @param initialOrder - Initial order of indices
 * @returns Optimized order
 */
function twoOptOptimization(points: Point[], initialOrder: number[]): number[] {
  let order = [...initialOrder];
  let improved = true;
  
  function calculateTotalDistance(ord: number[]): number {
    let total = 0;
    for (let i = 0; i < ord.length - 1; i++) {
      total += getDistance(points[ord[i]], points[ord[i + 1]]);
    }
    return total;
  }

  while (improved) {
    improved = false;
    const currentDist = calculateTotalDistance(order);

    for (let i = 1; i < order.length - 1; i++) {
      for (let j = i + 1; j < order.length; j++) {
        const newOrder = [...order];
        // Reverse segment between i and j
        let left = i, right = j;
        while (left < right) {
          [newOrder[left], newOrder[right]] = [newOrder[right], newOrder[left]];
          left++;
          right--;
        }

        const newDist = calculateTotalDistance(newOrder);
        if (newDist < currentDist) {
          order = newOrder;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  return order;
}

// Export all functions
export {
  dijkstra,
  astar,
  bfs,
  nearestNeighborTSP,
  twoOptOptimization
};