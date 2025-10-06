const charactersList = document.getElementById('character-list');
const loadMoreButton = document.getElementById('load-more');
let currentPage = 1;
let nextUrl = `https://rickandmortyapi.com/api/character?page=${currentPage}`; // Use nextUrl to track next page

async function fetchCharacters(url) {
    if (!url) {
        // If nextUrl is null, we've hit the last page
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = "No More Characters";
        return;
    }

    try {
        // CORRECTION 1: Fixed API URL to the correct domain
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results) {
            displayCharacters(data.results);
            
            // Update the next URL for the next "Load More" click
            nextUrl = data.info.next;
            
            // Disable button if there is no next page
            if (!nextUrl) {
                loadMoreButton.disabled = true;
                loadMoreButton.textContent = "No More Characters";
            }
        } else {
            console.error('No Characters Found.');
        }
    } catch (error) {
        console.error('Error Fetching Characters:', error);
        charactersList.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        loadMoreButton.disabled = true;
    }
}

function displayCharacters(characters) {
    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');
        
        const image = document.createElement('img');
        image.src = character.image;
        image.alt = character.name;
        
        const name = document.createElement('h2');
        name.textContent = character.name;
        
        const status = document.createElement('p');
        status.textContent = `Status: ${character.status}`;
        
        const species = document.createElement('p');
        species.textContent = `Species: ${character.species}`;
        
        characterCard.appendChild(image);
        characterCard.appendChild(name);
        characterCard.appendChild(status);
        characterCard.appendChild(species);
        
        // CORRECTION 2: Append the card to the list container, NOT to itself
        charactersList.appendChild(characterCard); 
    });
}

loadMoreButton.addEventListener('click', () => {
    // Now uses nextUrl directly instead of incrementing currentPage
    fetchCharacters(nextUrl); 
});

// Initial call to load the first page
fetchCharacters(nextUrl);
/* Código corrigido pela IA Gemini */