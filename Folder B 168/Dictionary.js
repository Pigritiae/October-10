const searchButton = document.getElementById('searchButton');
const wordInput = document.getElementById('word');
const dictionaryIframe = document.getElementById('dictionaryIframe');

searchButton.addEventListener('click', () => {
    const word = wordInput.value;
    const url = `https://www.dicio.com.br/${word}`;
    dictionaryIframe.src = url;
});