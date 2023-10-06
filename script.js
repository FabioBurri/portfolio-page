// Constants
const apiUrl = 'https://restcountries.com/v3.1/all';

// Variables
let countriesData = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 180; // Time limit -> set to 3 minutes, could be higher after some tests
let timerInterval;

// DOM Elements
const flagImage = document.getElementById('flag-image');
const optionButtons = [document.getElementById('option1'), document.getElementById('option2'), document.getElementById('option3'), document.getElementById('option4')]; // Updated to use getElementById for each button
const questionElement = document.querySelector('.question');
const progressBar = document.querySelector('.progress-bar');
const timeLeftElement = document.getElementById('time-left');
const scoreElement = document.getElementById('score');
const feedbackMessageElement = document.getElementById('feedback-message');

// Hamburger menu
function openNavWindow() {
  const navWindow = window.open("", "navWindow", "width=50%,height=100%,left=50%,top=0");
  navWindow.document.write(`
      <link rel="stylesheet" href="nav-window.css">
      <ul class="nav-items">
          <li><a href="home.html" target="_parent">Home</a></li>
          <li><a href="rules.html" target="_parent">How it works</a></li>
          <li><a href="quiz.html" target="_parent">Quiz</a></li>
          <li><a href="contact.html" target="_parent">Contact</a></li>
      </ul>
  `);
}


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

// Start the quiz
function startGame() {
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
      button.addEventListener('click', () => checkAnswer(button.textContent, correctAnswer));
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
  } else {
    feedbackMessageElement.textContent = 'Wrong! The correct answer is ' + correctAnswer;
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
  optionButtons.forEach((button) => button.style.display = 'none');
  feedbackMessageElement.textContent = '';
  scoreElement.textContent = `Your Score: ${score}`;
}

// Start the quiz when the page loads
fetchData();