const apiKey = '664eee67094b4a609e63a6187d7bfe84';
const lat= -30.0346;
const lon = -51.2177;
const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}&lang=pt`;
fetch(url)
.then(Response => Response.jjson())
.then(data => {
    if (data && data.data && data.data.length > 0) {
        const weather = data.data[0];
        const tickerText = `| @ Porto Alegre | Temperature: ${weather.temp}°C | Condition: ${weather.weather.description} | Humidity: ${weather.rh}% | Wind: ${weather.wind_spd.toFixed(1)} m/s`;
        document.getElementById('weatherTicker').textContent = tickerText;
    } else {
        document.getElementById('weatherTicker').textContent = 'Data not Found for Porto Alegre.';
    }
})
.catch(error => {
    document.getElementById('weatherTicker').textContent = `Error at Loading Data: ${error}`;
});
/* Código Incompleto. Chave API vazia pela criação de conta de Weatherbit não estar funcionando no momento da criação do código */