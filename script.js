let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");
const resultContainer = document.getElementById("result-container");
const finalScoreEl = document.getElementById("final-score");
const correctCountEl = document.getElementById("correct-count");
const wrongCountEl = document.getElementById("wrong-count");
const restartBtn = document.getElementById("restart");
const themeToggle = document.getElementById("theme-toggle");
const leaderboardList = document.getElementById("leaderboard-list");

let correctAnswers = 0;
let wrongAnswers = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    scoreEl.textContent = score;
    resultContainer.classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
    shuffle(questions);
    showQuestion();
}

function showQuestion() {
    clearInterval(timer);
    timeLeft = 15;
    timerEl.textContent = timeLeft;

    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.addEventListener("click", () => checkAnswer(index));
        optionsEl.appendChild(btn);
    });

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1);
        }
    }, 1000);
}

function checkAnswer(selected) {
    clearInterval(timer);
    const q = questions[currentQuestion];
    const buttons = optionsEl.querySelectorAll("button");

    if (selected === q.answer) {
        feedbackEl.textContent = "✅ সঠিক!";
        buttons[selected].classList.add("correct");
        score += 10 + timeLeft;
        correctAnswers++;
    } else {
        feedbackEl.textContent = "❌ ভুল!";
        if (selected >= 0) buttons[selected].classList.add("wrong");
        buttons[q.answer].classList.add("correct");
        wrongAnswers++;
    }

    scoreEl.textContent = score;
    currentQuestion++;
    setTimeout(() => {
        feedbackEl.textContent = "";
        showQuestion();
    }, 1500);
}

function showResult() {
    document.getElementById("quiz-container").classList.add("hidden");
    resultContainer.classList.remove("hidden");
    finalScoreEl.textContent = score;
    correctCountEl.textContent = correctAnswers;
    wrongCountEl.textContent = wrongAnswers;
    updateLeaderboard(score);
}

restartBtn.addEventListener("click", startQuiz);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

function updateLeaderboard(newScore) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push(newScore);
    leaderboard.sort((a,b) => b - a);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    leaderboardList.innerHTML = "";
    leaderboard.forEach((score) => {
        const li = document.createElement("li");
        li.textContent = score;
        leaderboardList.appendChild(li);
    });
}

startQuiz();
updateLeaderboard();
