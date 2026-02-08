import { Graph, TSPResult, Node } from "@/utils/types";


/**
 * Swap 2-opt segment
 */
function twoOptSwap(order: number[], i: number, k: number): number[] {
  return order.slice(0, i).concat(order.slice(i, k + 1).reverse(), order.slice(k + 1));
}

/**
 * Compute tour distance
 */
function tourDistance(order: number[], dist: number[][]): number {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]][order[i + 1]];
  }
  return total;
}

/**
 * Lin-Kernighan heuristic simplified for TypeScript
 */
export function linKernighanTSP(
  graph: Graph,
  targets: string[],
  shortestPathFunc: (graph: Graph, from: string, to: string) => { distance: number; path: string[] }
): TSPResult {
  const n = targets.length;

  // 1. Build distance matrix and path segments
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

  // 2. Initial tour: Nearest Neighbor
  const order: number[] = [];
  const visited = new Set<number>();
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

  // 3. Lin-Kernighan improvement loop (2-opt + 3-opt)
  let improved = true;
  while (improved) {
    improved = false;

    // 2-opt
    for (let i = 1; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        const newOrder = twoOptSwap(order, i, k);
        if (tourDistance(newOrder, dist) < tourDistance(order, dist)) {
          order.splice(0, order.length, ...newOrder);
          improved = true;
        }
      }
    }

    // 3-opt: attempt removing 3 edges and reconnecting in better way
    for (let i = 0; i < n - 2; i++) {
      for (let j = i + 1; j < n - 1; j++) {
        for (let k = j + 1; k < n; k++) {
          // 3 possible reconnections (simplified)
          const newOrders = [
            [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1, k + 1), ...order.slice(k + 1)],
            [...order.slice(0, i), ...order.slice(i, j + 1), ...order.slice(j + 1, k + 1).reverse(), ...order.slice(k + 1)],
            [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1, k + 1).reverse(), ...order.slice(k + 1)]
          ];

          for (const newOrder of newOrders) {
            if (tourDistance(newOrder, dist) < tourDistance(order, dist)) {
              order.splice(0, order.length, ...newOrder);
              improved = true;
            }
          }
        }
      }
    }
  }

  // 4. Build full road path
  const fullPath: string[] = [];
  for (let i = 0; i < n - 1; i++) {
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
