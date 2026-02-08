import { Edge, Graph, Node } from "@/utils/types";
import Heap from "heap"; 



function dijkstraHeap(
    graph: Graph,
    start: string,
    end: string
  ): { distance: number; path: string[] } {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const visited = new Set<string>();
  
    for (const nodeId in graph.nodes) {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
    }
    distances[start] = 0;
  
    const heap = new Heap<{ id: string; dist: number }>((a, b) => a.dist - b.dist);
    heap.push({ id: start, dist: 0 });
  
    while (!heap.empty()) {
      const { id: currentNode, dist } = heap.pop()!;
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);
  
      if (currentNode === end) break;
  
      for (const edge of graph.adjacency[currentNode] || []) {
        const neighbor = edge.to;
        const newDist = distances[currentNode] + edge.distance;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = currentNode;
          heap.push({ id: neighbor, dist: newDist });
        }
      }
    }
  
    const path: string[] = [];
    let node: string | null = end;
    if (distances[end] === Infinity) return { distance: Infinity, path: [] };
    while (node) {
      path.unshift(node);
      node = previous[node];
    }
  
    return { distance: distances[end], path };
  }
  


  function dijkstra(
    graph: Graph,
    start: string,
    end: string
  ): { distance: number; path: string[] } {
  
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const visited = new Set<string>();
  
    
    for (const nodeId in graph.nodes) {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
    }
    
    distances[start] = 0;
  
    while (visited.size < Object.keys(graph.nodes).length) {
      
      let currentNode: string | null = null;
      let minDist = Infinity;
      for (const nodeId in distances) {
        if (!visited.has(nodeId) && distances[nodeId] < minDist) {
          minDist = distances[nodeId];
          currentNode = nodeId;
        }
      }
  
      if (!currentNode) break; 
      if (currentNode === end) break; 
  
      visited.add(currentNode);
  
      
      for (const edge of graph.adjacency[currentNode] || []) {
        const neighbor = edge.to;
        const newDist = distances[currentNode] + edge.distance;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = currentNode;
        }
      }
            
    }
  
    
    const path: string[] = [];
    let node: string | null = end;
    if (distances[end] === Infinity) {
      return { distance: Infinity, path: [] }; 
    }
    while (node) {
      path.unshift(node);
      node = previous[node];
    }
  
    return { distance: distances[end], path };
}


  

export{
    dijkstra,
    dijkstraHeap
}