const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results');

async function searchWikipedia(query) {
    const endpoint = `https://pt.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=snipper&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`;
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const results = data.query.search;
        displayResults(results);;
    } catch (error) {
        console.error('Error at Finding Results:', error);
        resultsContainer.innerHTML = 
        '<p>Error at finding Results. Please try Again Later.</p>';
    }
}
function displayResults(results) {
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No Results Found.</p>';
        return;
    }
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
        <h3><a href="https://pt.wikipedia.org/wiki/${encodeURIComponent(result.title)}" target="_blank">${result.title}</a></h3>
        <p>${result.snippet}</p>
        `;
        resultsContainer.appendChild(resultItem);
    });
}
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchWikipedia(query);
    }
});
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});