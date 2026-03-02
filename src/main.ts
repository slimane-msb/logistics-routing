import L from 'leaflet';
import 'leaflet-routing-machine';

// ── Map init ──────────────────────────────────────────────────────────────
const map: L.Map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OSM © CARTO',
  maxZoom: 19,
}).addTo(map);

// ── State ─────────────────────────────────────────────────────────────────
interface Address { label: string; latlng: L.LatLng }

let addresses: Address[] = [];
let markers: L.Marker[] = [];
let routeControl: any = null;

// ── DOM helpers ───────────────────────────────────────────────────────────
function setStatus(msg: string, type: 'idle' | 'loading' | 'success' | 'error' = 'idle') {
  const el = document.getElementById('status')!;
  el.textContent = msg;
  el.className = type;
}

function renderList() {
  const list = document.getElementById('address-list')!;
  list.innerHTML = '';
  addresses.forEach((addr, i) => {
    const row = document.createElement('div');
    row.className = 'address-row';
    row.dataset.index = String(i);
    row.innerHTML = `
      <span class="addr-num">${i + 1}</span>
      <input type="text" value="${escHtml(addr.label)}" placeholder="Address…" data-idx="${i}" />
      <button class="remove-btn" data-idx="${i}" title="Remove">×</button>
    `;
    list.appendChild(row);
  });

  // Bind events
  list.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', e => {
      const idx = parseInt((e.target as HTMLElement).dataset.idx!);
      addresses[idx].label = (e.target as HTMLInputElement).value;
    });
  });
  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = parseInt((e.target as HTMLElement).dataset.idx!);
      addresses.splice(idx, 1);
      renderList();
      redrawMarkers();
    });
  });
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// ── Markers ───────────────────────────────────────────────────────────────
const pinIcon = (num: number) => L.divIcon({
  className: '',
  html: `<div style="
    background:#5b6ef5;border:2px solid #fff;color:#fff;
    width:24px;height:24px;border-radius:50%;display:flex;
    align-items:center;justify-content:center;
    font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
    box-shadow:0 2px 8px rgba(0,0,0,.5);">${num}</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function redrawMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  addresses.forEach((addr, i) => {
    const m = L.marker(addr.latlng, { icon: pinIcon(i + 1) })
      .bindTooltip(addr.label || `Point ${i + 1}`, { permanent: false, direction: 'top', offset: [0, -10] })
      .addTo(map);
    markers.push(m);
  });
}

// ── Map click → add address ───────────────────────────────────────────────
map.on('click', async (e: L.LeafletMouseEvent) => {
  const latlng = e.latlng;
  setStatus('Reverse geocoding…', 'loading');
  let label = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
    const data = await res.json();
    if (data?.display_name) label = data.display_name.split(',').slice(0, 3).join(', ');
  } catch { /* keep coords */ }
  addresses.push({ label, latlng });
  renderList();
  redrawMarkers();
  setStatus(`Added: ${label}`, 'success');
  setTimeout(() => setStatus(''), 3000);
});

// ── Add from sidebar input ────────────────────────────────────────────────
async function addFromInput() {
  const input = document.getElementById('new-address-input') as HTMLInputElement;
  const val = input.value.trim();
  if (!val) return;
  setStatus('Geocoding…', 'loading');
  const coords = await geocode(val);
  if (!coords) { setStatus('Address not found, Please use the format: Number, Street, City.', 'error'); return; }
  addresses.push({ label: val, latlng: coords });
  input.value = '';
  renderList();
  redrawMarkers();
  map.panTo(coords);
  setStatus('Address added.', 'success');
  setTimeout(() => setStatus(''), 2500);
}

(window as any).addAddressFromInput = addFromInput;

document.getElementById('new-address-input')?.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') addFromInput();
});

// ── File import ───────────────────────────────────────────────────────────
(window as any).handleFileImport = async (event: Event): Promise<void> => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const text = await file.text();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  setStatus(`Geocoding ${lines.length} addresses…`, 'loading');
  let added = 0;
  for (const line of lines) {
    const coords = await geocode(line);
    if (coords) { addresses.push({ label: line, latlng: coords }); added++; }
  }
  renderList();
  redrawMarkers();
  setStatus(`Imported ${added}/${lines.length} addresses.`, 'success');
  setTimeout(() => setStatus(''), 3000);
  (event.target as HTMLInputElement).value = '';
};

// ── Geocode helper ────────────────────────────────────────────────────────
async function geocode(address: string): Promise<L.LatLng | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    const data = await res.json();
    return data.length > 0 ? L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon)) : null;
  } catch { return null; }
}

// ── TSP nearest-neighbor ──────────────────────────────────────────────────
function tspNearestNeighbor(items: Address[]): Address[] {
  if (items.length === 0) return [];
  const remaining = [...items];
  const path: Address[] = [remaining.shift()!];
  while (remaining.length > 0) {
    const last = path[path.length - 1].latlng;
    let ni = 0, nd = Infinity;
    remaining.forEach((r, i) => { const d = last.distanceTo(r.latlng); if (d < nd) { nd = d; ni = i; } });
    path.push(remaining.splice(ni, 1)[0]);
  }
  return path;
}

// ── Optimize & draw route ─────────────────────────────────────────────────
(window as any).optimizeRoute = async (): Promise<void> => {
  if (addresses.length < 2) { setStatus('Need at least 2 addresses.', 'error'); return; }

  const btn = document.getElementById('optimize-btn') as HTMLButtonElement;
  btn.disabled = true;
  setStatus('Optimizing route…', 'loading');

  const ordered = tspNearestNeighbor(addresses);
  addresses = ordered;

  renderList();

  markers.forEach(m => map.removeLayer(m));
  markers = [];
  if (routeControl) { map.removeControl(routeControl); routeControl = null; }

  ordered.forEach((addr, i) => {
    const m = L.marker(addr.latlng, { icon: pinIcon(i + 1) })
      .bindTooltip(`${i + 1}. ${addr.label}`, { permanent: false, direction: 'top', offset: [0, -10] })
      .addTo(map);
    markers.push(m);
  });

  // @ts-ignore
  routeControl = L.Routing.control({
    waypoints: ordered.map(a => a.latlng),
    lineOptions: { styles: [{ color: '#5b6ef5', weight: 4, opacity: 0.85 }], addWaypoints: false },
    show: false,
    addWaypoints: false,
    fitSelectedRoutes: true,
  }).addTo(map);

  setStatus(`Route optimized — ${ordered.length} stops.`, 'success');
  buildRoutePanel(ordered);
  btn.disabled = false;
};

// ── Google Maps URL builders ──────────────────────────────────────────────
function mapsLegUrl(from: Address, to: Address): string {
    const origin = encodeURIComponent(`${from.latlng.lat},${from.latlng.lng}`);
    const destination = encodeURIComponent(`${to.latlng.lat},${to.latlng.lng}`);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  }
  
function mapsFullUrl(ordered: Address[]): string {
    const origin = encodeURIComponent(`${ordered[0].latlng.lat},${ordered[0].latlng.lng}`);
    const destination = encodeURIComponent(`${ordered[ordered.length - 1].latlng.lat},${ordered[ordered.length - 1].latlng.lng}`);
    const waypoints = ordered.slice(1, -1)
        .map(a => `${a.latlng.lat},${a.latlng.lng}`)
        .join('|');
    const encodedWaypoints = encodeURIComponent(waypoints);

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodedWaypoints}&travelmode=driving`;
}


// ── Route panel ───────────────────────────────────────────────────────────
function buildRoutePanel(ordered: Address[]) {
    const panel = document.getElementById('route-panel')!;
    document.getElementById('route-stop-count')!.textContent = `${ordered.length} stops`;
  
    // 1. Full route button - Open directly in new tab
    document.getElementById('full-route-btn')!.onclick = () => {
      window.open(mapsFullUrl(ordered), '_blank');
    };
  
    // 2. Build legs
    const legsEl = document.getElementById('route-legs')!;
    legsEl.innerHTML = '';
  
    ordered.forEach((addr, i) => {
      // Add the Stop Row
      const stop = document.createElement('div');
      stop.className = 'leg-stop';
      stop.innerHTML = `
        <div class="leg-stop-dot${i === ordered.length - 1 ? ' last' : ''}">${i + 1}</div>
        <div class="leg-stop-label">${escHtml(addr.label)}</div>
      `;
      legsEl.appendChild(stop);
  
      // Add the Connector and Navigation Button (if not the last stop)
      if (i < ordered.length - 1) {
        const conn = document.createElement('div');
        conn.className = 'leg-connector';
        
        // Calculate URL for this specific leg
        const legUrl = mapsLegUrl(addr, ordered[i + 1]);
  
        conn.innerHTML = `
          <div class="leg-connector-line"></div>
          <button class="leg-nav-btn" title="Open in Google Maps">
            <span class="nav-label">Navigate this leg</span>
            <span class="nav-arrow">→ Maps</span>
          </button>
        `;
  
        // Open directly in a new tab on click
        conn.querySelector('.leg-nav-btn')!.addEventListener('click', () => {
          window.open(legUrl, '_blank');
        });
  
        legsEl.appendChild(conn);
      }
    });
  
    panel.classList.remove('hidden');
  }

(window as any).closeRoutePanel = () => document.getElementById('route-panel')!.classList.add('hidden');

// ── Clear all ─────────────────────────────────────────────────────────────
(window as any).clearAll = (): void => {
  addresses = [];
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  if (routeControl) { map.removeControl(routeControl); routeControl = null; }
  renderList();
  document.getElementById('route-panel')!.classList.add('hidden');
  setStatus('Cleared.', 'idle');
};

// ── Init ──────────────────────────────────────────────────────────────────
renderList();
setStatus('Click the map or add addresses below.');