
import type { Graph } from "../../utils/types";
import { astar } from "./astar";

// both astar and greedyBestFirstSearch are fast, astar is better in shortestPath
function shortestPath(
  graph: Graph,
  start: string,
  end: string
): { distance: number; path: string[] }{
    return (astar(graph, start, end))
}


export{
    shortestPath
}