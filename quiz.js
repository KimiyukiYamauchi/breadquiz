// 不正解の質問と回答を保持するリスト
const incorrectQuestions = [];
const incorrectAnswers = [];


// サンプルデータ (quiz.jsから動的に渡されることを想定)
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
  const nextButton = document.getElementById('next-question');

  if (selectedChoice === correctAnswer) {
    feedbackElement.textContent = '正解！';
    feedbackElement.style.color = 'green';
    score++;
  } else {
    feedbackElement.textContent = `不正解！正解は「${correctAnswer}」です。`;
    feedbackElement.style.color = 'red';

    // 不正解の質問と回答をリストに追加
    incorrectQuestions.push(quiz[currentQuestionIndex]);
    incorrectAnswers.push({
      question: quiz[currentQuestionIndex],
      userAnswer: selectedChoice,
    });
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
    nextButton.textContent = '次へ';
    nextButton.style.display = 'block';
    nextButton.onclick = () => displayQuestion(quiz);
  } else {
    nextButton.textContent = '確認';
    nextButton.style.display = 'block';
    nextButton.onclick = displayFinalScore;
  }
}

function displayFinalScore() {
  const quizWrapper = document.getElementById('quiz-wrapper');
  quizWrapper.innerHTML = `
    <h2>結果発表</h2>
    <p>あなたのスコアは ${score} 点です。</p>
  `;

  if (incorrectQuestions.length > 0) {
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>問題番号</th>
          <th>問題</th>
          <th>正解</th>
        </tr>
      </thead>
      <tbody>
        ${incorrectQuestions
          .map((question, index) => `
            <tr>
              <td>${question.investmentNumber}</td>
              <td>${question.question}</td>
              <td>${question.answer}</td>
            </tr>
          `)
          .join('')}
      </tbody>
    `;
    quizWrapper.appendChild(table);
  }
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
