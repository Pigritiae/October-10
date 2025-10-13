const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const generateButton = document.getElementById('generate');
const imageContainer = document.getElementById('imageContainer');

generateButton.addEventListener('click', () => {
    const width = widthInput.value;
    const height = heightInput.value;
    generateImage(width, height);
});
function generateImage(width, height) {
    const imageUrl = `https://picsum.photos/${width}/${height}`;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Random image ${width}x${height}`;
    imageContainer.innerHTML = '';
    imageContainer.appendChild(img);
}