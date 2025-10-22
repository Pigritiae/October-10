const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('nextButton');
const scoreElement = document.getElementById('score');
const rankingElement = document.getElementById('ranking');
const endScreenElement = document.getElementById('endscreen'); // Corrected ID case
const quizElement = document.getElementById('quiz'); // Added reference for hiding/showing quiz
const finalScoreElement = document.getElementById('finalScore');
const playerNameInput = document.getElementById('playerName');
const saveScoreButton = document.getElementById('saveScoreButton');

let currentQuestion = null; // Initialize as null
let score = 0;
let questions = [];

// API keys are not required for opentdb, but kept for MyMemory translation API
const myMemoryApiKey = ""; 
const myMemoryEmail = ""; 

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Kept translation function as provided
async function translateText(text, targetLanguage = 'pt') {
    const sourceLang = 'en';
    let url = `https://api.memory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLanguage}`;
    if (myMemoryApiKey && myMemoryEmail) {
        url += `&key=${myMemoryApiKey}&de=${myMemoryEmail}`;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch {
        return text;
    }
}

async function getQuestions() {
    try {
        // CORRECTED: 'poentdb.com' to 'opentdb.com'
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple'); 
        if (!response.ok) throw new Error('API failed to fetch.');
        const data = await response.json();
        questions = data.results;
        startQuiz();
    } catch (error) {
        console.error("Error fetching questions:", error);
        questionElement.textContent = 'Error fetching questions. Please try again later.';
        nextButton.disabled = true;
    }
}

function startQuiz() {
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    quizElement.style.display = 'block'; // Ensure quiz is visible
    endScreenElement.style.display = 'none'; // Ensure end screen is hidden
    showQuestion();
}

async function showQuestion() {
    // Disable Next button until an answer is selected (or after checkAnswer)
    nextButton.disabled = true;

    if (questions.length === 0) {
        endGame();
        return;
    }

    currentQuestion = questions.shift();
    
    // Decode and Translate Question
    const decodedQuestion = decodeHtml(currentQuestion.question);
    const translatedQuestion = await translateText(decodedQuestion);
    questionElement.textContent = translatedQuestion;

    // Prepare Answers
    const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    shuffleArray(answers);
    
    // Decode and Translate all answers
    const translatedAnswers = await Promise.all(answers.map(ans => translateText(decodeHtml(ans))));
    
    // Display Answers
    answersElement.innerHTML = '';
    
    translatedAnswers.forEach((translatedAnswer, index) => {
        const button = document.createElement('button');
        button.textContent = translatedAnswer;
        
        // Store the ORIGINAL, DECODED answer text in the button's dataset for easy checking
        button.dataset.originalAnswer = decodeHtml(answers[index]); 
        
        button.addEventListener('click', () => checkAnswer(button));
        answersElement.appendChild(button);
    });
} // CORRECTED: Added the missing closing brace '}'

function shuffleArray(array) {
    // CORRECTED: Logic for shuffling the array (Fisher-Yates)
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkAnswer(clickedButton) {
    // Check if the current question is defined and if the answer has already been checked
    if (!currentQuestion || nextButton.disabled === false) return; 

    const buttons = answersElement.querySelectorAll('button');
    const decodedCorrectAnswer = decodeHtml(currentQuestion.correct_answer);
    
    // Disable all buttons and enable the 'Next' button
    buttons.forEach(btn => {
        btn.disabled = true;
        // Check if the button's stored original answer matches the correct answer
        if (btn.dataset.originalAnswer === decodedCorrectAnswer) {
            btn.classList.add('correct');
        }
    });
    
    // Check if the clicked answer is correct (using the stored original answer)
    if (clickedButton.dataset.originalAnswer === decodedCorrectAnswer) {
        score++;
        // The correct class is already added above, but we highlight the WRONG choice if made
    } else {
        clickedButton.classList.add('wrong');
    }
    
    scoreElement.textContent = `Score: ${score}`;
    nextButton.disabled = false; // Allow user to proceed
}

function endGame() {
    quizElement.style.display = 'none'; // Hide the quiz area
    endScreenElement.style.display = 'block'; // Show the end screen
    finalScoreElement.textContent = score;
    nextButton.disabled = true; // Make sure next button is off
    
    // The ranking will be saved only when the user clicks 'Save Score'
}

function saveScore() {
    const playerName = playerNameInput.value.trim() || 'Anonymous';
    
    // Check if score has already been saved for this game (prevents double-save)
    if (endScreenElement.dataset.saved === 'true') return; 

    const newScore = { name: playerName, score: score};
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    
    ranking.push(newScore);
    ranking.sort((a, b) => b.score - a.score);
    
    // Limit ranking size (optional, but good practice)
    ranking = ranking.slice(0, 10); 

    localStorage.setItem('ranking', JSON.stringify(ranking));
    
    updateRanking();
    
    playerNameInput.value = '';
    // Hide end screen and restart or inform user
    alert(`Score of ${score} saved for ${playerName}!`);
    endScreenElement.style.display = 'none';
    quizElement.style.display = 'block';
    
    // Start a new quiz automatically
    getQuestions(); 
}

function updateRanking() {
    rankingElement.innerHTML = '';
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    
    ranking.forEach((scoreData, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${scoreData.name} - ${scoreData.score}`;
        rankingElement.appendChild(listItem);
    });
}

nextButton.addEventListener('click', showQuestion);
saveScoreButton.addEventListener('click', saveScore); // CORRECTED: Listener attached to the correct function

// Initial setup
getQuestions();
updateRanking();
/* Código corrigido pela IA Gemini */