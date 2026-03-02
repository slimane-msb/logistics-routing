// // Export all utilities
// export * from './utils/distance';
// export { loadGraphAsync, load_city_graph } from './utils/graph_loader';

// // Export shortest path algorithms
// export * from './algorithms/shortest path/dijkstra';
// export * from './algorithms/shortest path/astar';
// export * from './algorithms/shortest path/greedyBestFirstSearch';
// export * from './algorithms/shortest path/chosen_algo';

// // Export TSP algorithms
// export * from './algorithms/TSP/greedy_insertion';
// export * from './algorithms/TSP/held_karp';
// export * from './algorithms/TSP/lin_kernighan_heuristic';
// export * from './algorithms/TSP/metaheuristics';
// export * from './algorithms/TSP/nearest_neighbor_twoOpt';
// export * from './algorithms/TSP/TwoOpt_Lin_Kernighan';
// export * from './algorithms/TSP/chosen_tsp';


import L from 'leaflet';
import 'leaflet-routing-machine';
// Import the Leaflet CSS directly into the TS file
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let waypoints: L.LatLng[] = [];
let markers: L.Marker[] = [];
let routingControl: any = null;

map.on('click', (e: L.LeafletMouseEvent) => {
    const { latlng } = e;
    waypoints.push(latlng);
    const marker = L.marker(latlng).addTo(map).bindPopup(`Point ${waypoints.length}`).openPopup();
    markers.push(marker);
});

document.getElementById('optimizeBtn')?.addEventListener('click', () => {
    if (waypoints.length < 2) return alert("Select 2+ points");
    
    if (routingControl) map.removeControl(routingControl);

    routingControl = (L.Routing as any).control({
        waypoints: waypoints,
        lineOptions: { styles: [{ color: '#007bff', weight: 4 }] },
        createMarker: (i: number, wp: any) => {
            return L.marker(wp.latLng).bindTooltip(`${i + 1}`, { permanent: true });
        }
    }).addTo(map);
});

document.getElementById('clearBtn')?.addEventListener('click', () => {
    if (routingControl) map.removeControl(routingControl);
    markers.forEach(m => map.removeLayer(m));
    waypoints = [];
    markers = [];
    routingControl = null;
});