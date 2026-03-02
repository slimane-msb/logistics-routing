import L from 'leaflet';
import 'leaflet-routing-machine';

// Define the shape of the Routing Control for TypeScript
interface RoutingControl extends L.Control {
    setWaypoints(waypoints: L.LatLng[]): this;
}

// Initialize the map centered on Paris
const map: L.Map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let points: L.LatLng[] = [];
let markers: L.Marker[] = [];
let routeControl: any = null;

// Event listener for adding points
map.on('click', (e: L.LeafletMouseEvent): void => {
    const marker: L.Marker = L.marker(e.latlng).addTo(map);
    markers.push(marker);
    points.push(e.latlng);
});

/**
 * Nearest Neighbor (Greedy) Algorithm
 * A simple heuristic for the Traveling Salesperson Problem (TSP)
 */
function tspNearestNeighbor(coords: L.LatLng[]): L.LatLng[] {
    if (coords.length === 0) return [];

    let remaining: L.LatLng[] = [...coords];
    let path: L.LatLng[] = [];
    let current: L.LatLng | undefined = remaining.shift();

    if (current) path.push(current);

    while (remaining.length > 0 && current) {
        let nearestIndex: number = 0;
        let nearestDist: number = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const d: number = current.distanceTo(remaining[i]);
            if (d < nearestDist) {
                nearestDist = d;
                nearestIndex = i;
            }
        }

        current = remaining.splice(nearestIndex, 1)[0];
        path.push(current);
    }

    return path;
}

/**
 * Global function to optimize and draw the route
 */
(window as any).optimizeRoute = (): void => {
    if (points.length < 2) {
        alert("Add at least 2 points by clicking on the map.");
        return;
    }

    // Remove existing route layers
    if (routeControl) {
        map.removeControl(routeControl);
    }

    // Run TSP Optimization
    const ordered: L.LatLng[] = tspNearestNeighbor(points);

    // Refresh markers with numbers
    markers.forEach((m: L.Marker) => map.removeLayer(m));
    markers = [];

    ordered.forEach((p: L.LatLng, i: number) => {
        const marker: L.Marker = L.marker(p)
            .bindTooltip((i + 1).toString(), { permanent: true, direction: 'top' })
            .addTo(map);
        markers.push(marker);
    });

    // Draw the calculated route
    // @ts-ignore: L.Routing is added dynamically by the plugin
    routeControl = L.Routing.control({
        waypoints: ordered,
        lineOptions: {
            styles: [{ color: '#2A81CB', weight: 5, opacity: 0.7 }],
            addWaypoints: false
        },
        show: false // Hides the text instructions panel
    }).addTo(map);
};