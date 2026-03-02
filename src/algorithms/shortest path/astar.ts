import Heap from "heap";
import type { Graph } from "../../utils/types";
import { getDistance } from "../../utils/distance";

function astar(
  graph: Graph,
  start: string,
  end: string
): { distance: number; path: string[] } {

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();

  for (const nodeId in graph.nodes) {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
    previous[nodeId] = null;
  }

  gScore[start] = 0;

  const endNode = graph.nodes[end];
  const startNode = graph.nodes[start];

  fScore[start] = getDistance(
    startNode,
    endNode,
  );

  const openSet = new Heap<{ id: string; f: number }>(
    (a, b) => a.f - b.f
  );

  openSet.push({ id: start, f: fScore[start] });

  while (!openSet.empty()) {
    const { id: current } = openSet.pop()!;
    if (visited.has(current)) continue;

    if (current === end) break;
    visited.add(current);

    for (const edge of graph.adjacency[current] || []) {
      const neighbor = edge.to;
      const tentativeG = gScore[current] + edge.distance;

      if (tentativeG < gScore[neighbor]) {
        gScore[neighbor] = tentativeG;
        previous[neighbor] = current;

        const neighborNode = graph.nodes[neighbor];
        fScore[neighbor] =
          tentativeG +
          getDistance(
            neighborNode,
            endNode,
          );

        openSet.push({ id: neighbor, f: fScore[neighbor] });
      }
    }
  }

  // Reconstruct path
  if (gScore[end] === Infinity) {
    return { distance: Infinity, path: [] };
  }

  const path: string[] = [];
  let node: string | null = end;
  while (node) {
    path.unshift(node);
    node = previous[node];
  }

  return { distance: gScore[end], path };
}


export{
  astar
}