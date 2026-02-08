import Heap from "heap";
import { Graph, Node} from "@/utils/types";
import { getDistance } from "../../utils/distance";

function greedyBestFirstSearch(
  graph: Graph,
  start: string,
  end: string
): { distance: number; path: string[] } {

  const visited = new Set<string>();
  const previous: Record<string, string | null> = {};
  const distance: Record<string, number> = {};

  for (const nodeId in graph.nodes) {
    previous[nodeId] = null;
    distance[nodeId] = Infinity;
  }

  distance[start] = 0;

  const endNode = graph.nodes[end];

  const openSet = new Heap<{ id: string; h: number }>(
    (a, b) => a.h - b.h
  );

  const startNode = graph.nodes[start];
  openSet.push({
    id: start,
    h: getDistance(
      startNode,
      endNode
    ),
  });

  while (!openSet.empty()) {
    const { id: current } = openSet.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    if (current === end) break;

    for (const edge of graph.adjacency[current] || []) {
      const neighbor = edge.to;
      if (visited.has(neighbor)) continue;

      // record path and cumulative distance (not used for priority)
      const newDist = distance[current] + edge.distance;
      if (newDist < distance[neighbor]) {
        distance[neighbor] = newDist;
        previous[neighbor] = current;

        const neighborNode = graph.nodes[neighbor];
        openSet.push({
          id: neighbor,
          h: getDistance(
            neighborNode,
            endNode
          ),
        });
      }
    }
  }

  if (distance[end] === Infinity) {
    return { distance: Infinity, path: [] };
  }

  const path: string[] = [];
  let node: string | null = end;
  while (node) {
    path.unshift(node);
    node = previous[node];
  }

  return { distance: distance[end], path };
}

export{
    greedyBestFirstSearch
}