// Constants
const apiUrl = 'https://restcountries.com/v3.1/all';

// Variables
let countriesData = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30; 
let timerInterval;

// DOM Elements
const flagImage = document.getElementById('flag-image');
const optionButtons = [
  document.getElementById('option1'),
  document.getElementById('option2'),
  document.getElementById('option3'),
  document.getElementById('option4'),
];
const questionElement = document.querySelector('.question');
const progressBar = document.querySelector('.progress-bar');
const timeLeftElement = document.getElementById('time-left');
const scoreElement = document.getElementById('score');
const feedbackMessageElement = document.getElementById('feedback-message');
const timerBar = document.querySelector('.timer-bar'); // Added for timer bar

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
      // Remove any previous listeners to avoid multiple triggers
      button.removeEventListener('click', button.clickListener);

      // Define the new listener
      button.clickListener = () => checkAnswer(button.textContent, correctAnswer);

      // Assign the listener to the button
      button.addEventListener('click', button.clickListener);

      button.textContent = shuffledOptions[index];
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

  // Update the timer bar width
  let widthPercentage = (timeLeft / 30) * 100;  // 30 seconds total duration
  timerBar.style.width = `${widthPercentage}%`;

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
  restartButton.style.display = 'block';
  restartButton.addEventListener('click', restartGame);
}


function restartGame() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 30;
  scoreElement.textContent = '0';
  timeLeftElement.textContent = '30';
  flagImage.style.display = 'block';
  optionButtons.forEach((button) => (button.style.display = 'block'));
  feedbackMessageElement.textContent = '';
  clearInterval(timerInterval);

  restartButton.style.display = 'none';
  
  startGame();
}


// Start the quiz when the page loads
fetchData();


// List of languages spoken, represented by country codes
const spokenLanguages = ['DE', 'FR', 'US', 'RU'];

// Function to load language flags
async function loadLanguageFlags() {
    const languagesContainer = document.getElementById('languages-container');

    for (const languageCode of spokenLanguages) {
        try {
            // Fetch data from the API
            const response = await fetch(`https://restcountries.com/v2/alpha/${languageCode}`);
            const languageData = await response.json();
            
            // Create image element for the flag
            const flagImage = document.createElement('img');
            flagImage.src = languageData.flags.png;
            flagImage.alt = `Flag representing ${languageData.languages[0].name} language`;
            flagImage.className = 'language-flag';

            // Append the image to the container
            languagesContainer.appendChild(flagImage);
        } catch (error) {
            console.error('Error fetching language flag:', error);
        }
    }
}



// List of countries visited
const visitedCountries = ['AUT', 'BE', 'HR', 'CZ', 'GB', 'FR', 'DE', 'HU', 'IE', 'IT', 'XK', 'LT', 'FL', 'MK', 'MT', 'MC', 'PO',
 'PT', 'RO', 'RU', 'SK', 'SI', 'ES', 'NL', 'TR', 'UA', 'CN', 'HK', 'MY', 'MM', 'PH', 'SG', 'AE', 'VN', 'US', 'CO', 'EC',
  'PE', 'ID'];

// Function to load flags
async function loadFlags() {
    const countriesContainer = document.getElementById('countries-container');

    for (const countryCode of visitedCountries) {
        try {
            // Fetch data from the API
            const response = await fetch(`https://restcountries.com/v2/alpha/${countryCode}`);
            const countryData = await response.json();
            
            // Create image element for the flag
            const flagImage = document.createElement('img');
            flagImage.src = countryData.flags.png;
            flagImage.alt = `Flag of ${countryData.name}`;
            flagImage.className = 'country-flag';

            // Append the image to the container
            countriesContainer.appendChild(flagImage);
        } catch (error) {
            console.error('Error fetching flag:', error);
        }
    }
}

// Call the functions when the window loads
window.onload = () => {
    loadFlags();
    loadLanguageFlags();
};
