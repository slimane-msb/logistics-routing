// UI Components and Location Management

let locations = [];
let markers = [];
let visualizationLayers = [];
let isAddingLocation = false;
let isVisualizing = false;

/**
 * Update the locations panel with current locations
 */
function updateLocationsPanel() {
    const locationCount = document.getElementById('locationCount');
    const locationsList = document.getElementById('locationsList');
    const visualizeBtn = document.getElementById('visualizeBtn');

    locationCount.textContent = locations.length;
    locationsList.innerHTML = '';

    locations.forEach((loc, index) => {
        const item = document.createElement('div');
        item.className = 'location-item';
        
        const number = document.createElement('div');
        number.className = 'location-number';
        number.style.background = getMarkerColor(index, locations.length);
        number.textContent = index + 1;
        
        const coords = document.createElement('span');
        coords.textContent = `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'location-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = () => removeLocation(index);
        
        item.appendChild(number);
        item.appendChild(coords);
        item.appendChild(deleteBtn);
        locationsList.appendChild(item);
    });

    visualizeBtn.disabled = locations.length < 2;
}

/**
 * Add a location to the map
 * @param {Object} latlng - Leaflet LatLng object
 */
function addLocation(latlng) {
    const location = { lat: latlng.lat, lng: latlng.lng };
    locations.push(location);

    const marker = L.marker([latlng.lat, latlng.lng], {
        icon: createMarkerIcon(getMarkerColor(locations.length - 1, locations.length), locations.length)
    }).addTo(getMap());

    markers.push(marker);
    updateLocationsPanel();
    updateAllMarkers();

    updateStatus(`Location ${locations.length} added. Add more or visualize.`);
}

/**
 * Remove a location from the map
 * @param {number} index - Index of location to remove
 */
function removeLocation(index) {
    locations.splice(index, 1);
    getMap().removeLayer(markers[index]);
    markers.splice(index, 1);
    updateAllMarkers();
    updateLocationsPanel();
    updateStatus(locations.length > 0 ? 'Location removed' : 'Add locations to start');
}

/**
 * Update all markers with new colors and labels
 */
function updateAllMarkers() {
    markers.forEach((marker, index) => {
        marker.setIcon(createMarkerIcon(getMarkerColor(index, locations.length), index + 1));
    });
}

/**
 * Clear all visualization layers from map
 */
function clearVisualization() {
    visualizationLayers.forEach(layer => getMap().removeLayer(layer));
    visualizationLayers = [];
    
    const routeInfo = document.getElementById('routeInfo');
    routeInfo.style.display = 'none';
    
    updateStatus(locations.length >= 2 ? 'Ready to visualize' : 'Add at least 2 locations');
    document.getElementById('clearBtn').disabled = true;
}

/**
 * Reset all locations and markers
 */
function resetAll() {
    clearVisualization();
    markers.forEach(marker => getMap().removeLayer(marker));
    locations = [];
    markers = [];
    updateLocationsPanel();
    document.getElementById('visualizeBtn').disabled = true;
    updateStatus('Click "Add Location" to start');
}

/**
 * Update status message
 * @param {string} message - Status message
 */
function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

/**
 * Get current locations
 * @returns {Array} Array of locations
 */
function getLocations() {
    return locations;
}

/**
 * Set locations (for reordering after optimization)
 * @param {Array} newLocations - New locations array
 */
function setLocations(newLocations) {
    locations = newLocations;
}

/**
 * Get markers
 * @returns {Array} Array of markers
 */
function getMarkers() {
    return markers;
}

/**
 * Set markers (for reordering after optimization)
 * @param {Array} newMarkers - New markers array
 */
function setMarkers(newMarkers) {
    markers = newMarkers;
}

/**
 * Add visualization layer to map
 * @param {L.Layer} layer - Leaflet layer
 */
function addVisualizationLayer(layer) {
    visualizationLayers.push(layer);
}

/**
 * Get visualization state
 * @returns {boolean} Whether currently visualizing
 */
function getVisualizingState() {
    return isVisualizing;
}

/**
 * Set visualization state
 * @param {boolean} state - Visualizing state
 */
function setVisualizingState(state) {
    isVisualizing = state;
}

/**
 * Get adding location state
 * @returns {boolean} Whether currently adding a location
 */
function getAddingLocationState() {
    return isAddingLocation;
}

/**
 * Set adding location state
 * @param {boolean} state - Adding location state
 */
function setAddingLocationState(state) {
    isAddingLocation = state;
}


// Markers

/**
 * Color interpolation for markers
 * @param {number} index - Current index
 * @param {number} total - Total number of items
 * @returns {string} RGB color string
 */
function getMarkerColor(index, total) {
    if (total === 1) return '#00ff00';
    const ratio = index / (total - 1);
    const r = Math.round(255 * ratio);
    const g = Math.round(255 * (1 - ratio));
    return `rgb(${r}, ${g}, 0)`;
}

/**
 * Create custom Leaflet marker icon
 * @param {string} color - Background color
 * @param {string} label - Label text
 * @returns {L.DivIcon} Leaflet div icon
 */
function createMarkerIcon(color, label) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-icon" style="background: ${color};">${label}</div>`,
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5]
    });
}


/**
 * Delay function for animations
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
