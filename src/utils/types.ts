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
    adjacency: Record<string, Edge[]>; 
  }
  
// TSP
interface TSPResult {
  order: string[];
  path: string[];
  distance: number;
}


// export 


export{
    type Node,
    type Edge,
    type Graph,
    type Point,
    TSPResult
}