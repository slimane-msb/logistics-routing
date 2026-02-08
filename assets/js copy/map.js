// Map and Road Network Functions

let map;
let roadGraph = null;

/**
 * Initialize the Leaflet map
 */
function initializeMap() {
    map = L.map('map').setView([48.8566, 2.3522], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            map.setView([position.coords.latitude, position.coords.longitude], 13);
        });
    }

    return map;
}

/**
 * Fetch road network from OpenStreetMap via Overpass API
 * @param {L.LatLngBounds} bounds - Map bounds
 * @returns {Promise<Object>} OSM data
 */
async function fetchRoadNetwork(bounds) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    
    const query = `
        [out:json][timeout:25];
        (
          way["highway"]["highway"!~"footway|path|steps|service"]["highway"!~"proposed|construction"](${bbox});
        );
        out body;
        >;
        out skel qt;
    `;

    const response = await fetch(overpassUrl, {
        method: 'POST',
        body: query
    });

    if (!response.ok) {
        throw new Error('Failed to fetch road network');
    }

    return await response.json();
}

/**
 * Build graph from OSM data
 * @param {Object} osmData - OSM API response data
 * @returns {Object} Graph with nodes and edges
 */
function buildGraph(osmData) {
    const nodes = {};
    const edges = [];

    // Store all nodes
    osmData.elements.forEach(element => {
        if (element.type === 'node') {
            nodes[element.id] = {
                id: element.id,
                lat: element.lat,
                lon: element.lon
            };
        }
    });

    // Build edges from ways (roads)
    osmData.elements.forEach(element => {
        if (element.type === 'way' && element.nodes) {
            for (let i = 0; i < element.nodes.length - 1; i++) {
                const node1 = nodes[element.nodes[i]];
                const node2 = nodes[element.nodes[i + 1]];
                
                if (node1 && node2) {
                    const distance = getDistance(
                        { lat: node1.lat, lng: node1.lon },
                        { lat: node2.lat, lng: node2.lon }
                    );
                    
                    edges.push({
                        from: element.nodes[i],
                        to: element.nodes[i + 1],
                        distance: distance
                    });
                    
                    // Add reverse edge for two-way streets
                    if (!element.tags || element.tags.oneway !== 'yes') {
                        edges.push({
                            from: element.nodes[i + 1],
                            to: element.nodes[i],
                            distance: distance
                        });
                    }
                }
            }
        }
    });

    return { nodes, edges };
}

/**
 * Get the Leaflet map instance
 * @returns {L.Map} Map instance
 */
function getMap() {
    return map;
}

/**
 * Get the road graph
 * @returns {Object} Road graph
 */
function getRoadGraph() {
    return roadGraph;
}

/**
 * Set the road graph
 * @param {Object} graph - Road graph
 */
function setRoadGraph(graph) {
    roadGraph = graph;
}
