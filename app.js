/**
 * Dubai Indian School - Math Adventure Admission Test
 * JavaScript Logic & Interactive Mechanics
 */

// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
  currentQuestionIndex: 0, // 0, 1, 2
  questions: [],           // Array of question objects
  selectedAnswer: null,    // User's current temporary answer
  answersCorrect: []       // Boolean array matching each question's correctness
};

// SVG elements or emoji markers
const progressMsgs = [
  "Let's go! 🎒",
  "Doing great! 🚌",
  "Almost there! 🏫"
];

// ==========================================
// DOM ELEMENT SELECTORS
// ==========================================
const screenIntro = document.getElementById("screen-intro");
const screenQuestion = document.getElementById("screen-question");
const screenSuccess = document.getElementById("screen-success");
const screenFailure = document.getElementById("screen-failure");

const btnStart = document.getElementById("btn-start");
const btnSubmit = document.getElementById("btn-submit");
const btnRestartSuccess = document.getElementById("btn-restart-success");
const btnRestartFailure = document.getElementById("btn-restart-failure");

const numADisplay = document.getElementById("num-a");
const numBDisplay = document.getElementById("num-b");
const operatorDisplay = document.getElementById("operator");
const mathAnswerInput = document.getElementById("math-answer-input");
const keypadGrid = document.getElementById("keypad-grid");

const questionNumberBadge = document.getElementById("question-number");
const scoreHelper = document.getElementById("score-helper");
const progressFill = document.getElementById("progress-fill");
const progressBus = document.getElementById("progress-bus");

// ==========================================
// QUESTION GENERATION ENGINE
// ==========================================
function generateQuestions() {
  const list = [];

  // Q1: Addition (Two single-digit numbers 1-9)
  const a1 = getRandomDigit();
  const b1 = getRandomDigit();
  list.push({
    numA: a1,
    numB: b1,
    op: "+",
    correctAnswer: a1 + b1
  });

  // Q2: Subtraction (Two single-digit numbers where result is non-negative)
  const a2 = getRandomDigit();
  // Ensure the second number is less than or equal to the first
  const b2 = Math.floor(Math.random() * a2) + 1; // 1 to a2
  list.push({
    numA: a2,
    numB: b2,
    op: "-",
    correctAnswer: a2 - b2
  });

  // Q3: Multiplication (Two single-digit numbers 1-9)
  const a3 = getRandomDigit();
  const b3 = getRandomDigit();
  list.push({
    numA: a3,
    numB: b3,
    op: "×",
    correctAnswer: a3 * b3
  });

  return list;
}

// Generate a random digit between 1 and 9
function getRandomDigit() {
  return Math.floor(Math.random() * 9) + 1;
}

// ==========================================
// GAME STATE TRANSITIONS
// ==========================================
function initTest() {
  state.currentQuestionIndex = 0;
  state.selectedAnswer = null;
  state.answersCorrect = [false, false, false];
  state.questions = generateQuestions();
  
  showScreen(screenQuestion);
  renderQuestion();
}

function showScreen(targetScreen) {
  // Hide all screens
  [screenIntro, screenQuestion, screenSuccess, screenFailure].forEach(screen => {
    screen.classList.remove("active");
  });
  
  // Activate target screen
  targetScreen.classList.add("active");
}

function renderQuestion() {
  const q = state.questions[state.currentQuestionIndex];
  state.selectedAnswer = null;
  
  // Set equation numbers and operator
  numADisplay.textContent = q.numA;
  numBDisplay.textContent = q.numB;
  operatorDisplay.textContent = q.op;

  // Reset input field
  mathAnswerInput.value = "";
  setTimeout(() => {
    mathAnswerInput.focus();
  }, 50);
  
  // Disable submit button
  btnSubmit.disabled = true;
  btnSubmit.classList.add("btn-disabled");

  // Update progress UI
  const questionNum = state.currentQuestionIndex + 1;
  questionNumberBadge.textContent = `Question ${questionNum} of 3`;
  scoreHelper.textContent = progressMsgs[state.currentQuestionIndex];
  
  // Update progress bar
  const progressPct = ((questionNum - 1) / 3) * 100;
  progressFill.style.width = `${progressPct}%`;
  progressBus.style.left = `${progressPct}%`;
}

