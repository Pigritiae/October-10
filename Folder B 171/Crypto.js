const cryptoIdInput = document.getElementById('crypto-id');
const fetchDataButton = document.getElementById('fetch-data');
const cryptoInfoDiv = document.getElementById('crypto-info');
// FIX 4: Changed ID from 'h2' (which is a tag, not a good ID) to 'crypto-name'
const cryptoNameH2 = document.getElementById('crypto-name'); 
const currentPriceSpan = document.getElementById('current-price');
const priceChangeSpan = document.getElementById('price-change');
const marketCapSpan = document.getElementById('market-cap');
const high24hSpan = document.getElementById('high-24h');
const low24hSpan = document.getElementById('low-24h');
const totalSupplySpan = document.getElementById('total-supply');
const circulatingSupplySpan = document.getElementById('circulating-supply');

// Helper function to format currency (BRL)
const formatCurrency = (value) => {
    return value ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}` : 'N/A';
};

fetchDataButton.addEventListener('click', () => {
    const cryptoId = cryptoIdInput.value.trim().toLowerCase(); // Use toLowerCase for consistent API IDs
    
    if (cryptoId === '') {
        alert('Please Insert a Cryptocurrency ID (e.g., bitcoin).');
        return;
    }

    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoId}`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            // Include status code for better debugging
            throw new Error(`Error Adquiring Data: Status ${response.status} (${response.statusText})`);
        }
        return response.json();
    })
    .then(data => {
        // Data path is data.market_data.price_change_percentage_24h
        const priceChange24h = data.market_data.price_change_percentage_24h;

        cryptoNameH2.textContent = data.name;
        
        // FIX 5: Corrected data paths and applied formatting helper
        currentPriceSpan.textContent = formatCurrency(data.market_data.current_price.brl);
        marketCapSpan.textContent = formatCurrency(data.market_data.market_cap.brl);
        high24hSpan.textContent = formatCurrency(data.market_data.high_24h.brl);
        low24hSpan.textContent = formatCurrency(data.market_data.low_24h.brl);

        // Price Change is a percentage value
        priceChangeSpan.textContent = priceChange24h ? `${priceChange24h.toFixed(2)}%` : 'N/A';
        priceChangeSpan.style.color = priceChange24h > 0 ? 'green' : (priceChange24h < 0 ? 'red' : '#555');

        // Total and Circulating Supply
        totalSupplySpan.textContent = data.market_data.total_supply ? data.market_data.total_supply.toLocaleString('pt-BR') : 'N/A';
        circulatingSupplySpan.textContent = data.market_data.circulating_supply ? data.market_data.circulating_supply.toLocaleString('pt-BR') : 'N/A';
        
        // FIX 6: Display the info div
        cryptoInfoDiv.style.display = 'block';
    })
    .catch(error => {
        console.error('Error at Adquiring Currency Data:', error);
        alert(`Error: ${error.message}. Check the ID and Try Again.`);
        cryptoInfoDiv.style.display = 'none';
    });
});
/* Código corrigidos pela IA Gemini */ 