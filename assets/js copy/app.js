// Main Application Logic

// Initialize map on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
});

/**
 * Setup all event listeners for UI controls
 */
function setupEventListeners() {
    const addLocationBtn = document.getElementById('addLocationBtn');
    const visualizeBtn = document.getElementById('visualizeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Add location button
    addLocationBtn.addEventListener('click', () => {
        setAddingLocationState(true);
        addLocationBtn.classList.add('active');
        updateStatus('Click on the map to add a location');
        getMap().getContainer().style.cursor = 'crosshair';
    });

    // Map click handler
    getMap().on('click', (e) => {
        if (!getAddingLocationState()) return;

        addLocation(e.latlng);
        
        setAddingLocationState(false);
        document.getElementById('addLocationBtn').classList.remove('active');
        getMap().getContainer().style.cursor = '';
    });

    // Visualize button
    visualizeBtn.addEventListener('click', visualizePath);

    // Clear paths button
    clearBtn.addEventListener('click', clearVisualization);

    // Reset all button
    resetBtn.addEventListener('click', resetAll);
}

/**
 * Main visualization function - orchestrates the entire pathfinding process
 */
async function visualizePath() {
    if (getVisualizingState() || getLocations().length < 2) return;
    
    setVisualizingState(true);
    document.getElementById('visualizeBtn').disabled = true;
    document.getElementById('clearBtn').disabled = true;

    clearVisualization();

    try {
        // Step 1: Optimize route order
        updateStatus('Optimizing route order...');
        const optimizationMethod = document.getElementById('optimizationSelect').value;
        let order;

        if (optimizationMethod === 'none') {
            order = getLocations().map((_, i) => i);
        } else if (optimizationMethod === 'greedy') {
            order = nearestNeighborTSP(getLocations());
        } else { // 2opt
            const greedyOrder = nearestNeighborTSP(getLocations());
            order = twoOptOptimization(getLocations(), greedyOrder);
        }

        // Reorder locations and markers
        const reorderedLocations = order.map(i => getLocations()[i]);
        const reorderedMarkers = order.map(i => getMarkers()[i]);
        
        setLocations(reorderedLocations);
        setMarkers(reorderedMarkers);
        updateAllMarkers();
        updateLocationsPanel();

        // Step 2: Fetch road network
        updateStatus('Loading road network...');
        const bounds = getMap().getBounds().pad(0.2);
        const osmData = await fetchRoadNetwork(bounds);
        const graph = buildGraph(osmData);
        setRoadGraph(graph);

        updateStatus('Finding paths between locations...');

        let totalDistance = 0;
        const algorithm = document.getElementById('algorithmSelect').value;

        // Step 3: Find path between each consecutive pair of locations
        for (let i = 0; i < getLocations().length - 1; i++) {
            const startLoc = getLocations()[i];
            const endLoc = getLocations()[i + 1];

            updateStatus(`Finding path ${i + 1}/${getLocations().length - 1}...`);

            const startNode = findNearestNode(startLoc, graph.nodes);
            const endNode = findNearestNode(endLoc, graph.nodes);

            if (!startNode || !endNode) {
                updateStatus('Could not find road network nearby');
                setVisualizingState(false);
                return;
            }

            // Run selected algorithm
            let result;
            if (algorithm === 'dijkstra') {
                result = await dijkstra(graph, startNode, endNode);
            } else if (algorithm === 'astar') {
                result = await astar(graph, startNode, endNode);
            } else { // bfs
                result = await bfs(graph, startNode, endNode);
            }

            // Animate exploration
            await animateExploration(result.visitedOrder, graph);

            // Draw path segment
            if (result.path.length > 1) {
                drawPathSegment(result.path, graph);
                totalDistance += result.distance;
            }

            await delay(100);
        }

        // Step 4: Display route information
        displayRouteInfo(totalDistance);

    } catch (error) {
        console.error('Error:', error);
        updateStatus('Error: Try a smaller area or fewer locations');
    }

    setVisualizingState(false);
    document.getElementById('clearBtn').disabled = false;
    document.getElementById('visualizeBtn').disabled = false;
}

/**
 * Animate the exploration of nodes during pathfinding
 * @param {Array} visitedOrder - Order of visited nodes
 * @param {Object} graph - Road graph
 */
async function animateExploration(visitedOrder, graph) {
    for (let i = 0; i < visitedOrder.length; i++) {
        const nodeId = visitedOrder[i];
        const node = graph.nodes[nodeId];
        
        if (node) {
            const circle = L.circleMarker([node.lat, node.lon], {
                radius: 4,
                fillColor: '#ffff00',
                color: '#ffff00',
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.3
            }).addTo(getMap());
            
            addVisualizationLayer(circle);
            
            // Throttle animation for performance
            if (i % 15 === 0) {
                await delay(5);
            }
        }
    }
}

/**
 * Draw a path segment on the map
 * @param {Array} path - Array of node IDs
 * @param {Object} graph - Road graph
 */
function drawPathSegment(path, graph) {
    const pathCoords = path
        .map(nodeId => graph.nodes[nodeId])
        .filter(node => node)
        .map(node => [node.lat, node.lon]);

    const pathLine = L.polyline(pathCoords, {
        color: '#9c27b0',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round'
    }).addTo(getMap());

    addVisualizationLayer(pathLine);

    // Add direction arrow at midpoint
    if (pathCoords.length >= 2) {
        const mid = Math.floor(pathCoords.length / 2);
        const arrow = L.marker(pathCoords[mid], {
            icon: L.divIcon({
                className: 'arrow-icon',
                html: '→',
                iconSize: [20, 20]
            })
        }).addTo(getMap());
        addVisualizationLayer(arrow);
    }
}

/**
 * Display route information in the UI
 * @param {number} totalDistance - Total route distance in meters
 */
function displayRouteInfo(totalDistance) {
    const routeInfo = document.getElementById('routeInfo');
    const distanceKm = (totalDistance / 1000).toFixed(2);
    const optimizationSelect = document.getElementById('optimizationSelect');
    const algorithmSelect = document.getElementById('algorithmSelect');

    routeInfo.innerHTML = `
        <div><strong>Route Complete!</strong></div>
        <div>📍 Stops: ${getLocations().length}</div>
        <div>📏 Total Distance: ~${distanceKm} km</div>
        <div>🔀 Optimization: ${optimizationSelect.options[optimizationSelect.selectedIndex].text}</div>
        <div>🧮 Algorithm: ${algorithmSelect.options[algorithmSelect.selectedIndex].text}</div>
    `;
    routeInfo.style.display = 'block';

    updateStatus(`✓ Route optimized! Total: ${distanceKm} km`);
}
