import { astar } from "./astar";
// both astar and greedyBestFirstSearch are fast, astar is better in shortestPath
function shortestPath(graph, start, end) {
    return (astar(graph, start, end));
}
export { shortestPath };
