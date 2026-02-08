import { linKernighanTSP } from "./lin_kernighan_heuristic";
import { heldKarpTSP } from "./held_karp";
import { astar } from "../shortest path/astar";
// Wrapper to choose TSP algorithm based on number of targets
export function bestTSP(graph, targets) {
    if (targets.length < 15) {
        // Use Held-Karp for small graphs (optimal path)
        return heldKarpTSP(graph, targets, astar);
    }
    else {
        // Use Lin-Kernighan heuristic for larger graphs (fast, almost optimal path)
        return linKernighanTSP(graph, targets, astar);
    }
}
