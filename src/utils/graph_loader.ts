import fs from 'fs';
import path from 'path';
import { Edge, Graph , Node} from './types';
import { assert } from 'console';



 function loadGraph(nodesFilePath: string, edgesFilePath: string): Graph {

    const nodesRaw: { id: number; lat: number; lng: number }[] = JSON.parse(
        fs.readFileSync(path.resolve(nodesFilePath), 'utf-8')
    );

    const edgesRaw: { from_node_id: number; to_node_id: number; distance: number }[] = JSON.parse(
        fs.readFileSync(path.resolve(edgesFilePath), 'utf-8')
    );


    const nodes: Record<string, Node> = {};
    nodesRaw.forEach((n) => {
        nodes[n.id.toString()] = { id: n.id.toString(), lat: n.lat, lng: n.lng };
    });


    const edges: Edge[] = edgesRaw.map((e) => ({
        from: e.from_node_id.toString(),
        to: e.to_node_id.toString(),
        distance: e.distance,
    }));

    return { nodes, edges };
}


function load_city_graph(city: string): Graph {
    const allowedCities = ['dublin', 'paris'];
    assert(
        allowedCities.includes(city), 
        `City must be one of ${allowedCities.join(', ')}`
    );
    return loadGraph(
        `./data/${city}_nodes.json`, 
        `./data/${city}_edges.json`, 
    );
}
    


export { 
    loadGraph, 
    load_city_graph
};
