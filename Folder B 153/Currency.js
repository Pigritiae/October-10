const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
// CORRECTION 1: Changed 'converButton' to 'convertButton'
const convertButton = document.getElementById('convertButton'); 
const resultDiv = document.getElementById('result');
const currencyChartCanvas = document.getElementById('currencyChart');
// const apiKey = '39584d5d523d65838502f56cc4c7436d'; // API key not used for the historical data API
const apiUrl = 'https://api.exchangerate-api.com/v4/latest/';

let currencyChart = null;

async function getCurrencies() {
    try {
        // Assumes 'currencies.json' is in the root directory
        const response = await fetch('currencies.json'); 
        if (!response.ok) {
            throw new Error(`Error at Searching Currency: ${response.status} - ${response.statusText}`);
        }
        const currencies = await response.json();
        return currencies;
    } catch (error) {
        console.error('Error at Searching Currency:', error);
        resultDiv.textContent = 'An Error has Ocurred while Adquiring Currency. Please try again Later.';
        return [];
    }
}

function createCurrencyOption(selectElement, currency) {
    const option = document.createElement('option');
    option.value = currency.code;
    const flagUrl = `https://flagcdn.com/24x18/${currency.countryCode.toLowerCase()}.png`;
    option.textContent = `${currency.code} - ${currency.name}`;
    option.dataset.flag = flagUrl;
    return option;
}

function updateSelectWithFlag(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const flagUrl = selectedOption.dataset.flag;
    // Clears existing flag images that were added dynamically
    const parentContainer = selectElement.closest('.custom-select'); 
    const options = parentContainer.querySelectorAll('.selected-flag');
    options.forEach(opt => opt.remove()); 

    if (flagUrl) {
        const flagImg = document.createElement('img');
        flagImg.src = flagUrl;
        flagImg.alt = '';
        flagImg.className = 'selected-flag';
        // Simplified style to match custom-select positioning
        flagImg.style = 'position: absolute; left: 15px; top: 50%; transform: translateY(-50%); z-index: 10; width: 20px; height: 15px;'; 
        
        // CORRECTION: Insert flag *before* the select element within the custom-select div.
        parentContainer.insertBefore(flagImg, selectElement); 

        // Adjust padding of select element to accommodate the flag
        selectElement.style.paddingLeft = '45px'; 
    } else {
        selectElement.style.paddingLeft = '15px'; 
    }
}

async function populateCurrencies() {
    const currencies = await getCurrencies();
    currencies.sort((a, b) => a.code.localeCompare(b.code));
    currencies.forEach(currency => {
        fromCurrencySelect.add(createCurrencyOption(fromCurrencySelect, currency));
        toCurrencySelect.add(createCurrencyOption(toCurrencySelect, currency));
    });
    const defaultFrom = currencies.find(c => c.code === 'BRL');
    const defaultTo = currencies.find(c => c.code === 'USD');
    if (defaultFrom) fromCurrencySelect.value = 'BRL';
    if (defaultTo) toCurrencySelect.value = 'USD';
    updateSelectWithFlag(fromCurrencySelect);
    updateSelectWithFlag(toCurrencySelect);
    fromCurrencySelect.addEventListener('change', () => updateSelectWithFlag(fromCurrencySelect));
    toCurrencySelect.addEventListener('change', () => updateSelectWithFlag(toCurrencySelect));
}

