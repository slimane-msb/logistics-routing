import { Graph, TSPResult, Node } from "../../utils/types";
import { shortestPath } from "../shortest path/chosen_algo";


export function heldKarpTSP(
    graph: Graph,
    targets: string[],
    shortestPath: (
      graph: Graph,
      from: string,
      to: string
    ) => { distance: number; path: string[] }
  ): TSPResult {
    const n = targets.length;
  
    /* -------------------------------------------
     * 1. Metric closure (shortestPath (A* / Dijkstra...) between targets)
     * ------------------------------------------- */
  
    const dist: number[][] = Array.from({ length: n }, () =>
      Array(n).fill(Infinity)
    );
  
    const paths: string[][][] = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => [])
    );
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const res = shortestPath(graph, targets[i], targets[j]);
        dist[i][j] = res.distance;
        paths[i][j] = res.path;
      }
    }
  
    /* -------------------------------------------
     * 2. Held–Karp DP (What is the shortest path that visits every target exactly once)
     * ------------------------------------------- */
  
    const size = 1 << n;
    const dp: number[][] = Array.from({ length: size }, () =>
      Array(n).fill(Infinity)
    );
    const parent: number[][] = Array.from({ length: size }, () =>
      Array(n).fill(-1)
    );
  
    // Init
    for (let i = 0; i < n; i++) {
      dp[1 << i][i] = 0;
    }
  
    // Transitions
    for (let mask = 1; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        if (!(mask & (1 << i))) continue;
  
        const prevMask = mask ^ (1 << i);
        if (prevMask === 0) continue;
  
        for (let j = 0; j < n; j++) {
          if (!(prevMask & (1 << j))) continue;
  
          const candidate = dp[prevMask][j] + dist[j][i];
          if (candidate < dp[mask][i]) {
            dp[mask][i] = candidate;
            parent[mask][i] = j;
          }
        }
      }
    }
  
    /* -------------------------------------------
     * 3. Find best endpoint
     * ------------------------------------------- */
  
    const fullMask = size - 1;
    let bestCost = Infinity;
    let last = -1;
  
    for (let i = 0; i < n; i++) {
      if (dp[fullMask][i] < bestCost) {
        bestCost = dp[fullMask][i];
        last = i;
      }
    }
  
    /* -------------------------------------------
     * 4. Reconstruct visit order
     * ------------------------------------------- */
  
    const orderIdx: number[] = [];
    let mask = fullMask;
    let curr = last;
  
    while (curr !== -1) {
      orderIdx.push(curr);
      const p = parent[mask][curr];
      mask ^= 1 << curr;
      curr = p;
    }
  
    orderIdx.reverse();
    const order = orderIdx.map(i => targets[i]);
  
    /* -------------------------------------------
     * 5. Build full road-level path
     * ------------------------------------------- */
  
    const fullPath: string[] = [];
    for (let i = 0; i < orderIdx.length - 1; i++) {
      const a = orderIdx[i];
      const b = orderIdx[i + 1];
      const segment = paths[a][b];
  
      if (i === 0) {
        fullPath.push(...segment);
      } else {
        // avoid duplicate node
        fullPath.push(...segment.slice(1));
      }
    }
  
    return {
      order,
      path: fullPath,
      distance: bestCost
    };
}
  