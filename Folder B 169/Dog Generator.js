// Renamed file to dog-generator.js for better convention

const breedSelect = document.getElementById('breedSelect');
// CRITICAL FIX 1: Change getElementsByTagName to getElementById
const generateButton = document.getElementById('generateButton');
const dogImage = document.getElementById('dogImage');

async function fetchBreeds() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        const breeds = Object.keys(data.message);

        // Optional: Add a default 'Select a Breed' option
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a Breed';
        defaultOption.value = '';
        breedSelect.appendChild(defaultOption);

        breeds.forEach(breed => {
            const option = document.createElement('option');
            // Capitalize the first letter for display, but use lowercase for the API
            const displayBreed = breed.charAt(0).toUpperCase() + breed.slice(1);
            
            option.value = breed;
            option.textContent = displayBreed;
            breedSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
}

async function fetchDogImage(breed) {
    try {
        // CRITICAL FIX 2: Corrected typo in the API URL (dog.ceo, not do.ceo)
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
        
        // Handle non-OK responses
        if (!response.ok) {
             throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        dogImage.src = data.message;
        dogImage.alt = `Photo of a ${breed.charAt(0).toUpperCase() + breed.slice(1)} Dog`;
        
    } catch (error) {
        console.error('Error fetching image:', error);
        dogImage.src = '';
        dogImage.alt = 'Error fetching image. Please try again.';
    }
}

generateButton.addEventListener('click', () => {
    const selectedBreed = breedSelect.value;
    if (selectedBreed) {
        fetchDogImage(selectedBreed);
    } else {
        alert('Please select a dog breed first!');
    }
});

// REMOVED: adjustExpandedImagePosition() is no longer needed 
// because the CSS has been fixed to center the image using 'position: fixed' 
// and 'transform: translate'.

dogImage.addEventListener('click', () => {
    // Only toggle 'expanded' if an image is actually loaded
    if (dogImage.src) {
        dogImage.classList.toggle('expanded');
    }
});

// Initialize the application
fetchBreeds();
/* Códigos corrigidos pela IA Gemini */