
class QuizSystem {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.quizData = {
      seasons: {
        vocabulary: [
          { italian: 'primavera', english: 'spring', icon: 'seedling', color: '#28a745' },
          { italian: 'estate', english: 'summer', icon: 'sun', color: '#ffc107' },
          { italian: 'autunno', english: 'autumn', icon: 'leaf', color: '#fd7e14' },
          { italian: 'inverno', english: 'winter', icon: 'snowflake', color: '#17a2b8' }
        ],
        phrases: [
          { italian: 'Quale stagione preferisci?', english: 'Which season do you prefer?' },
          { italian: 'Preferisco la primavera', english: 'I prefer spring' },
          { italian: 'Mi piace l\'estate', english: 'I like summer' }
        ]
      },
      market: {
        vocabulary: [
          { italian: 'formaggio', english: 'cheese', category: 'dairy' },
          { italian: 'pesce', english: 'fish', category: 'protein' },
          { italian: 'mele', english: 'apples', category: 'fruit' },
          { italian: 'pomodori', english: 'tomatoes', category: 'vegetables' },
          { italian: 'pane', english: 'bread', category: 'carbs' }
        ],
        expressions: [
          { italian: 'Vorrei del parmigiano', english: 'I would like some parmesan' },
          { italian: 'Quanto costa?', english: 'How much does it cost?' },
          { italian: 'Posso assaggiare?', english: 'Can I taste it?' }
        ]
      }
    };
  }

  generateQuiz(topic, type = 'mixed') {
    const data = this.quizData[topic];
    if (!data) return null;

    const quizTypes = ['multipleChoice', 'matching', 'fillBlank', 'flashcard', 'letterPicker'];
    const selectedType = type === 'mixed' ? quizTypes[Math.floor(Math.random() * quizTypes.length)] : type;

    switch (selectedType) {
      case 'multipleChoice':
        return this.generateMultipleChoice(data);
      case 'matching':
        return this.generateMatching(data);
      case 'fillBlank':
        return this.generateFillBlank(data);
      case 'flashcard':
        return this.generateFlashcard(data);
      case 'letterPicker':
        return this.generateLetterPicker(data);
      default:
        return this.generateMultipleChoice(data);
    }
  }

  generateMultipleChoice(data) {
    const vocab = data.vocabulary || [];
    if (vocab.length < 4) return null;

    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    const options = [correct];
    
    while (options.length < 4) {
      const random = vocab[Math.floor(Math.random() * vocab.length)];
      if (!options.includes(random)) {
        options.push(random);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      type: 'multipleChoice',
      question: `What is the Italian word for "${correct.english}"?`,
      options: options.map(opt => opt.italian),
      correct: correct.italian,
      explanation: `"${correct.italian}" means "${correct.english}" in English.`
    };
  }

  generateMatching(data) {
    const vocab = data.vocabulary?.slice(0, 4) || [];
    if (vocab.length < 3) return null;

    const shuffledEnglish = [...vocab.map(v => v.english)].sort(() => Math.random() - 0.5);

    return {
      type: 'matching',
      question: 'Match the Italian words with their English translations:',
      italian: vocab.map(v => v.italian),
      english: shuffledEnglish,
      correct: vocab.reduce((acc, v) => {
        acc[v.italian] = v.english;
        return acc;
      }, {})
    };
  }

  generateFillBlank(data) {
    const phrases = data.phrases || data.vocabulary || [];
    if (phrases.length === 0) return null;

    const item = phrases[Math.floor(Math.random() * phrases.length)];
    const words = item.italian.split(' ');
    const blankIndex = Math.floor(Math.random() * words.length);
    const correctWord = words[blankIndex];
    
    words[blankIndex] = '_____';

    return {
      type: 'fillBlank',
      question: `Fill in the blank: ${words.join(' ')}`,
      correct: correctWord.toLowerCase(),
      explanation: `Complete sentence: "${item.italian}" means "${item.english}"`
    };
  }

  generateFlashcard(data) {
    const vocab = data.vocabulary || [];
    if (vocab.length === 0) return null;

    const item = vocab[Math.floor(Math.random() * vocab.length)];

    return {
      type: 'flashcard',
      question: item.italian,
      answer: item.english,
      icon: item.icon,
      color: item.color
    };
  }

  generateLetterPicker(data) {
    const vocab = data.vocabulary || [];
    if (vocab.length === 0) return null;

    const item = vocab[Math.floor(Math.random() * vocab.length)];
    const word = item.italian.toLowerCase();
    const letters = word.split('');
    
    // Add some random letters
    const extraLetters = 'abcdefghilmnopqrstuvz'.split('').filter(l => !letters.includes(l));
    const allLetters = [...letters, ...extraLetters.slice(0, 6)].sort(() => Math.random() - 0.5);

    return {
      type: 'letterPicker',
      question: `Spell "${item.english}" in Italian by clicking the letters:`,
      letters: allLetters,
      correct: word,
      hint: `${word.length} letters`
    };
  }

  renderQuiz(quiz, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    switch (quiz.type) {
      case 'multipleChoice':
        html = this.renderMultipleChoice(quiz);
        break;
      case 'matching':
        html = this.renderMatching(quiz);
        break;
      case 'fillBlank':
        html = this.renderFillBlank(quiz);
        break;
      case 'flashcard':
        html = this.renderFlashcard(quiz);
        break;
      case 'letterPicker':
        html = this.renderLetterPicker(quiz);
        break;
    }

    container.innerHTML = html;
    this.currentQuiz = quiz;
  }

  renderMultipleChoice(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <div class="quiz-options">
          ${quiz.options.map((option, index) => `
            <button class="quiz-option" onclick="quizSystem.checkAnswer('${option}', this)">${option}</button>
          `).join('')}
        </div>
        <div class="quiz-feedback" style="display: none;"></div>
        <button class="quiz-next" onclick="quizSystem.nextQuestion()" style="display: none;">Next Question</button>
      </div>
    `;
  }

  renderMatching(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <div class="matching-container">
          <div class="italian-column">
            ${quiz.italian.map(word => `
              <div class="match-item italian" data-word="${word}">${word}</div>
            `).join('')}
          </div>
          <div class="english-column">
            ${quiz.english.map(word => `
              <div class="match-item english" data-word="${word}">${word}</div>
            `).join('')}
          </div>
        </div>
        <div class="quiz-feedback" style="display: none;"></div>
        <button class="quiz-check" onclick="quizSystem.checkMatching()">Check Answers</button>
        <button class="quiz-next" onclick="quizSystem.nextQuestion()" style="display: none;">Next Question</button>
      </div>
    `;
  }

  renderFillBlank(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <input type="text" class="quiz-input fill-blank" placeholder="Type your answer...">
        <div class="quiz-feedback" style="display: none;"></div>
        <button class="quiz-check" onclick="quizSystem.checkFillBlank()">Check Answer</button>
        <button class="quiz-next" onclick="quizSystem.nextQuestion()" style="display: none;">Next Question</button>
      </div>
    `;
  }

  renderFlashcard(quiz) {
    return `
      <div class="quiz-question">
        <h4>Flashcard - Click to reveal the answer</h4>
        <div class="flashcard" onclick="this.classList.toggle('flipped')">
          <div class="flashcard-front">
            ${quiz.icon ? `<i class="fas fa-${quiz.icon}" style="color: ${quiz.color}; font-size: 2rem;"></i>` : ''}
            <div class="flashcard-word">${quiz.question}</div>
          </div>
          <div class="flashcard-back">
            <div class="flashcard-word">${quiz.answer}</div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="quiz-option incorrect" onclick="quizSystem.flashcardResult(false)">Need More Practice</button>
          <button class="quiz-option correct" onclick="quizSystem.flashcardResult(true)">Got It!</button>
        </div>
        <button class="quiz-next" onclick="quizSystem.nextQuestion()" style="display: none;">Next Question</button>
      </div>
    `;
  }

  renderLetterPicker(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <div class="letter-picker-hint">${quiz.hint}</div>
        <div class="letter-picker-answer" data-correct="${quiz.correct}"></div>
        <div class="letter-picker-letters">
          ${quiz.letters.map(letter => `
            <button class="letter-btn" onclick="quizSystem.pickLetter('${letter}', this)">${letter}</button>
          `).join('')}
        </div>
        <div class="letter-picker-controls">
          <button class="quiz-option" onclick="quizSystem.clearLetters()">Clear</button>
          <button class="quiz-check" onclick="quizSystem.checkLetterPicker()">Check Answer</button>
        </div>
        <div class="quiz-feedback" style="display: none;"></div>
        <button class="quiz-next" onclick="quizSystem.nextQuestion()" style="display: none;">Next Question</button>
      </div>
    `;
  }

  checkAnswer(answer, button) {
    const isCorrect = answer === this.currentQuiz.correct;
    const feedback = document.querySelector('.quiz-feedback');
    
    // Disable all option buttons
    document.querySelectorAll('.quiz-option').forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
      button.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Correct! ${this.currentQuiz.explanation || ''}</div>`;
      this.score++;
    } else {
      button.classList.add('incorrect');
      document.querySelectorAll('.quiz-option').forEach(btn => {
        if (btn.textContent === this.currentQuiz.correct) {
          btn.classList.add('correct');
        }
      });
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "${this.currentQuiz.correct}". ${this.currentQuiz.explanation || ''}</div>`;
    }
    
    this.totalQuestions++;
    feedback.style.display = 'block';
    document.querySelector('.quiz-next').style.display = 'inline-block';
  }

  checkFillBlank() {
    const input = document.querySelector('.fill-blank');
    const answer = input.value.toLowerCase().trim();
    const isCorrect = answer === this.currentQuiz.correct;
    const feedback = document.querySelector('.quiz-feedback');
    
    if (isCorrect) {
      input.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Correct! ${this.currentQuiz.explanation || ''}</div>`;
      this.score++;
    } else {
      input.classList.add('incorrect');
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "${this.currentQuiz.correct}". ${this.currentQuiz.explanation || ''}</div>`;
    }
    
    this.totalQuestions++;
    feedback.style.display = 'block';
    document.querySelector('.quiz-next').style.display = 'inline-block';
    document.querySelector('.quiz-check').style.display = 'none';
  }

  pickLetter(letter, button) {
    const answerDiv = document.querySelector('.letter-picker-answer');
    answerDiv.textContent += letter;
    button.disabled = true;
    button.style.opacity = '0.5';
  }

  clearLetters() {
    document.querySelector('.letter-picker-answer').textContent = '';
    document.querySelectorAll('.letter-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
    });
  }

  checkLetterPicker() {
    const answer = document.querySelector('.letter-picker-answer').textContent.toLowerCase();
    const correct = document.querySelector('.letter-picker-answer').dataset.correct;
    const isCorrect = answer === correct;
    const feedback = document.querySelector('.quiz-feedback');
    
    if (isCorrect) {
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Correct! You spelled "${correct}" perfectly!</div>`;
      this.score++;
    } else {
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct spelling is "${correct}".</div>`;
    }
    
    this.totalQuestions++;
    feedback.style.display = 'block';
    document.querySelector('.quiz-next').style.display = 'inline-block';
    document.querySelector('.quiz-check').style.display = 'none';
  }

  flashcardResult(correct) {
    const feedback = document.querySelector('.quiz-feedback');
    if (correct) {
      this.score++;
    }
    this.totalQuestions++;
    document.querySelector('.flashcard-controls').style.display = 'none';
    document.querySelector('.quiz-next').style.display = 'inline-block';
  }

  nextQuestion() {
    const containerId = this.currentQuiz ? document.querySelector('.quiz-block:not(.hidden)').id : null;
    if (containerId) {
      this.startQuiz(containerId.replace('quiz', ''));
    }
  }

  startQuiz(topicIndex) {
    const topics = ['seasons', 'market', 'market', 'market', 'market'];
    const topic = topics[topicIndex] || 'seasons';
    const quiz = this.generateQuiz(topic);
    
    if (quiz) {
      this.renderQuiz(quiz, `quiz${topicIndex}`);
    }
  }

  showScore() {
    return `Score: ${this.score}/${this.totalQuestions} (${Math.round((this.score/this.totalQuestions) * 100)}%)`;
  }
}

// Initialize the quiz system
const quizSystem = new QuizSystem();

function toggleQuiz(id) {
  const block = document.getElementById(id);
  const isHidden = block.classList.contains('hidden');
  
  // Hide all other quiz blocks
  document.querySelectorAll('.quiz-block').forEach(q => q.classList.add('hidden'));
  
  if (isHidden) {
    block.classList.remove('hidden');
    const topicIndex = id.replace('quiz', '');
    quizSystem.startQuiz(topicIndex);
  }
}
