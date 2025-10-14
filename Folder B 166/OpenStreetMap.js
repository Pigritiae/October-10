let map;
function iniciateMap() {
    map = L.map('map').setView([-22.9, -43.2], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap contributors'
}).addTo(map);
}
function searchPlanes() {
    const falseData = [
        { lat: -22.9, long: -43.2, callsign: 'GOL123', country: 'Brazil'},
        { lat: -23.5, long: -46.6, callsign: 'LATAM456', country: 'Brazil'},
        { lat: -19.9, long: -43.9, callsign: 'AZUL789', country: 'Brazil'},
    ];
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    falseData.forEach(plane => {
        L.marker([plane.lat, plane.long])
        .addTo(map).bindPopup(`<strong>${plane.callsign}</strong><br>Origin: ${plane.country}`);
    });
}

window.onload = iniciateMap
