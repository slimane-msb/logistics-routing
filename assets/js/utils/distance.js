// haversine : Helper function 
function getDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const lat1 = point1.lat;
    const lon1 = point1.lng || point1.lng;
    const lat2 = point2.lat;
    const lon2 = point2.lng || point2.lng;
    if (lon1 === undefined || lon2 === undefined) {
        throw new Error('Points must have lng or lon property');
    }
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Find nearest node to a point in the graph
 * @param point - Point with lat/lng or lon
 * @param nodes - Graph nodes object
 * @returns Nearest node
 */
function findNearestNode(point, nodes) {
    let nearest = null;
    let minDist = Infinity;
    Object.values(nodes).forEach(node => {
        var _a, _b;
        const dist = getDistance({ lat: point.lat, lng: (_b = (_a = point.lng) !== null && _a !== void 0 ? _a : point.lng) !== null && _b !== void 0 ? _b : 0 }, { lat: node.lat, lng: node.lng });
        if (dist < minDist) {
            minDist = dist;
            nearest = node;
        }
    });
    return nearest;
}
export { getDistance, findNearestNode };
