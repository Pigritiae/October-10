const queryInput = document.getElementById('query');
const searchButton = document.getElementById('search');
const imageContainer = document.getElementById('imageContainer');

// NOTE: The API Key is exposed in client-side code, which is insecure for Unsplash.
// For production, you should use a server-side proxy to hide the key.
const apiKey = 'wOtg5LbckGgfgtDRtUujyju7y5a6H6O5AVnr-PGp2VE';

searchButton.addEventListener('click', () => {
    const query = queryInput.value.trim(); // Trim whitespace
    if (query) { // Only search if the query is not empty
        searchImages(query);
    } else {
        alert('Please enter a search query.');
    }
});

async function searchImages(query) {
    // Clear previous results immediately
    // CRITICAL FIX 3: Corrected case from 'innerHtml' to 'innerHTML'
    imageContainer.innerHTML = '<h2>Loading images...</h2>'; 

    try {
        // CRITICAL FIX 1 & 2: Removed space after await, and changed '?query-' to '?query='
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}&per_page=12`); 
        
        if (!response.ok) {
            throw new Error(`API response status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Clear the loading message
        imageContainer.innerHTML = '';

        if (data && data.results && data.results.length > 0) {
            data.results.forEach(result => {
                const img = document.createElement('img');
                img.src = result.urls.small;
                img.alt = result.alt_description || query;
                imageContainer.appendChild(img);
            });
        } else {
            // CRITICAL FIX 4: Corrected typo from 'alery' to 'alert'
            imageContainer.innerHTML = '<h2>No images found for that query.</h2>'; 
        }
    } catch (error) {
        console.error('Error at Searching Images:', error);
        imageContainer.innerHTML = '<h2>An error occurred while fetching images. Please check the console for details.</h2>';
    }
}
/* Código corrigido pela IA Gemini */ 
