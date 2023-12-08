const apiUrl = 'https://restcountries.com/v3.1/all';

let countriesData = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30; 
let timerInterval;

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
const timerBar = document.querySelector('.timer-bar');

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


// Next question
function showNextQuestion() {
  if (currentQuestionIndex < countriesData.length) {
    const countryData = countriesData[currentQuestionIndex];
    const correctAnswer = countryData.name.common;

    const flagImageUrl = countryData.flags.png;

    flagImage.src = flagImageUrl;

    questionElement.textContent = `Which country does this flag belong to?`;

    const shuffledOptions = shuffleAnswers(correctAnswer);

    optionButtons.forEach((button, index) => {
      button.removeEventListener('click', button.clickListener);

      button.clickListener = () => checkAnswer(button.textContent, correctAnswer);

      button.addEventListener('click', button.clickListener);

      button.textContent = shuffledOptions[index];
    });

    currentQuestionIndex++;
  } else {
    endGame();
  }
}

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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Checker
function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    score++;
    feedbackMessageElement.textContent = 'Correct!';
    scoreElement.textContent = score;
  } else {
    feedbackMessageElement.textContent =
      'Wrong! The correct answer is ' + correctAnswer;
  }

  // Next question
  showNextQuestion();
}

// Timer
function updateTimer() {
  timeLeft--;
  timeLeftElement.textContent = timeLeft;

  let widthPercentage = (timeLeft / 30) * 100;
  timerBar.style.width = `${widthPercentage}%`;

  if (timeLeft === 0) {
    clearInterval(timerInterval);
    endGame();
  }
}

// End game
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


fetchData();


const spokenLanguages = ['DE', 'FR', 'US', 'RU'];

async function loadLanguageFlags() {
    const languagesContainer = document.getElementById('languages-container');

    for (const languageCode of spokenLanguages) {
        try {
            const response = await fetch(`https://restcountries.com/v2/alpha/${languageCode}`);
            const languageData = await response.json();
            
            const flagImage = document.createElement('img');
            flagImage.src = languageData.flags.png;
            flagImage.alt = `Flag representing ${languageData.languages[0].name} language`;
            flagImage.className = 'language-flag';

            languagesContainer.appendChild(flagImage);
        } catch (error) {
            console.error('Error fetching language flag:', error);
        }
    }
}



// Countries
const visitedCountries = ['AUT', 'BE', 'HR', 'CZ', 'GB', 'FR', 'DE', 'HU', 'IE', 'IT', 'XK', 'LT', 'FL', 'MK', 'MT', 'MC', 'PL',
 'PT', 'RO', 'RU', 'SK', 'SI', 'ES', 'NL', 'TR', 'UA', 'CN', 'HK', 'MY', 'CH', 'MM', 'PH', 'SG', 'AE', 'VN', 'US', 'CO', 'EC',
  'PE', 'ID'];


async function loadFlags() {
    const countriesContainer = document.getElementById('countries-container');

    for (const countryCode of visitedCountries) {
        try {
            const response = await fetch(`https://restcountries.com/v2/alpha/${countryCode}`);
            const countryData = await response.json();
            
            const flagImage = document.createElement('img');
            flagImage.src = countryData.flags.png;
            flagImage.alt = `Flag of ${countryData.name}`;
            flagImage.className = 'country-flag';

            countriesContainer.appendChild(flagImage);
        } catch (error) {
            console.error('Error fetching flag:', error);
        }
    }
}

window.onload = () => {
    loadFlags();
    loadLanguageFlags();
};
