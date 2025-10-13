const apiKey = '26c7f39ed5bec157ed5f928f19ed7b2d';
const searchInput = document.getElementById('search-input');
const serachButton = document.getElementById('search-button');
const movieList = document.getElementById('movie-list');
const favoritesList = document.getElementById('favorites-list');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
async function searchMovies(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=pt-BR`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
            displayMovies(data.results, movieList);
        } else {
            movieList.innerHTML = '<p>No Movies Found.</p>';
        }
    } catch (error) {
        console.error('Error at Searching Movies:', error);
        movieList.innerHTML = '<p>Error at Searching Movies. Try Again Later.</p>';
    }
}
function displayMovies(movies, targetElement) {
    targetElement.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`: 'placeholder.png';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = movie.title;
        const title = document.createElement('h3');
        title.textContent = movie.title;
        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = isFavorite(movie.id) ? 'Removed from Favorites' : 'Added to Favorites';
        favoriteButton.addEventListener('click', () => toggleFavorite(movie));
        movieCard.appendChild(img);
        movieCard.appendChild(title);
        movieCard.appendChild(overview);
        movieCard.appendChild(favoriteButton);
        targetElement.appendChild(movieCard);
    });
}
function isFavorite(movieId) {
    return favorites.some(movie => movie.id === movieId);
}
function toggleFavorite(movie) {
    if (isFavorite(movie.id)) {
        favorites = favorites.filter(favMovie => favMovie.id !== movie.id);
    } else {
        favorites.push(movie);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
    searchMovies(searchInput.value);
}
function updateFavoritesList() {
    displayMovies(favorites, favoritesList);
}
serachButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        searchMovies(searchTerm);
    }
});
searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        serachButton.click();
    }
});
updateFavoritesList();