async function convertCurrency() {
    const amount = amountInput.value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    resultDiv.textContent = 'Converting...'; // Clear previous result/errors
    try {
        const response = await fetch(`${apiUrl}${fromCurrency}`);
        if (!response.ok) {
            throw new Error(`Error at Converting Currency: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        const rate = data.rates[toCurrency];
        if (!rate) {
             throw new Error(`Rate for ${toCurrency} not found in Exchangerate-API response.`);
        }
        const result = (amount * rate).toFixed(2);
        const fromCurrencyData = await getCurrencyData(fromCurrency);
        const toCurrencyData = await getCurrencyData(toCurrency);
        resultDiv.textContent = `${amount} ${fromCurrency} - ${fromCurrencyData.name} = ${result} ${toCurrency} - ${toCurrencyData.name}`;
        await updateChart(fromCurrency, toCurrency);
    } catch (error) {
        console.error(`Error at Converting Currency:`, error);
        resultDiv.textContent = 'An Error has Occurred when Converting Currency. Please try Again Later.';
    }
}

async function getCurrencyData(currencyCode) {
    const currencies = await getCurrencies();
    return currencies.find(currency => currency.code === currencyCode) || {code: currencyCode, name: 'Unknown', countryCode: 'us'};
}

const currencyToBcbCode = {
    // This object is largely unnecessary as the API uses the currency code, 
    // but kept for structure if non-standard codes were needed later.
    'USD': 'USD',
    'EUR': 'EUR',
    'GBP': 'GBP',
    'JPY': 'JPY',
    'BRL': 'BRL',
    'AUD': 'AUD',
    'CAD': 'CAD',
    'CHF': 'CHF',
    'CNY': 'CNY',
    'DKK': 'DKK',
    'HKD': 'HKD',
    'MXN': 'MXN',
    'NOK': 'NOK',
    'NZD': 'NZD',
    'SEK': 'SEK',
    'THB': 'THB',
    'TRY': 'TRY',
    'ZAR': 'ZAR',
};

function formatDateToBcbFormat(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}

async function getHistoricalData(fromCurrency, toCurrency) {
    console.log('Searching Historical Data...');
    console.log(`Currency Origin: ${fromCurrency}, Currency Destination: ${toCurrency}`);
    
    // CORRECTION 2: Logic moved into the proper async function scope.
    if (fromCurrency === 'BRL' || toCurrency === 'BRL') {
        // Determine the non-BRL currency for the BCB API call
        const targetCurrency = fromCurrency === 'BRL' ? toCurrency : fromCurrency;
        const isFromBRL = fromCurrency === 'BRL';

        // BCB API only supports specific currencies for historical data
        if (!currencyToBcbCode[targetCurrency] || targetCurrency === 'BRL') {
            console.log('BCB History Available only for conversions with BRL and a specific list of other currencies.');
            resultDiv.textContent += '\nVariation History not Available for this Currency Pair.';
            return null;
        }

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        
        // BCB API dates need to be quoted and use MM-dd-yyyy format in the query.
        const endDateFormatted = formatDateToBcbFormat(today);
        // CORRECTION 3: Corrected typo 'formateDateToBcbFormat' to 'formatDateToBcbFormat'
        const startDateFormatted = formatDateToBcbFormat(startDate); 
        
        console.log(`Period: ${startDateFormatted} Until ${endDateFormatted}`);
        
        const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${targetCurrency}'&@dataInicial='${startDateFormatted}'&@dataFinalCotacao='${endDateFormatted}'&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;
        
        console.log('Request URL:', url);
        
        try {
            console.log('Making Request to BCB API...');
            const response = await fetch(url);
            console.log('Request Received. Status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error at BCB API Request:', errorText);
                throw new Error(`Error at Searching History: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Raw Data from API to BCB:', data);

            if (!data.value || data.value.length === 0) {
                console.error('No Data Returned for API from BCB');
                resultDiv.textContent += '\nNo Variation History Data for this Period.';
                return null;
            }
            
            const rates = {};
            data.value.forEach(item => {
                const date = new Date(item.dataHoraCotacao);
                const dateStr = date.toISOString().split('T')[0];
                
                // BCB rate is always X per 1 BRL (Venda) or 1 BRL per X (Compra)
                // If From=BRL, we want Rate: 1 BRL = X TARGET, so we use 1 / cotacaoVenda
                // If To=BRL, we want Rate: 1 TARGET = X BRL, so we use cotacaoCompra
                const rate = isFromBRL ? 1 / item.cotacaoVenda : item.cotacaoCompra;
                
                rates[dateStr] = { [toCurrency]: rate };
            });
            
            console.log('Processed Rates:', Object.keys(rates).length);
            return rates;

        } catch (error) {
            console.error('Error at Searching BCB History:', error);
            // CORRECTION 5: Fixed typo in resultDiv update
            resultDiv.textContent += '\nAn Error has Occurred when Searching Variation History. Please try Again Later.'; 
            console.error('Error Details:', error.message);
            return null;
        }

    } else {
        console.log('History Available only for Conversions Involving the Brazilian Real (BRL)');
        resultDiv.textContent += '\nVariation History Available only for Conversions Involving BRL.';
        return null;
    }
}

async function updateChart(fromCurrency, toCurrency) {
    try {
        console.log('Starting Graph Update...');
        
        const historicalData = await getHistoricalData(fromCurrency, toCurrency);
        
        if (!historicalData) {
            console.error('No Historical Data Returned');
            return;
        }

        console.log('Historical Data Received:', historicalData);
        
        const labels = Object.keys(historicalData).sort();
        console.log('Labels (datas):', labels);
        
        const rates = labels.map(date => {
            const rateData = historicalData[date];
            const rate = rateData && rateData[toCurrency] ? rateData[toCurrency] : null;
            return rate;
        }).filter(rate => rate !== null);
        
        const validLabels = labels.filter((_, index) => rates[index] !== null);

        if (rates.length === 0) {
            console.error('No Valid Rates Found for this Result');
            resultDiv.textContent += '\nLoading the Variation History was not Possible (No Rates).';
            return;
        }

        // The following lines were not fully necessary for the chart logic but were kept for data context
        // const fromCurrencyData = await getCurrencyData(fromCurrency);
        // const toCurrencyData = await getCurrencyData(toCurrency);
        
        if (currencyChart) {
            console.log('Deleting Previous Graph...');
            currencyChart.destroy();
        }
        
        console.log('Creating New Graph...');
        const ctx = document.getElementById('currencyChart').getContext('2d');
        
        const chartConfig = {
            type: 'line',
            data: {
                labels: validLabels,
                datasets: [{
                    label: `1 ${fromCurrency} to ${toCurrency}`,
                    data: rates,
                    borderColor: 'rgb(75,192,192)',
                    backgroundColor: 'rgba(75,192,192,0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgb(75,192,192)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Travel Variation: ${fromCurrency} to ${toCurrency}`, // Assuming 'Travel' is a typo for 'Rate' or 'Exchange'
                        font: {
                            size: 16
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `1 ${fromCurrency} = ${context.parsed.y.toFixed(4)} ${toCurrency}`;
                            }
                        }
                    }
                },
                // CORRECTION 4: Removed duplicated 'scales' property from the options object
                scales: { 
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Data',
                            padding: {top: 10}
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 15
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: `Rate (${toCurrency})`,
                            padding: {bottom: 10}
                        },
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        };
        
        // CORRECTION 4: Changed 'new chartConfig' to 'new Chart'
        currencyChart = new Chart(ctx, chartConfig); 
        console.log('Graph Created Successfully!');
        
    } catch (error) {
        console.error('Error at Updating Graph:', error);
        // CORRECTION 5: Fixed typo in resultDiv update
        resultDiv.textContent += '\nAn Error has Occurred at Loading the Variation History: ' + error.message; 
    }
}

convertButton.addEventListener('click', convertCurrency);
populateCurrencies();
/* Códigos corrigidos pela IA Gemini, Código JSON copiado do repositório de "igormelol" */ 