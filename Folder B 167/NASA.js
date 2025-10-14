const imageContainer = document.getElementById('image-container');
const loadMoreButton = document.getElementById('load-more');
const apiKey = 'DEMO_KEY';
const query = 'Space';
let page = 1;
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const captionText = document.getElementById('caption');
const span = document.getElementsByClassName('close')[0];

async function searchNasaImages(query, page) {
    const nasaImageApiUrl = `https://images-api.nasa.gov/search?q=${query}&media_type=image&page=${page}`;
    try {
        const response = await fetch(nasaImageApiUrl);
        if (!response.ok) {
            throw new Error
            (`Error at Searching NASA Images: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data.collection.items;
    } catch (error) {
        console.error('Error at Searching NASA Images:', error);
        return [];
    }
}
function displayImages(images) {
    images.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');
        const img = document.createElement('img');
        img.src = image.links[0].href;
        img.alt = image.data[0].title;
        img.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            captionText.textContent = img.alt;
        });
        const title = document.createElement('p');
        title.textContent = image.data[0].title;
        imageItem.appendChild(img);
        imageItem.appendChild(title);
        imageContainer.appendChild(imageItem);
    });
}
async function loadMoreImages() {
    page++;
    const images = await searchNasaImages(query, page);
    displayImages(images);
}
loadMoreButton.addEventListener('click', loadMoreImages);
searchNasaImages(query, page).then(images => displayImages(images));
span.onclick = function() {
    modal.style.display = "none";
}