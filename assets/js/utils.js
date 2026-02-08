"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistance = getDistance;
exports.findNearestNode = findNearestNode;
// Helper function (from utils.ts)
function getDistance(point1, point2) {
    var R = 6371e3; // Earth's radius in meters
    var lat1 = point1.lat;
    var lon1 = point1.lng || point1.lon;
    var lat2 = point2.lat;
    var lon2 = point2.lng || point2.lon;
    if (lon1 === undefined || lon2 === undefined) {
        throw new Error('Points must have lng or lon property');
    }
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2 - lat1) * Math.PI / 180;
    var Δλ = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Find nearest node to a point in the graph
 * @param point - Point with lat/lng or lon
 * @param nodes - Graph nodes object
 * @returns Nearest node
 */
function findNearestNode(point, nodes) {
    var nearest = null;
    var minDist = Infinity;
    Object.values(nodes).forEach(function (node) {
        var _a, _b;
        var dist = getDistance({ lat: point.lat, lng: (_b = (_a = point.lng) !== null && _a !== void 0 ? _a : point.lon) !== null && _b !== void 0 ? _b : 0 }, { lat: node.lat, lng: node.lon });
        if (dist < minDist) {
            minDist = dist;
            nearest = node;
        }
    });
    return nearest;
}
