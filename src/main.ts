import L from 'leaflet';
import 'leaflet-routing-machine';

const map: L.Map = L.map('map').setView([48.8566, 2.3522], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);

let points: L.LatLng[] = [];
let markers: L.Marker[] = [];
let routeControl: any = null;

// Keep existing map-click functionality
map.on('click', (e: L.LeafletMouseEvent): void => {
    addPoint(e.latlng);
});

function addPoint(latlng: L.LatLng) {
    const marker = L.marker(latlng).addTo(map);
    markers.push(marker);
    points.push(latlng);
}

// UI: Add new input row
(window as any).addAddressRow = () => {
    const container = document.getElementById('address-list');
    const div = document.createElement('div');
    div.className = 'address-row';
    div.innerHTML = `<input type="text" placeholder="Enter address...">`;
    container?.appendChild(div);
};

// Helper: Convert address string to LatLng using Nominatim
async function geocode(address: string): Promise<L.LatLng | null> {
    if (!address.trim()) return null;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    return data.length > 0 ? L.latLng(data[0].lat, data[0].lon) : null;
}

/** * TSP Nearest Neighbor (Your original logic)
 */
function tspNearestNeighbor(coords: L.LatLng[]): L.LatLng[] {
    if (coords.length === 0) return [];
    let remaining = [...coords];
    let path: L.LatLng[] = [];
    let current = remaining.shift();
    if (current) path.push(current);

    while (remaining.length > 0 && current) {
        let nearestIndex = 0;
        let nearestDist = Infinity;
        for (let i = 0; i < remaining.length; i++) {
            const d = current.distanceTo(remaining[i]);
            if (d < nearestDist) { nearestDist = d; nearestIndex = i; }
        }
        current = remaining.splice(nearestIndex, 1)[0];
        path.push(current);
    }
    return path;
}



(window as any).handleFileImport = (event: Event): void => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");

        const container = document.getElementById('address-list');
        
        lines.forEach(address => {
            const div = document.createElement('div');
            div.className = 'address-row';
            // Pre-fill the input with the address from the file
            div.innerHTML = `<input type="text" value="${address.replace(/"/g, '&quot;')}" placeholder="Enter address...">`;
            container?.appendChild(div);
        });
    };
    reader.readAsText(file);
};

// ... existing imports and map init ...

/**
 * Clear everything: Map, Markers, and Sidebar
 */
(window as any).clearAll = (): void => {
    points = [];
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    if (routeControl) map.removeControl(routeControl);
    
    const container = document.getElementById('address-list');
    if (container) container.innerHTML = '<div class="address-row"><input type="text" placeholder="Enter address..."></div>';
};

(window as any).optimizeRoute = async (): Promise<void> => {
    // RESET internal state so we can re-build from the current sidebar + map clicks
    // Note: If you want to keep manual map clicks, we'd need a separate array.
    // For simplicity, this rebuilds the route based on what's currently in the sidebar.
    const newPoints: L.LatLng[] = [];
    const inputs = document.querySelectorAll('#address-list input') as NodeListOf<HTMLInputElement>;

    // Show a loading state or cursor if possible, geocoding many addresses takes time
    for (const input of Array.from(inputs)) {
        const val = input.value.trim();
        if (val) {
            const coords = await geocode(val);
            if (coords) newPoints.push(coords);
        }
    }

    // Merge with any points added via direct map clicks that aren't in the list
    // (To keep it simple, we use the sidebar as the "Source of Truth")
    points = newPoints;

    if (points.length < 2) {
        alert("Please ensure at least 2 valid addresses are in the list.");
        return;
    }

    // Remove old route and markers
    if (routeControl) map.removeControl(routeControl);
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    // Run TSP
    const ordered = tspNearestNeighbor(points);

    // Redraw Markers
    ordered.forEach((p, i) => {
        const m = L.marker(p).bindTooltip((i + 1).toString(), { permanent: true }).addTo(map);
        markers.push(m);
    });

    // Draw Route
    // @ts-ignore
    routeControl = L.Routing.control({
        waypoints: ordered,
        lineOptions: { styles: [{ color: '#2A81CB', weight: 5 }], addWaypoints: false },
        show: false
    }).addTo(map);
};

// ... keep handleFileImport and addAddressRow as they were ...