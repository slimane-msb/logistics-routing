const map = L.map('map').setView([48.8566, 2.3522], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

document.getElementById('searchBtn').addEventListener('click', async () => {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return;

  const popup = L.popup().setLatLng(map.getCenter())
    .setContent(`<b>Search in progress:</b> ${q}`).openOn(map);

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!data[0]) return popup.setContent(`<b>No results:</b> ${q}`);

    const {lat, lon, display_name} = data[0];
    map.setView([lat, lon], 15);
    L.marker([lat, lon]).addTo(map).bindPopup(display_name).openPopup();

  } catch (e) {
    popup.setContent(`<b>Error:</b> ${e}`);
  }
});
