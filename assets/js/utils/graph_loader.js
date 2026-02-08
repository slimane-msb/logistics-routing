import fs from 'fs';
import path from 'path';
import { assert } from 'console';
function loadGraph(nodesFilePath, edgesFilePath, adjacencyFilePath) {
    const nodesRaw = JSON.parse(fs.readFileSync(path.resolve(nodesFilePath), 'utf-8'));
    const edgesRaw = JSON.parse(fs.readFileSync(path.resolve(edgesFilePath), 'utf-8'));
    const nodes = {};
    nodesRaw.forEach((n) => {
        nodes[n.id.toString()] = { id: n.id.toString(), lat: n.lat, lng: n.lng };
    });
    const edges = edgesRaw.map((e) => ({
        from: e.from_node_id.toString(),
        to: e.to_node_id.toString(),
        distance: e.distance,
    }));
    let adjacency;
    const adjacencyRaw = JSON.parse(fs.readFileSync(path.resolve(adjacencyFilePath), "utf-8"));
    adjacency = {};
    for (const fromId in adjacencyRaw) {
        adjacency[fromId] = adjacencyRaw[fromId].map((e) => ({
            from: fromId,
            to: e.to.toString(),
            distance: e.distance,
        }));
    }
    return { nodes, edges, adjacency };
}
function load_city_graph(city) {
    const allowedCities = ['dublin', 'paris'];
    assert(allowedCities.includes(city), `City must be one of ${allowedCities.join(', ')}`);
    return loadGraph(`./data/${city}_nodes.json`, `./data/${city}_edges.json`, `./data/${city}_adjacency.json`);
}
export { loadGraph, load_city_graph };
