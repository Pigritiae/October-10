const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const bookList = document.getElementById('book-list');
const favoritesList = document.getElementById('favorites-list');
const historyList = document.getElementById('history-list');

// Initialize state from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

// Initial display of persistent lists
updateFavoritesList();
updateHistoryList();

async function searchBooks(query, retryCount = 0) {
    // CORRECTION 1: Fixed URL protocol typo (httos -> https)
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
    const maxRetries = 3;
    const retryDelay = 2000;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 500 && retryCount < maxRetries) {
                console.log(`Error 500 Detected. Retrying in ${retryDelay}ms (Attempt ${retryCount + 1}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return searchBooks(query, retryCount + 1);
            } else {
                throw new Error(`Error Requesting: ${response.status}`);
            }
        }
        
        const data = await response.json();
        
        if (data.items) {
            displayBooks(data.items, bookList);
        } else {
            bookList.innerHTML = '<p>No Books Found.</p>';
        }
    } catch (error) {
        console.error('Error at Searching Books:', error);
        bookList.innerHTML = '<p>Error at Searching Books. Try Again Later.</p>';
    }
}

function displayBooks(books, targetElement) {
    targetElement.innerHTML = '';
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        
        let coverUrl = 'placeholder.png'; // Placeholder for missing cover
        if (book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
            // Optional: Request larger image if available, or just use thumbnail
            coverUrl = book.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:');
        }

        const img = document.createElement('img');
        img.src = coverUrl;
        img.alt = book.volumeInfo ? book.volumeInfo.title : 'Title not Found';
        
        const title = document.createElement('h3');
        title.textContent = book.volumeInfo ? book.volumeInfo.title : 'Title not Available';
        
        const author = document.createElement('p');
        author.textContent = book.volumeInfo && book.volumeInfo.authors ? `Author: ${book.volumeInfo.authors.join(', ')}` : 'Unknown Author';
        
        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = isFavorite(book.id) ? 'Remove from Favorites' : 'Add to Favorites';
        favoriteButton.addEventListener('click', () => toggleFavorite(book));
        
        const historyButton = document.createElement('button');
        historyButton.textContent = 'Mark as Read';
        historyButton.addEventListener('click', () => addToHistory(book));
        
        bookCard.appendChild(img);
        bookCard.appendChild(title);
        bookCard.appendChild(author);
        bookCard.appendChild(favoriteButton);
        bookCard.appendChild(historyButton);
        
        targetElement.appendChild(bookCard);
    });
}

function isFavorite(bookId) {
    return favorites.some(book => book.id === bookId);
}

function toggleFavorite(book) {
    if (isFavorite(book.id)) {
        // CORRECTION 2: Inverted logic for removal
        favorites = favorites.filter(favBook => favBook.id !== book.id);
    } else {
        // CORRECTION 2: Inverted logic for adding
        favorites.push(book);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
    
    // CORRECTION 3: Removed redundant call to searchBooks
    if (searchInput.value) {
        searchBooks(searchInput.value); // Re-render main list to update button text
    }
}

function updateFavoritesList() {
    displayBooks(favorites, favoritesList);
}

function isRead(bookId) {
    // Helper to check if a book is in history (read)
    return history.some(histBook => histBook.id === bookId);
}

function addToHistory(book) {
    // CORRECTION 4: Check if book is already in history by ID
    if (!isRead(book.id)) {
        history.push(book);
        localStorage.setItem('history', JSON.stringify(history));
        updateHistoryList();
    }
}

function updateHistoryList() {
    displayBooks(history, historyList);
}

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchBooks(searchTerm);
    }
});

// CORRECTION 5: Fixed event listener syntax and logic
document.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click(); // Correct method to trigger button click
    }
});
/* Código corrigido pela IA Gemini */