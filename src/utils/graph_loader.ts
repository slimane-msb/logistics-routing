import type { Edge, Graph, Node } from "./types";
function processGraphData(
  nodesRaw: { id: number; lat: number; lng: number }[],
  edgesRaw: { from_node_id: number; to_node_id: number; distance: number }[],
  adjacencyRaw: Record<string, { to: number; distance: number }[]>
): Graph {
  const nodes: Record<string, Node> = {};
  nodesRaw.forEach((n) => {
    nodes[n.id.toString()] = { id: n.id.toString(), lat: n.lat, lng: n.lng };
  });

  const edges: Edge[] = edgesRaw.map((e) => ({
    from: e.from_node_id.toString(),
    to: e.to_node_id.toString(),
    distance: e.distance,
  }));

  const adjacency: Record<string, Edge[]> = {};
  for (const fromId in adjacencyRaw) {
    adjacency[fromId] = adjacencyRaw[fromId].map((e) => ({
      from: fromId,
      to: e.to.toString(),
      distance: e.distance,
    }));
  }

  return { nodes, edges, adjacency };
}

function loadGraph(
  nodesFilePath: string, 
  edgesFilePath: string, 
  adjacencyFilePath: string
): Graph {
  // @ts-ignore - require only exists in Node.js (for ts tests)
  const fs = require('fs');
  // @ts-ignore
  const path = require('path');

  const nodesRaw: { id: number; lat: number; lng: number }[] = JSON.parse(
    fs.readFileSync(path.resolve(nodesFilePath), 'utf-8')
  );
  const edgesRaw: { from_node_id: number; to_node_id: number; distance: number }[] = JSON.parse(
    fs.readFileSync(path.resolve(edgesFilePath), 'utf-8')
  );
  const adjacencyRaw: Record<string, { to: number; distance: number }[]> = JSON.parse(
    fs.readFileSync(path.resolve(adjacencyFilePath), 'utf-8')
  );

  return processGraphData(nodesRaw, edgesRaw, adjacencyRaw);
}


function load_city_graph(city: string): Graph {
  const allowedCities = ['dublin', 'paris'];
  
  if (!allowedCities.includes(city)) {
    throw new Error(`City must be one of ${allowedCities.join(', ')}`);
  }

  return loadGraph(
    `./data/${city}_nodes.json`,
    `./data/${city}_edges.json`,
    `./data/${city}_adjacency.json`
  );
}

//  Async version for browser
async function loadGraphAsync(
  nodesFilePath: string,
  edgesFilePath: string,
  adjacencyFilePath: string
): Promise<Graph> {
  const [nodesResponse, edgesResponse, adjacencyResponse] = await Promise.all([
    fetch(nodesFilePath),
    fetch(edgesFilePath),
    fetch(adjacencyFilePath)
  ]);

  const nodesRaw = await nodesResponse.json();
  const edgesRaw = await edgesResponse.json();
  const adjacencyRaw = await adjacencyResponse.json();

  return processGraphData(nodesRaw, edgesRaw, adjacencyRaw);
}

export { 
  loadGraph,
  load_city_graph,
  loadGraphAsync  // Export async version for browser use
};
