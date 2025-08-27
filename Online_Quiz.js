const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");
const resultBox = document.getElementById("result-box");
const scoreText = document.getElementById("score");

let questions = [];
let currentIndex = 0;
let score = 0;

// Fetch questions from Open Trivia API
async function fetchQuestions() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
    const data = await response.json();
    questions = data.results.map(q => {
      const options = [...q.incorrect_answers];
      const randomIndex = Math.floor(Math.random() * (options.length + 1));
      options.splice(randomIndex, 0, q.correct_answer);
      return {
        question: q.question,
        correct: q.correct_answer,
        options
      };
    });
    loadQuestion();
  } catch (error) {
    questionBox.innerText = "Failed to load questions. Please refresh.";
  }
}

// Load current question
function loadQuestion() {
  if (currentIndex < questions.length) {
    const q = questions[currentIndex];
    questionBox.innerHTML = q.question;
    optionsBox.innerHTML = "";
    q.options.forEach(option => {
      const li = document.createElement("li");
      li.innerHTML = option;
      li.onclick = () => selectAnswer(li, q.correct);
      optionsBox.appendChild(li);
    });
  } else {
    showSubmitButton();
  }
}

// Select answer
function selectAnswer(selected, correct) {
  const allOptions = optionsBox.querySelectorAll("li");
  allOptions.forEach(opt => opt.style.pointerEvents = "none");

  if (selected.innerText === correct) {
    selected.classList.add("correct");
    score++;
  } else {
    selected.classList.add("wrong");
    allOptions.forEach(opt => {
      if (opt.innerText === correct) {
        opt.classList.add("correct");
      }
    });
  }
}

// Next question
nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showSubmitButton();
  }
};

// Show submit button at end
function showSubmitButton() {
  nextBtn.style.display = "none";
  submitBtn.style.display = "inline-block";
}

// Show result
submitBtn.onclick = () => {
  resultBox.style.display = "block";
  scoreText.innerText = `You got ${score} correct and ${questions.length - score} wrong answers.`;
  submitBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
};

// Restart quiz
restartBtn.onclick = () => {
  location.reload();
};

// Initial fetch
fetchQuestions();