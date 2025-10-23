document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ Note: For a live application, the API key should ideally be protected.
    const apiKey = '664eee67094b4a609e63a6187d7bfe84'; 
    const lat= -30.0346; // Porto Alegre latitude
    const lon = -51.2177; // Porto Alegre longitude
    
    // Construct the API URL
    const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}&lang=pt`;

    fetch(url)
    .then(Response => {
        // ✅ FIX: Corrected method from .jjson() to .json()
        if (!Response.ok) {
            throw new Error(`HTTP error! status: ${Response.status}`);
        }
        return Response.json();
    })
    .then(data => {
        if (data && data.data && data.data.length > 0) {
            const weather = data.data[0];
            
            // Note: weather.wind_spd is in m/s, toFixed(1) is correct.
            const tickerText = `| @ Porto Alegre | Temperatura: ${weather.temp}°C | Condição: ${weather.weather.description} | Umidade: ${weather.rh}% | Vento: ${weather.wind_spd.toFixed(1)} m/s`;
            
            document.getElementById('weatherTicker').textContent = tickerText;
        } else {
            document.getElementById('weatherTicker').textContent = 'Dados não encontrados para Porto Alegre.';
        }
    })
    .catch(error => {
        console.error("Error at Loading Data:", error);
        document.getElementById('weatherTicker').textContent = `Erro ao carregar dados: ${error.message}`;
    });
});
/* Código corrigido pela IA Gemini */
