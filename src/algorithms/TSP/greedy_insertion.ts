import { Graph, TSPResult} from "../../utils/types";


/**
 * Compute total distance of a tour given order indices and distance matrix
 */
function tourDistance(order: number[], dist: number[][]): number {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]][order[i + 1]];
  }
  return total;
}

/**
 * Greedy Insertion / Cheapest Insertion TSP
 */
export function greedyInsertionTSP(
  graph: Graph,
  targets: string[],
  shortestPathFunc: (graph: Graph, from: string, to: string) => { distance: number; path: string[] }
): TSPResult {
  const n = targets.length;

  // 1. Distance matrix and path segments
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const paths: string[][][] = Array.from({ length: n }, () => Array.from({ length: n }, () => []));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const res = shortestPathFunc(graph, targets[i], targets[j]);
      dist[i][j] = res.distance;
      paths[i][j] = res.path;
    }
  }

  // 2. Initialize tour with first two nodes
  const order: number[] = [0, 1];

  const unvisited = new Set<number>();
  for (let i = 2; i < n; i++) unvisited.add(i);

  // 3. Insert remaining nodes greedily
  while (unvisited.size > 0) {
    let bestIncrease = Infinity;
    let bestNode = -1;
    let bestPosition = -1;

    for (const node of unvisited) {
      for (let pos = 0; pos < order.length; pos++) {
        const nextPos = (pos + 1) % order.length;
        const increase = dist[order[pos]][node] + dist[node][order[nextPos]] - dist[order[pos]][order[nextPos]];
        if (increase < bestIncrease) {
          bestIncrease = increase;
          bestNode = node;
          bestPosition = nextPos;
        }
      }
    }

    order.splice(bestPosition, 0, bestNode);
    unvisited.delete(bestNode);
  }

  // 4. Build full road-level path
  const fullPath: string[] = [];
  for (let i = 0; i < order.length - 1; i++) {
    const a = order[i];
    const b = order[i + 1];
    const segment = paths[a][b];
    if (i === 0) {
      fullPath.push(...segment);
    } else {
      fullPath.push(...segment.slice(1));
    }
  }

  const resultOrder = order.map(i => targets[i]);
  const distance = tourDistance(order, dist);

  return { order: resultOrder, path: fullPath, distance };
}
