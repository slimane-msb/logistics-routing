import { getDistance } from "@/utils/distance";
import { Graph, PathResult , Node} from "@/utils/types";
interface AStarQueueItem {
    id: string;
    fScore: number;
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
  