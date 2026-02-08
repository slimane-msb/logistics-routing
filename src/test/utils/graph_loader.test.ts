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

});
