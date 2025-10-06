const generateButton = document.getElementById('generate-button');
const robotDisplayDiv = document.getElementById('robot-display');
const robohashApiUrl = 'https://robohash.org/';

generateButton.addEventListener('click', () => {
    const randomText = generateRandomText(10);
    const imageUrl = `${robohashApiUrl}${encodeURIComponent(randomText)}`;
    robotDisplayDiv.innerHTML = `<img src="${imageUrl}" alt="Robot">`;
});
function generateRandomText(length) {
    const characters = 'ABDCEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result +=characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}