const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categorySelect = document.getElementById('category-select');
const ratingSelect = document.getElementById('rating-select');
const gifContainer = document.getElementById('gif-container');
const loadMoreButton = document.getElementById('load-more-button');


const apiKey = 'VtHH6Wc7ZVmKZtXQQPtCFzvBysfZlnHC'; 
const limit = 10;
let offset = 0;

// Initial load on page load (optional, useful for trending)
document.addEventListener('DOMContentLoaded', () => {
    // Optionally load trending GIFs on startup if search term is empty
    // For now, it will wait for a search.
});

// Event listeners for searching and filtering
searchButton.addEventListener('click', () => {
    offset = 0; // Reset offset for new search
    gifContainer.innerHTML = ''; // Clear existing GIFs
    loadGifs();
});

// Load more listener
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadGifs();
});

// Filter listeners (Category and Rating)
categorySelect.addEventListener('change', () => {
    offset = 0;
    gifContainer.innerHTML = '';
    loadGifs();
});

ratingSelect.addEventListener('change', () => {
    offset = 0;
    gifContainer.innerHTML = '';
    loadGifs();
});


function loadGifs() {
    const searchTerm = searchInput.value.trim();
    const category = categorySelect.value;
    const rating = ratingSelect.value;
    
    let query = searchTerm;
    
    // If no search term is entered, use the category as the query for a broad search
    if (searchTerm === '' && category !== '') {
        query = category;
    } else if (searchTerm === '' && category === '') {
        // If both are empty, prompt the user or default to a safe search (e.g., "gifs")
        alert('Please insert a Search Term or select a Category.');
        return;
    }

    // GIPHY Search API endpoint
    let apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}&offset=${offset}`;

    // Add rating to the URL if a specific rating is selected
    if (rating !== '') {
        apiUrl += `&rating=${rating}`;
    }
    
    // Log the API URL for debugging (good practice)
    console.log("Fetching URL:", apiUrl);

    // Fetch call is now correctly inside the function scope
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            // Correcting the error message for better clarity
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Hide/show load more button
        if (data.pagination.total_count > (offset + limit)) {
            loadMoreButton.style.display = 'block';
        } else {
            loadMoreButton.style.display = 'none';
        }

        if (data.data.length === 0 && offset === 0) {
            gifContainer.innerHTML = '<p>No GIFs Found. Try a different search or category.</p>';
            return;
        } else if (data.data.length === 0) {
            // Display a temporary message for no more GIFs
            const message = document.createElement('p');
            message.textContent = 'No Additional GIFs Found.';
            gifContainer.appendChild(message);
            return;
        }
        
        // Loop through the received GIFs and display them
        data.data.forEach(gif => {
            const gifItem = document.createElement('div');
            gifItem.classList.add('gif-item');
            
            const img = document.createElement('img');
            // Use the 'fixed_width' size for display
            img.src = gif.images.fixed_width.url;
            img.alt = gif.title || 'GIF Image';
            
            gifItem.appendChild(img);
            gifContainer.appendChild(gifItem);
        });
    })
    .catch(error => {
        console.error('Error getting GIFs:', error);
        // Clear container only if it's the first fetch (offset=0)
        if (offset === 0) {
            gifContainer.innerHTML = 'Error getting GIFs. Try again later.';
        }
    });
}

/* Códigos corrigidos pela IA Gemini. Chave API vazia pela criação de contas no site estiver inacessível no momento de criação */ 
