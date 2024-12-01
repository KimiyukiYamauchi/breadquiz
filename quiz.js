async function fetchQuiz() {
  const response = await fetch('quiz.json');
  return await response.json();
}

let currentQuestionIndex = 0;
let score = 0;

function updateProgress(current, total) {
  const progressElement = document.getElementById('progress');
  progressElement.textContent = `${current}問目/${total}問中`;
}

function displayQuestion(quiz) {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  const questionData = quiz[currentQuestionIndex];

  // Update progress
  updateProgress(currentQuestionIndex + 1, quiz.length);

  // Display the question
  const questionElement = document.createElement('h2');
  questionElement.textContent = questionData.question;
  quizContainer.appendChild(questionElement);

  questionData.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.onclick = () => handleAnswer(choice, questionData.answer, questionData.explanation, quiz);
    quizContainer.appendChild(button);
  });

  // Add an area for feedback (correct/incorrect message)
  const feedbackElement = document.createElement('div');
  feedbackElement.id = 'feedback';
  feedbackElement.style.marginTop = '20px';
  quizContainer.appendChild(feedbackElement);
}

function handleAnswer(selectedChoice, correctAnswer, explanation, quiz) {
  const feedbackElement = document.getElementById('feedback');
  if (selectedChoice === correctAnswer) {
    feedbackElement.textContent = '正解！';
    feedbackElement.style.color = 'green';
    score++;
  } else {
    feedbackElement.textContent = `不正解！正解は「${correctAnswer}」です。`;
    feedbackElement.style.color = 'red';
  }

  feedbackElement.style.fontSize = '20px';
  feedbackElement.style.fontWeight = 'bold';
  feedbackElement.style.textAlign = 'center';
  feedbackElement.style.padding = '10px';
  feedbackElement.style.border = '2px solid';
  feedbackElement.style.borderRadius = '10px';
  feedbackElement.style.backgroundColor = '#f9f9f9';

  // Add explanation below the feedback
  const explanationElement = document.createElement('div');
  explanationElement.textContent = `解説: ${explanation}`;
  explanationElement.style.marginTop = '10px';
  explanationElement.style.fontSize = '16px';
  explanationElement.style.fontWeight = 'normal';
  explanationElement.style.textAlign = 'left';
  explanationElement.style.padding = '10px';
  explanationElement.style.borderTop = '1px solid #ddd';
  feedbackElement.appendChild(explanationElement);

  currentQuestionIndex++;
  if (currentQuestionIndex < quiz.length) {
    document.getElementById('next-question').style.display = 'block';
  } else {
    displayFinalScore();
  }
}

function displayFinalScore() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = `<h2>Your score: ${score}</h2>`;
  document.getElementById('progress').textContent = `${quiz.length}問中終了`;
  document.getElementById('next-question').style.display = 'none';
}

document.getElementById('next-question').onclick = async function () {
  const quiz = await fetchQuiz();
  displayQuestion(quiz);
  document.getElementById('next-question').style.display = 'none';
};

// Initialize quiz
(async function initQuiz() {
  const quiz = await fetchQuiz();
  displayQuestion(quiz);
})();
