// Type Definitions

interface Point {
    lat: number;
    lng: number;
 }
  
  
interface Node {
    id: string;
    lat: number;
    lng: number;
    edges?: Edge[];
  }
  
  interface Edge {
    from: string;
    to: string;
    distance: number;
  }
  
  interface Graph {
    nodes: Record<string, Node>;
    edges: Edge[];
    adjacency?: Record<string, Edge[]>; // TODO
  }
  
  interface PathResult {
    path: string[];
    visitedOrder: string[];
    distance: number;
  }


// export 


export{
    type Node,
    type Edge,
    type Graph,
    type PathResult,
    type Point
}