document.addEventListener('DOMContentLoaded', function () {
    // ✅ FIX: Use L.Icon.Default.mergeOptions to correctly redefine the icon paths.
    // This is the robust way to ensure Leaflet markers load from the CDN path.
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    // Initialize the map, default to São Paulo, Brazil (-23.5505, -46.6333)
    const map = L.map('map').setView([-23.5505, -46.6333], 12);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Geolocation for user's current position
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // ✅ FIX: Access coordinates via the 'coords' object
                const lat = position.coords.latitude; 
                const lng = position.coords.longitude; 
                
                map.setView([lat, lng], 15);
                const userMarker = L.marker([lat, lng]).addTo(map);
                userMarker.bindPopup("<b>You are Here!</b>").openPopup();
                console.log("User Location Get:", lat, lng);
            },
            (error) => {
                console.error("Error at Getting Location:", error.message);
                // Note: The default location name in the alert seems misplaced ("Calábria" is a city in Italy, but the default coordinates are São Paulo, Brazil). 
                // I've left the alert message as is, but you may want to update the text or the default coords.
                alert("Error at Getting Location. Showing Calábria as Default.");
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert("Geolocation Not Supported by your Browser. Showing Calábria as Default.");
    }

    // --- Map Interactions ---

    // Function to handle map click events and display coordinates in a popup
    function onMapClick(e) {
        L.popup()
        .setLatLng(e.latlng)
        .setContent("You Clicked the Map at Coordinate " + e.latlng.toString())
        .openOn(map);
    }
    map.on('click', onMapClick);

    // Function to add a custom marker
    function addCustomMarker(lat, lng, text) {
        const customMarker = L.marker([lat, lng]).addTo(map);
        customMarker.bindPopup(text).openPopup();
    }
    
    // Add the custom marker for "Calábria" (assuming this is meant to be a fixed point, not related to the alert message)
    // Note: This coordinate (-30.103139, -51.216078) is in Porto Alegre, Brazil, not Italy.
    addCustomMarker(-30.103139, -51.216078, "Calábria");
});
/* Código corrigido pela IA Gemini */