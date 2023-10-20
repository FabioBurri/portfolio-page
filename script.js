// Constants
const apiUrl = 'https://restcountries.com/v3.1/all';

// Variables
let countriesData = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 90;
let timerInterval;

// DOM Elements
const flagImage = document.getElementById('flag-image');
const optionButtons = [
  document.getElementById('option1'),
  document.getElementById('option2'),
  document.getElementById('option3'),
  document.getElementById('option4'),
]; // Updated to use getElementById for each button
const questionElement = document.querySelector('.question');
const progressBar = document.querySelector('.progress-bar');
const timeLeftElement = document.getElementById('time-left');
const scoreElement = document.getElementById('score');
const feedbackMessageElement = document.getElementById('feedback-message');

// Hamburger menu
const openNavWindow = () => {
  const x = document.getElementById('menu');
  if (window.innerWidth <= 600) {
    if (x.style.display === 'flex' || getComputedStyle(x).display === 'flex') {
      x.style.display = 'none';
    } else {
      x.style.display = 'flex';
    }
  }
};

window.addEventListener('resize', () => {
  const x = document.getElementById('menu');
  if (window.innerWidth > 600) {
    x.style.display = 'flex';
  } else {
    x.style.display = 'none';
  }
});

// Fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    countriesData = data;
    startGame();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const restartButton = document.getElementById('restart-button');

function startGame() {
  countriesData = shuffleArray(countriesData);
  showNextQuestion();
  timerInterval = setInterval(updateTimer, 1000);
}


// Show the next question
function showNextQuestion() {
  if (currentQuestionIndex < countriesData.length) {
    const countryData = countriesData[currentQuestionIndex];
    const correctAnswer = countryData.name.common;

    // Access the flag image URL (PNG version)
    const flagImageUrl = countryData.flags.png;

    // Set the flag image source
    flagImage.src = flagImageUrl;

    // Display flag and options
    questionElement.textContent = `Which country does this flag belong to?`;

    // Randomly shuffle answer options
    const shuffledOptions = shuffleAnswers(correctAnswer);

    // Set the answer options text
    optionButtons.forEach((button, index) => {
      button.textContent = shuffledOptions[index];
      button.addEventListener('click', () =>
        checkAnswer(button.textContent, correctAnswer)
      );
    });

    currentQuestionIndex++;
  } else {
    endGame();
  }
}

// Shuffle answer options to randomize their order
function shuffleAnswers(correctAnswer) {
  const options = [correctAnswer];
  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * countriesData.length);
    const randomOption = countriesData[randomIndex].name.common;
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  return shuffleArray(options);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Check if the selected answer is correct
function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    score++;
    feedbackMessageElement.textContent = 'Correct!';
    scoreElement.textContent = score;
  } else {
    feedbackMessageElement.textContent =
      'Wrong! The correct answer is ' + correctAnswer;
  }

  // Move to the next question
  showNextQuestion();
}

// Update the timer and end the game if time runs out
function updateTimer() {
  timeLeft--;
  timeLeftElement.textContent = timeLeft;

  if (timeLeft === 0) {
    clearInterval(timerInterval);
    endGame();
  }
}

// End the game and display the final score
function endGame() {
  flagImage.style.display = 'none';
  questionElement.textContent = 'Quiz Complete!';
  optionButtons.forEach((button) => (button.style.display = 'none'));
  feedbackMessageElement.textContent = '';
  scoreElement.textContent = `Your Score: ${score}`;
  restartButton.style.display = 'block';
  restartButton.addEventListener('click', restartGame);
}


function restartGame() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 90;
  scoreElement.textContent = '0';
  timeLeftElement.textContent = '90';
  flagImage.style.display = 'block';
  optionButtons.forEach((button) => (button.style.display = 'block'));
  feedbackMessageElement.textContent = '';
  clearInterval(timerInterval);

  restartButton.style.display = 'none';
  
  startGame();
}


// Start the quiz when the page loads
fetchData();