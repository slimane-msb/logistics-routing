// Type Definitions

interface Point {
    lat: number;
    lng?: number;
    lon?: number;
  }
  
  
interface Node {
    id: string;
    lat: number;
    lon: number;
  }
  
  interface Edge {
    from: string;
    to: string;
    distance: number;
  }
  
  interface Graph {
    nodes: Record<string, Node>;
    edges: Edge[];
  }
  
  interface PathResult {
    path: string[];
    visitedOrder: string[];
    distance: number;
  }

  


export{
    type Node,
    type Edge,
    type Graph,
    type PathResult,
    type Point
}