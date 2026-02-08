
import { Graph } from "../../utils/types";
import { astar } from "./astar";

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