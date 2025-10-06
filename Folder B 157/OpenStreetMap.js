const map = L.map('map').setView([-30.0321, -51.2303], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map); // Corrected 'addlo' to 'addTo' and fixed the missing closing single quote for the attribution string

const marker = L.marker([-30.0321, -51.2303]).addTo(map);
marker.bindPopup("<b>Porto Alegre</b><br>A Big City.").openPopup(); // Changed city name to match coordinates and added .openPopup() for immediate visibility

const popup = L.popup()
    .setLatLng([-30.0321, -51.2303]) // Corrected 'seLatlng' to 'setLatLng'
    .setContent("This is a Popup Example. Insert Any Information Here.")
    .openOn(map);

function onMapClick(e) {
    alert("You Clicked at the Map in " + e.latlng);
}
map.on('click', onMapClick);

// Assuming L.Control.Geocoder is loaded from a separate plugin script
if (L.Control.Geocoder) {
    new L.Control.Geocoder().addTo(map); // Adjusted for common usage of the geocoder control
} else {
    console.warn("Leaflet Geocoder Control not loaded. Ensure the plugin script is included.");
}
/* Código corrigido pela IA Gemini */ 