function selectAnswer(value) {
  if (value === null || isNaN(value)) {
    state.selectedAnswer = null;
    btnSubmit.disabled = true;
    btnSubmit.classList.add("btn-disabled");
  } else {
    state.selectedAnswer = value;
    btnSubmit.disabled = false;
    btnSubmit.classList.remove("btn-disabled");
  }
}

function submitAnswer() {
  if (state.selectedAnswer === null) return;

  const q = state.questions[state.currentQuestionIndex];
  const isCorrect = (state.selectedAnswer === q.correctAnswer);
  state.answersCorrect[state.currentQuestionIndex] = isCorrect;

  // Step forward
  state.currentQuestionIndex++;

  if (state.currentQuestionIndex < 3) {
    // Show next question
    renderQuestion();
  } else {
    // We are at the end, evaluate
    evaluateTest();
  }
}

function evaluateTest() {
  // Move progress bar to full for satisfaction!
  progressFill.style.width = "100%";
  progressBus.style.left = "100%";

  setTimeout(() => {
    // Check if ALL answers are correct
    const allCorrect = state.answersCorrect.every(val => val === true);
    
    if (allCorrect) {
      showScreen(screenSuccess);
      startConfetti();
    } else {
      showScreen(screenFailure);
    }
  }, 400);
}

// ==========================================
// INTERACTIVE EVENT LISTENERS
// ==========================================
btnStart.addEventListener("click", initTest);
btnSubmit.addEventListener("click", submitAnswer);

btnRestartSuccess.addEventListener("click", () => {
  stopConfetti();
  initTest();
});

btnRestartFailure.addEventListener("click", () => {
  initTest();
});

// Handle direct input typing
mathAnswerInput.addEventListener("input", (e) => {
  const val = e.target.value.trim();
  if (val !== "") {
    // Limit to 2 digits to keep it reasonable for kids
    if (val.length > 2) {
      e.target.value = val.slice(0, 2);
    }
    selectAnswer(parseInt(e.target.value, 10));
  } else {
    selectAnswer(null);
  }
});

// Setup on-screen keypad events
document.querySelectorAll(".keypad-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const valType = btn.getAttribute("data-val");
    let currentVal = mathAnswerInput.value;

    if (valType === "clear") {
      mathAnswerInput.value = "";
    } else if (valType === "backspace") {
      mathAnswerInput.value = currentVal.slice(0, -1);
    } else {
      // Append number if under 2 digits
      if (currentVal.length < 2) {
        mathAnswerInput.value = currentVal + valType;
      }
    }

    // Trigger change event to update state
    mathAnswerInput.dispatchEvent(new Event("input"));
    mathAnswerInput.focus();
  });
});

// Keyboard Enter Key submission
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !btnSubmit.disabled && screenQuestion.classList.contains("active")) {
    submitAnswer();
  }
});

// ==========================================
// CUSTOM CANVAS CONFETTI SYSTEM
// ==========================================
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confettiAnimationId = null;
const particles = [];
const particleCount = 100;
const colors = ["#FF5722", "#E91E63", "#9C27B0", "#3F51B5", "#00BCD4", "#4CAF50", "#FFEB3B", "#FF9800"];

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height - 20; // Spawn off-screen
    this.r = Math.random() * 6 + 4;
    this.d = Math.random() * canvas.height;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.tilt = Math.random() * 10 - 5;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.02;
    this.tiltAngle = 0;
    this.speed = Math.random() * 3 + 2;
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = this.r * 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.tilt + this.r, this.y);
    ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r);
    ctx.stroke();
  }

  update() {
    this.tiltAngle += this.tiltAngleIncremental;
    this.y += this.speed;
    this.tilt = Math.sin(this.tiltAngle) * 12;

    // Reset particle back to top when it hits bottom
    if (this.y > canvas.height) {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.speed = Math.random() * 3 + 2;
    }
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function startConfetti() {
  canvas.style.display = "block";
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new ConfettiParticle());
  }

  function run() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    confettiAnimationId = requestAnimationFrame(run);
  }
  
  run();
}

function stopConfetti() {
  canvas.style.display = "none";
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
  window.removeEventListener("resize", resizeCanvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
