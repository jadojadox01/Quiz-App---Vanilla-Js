// Global Variables
let questions = []; // To store fetched questions
let currentQuestionIndex = 0;
let score = 0;
let timer; // To store the timer interval
let timeLeft = 15; // Timer for each question (in seconds)

// DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer"); // Element to show the timer

// Fetch Questions from JSON File
async function fetchQuestions() {
    try {
        const response = await fetch("question.json");
        if (!response.ok) {
            throw new Error("Failed to load questions.");
        }
        questions = await response.json();
        loadQuestion(); // Start quiz after fetching questions
    } catch (error) {
        console.error(error);
        questionEl.textContent = "Error loading questions.";
    }
}

// Load a Question
function loadQuestion() {
    // Check if there are more questions
    if (currentQuestionIndex >= questions.length) {
        displayResult();
        return;
    }

    // Get Current Question
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;

    // Clear Previous Options
    optionsEl.innerHTML = "";

    // Display Options
    currentQuestion.options.forEach((option) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(option));
        li.appendChild(button);
        optionsEl.appendChild(li);
    });

    // Reset Timer
    timeLeft = 15; // Reset the timer for each question
    timerEl.textContent = `Time Left: ${timeLeft}s`; // Show initial time
    clearInterval(timer); // Clear any existing timers
    startTimer(); // Start the countdown
}

// Start Timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--; // Decrease time left by 1 second
        timerEl.textContent = `Time Left: ${timeLeft}s`; // Update timer on screen

        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer when it reaches 0
            currentQuestionIndex++; // Move to next question
            loadQuestion(); // Load next question automatically when time is up
        }
    }, 1000); // Update every second
}

// Check Answer
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];

    // Check if Correct
    if (selectedOption === currentQuestion.correct) {
        score++;
    }

    // Move to next question
    currentQuestionIndex++;
    loadQuestion();
}

// Display Result
function displayResult() {
    clearInterval(timer); // Stop the timer when the quiz is completed
    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = "";
    scoreEl.textContent = `Your Score: ${score}/${questions.length}`;
    timerEl.textContent = ""; // Remove timer display when quiz is finished
}

// Initialize Quiz
fetchQuestions();
