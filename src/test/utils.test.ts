import { describe, it, expect } from 'vitest';
import { getDistance } from '../utils/distance';
import {Point} from '../types'; 

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

