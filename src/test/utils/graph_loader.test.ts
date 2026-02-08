import { loadGraph,  load_city_graph } from '../../utils/graph_loader'; 
import { Graph ,Node} from '../../utils/types';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Graph loading', () => {
    
    let dublinGraph: Graph;
    let parisGraph: Graph;

    beforeAll(() => {
        dublinGraph = load_city_graph('dublin');
        parisGraph = load_city_graph('paris');
    });

    it('Number of nodes and edges in Dublin', () => {
        expect(Object.keys(dublinGraph.nodes).length).toBe(11566); 
        expect(dublinGraph.edges.length).toBe(51353); 
    });

    it('Number of nodes and edges in Paris', () => {
        expect(Object.keys(parisGraph.nodes).length).toBe(9427); 
        expect(parisGraph.edges.length).toBe(24949); 
    });

    it('Node properties in Dublin', () => {
        const node = dublinGraph.nodes['389279']; 
        expect(node.id).toBe('389279');
        expect(node.lat).lessThan(54); 
        expect(node.lng).lessThan(-6.1); 
    });

    it('Node properties in Paris', () => {
        const node: Node = parisGraph.nodes['125730']; 
        expect(node.id).toBe('125730');
        expect(node.lat).lessThan(49); 
        expect(node.lng).lessThan(2.5); 
    });

    it('Edge properties in Paris', () => {
        const edge = parisGraph.edges[0];
        expect(edge.from).toBe('125730'); 
        expect(edge.to).toBe('12179625841');   
        expect(edge.distance).lessThan(4.4); 
    });


    it('neighbors (edges) from 389281 are correct', () => {
        const neighbors = dublinGraph.adjacency!['389281'];
        expect(neighbors).toBeDefined();
        expect(neighbors.length).toBe(5); // total edges
      
        // List of expected neighbors
        const expected = [
          { to: '26165090', distance: 108.27 },
          { to: '135109542', distance: 100.24 },
          { to: '2384200130', distance: 118.19 },
          { to: '135109542', distance: 100.24 },
          { to: '2384200130', distance: 118.19 },
        ];
      
        expected.forEach((exp) => {
          const found = neighbors.some(
            (n) => n.to === exp.to && Math.abs(n.distance - exp.distance) < 0.01
          );
          expect(found).toBe(true);
        });
    });

});
