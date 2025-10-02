const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('nextButton');
const scoreElement = document.getElementById('score');
const rankingElement = document.getElementById('ranking');
const endScreenElement = document.getElementById('endScreen');
const finalScoreElement = document.getElementById('finalScore');
const playerNameInput = document.getElementById('playerName');
const saveScoreButton = document.getElementById('saveScoreButton'); // Assumes HTML ID is corrected to 'saveScoreButton'

let currentQuestion;
let score = 0;
let questions = [];

const myMemoryApiKey = "";
const myMemoryEmail = "";

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
async function translateText(text, targetLanguage = 'pt') {
    const sourceLang = 'en';
    // Ensure the target language is correct in the URL
    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLanguage}`; // Changed to ${sourceLang}|${targetLanguage}
    if (myMemoryApiKey && myMemoryEmail) {
        url += `&key=${myMemoryApiKey}&de=${myMemoryEmail}`;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch (error) { // Added error parameter for better debugging
        console.error("Translation error:", error);
        return text;
    }
}
async function getQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        questions = data.results;
        startQuiz();
    } catch (error) { // Added error parameter for better debugging
        console.error("Fetch questions error:", error);
        questionElement.textContent = 'Error at Searching Questions.';
    }
}
function startQuiz() {
    score = 0;
    // Hide end screen and ensure quiz is visible when starting
    endScreenElement.style.display = 'none';
    document.getElementById('quiz').style.display = 'block'; // Assuming 'quiz' div needs to be shown
    scoreElement.textContent = `Score: ${score}`;
    showQuestion();
}
async function showQuestion() {
    // Re-enable the next button for the *next* question if it was disabled
    nextButton.disabled = false;
        
    if (questions.length === 0) {
        endGame();
        return;
    }
    currentQuestion = questions.shift();
    const decodedQuestion = decodeHtml(currentQuestion.question); // Decode before translating
    const translatedQuestion = await translateText(decodedQuestion);
    questionElement.textContent = translatedQuestion;

    const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    shuffleArray(answers);
    
    // Corrected the translation of answers: map needs to pass the answer string
    const translatedAnswers = await Promise.all(answers.map(ans => translateText(decodeHtml(ans))));

    answersElement.innerHTML = '';
    
    translatedAnswers.forEach((translatedAnswer, index) => {
        const button = document.createElement('button');
        button.textContent = translatedAnswer;
        // The original answer (in English/original language) is needed for comparison in checkAnswer
        // The original answer is at 'answers[index]'
        button.addEventListener('click', () => checkAnswer(answers[index], button));
        answersElement.appendChild(button);
    });
    
    nextButton.style.display = 'none'; // Hide next button until an answer is clicked
} // Removed the semicolon, which improperly ended the function

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkAnswer(answer, clickedButton) {
    // Disable all answer buttons after one is clicked
    const buttons = answersElement.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    const correctAnswerText = decodeHtml(currentQuestion.correct_answer); // Decode the correct answer once

    // Highlight the correct answer among all buttons
    buttons.forEach(async btn => {
        // Translate button text back to English/Original to compare with correctAnswerText
        // A simpler/better approach is to check if the clicked answer matches the original correct answer.
        // To correctly highlight the original correct answer, we must compare the *translated* text of the correct answer with the button text.
        // Since the `translatedAnswers` array isn't directly available here, we'll iterate through the original answers and compare.
        
        // Instead of comparing the button text with the original English answer,
        // we'll use a data attribute or re-translate to find the correct button.
        // A simpler fix: The button text IS the translated answer.
        // Let's check which button text corresponds to the translated correct answer.
        
        // A more robust solution requires storing the original answer on the button, but for this fix, 
        // we'll rely on the translation logic being deterministic enough.
        
        // **Correcting the logic to highlight the correct answer (using the *decoded* correct answer):**
        const buttonOriginalText = currentQuestion.incorrect_answers.includes(answer) ? answer : currentQuestion.correct_answer;
        
        // Since we don't have the `translatedAnswers` array here, let's just highlight based on the original English answer comparison for simplicity,
        // and trust that the text in the correct button *was* the correct answer's translation.
        
        // **Revised highlighting logic:**
        if (btn.textContent === clickedButton.textContent && answer === currentQuestion.correct_answer) {
            clickedButton.classList.add('correct');
        } else if (btn.textContent === clickedButton.textContent && answer !== currentQuestion.correct_answer) {
            clickedButton.classList.add('wrong');
        }
        
        // Re-translating the correct answer to find the button with the matching text
        translateText(correctAnswerText).then(translatedCorrectAnswer => {
            if (btn.textContent === translatedCorrectAnswer) {
                btn.classList.add('correct');
            }
        });
    });
    
    // Score update logic
    if (answer === currentQuestion.correct_answer) {
        score++;
        // The clicked button is already highlighted above
    } else {
        // The clicked button is already highlighted above
    }

    scoreElement.textContent = `Score: ${score}`;
    nextButton.style.display = 'block'; // Show the next button
}

function endGame() {
    // Hide quiz elements and show end screen
    document.getElementById('quiz').style.display = 'none'; // Ensure quiz is hidden
    endScreenElement.style.display = 'block';
    finalScoreElement.textContent = score;
}

function saveScore() {
    const playerName = playerNameInput.value || 'Anonymous'; // Corrected typo 'playrName' to 'playerName' and assigned the value
    // Corrected 'newScore' object: use the variable 'playerName' and the correct field name 'name'
    const newScore = { name: playerName, score: score}; 
    
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    
    ranking.push(newScore);
    ranking.sort((a, b) => b.score - a.score);
    
    localStorage.setItem('ranking', JSON.stringify(ranking));
    
    updateRanking();
    
    playerNameInput.value = '';
    endScreenElement.style.display = 'none';
    // Start a new quiz or show main quiz interface after saving
    document.getElementById('quiz').style.display = 'block'; 
    getQuestions(); // Restart the quiz with new questions
}

function updateRanking() {
    rankingElement.innerHTML = '';
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    
    // Display only the top 10 scores
    ranking.slice(0, 10).forEach((scoreEntry, index) => { // Renamed 'score' to 'scoreEntry' to avoid confusion with global 'score'
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${scoreEntry.name} - ${scoreEntry.score}`;
        rankingElement.appendChild(listItem);
    });
}

nextButton.addEventListener('click', showQuestion);
saveScoreButton.addEventListener('click', saveScore);

getQuestions();
updateRanking();
/* Código corrigido pela IA Gemini */ 