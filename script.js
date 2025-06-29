// Simple quiz system for Italian lessons
class QuizSystem {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.recentQuizTypes = [];
    this.maxRecentTypes = 3;
    this.difficultyLevel = 'improver';
    this.selectedMatches = new Map();
    this.selectedAnswer = null;
    this.askedQuestions = new Map(); // Track questions per container
    this.correctAnswers = new Map(); // Track correct answers per container

    this.quizData = {
      seasons: {
        vocabulary: [
          { italian: 'primavera', english: 'spring' },
          { italian: 'estate', english: 'summer' },
          { italian: 'autunno', english: 'autumn' },
          { italian: 'inverno', english: 'winter' }
        ],
        phrases: [
          { italian: 'Preferisco la primavera', english: 'I prefer spring' },
          { italian: 'Mi piace l\'estate', english: 'I like summer' },
          { italian: 'Quale stagione preferisci?', english: 'Which season do you prefer?' }
        ]
      },
      vocabulary: {
        vocabulary: [
          { italian: 'pane', english: 'bread' },
          { italian: 'pesche', english: 'peaches' },
          { italian: 'mele', english: 'apples' },
          { italian: 'formaggio', english: 'cheese' },
          { italian: 'latte', english: 'milk' },
          { italian: 'pomodori', english: 'tomatoes' },
          { italian: 'carote', english: 'carrots' },
          { italian: 'pesce', english: 'fish' },
          { italian: 'pollo', english: 'chicken' }
        ]
      },
      expressions: {
        expressions: [
          { italian: 'Vorrei...', english: 'I would like...' },
          { italian: 'Quanto costa?', english: 'How much does it cost?' },
          { italian: 'Posso assaggiare?', english: 'Can I taste it?' },
          { italian: 'Tre etti', english: '300 grams' },
          { italian: 'È fresco?', english: 'Is it fresh?' }
        ]
      },
      dialogue: {
        phrases: [
          { italian: 'Vorrei del parmigiano', english: 'I would like some parmesan' },
          { italian: 'Quanto ne vuole?', english: 'How much do you want?' },
          { italian: 'Tre etti', english: '300 grams' }
        ]
      },
      extraVocabulary: {
        vocabulary: [
          { italian: 'passi', english: 'steps' },
          { italian: 'passeggiare', english: 'to walk' },
          { italian: 'alberi', english: 'trees' }
        ]
      },
      grammar: {
        vocabulary: [
          { italian: 'ne', english: 'of it/them' },
          { italian: 'lo', english: 'it (masculine)' },
          { italian: 'la', english: 'it (feminine)' }
        ]
      }
    };
  }

  generateQuiz(topic, type = 'mixed', containerId = null) {
    const data = this.quizData[topic];
    if (!data) return null;

    // Initialize tracking for this container if needed
    if (containerId && !this.askedQuestions.has(containerId)) {
      this.askedQuestions.set(containerId, new Set());
      this.correctAnswers.set(containerId, new Set());
    }

    const allQuizTypes = ['multipleChoice', 'matching', 'fillBlank'];
    let selectedType = type;

    if (type === 'mixed') {
      const availableTypes = allQuizTypes.filter(qType => !this.recentQuizTypes.includes(qType));
      selectedType = availableTypes.length > 0 ? 
        availableTypes[Math.floor(Math.random() * availableTypes.length)] :
        allQuizTypes[Math.floor(Math.random() * allQuizTypes.length)];

      this.recentQuizTypes.push(selectedType);
      if (this.recentQuizTypes.length > this.maxRecentTypes) {
        this.recentQuizTypes.shift();
      }
    }

    // Special handling for topics with limited items
    if (containerId) {
      const askedSet = this.askedQuestions.get(containerId);
      const correctSet = this.correctAnswers.get(containerId);

      // For seasons (only 4 items) - avoid matching if all are correct
      if (topic === 'seasons' && selectedType === 'matching' && correctSet.size >= 4) {
        selectedType = Math.random() < 0.5 ? 'multipleChoice' : 'fillBlank';
      }

      // For small vocabulary sets, avoid repeated matching
      if ((data.vocabulary && data.vocabulary.length <= 6) && selectedType === 'matching' && correctSet.size >= data.vocabulary.length) {
        selectedType = Math.random() < 0.5 ? 'multipleChoice' : 'fillBlank';
      }
    }

    switch (selectedType) {
      case 'multipleChoice':
        return this.generateMultipleChoice(data, containerId);
      case 'matching':
        return this.generateMatching(data, containerId);
      case 'fillBlank':
        return this.generateFillBlank(data, containerId);
      default:
        return this.generateMultipleChoice(data, containerId);
    }
  }

  generateMultipleChoice(data, containerId = null) {
    const vocab = data.vocabulary || [];
    if (vocab.length < 4) return null;

    let availableVocab = vocab;

    // Filter out recently asked questions if we have enough options
    if (containerId && this.askedQuestions.has(containerId)) {
      const askedSet = this.askedQuestions.get(containerId);
      const unasked = vocab.filter(v => !askedSet.has(v.italian + '_mc'));
      if (unasked.length >= 1) {
        availableVocab = unasked;
      } else {
        // If all have been asked, reset the tracking to avoid infinite loops
        askedSet.clear();
        availableVocab = vocab;
      }
    }

    const correct = availableVocab[Math.floor(Math.random() * availableVocab.length)];
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

    // Track this question
    if (containerId && this.askedQuestions.has(containerId)) {
      this.askedQuestions.get(containerId).add(correct.italian + '_mc');
    }

    return {
      type: 'multipleChoice',
      question: `What is the Italian word for "${correct.english}"?`,
      options: options.map(opt => opt.italian),
      correct: correct.italian,
      correctItem: correct
    };
  }

  generateMatching(data, containerId = null) {
    const vocab = data.vocabulary || [];
    if (vocab.length < 3) return null;

    // Check if we've already done matching with all available items
    if (containerId && this.askedQuestions.has(containerId)) {
      const askedSet = this.askedQuestions.get(containerId);
      const matchingKey = vocab.map(v => v.italian).sort().join(',') + '_matching';
      if (askedSet.has(matchingKey)) {
        // Return null to force a different quiz type
        return null;
      }
      // Track this matching combination
      askedSet.add(matchingKey);
    }

    const selectedVocab = vocab.slice(0, Math.min(4, vocab.length));
    const shuffledEnglish = [...selectedVocab.map(v => v.english)].sort(() => Math.random() - 0.5);

    return {
      type: 'matching',
      question: 'Match the Italian words with their English translations:',
      italian: selectedVocab.map(v => v.italian),
      english: shuffledEnglish,
      correct: selectedVocab.reduce((acc, v) => {
        acc[v.italian] = v.english;
        return acc;
      }, {}),
      selectedVocab: selectedVocab
    };
  }

  generateFillBlank(data, containerId = null) {
    const phrases = data.phrases || data.expressions || [];
    if (phrases.length === 0) return null;

    let availablePhrases = phrases;

    // Filter out recently asked questions
    if (containerId && this.askedQuestions.has(containerId)) {
      const askedSet = this.askedQuestions.get(containerId);
      const unasked = phrases.filter(p => !askedSet.has(p.italian + '_fb'));
      if (unasked.length > 0) {
        availablePhrases = unasked;
      }
    }

    const item = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
    const words = item.italian.split(' ');
    const blankIndex = Math.floor(Math.random() * words.length);
    const correctWord = words[blankIndex];

    words[blankIndex] = '_____';

    // Track this question
    if (containerId && this.askedQuestions.has(containerId)) {
      this.askedQuestions.get(containerId).add(item.italian + '_fb');
    }

    return {
      type: 'fillBlank',
      question: `Fill in the blank: ${words.join(' ')}`,
      hint: `Translation: "${item.english}"`,
      correct: correctWord.toLowerCase(),
      correctItem: item
    };
  }

  renderQuiz(quiz, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    switch (quiz.type) {
      case 'multipleChoice':
        html = `
          <div class="quiz-question new-question">
            <h4>${quiz.question}</h4>
            <div class="quiz-options">
              ${quiz.options.map(option => `
                <button class="quiz-option" onclick="quizSystem.selectOption('${option}', this)">${option}</button>
              `).join('')}
            </div>
            <div class="quiz-feedback" style="display: none;"></div>
          </div>
        `;
        break;
      case 'matching':
        html = `
          <div class="quiz-question new-question">
            <h4>${quiz.question}</h4>
            <div class="matching-container">
              <div class="italian-column">
                <h5>Italian</h5>
                ${quiz.italian.map(word => `
                  <div class="match-item italian" data-word="${word}">${word}</div>
                `).join('')}
              </div>
              <div class="english-column">
                <h5>English</h5>
                ${quiz.english.map(word => `
                  <div class="match-item english" data-word="${word}">${word}</div>
                `).join('')}
              </div>
            </div>
            <button class="quiz-check" onclick="quizSystem.checkMatching()">Check Answers</button>
            <div class="quiz-feedback" style="display: none;"></div>
          </div>
        `;
        break;
      case 'fillBlank':
        html = `
          <div class="quiz-question new-question">
            <h4>${quiz.question}</h4>
            <p class="quiz-hint"><em>${quiz.hint}</em></p>
            <input type="text" class="quiz-input fill-blank" placeholder="Type your answer...">
            <button class="quiz-check" onclick="quizSystem.checkFillBlank()">Check Answer</button>
            <div class="quiz-feedback" style="display: none;"></div>
          </div>
        `;
        break;
    }

    container.innerHTML = html;
    this.currentQuiz = quiz;

    if (quiz.type === 'matching') {
      setTimeout(() => this.setupMatchingEventListeners(), 100);
    }
  }

  setupMatchingEventListeners() {
    document.querySelectorAll('.match-item').forEach(item => {
      item.addEventListener('click', (e) => this.handleMatchClick(e.target));
    });
  }

  handleMatchClick(item) {
    const word = item.dataset.word;
    const isItalian = item.classList.contains('italian');

    if (item.classList.contains('matched')) return;

    if (item.classList.contains('selected')) {
      item.classList.remove('selected');
      if (isItalian) {
        this.selectedMatches.delete('italian');
      } else {
        this.selectedMatches.delete('english');
      }
      return;
    }

    document.querySelectorAll(`.match-item.${isItalian ? 'italian' : 'english'}.selected`).forEach(sel => {
      sel.classList.remove('selected');
    });

    item.classList.add('selected');

    if (isItalian) {
      this.selectedMatches.set('italian', { element: item, word: word });
    } else {
      this.selectedMatches.set('english', { element: item, word: word });
    }

    if (this.selectedMatches.has('italian') && this.selectedMatches.has('english')) {
      const italianMatch = this.selectedMatches.get('italian');
      const englishMatch = this.selectedMatches.get('english');

      if (this.currentQuiz.correct[italianMatch.word] === englishMatch.word) {
        italianMatch.element.classList.add('matched');
        englishMatch.element.classList.add('matched');
        italianMatch.element.classList.remove('selected');
        englishMatch.element.classList.remove('selected');
      } else {
        setTimeout(() => {
          italianMatch.element.classList.remove('selected');
          englishMatch.element.classList.remove('selected');
        }, 500);
      }

      this.selectedMatches.clear();
    }
  }

  selectOption(answer, button) {
    const currentQuestion = button.closest('.quiz-question');

    // Check if this question has already been answered
    if (currentQuestion.querySelector('.quiz-option.correct, .quiz-option.incorrect') || 
        currentQuestion.classList.contains('answered')) {
      return; // Prevent re-answering
    }

    currentQuestion.querySelectorAll('.quiz-option.selected').forEach(opt => opt.classList.remove('selected'));
    button.classList.add('selected');
    this.selectedAnswer = answer;

    setTimeout(() => this.checkMultipleChoice(currentQuestion), 300);
  }

  checkMultipleChoice(questionElement = null) {
    if (!this.selectedAnswer) return;

    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    const selectedButton = document.querySelector('.quiz-option.selected');
    const currentQuestion = questionElement || selectedButton.closest('.quiz-question');
    const feedback = currentQuestion.querySelector('.quiz-feedback');
    const containerId = currentQuestion.closest('.quiz-block').id;

    // Prevent re-answering
    if (currentQuestion.querySelector('.quiz-option.correct, .quiz-option.incorrect') || 
        currentQuestion.classList.contains('answered')) {
      return;
    }

    // Reset all button styles first to prevent mixing
    currentQuestion.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = true;
      btn.classList.remove('correct', 'incorrect', 'selected');
    });

    if (isCorrect) {
      selectedButton.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Correct! The answer is "${this.currentQuiz.correct}"</div>`;
      this.score++;

      // Track correct answer
      if (this.correctAnswers.has(containerId) && this.currentQuiz.correctItem) {
        this.correctAnswers.get(containerId).add(this.currentQuiz.correctItem.italian);
      }
    } else {
      selectedButton.classList.add('incorrect');
      currentQuestion.querySelectorAll('.quiz-option').forEach(btn => {
        if (btn.textContent === this.currentQuiz.correct) {
          btn.classList.add('correct');
        }
      });
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "${this.currentQuiz.correct}"</div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';

    // Mark question as answered and add styling
    currentQuestion.classList.add('answered');
    currentQuestion.classList.remove('new-question');

    // Reset selected answer
    this.selectedAnswer = null;

    setTimeout(() => this.generateNextQuestion(), 2000);
  }

  checkMatching() {
    const currentQuestion = document.querySelector('.quiz-question.new-question:last-child') || document.querySelector('.quiz-question:last-child');
    if (!currentQuestion) return;

    const matchedItems = currentQuestion.querySelectorAll('.match-item.matched');
    const totalItems = currentQuestion.querySelectorAll('.match-item.italian').length;
    const feedback = currentQuestion.querySelector('.quiz-feedback');
    const checkButton = currentQuestion.querySelector('.quiz-check');
    const containerId = currentQuestion.closest('.quiz-block').id;

    // Prevent re-checking
    if (currentQuestion.classList.contains('answered')) {
      return;
    }

    // Disable all match items to prevent further interaction
    currentQuestion.querySelectorAll('.match-item').forEach(item => {
      item.style.pointerEvents = 'none';
    });

    const isFullyMatched = matchedItems.length === totalItems * 2;

    if (isFullyMatched) {
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Perfect! All matches are correct!</div>`;
      this.score++;

      // Track all correct matches
      if (this.correctAnswers.has(containerId) && this.currentQuiz.selectedVocab) {
        this.currentQuiz.selectedVocab.forEach(item => {
          this.correctAnswers.get(containerId).add(item.italian);
        });
      }
    } else {
      const correctMatches = matchedItems.length / 2;
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> You matched ${correctMatches} out of ${totalItems} correctly. Keep practicing!</div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    // Mark question as answered and add styling
    currentQuestion.classList.add('answered');
    currentQuestion.classList.remove('new-question');

    setTimeout(() => this.generateNextQuestion(), 2000);
  }

  checkFillBlank() {
    const currentQuestion = document.querySelector('.quiz-question.new-question:last-child') || document.querySelector('.quiz-question:last-child');
    if (!currentQuestion) return;

    const input = currentQuestion.querySelector('.fill-blank');
    const feedback = currentQuestion.querySelector('.quiz-feedback');
    const checkButton = currentQuestion.querySelector('.quiz-check');
    const containerId = currentQuestion.closest('.quiz-block').id;

    // Prevent re-answering
    if (currentQuestion.classList.contains('answered')) {
      return;
    }

    const answer = input.value.toLowerCase().trim();
    const isCorrect = answer === this.currentQuiz.correct.toLowerCase();

    // Disable input and button to prevent re-answering
    input.disabled = true;
    checkButton.disabled = true;
    checkButton.style.display = 'none';

    if (isCorrect) {
      input.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Correct! The answer is "${this.currentQuiz.correct}"</div>`;
      this.score++;

      // Track correct answer
      if (this.correctAnswers.has(containerId) && this.currentQuiz.correctItem) {
        this.correctAnswers.get(containerId).add(this.currentQuiz.correctItem.italian);
      }
    } else {
      input.classList.add('incorrect');
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "${this.currentQuiz.correct}"</div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';

    // Mark question as answered and add styling
    currentQuestion.classList.add('answered');
    currentQuestion.classList.remove('new-question');

    setTimeout(() => this.generateNextQuestion(), 2000);
  }

  generateNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    // Clean up questions to maintain only 2 max (previous answered + current)
    const allQuestions = currentContainer.querySelectorAll('.quiz-question');
    if (allQuestions.length >= 2) {
      // Remove the oldest question immediately to prevent visual mixing
      const oldestQuestion = allQuestions[0];
      if (oldestQuestion) {
        oldestQuestion.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        oldestQuestion.style.opacity = '0';
        oldestQuestion.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          if (oldestQuestion.parentNode) {
            oldestQuestion.remove();
          }
        }, 300);
      }
    }

    // Generate new question after cleanup
    setTimeout(() => {
      const containerId = currentContainer.id;
      const topicIndex = containerId.replace('quiz', '');
      const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar'];
      const topic = topics[topicIndex] || 'seasons';

      let nextQuiz = this.generateQuiz(topic, 'mixed', containerId);

      // If quiz generation returns null (e.g., avoided repetitive matching), try a different type
      if (!nextQuiz) {
        nextQuiz = this.generateQuiz(topic, 'multipleChoice', containerId);
      }

      if (nextQuiz) {
        this.appendQuiz(nextQuiz, containerId);
      }
    }, 400);
  }

  appendQuiz(quiz, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    switch (quiz.type) {
      case 'multipleChoice':
        html = `
          <div class="quiz-question new-question">
            <h4>${quiz.question}</h4>
            <div class="quiz-options">
              ${quiz.options.map(option => `
                <button class="quiz-option" onclick="quizSystem.selectOption('${option}', this)">${option}</button>
              `).join('')}
            </div>
            <div class="quiz-feedback" style="display: none;"></div>
          </div>
        `;
        break;
      case 'matching':
        html = `
          <div class="quiz-question new-question">
            <h4>${quiz.question}</h4>
            <div class="matching-container">
              <div class="italian-column">
                <h5>Italian</h5>
                ${quiz.italian.map(word => `
                  <div class="match-item italian" data-word="${word}">${word}</div>
                `).join('')}
              </div>
              <div class="english-column">
                <h5>English</h5>
                ${quiz.english.map(word => `
                  <div class="match-item english" data-word="${word}">${word}</div>
                `).join('')}
              </div>
            </div>
            <button class="quiz-check" onclick="quizSystem.checkMatching()">Check Answers</button>
            <div class="quiz-feedback" style="display: none;"></div>
          </div>
        `;
        break;
      case 'fillBlank':
        html = `
          <div class="quiz-question new-question">
            <h4>${quiz.question}</h4>
            <p class="quiz-hint"><em>${quiz.hint}</em></p>
            <input type="text" class="quiz-input fill-blank" placeholder="Type your answer...">
            <button class="quiz-check" onclick="quizSystem.checkFillBlank()">Check Answer</button>
            <div class="quiz-feedback" style="display: none;"></div>
          </div>
        `;
        break;
    }

    container.insertAdjacentHTML('beforeend', html);

    this.currentQuiz = quiz;

    if (quiz.type === 'matching') {
      setTimeout(() => this.setupMatchingEventListeners(), 100);
    }

    // Smooth scroll to the new question without jumping
    setTimeout(() => {
      const newQuestion = container.querySelector('.quiz-question.new-question:last-child');
      if (newQuestion) {
        newQuestion.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }, 100);
  }

  startEndlessQuiz(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const topicIndex = containerId.replace('quiz', '');
    const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar'];
    const topic = topics[topicIndex] || 'seasons';

    const quiz = this.generateQuiz(topic, 'mixed', containerId);
    if (quiz) {
      this.renderQuiz(quiz, containerId);
    }
  }
}

// Initialize quiz system
const quizSystem = new QuizSystem();

// Toggle quiz function
function toggleQuiz(quizId) {
  const quiz = document.getElementById(quizId);
  if (!quiz) return;

  if (quiz.classList.contains('hidden')) {
    quiz.classList.remove('hidden');
    quiz.style.display = 'block';
    quizSystem.startEndlessQuiz(quizId);
  } else {
    quiz.classList.add('hidden');
    quiz.style.display = 'none';
  }
}

// Initialize tooltips
function initializeTooltips() {
  document.querySelectorAll('.tooltip-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const tooltip = item.querySelector('.tooltip');
      if (tooltip) tooltip.style.display = 'block';
    });

    item.addEventListener('mouseleave', () => {
      const tooltip = item.querySelector('.tooltip');
      if (tooltip) tooltip.style.display = 'none';
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTooltips();
});