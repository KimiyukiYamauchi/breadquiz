const incorrectQuestions = [];
const incorrectAnswers = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedQuiz = [];

// クイズデータをフェッチ
async function fetchQuiz() {
  const response = await fetch('quiz.json');
  return await response.json();
}

// 配列をシャッフルする関数
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// モード選択時の処理
document.getElementById('normal-mode').addEventListener('click', async () => {
  selectedQuiz = await fetchQuiz();
  startQuiz(selectedQuiz);
});

document.getElementById('random-mode').addEventListener('click', () => {
  document.getElementById('random-options').style.display = 'block';
});

document.getElementById('start-random').addEventListener('click', async () => {
  const totalQuestions = parseInt(document.getElementById('random-count').value);
  if (isNaN(totalQuestions) || totalQuestions < 1) {
    alert('正しい問題数を入力してください');
    return;
  }
  const allQuestions = await fetchQuiz();
  shuffleArray(allQuestions);
  selectedQuiz = allQuestions.slice(0, totalQuestions);
  startQuiz(selectedQuiz);
});

// クイズを開始
function startQuiz(quiz) {
  document.getElementById('mode-selection').style.display = 'none';
  document.getElementById('quiz-wrapper').style.display = 'block';
  currentQuestionIndex = 0;
  score = 0;
  displayQuestion(quiz);
}

// クイズの進捗を更新
function updateProgress(current, total) {
  const progressElement = document.getElementById('progress');
  progressElement.textContent = `${current}問目/${total}問中`;
}

// 質問を表示
function displayQuestion(quiz) {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  const questionData = quiz[currentQuestionIndex];

  // 進捗更新
  updateProgress(currentQuestionIndex + 1, quiz.length);

  // 質問表示
  const questionElement = document.createElement('h2');
  questionElement.textContent = questionData.question;
  quizContainer.appendChild(questionElement);

  // 選択肢表示
  questionData.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.onclick = () => handleAnswer(choice, questionData.answer, questionData.explanation, quiz);
    quizContainer.appendChild(button);
  });

  // フィードバックエリア
  const feedbackElement = document.createElement('div');
  feedbackElement.id = 'feedback';
  feedbackElement.style.marginTop = '20px';
  quizContainer.appendChild(feedbackElement);
}

// 現在のスコアを表示する関数
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = `${score}問正解`;
}

// 回答を処理
function handleAnswer(selectedChoice, correctAnswer, explanation, quiz) {
  const feedbackElement = document.getElementById('feedback');
  const nextButton = document.getElementById('next-question');

  // ボタンの無効化
  const buttons = document.querySelectorAll('#quiz-container button');
  buttons.forEach(button => {
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
  });

  if (selectedChoice === correctAnswer) {
    feedbackElement.textContent = '正解！';
    feedbackElement.style.color = 'green';
    score++;
    updateScoreDisplay(); // スコア表示を更新
  } else {
    feedbackElement.textContent = `不正解！正解は「${correctAnswer}」です。`;
    feedbackElement.style.color = 'red';
    incorrectQuestions.push(quiz[currentQuestionIndex]);
    incorrectAnswers.push({
      question: quiz[currentQuestionIndex],
      userAnswer: selectedChoice,
    });
  }

  feedbackElement.style.fontSize = '20px';

  // 解説追加
  const explanationElement = document.createElement('div');
  explanationElement.textContent = `解説: ${explanation}`;
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

// 最終スコアを表示
function displayFinalScore() {
  const quizWrapper = document.getElementById('quiz-wrapper');
  const totalQuestions = incorrectQuestions.length + score; // 全問題数
  const accuracy = ((score / totalQuestions) * 100).toFixed(2); // 正解率を計算（小数点2桁まで）

  quizWrapper.innerHTML = `
    <h2>結果発表</h2>
    <p>正解率: ${accuracy}%</p>
  `;

  if (incorrectQuestions.length > 0) {
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>No.</th>
          <th>問題</th>
          <th>正解</th>
        </tr>
      </thead>
      <tbody>
        ${incorrectQuestions
          .map((question) => `
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

// 初期化
(async function initQuiz() {
  await fetchQuiz();
})();
