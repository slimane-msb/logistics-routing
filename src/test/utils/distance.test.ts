import { describe, it, expect } from 'vitest';
import { findNearestNode, getDistance } from '../../utils/distance';
import {Node, Point} from '../../utils/types'; 

describe('getDistance', () => {
    const paris: Point = { lat: 48.8566, lng: 2.3522 };
    const london: Point = { lat: 51.5074, lng: -0.1278 };
    const newYork: Point = { lat: 40.7128, lng: -74.0060 };

    it('should calculate correct distance between Paris and London', () => {
        const distance = getDistance(paris, london);
        expect(distance).toBeGreaterThan(340000); // ~343 km
        expect(distance).toBeLessThan(350000);
    });

    it('should calculate correct distance between London and New York', () => {
        const distance = getDistance(london, newYork);
        expect(distance).toBeGreaterThan(5550000); // ~5,570 km
        expect(distance).toBeLessThan(5600000);
    });

    it('should return 0 for the same location', () => {
        const distance = getDistance(paris, paris);
        expect(distance).toBe(0);
    });

    it('should calculate correct distance between Paris and New York', () => {
        const distance = getDistance(paris, newYork);
        expect(distance).toBeGreaterThan(5800000); // ~5,840 km
        expect(distance).toBeLessThan(5900000);
    });
});


describe('findNearestNode', () => {
    
    const nodes: Record<string, Node> = {
        '1': { id: '1', lat: 48.8566, lng: 2.3522 }, // Paris
        '2': { id: '2', lat: 53.3498, lng: -6.2603 }, // Dublin
        '3': { id: '3', lat: 51.5074, lng: -0.1278 }  // London
    };

    it('finds the nearest node to a given point', () => {
        const point: Point = { lat: 48.9, lng: 2.41 }; // near Paris
        const nearest = findNearestNode(point, nodes);
        expect(nearest).not.toBeNull();
        expect(nearest?.id).toBe('1'); // Paris node
    });

    it('finds the nearest node to a point near Dublin', () => {
        const point: Point = { lat: 53.35, lng: -6.26 };
        const nearest = findNearestNode(point, nodes);
        expect(nearest).not.toBeNull();
        expect(nearest?.id).toBe('2'); // Dublin node
    });

    it('returns null if nodes are empty', () => {
        const point: Point = { lat: 0, lng: 0 };
        const nearest = findNearestNode(point, {});
        expect(nearest).toBeNull();
    });

});
