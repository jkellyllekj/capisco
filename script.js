class QuizSystem {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.questionsAnswered = 0;
    this.autoNextEnabled = true;
    this.recentQuizTypes = []; // Track recent quiz types for variety
    this.maxRecentTypes = 3; // Don't repeat same type within last 3 questions
    this.quizData = {
      seasons: {
        vocabulary: [
          { italian: 'primavera', english: 'spring', icon: 'seedling', color: '#28a745' },
          { italian: 'estate', english: 'summer', icon: 'sun', color: '#ffc107' },
          { italian: 'autunno', english: 'autumn', icon: 'leaf', color: '#fd7e14' },
          { italian: 'inverno', english: 'winter', icon: 'snowflake', color: '#17a2b8' }
        ],
        phrases: [
          { italian: 'Preferisco la primavera', english: 'I prefer spring' },
          { italian: 'Mi piace l\'estate', english: 'I like summer' },
          { italian: 'Preferisco l\'autunno', english: 'I prefer autumn' },
          { italian: 'Quale stagione preferisci?', english: 'Which season do you prefer?' },
          { italian: 'Perché fa caldo', english: 'Because it\'s hot' },
          { italian: 'Perché fa freddo', english: 'Because it\'s cold' }
        ]
      },
      vocabulary: {
        vocabulary: [
          // Bread and Grains
          { italian: 'panini', english: 'bread rolls', category: 'bread' },
          { italian: 'pane', english: 'bread', category: 'bread' },
          { italian: 'pasta', english: 'pasta', category: 'bread' },
          { italian: 'riso', english: 'rice', category: 'bread' },
          // Fruit
          { italian: 'cocomero', english: 'watermelon', category: 'fruit' },
          { italian: 'pesche', english: 'peaches', category: 'fruit' },
          { italian: 'mele', english: 'apples', category: 'fruit' },
          { italian: 'banane', english: 'bananas', category: 'fruit' },
          { italian: 'arance', english: 'oranges', category: 'fruit' },
          { italian: 'uva', english: 'grapes', category: 'fruit' },
          // Vegetables
          { italian: 'patate', english: 'potatoes', category: 'vegetables' },
          { italian: 'pomodori', english: 'tomatoes', category: 'vegetables' },
          { italian: 'carote', english: 'carrots', category: 'vegetables' },
          { italian: 'insalata', english: 'lettuce', category: 'vegetables' },
          { italian: 'cipolle', english: 'onions', category: 'vegetables' },
          // Fish and Meat
          { italian: 'pesce', english: 'fish', category: 'protein' },
          { italian: 'salmone', english: 'salmon', category: 'protein' },
          { italian: 'pollo', english: 'chicken', category: 'protein' },
          { italian: 'manzo', english: 'beef', category: 'protein' },
          // Dairy
          { italian: 'formaggio', english: 'cheese', category: 'dairy' },
          { italian: 'parmigiano', english: 'parmesan', category: 'dairy' },
          { italian: 'mozzarella', english: 'mozzarella', category: 'dairy' },
          { italian: 'latte', english: 'milk', category: 'dairy' },
          { italian: 'burro', english: 'butter', category: 'dairy' }
        ]
      },
      expressions: {
        expressions: [
          // Asking and Buying
          { italian: 'Vorrei...', english: 'I would like...', category: 'asking' },
          { italian: 'Quanto costa?', english: 'How much does it cost?', category: 'asking' },
          { italian: 'Quanto costano?', english: 'How much do they cost?', category: 'asking' },
          { italian: 'Posso assaggiare?', english: 'Can I taste it?', category: 'asking' },
          { italian: 'Quanto ne vuole?', english: 'How much do you want?', category: 'asking' },
          { italian: 'Questo є tutto', english: 'That\'s all', category: 'asking' },
          // Quantities
          { italian: 'Un chilo di...', english: 'A kilo of...', category: 'quantity' },
          { italian: 'Mezzo chilo', english: 'Half a kilo', category: 'quantity' },
          { italian: 'Tre etti', english: '300 grams', category: 'quantity' },
          { italian: 'Un etto', english: '100 grams', category: 'quantity' },
          { italian: 'Una dozzina', english: 'A dozen', category: 'quantity' },
          { italian: 'Un pezzo', english: 'One piece', category: 'quantity' },
          // Quality
          { italian: 'È fresco?', english: 'Is it fresh?', category: 'quality' },
          { italian: 'Lo preferisce fresco o stagionato?', english: 'Do you prefer it fresh or aged?', category: 'quality' },
          { italian: 'È maturo?', english: 'Is it ripe?', category: 'quality' },
          { italian: 'È di stagione?', english: 'Is it in season?', category: 'quality' },
          { italian: 'È locale?', english: 'Is it local?', category: 'quality' }
        ]
      },
      dialogue: {
        phrases: [
          { italian: 'Vorrei del parmigiano', english: 'I would like some parmesan' },
          { italian: 'Lo preferisce fresco o stagionato?', english: 'Do you prefer it fresh or aged?' },
          { italian: 'Mah... fresco', english: 'Well... fresh' },
          { italian: 'Quanto ne vuole?', english: 'How much do you want?' },
          { italian: 'Tre etti', english: '300 grams' }
        ],
        vocabulary: [
          { italian: 'ne', english: 'of it/them', note: 'Pronoun referring to quantity' },
          { italian: 'fresco', english: 'fresh' },
          { italian: 'stagionato', english: 'aged' }
        ]
      },
      extraVocabulary: {
        vocabulary: [
          { italian: 'abito', english: 'suit', category: 'clothing' },
          { italian: 'passi', english: 'steps', category: 'movement' },
          { italian: 'cinquanta', english: 'fifty', category: 'numbers' },
          { italian: 'dieci mila', english: 'ten thousand', category: 'numbers' },
          { italian: 'passeggiare', english: 'to walk', category: 'verbs' },
          { italian: 'alberi', english: 'trees', category: 'nature' }
        ]
      },
      grammar: {
        vocabulary: [
          { italian: 'ne', english: 'of it/them', note: 'Pronoun referring to quantity' },
          { italian: 'lo', english: 'it (masculine)', note: 'Direct object pronoun' },
          { italian: 'la', english: 'it (feminine)', note: 'Direct object pronoun' },
          { italian: 'li', english: 'them (masculine)', note: 'Direct object pronoun' },
          { italian: 'le', english: 'them (feminine)', note: 'Direct object pronoun' }
        ],
        phrases: [
          { italian: 'Ne voglio un po\'', english: 'I want some of it' },
          { italian: 'Lo prendo', english: 'I take it' },
          { italian: 'La preferisco', english: 'I prefer it' }
        ]
      }
    };
    this.selectedMatches = new Map();
  }

  generateQuiz(topic, type = 'mixed') {
    const data = this.quizData[topic];
    if (!data) return null;

    const allQuizTypes = ['multipleChoice', 'matching', 'fillBlank', 'flashcard', 'letterPicker', 'wordOrder', 'audioQuiz'];

    let selectedType = type;
    if (type === 'mixed') {
      // Filter out recently used types for variety
      const availableTypes = allQuizTypes.filter(qType => !this.recentQuizTypes.includes(qType));

      if (availableTypes.length > 0) {
        selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      } else {
        // If all types have been used recently, pick randomly but avoid the most recent
        const typesToAvoid = this.recentQuizTypes.slice(-1); // Avoid just the last one
        const lessRecentTypes = allQuizTypes.filter(qType => !typesToAvoid.includes(qType));
        selectedType = lessRecentTypes.length > 0 ? 
          lessRecentTypes[Math.floor(Math.random() * lessRecentTypes.length)] :
          allQuizTypes[Math.floor(Math.random() * allQuizTypes.length)];
      }

      // Track this type
      this.recentQuizTypes.push(selectedType);
      if (this.recentQuizTypes.length > this.maxRecentTypes) {
        this.recentQuizTypes.shift(); // Remove oldest
      }
    }

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
      case 'wordOrder':
        return this.generateWordOrder(data);
      case 'audioQuiz':
        return this.generateAudioQuiz(data);
      default:
        return this.generateMultipleChoice(data);
    }
  }

  generateWordOrder(data) {
    const phrases = data.phrases || data.expressions || [];
    if (phrases.length === 0) return null;

    const item = phrases[Math.floor(Math.random() * phrases.length)];
    const words = item.italian.split(' ');
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    return {
      type: 'wordOrder',
      question: `Arrange these words to form: "${item.english}"`,
      words: shuffledWords,
      correct: item.italian,
      translation: item.english,
      note: item.note
    };
  }

  generateAudioQuiz(data) {
    const vocab = data.vocabulary || [];
    if (vocab.length === 0) return null;

    const item = vocab[Math.floor(Math.random() * vocab.length)];

    return {
      type: 'audioQuiz',
      question: `Listen and type what you hear:`,
      word: item.italian,
      english: item.english,
      hint: `Translation: "${item.english}"`,
      pronunciation: this.getPhoneticSpelling(item.italian)
    };
  }

  getPhoneticSpelling(word) {
    const phoneticMap = {
      'primavera': 'pree-mah-VEH-rah',
      'estate': 'eh-STAH-teh',
      'autunno': 'ah-TOON-noh',
      'inverno': 'een-VEHR-noh',
      'formaggio': 'for-MAH-joh',
      'pomodori': 'po-mo-DOH-ree',
      'parmigiano': 'par-mee-JAH-noh'
    };
    return phoneticMap[word.toLowerCase()] || word;
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

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      type: 'multipleChoice',
      question: `What is the Italian word for "${correct.english}"?`,
      options: options.map(opt => opt.italian),
      correct: correct.italian,
      explanation: `"${correct.italian}" means "${correct.english}" in English. ${correct.etymology || ''} ${correct.lesson ? `You learned this in ${correct.lesson}.` : ''}`
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
    const phrases = data.phrases || data.expressions || [];
    if (phrases.length === 0) return null;

    const item = phrases[Math.floor(Math.random() * phrases.length)];
    const words = item.italian.split(' ');
    const blankIndex = Math.floor(Math.random() * words.length);
    const correctWord = words[blankIndex];

    words[blankIndex] = '_____';

    return {
      type: 'fillBlank',
      question: `Fill in the blank: ${words.join(' ')}`,
      hint: `Translation: "${item.english}"`,
      correct: correctWord.toLowerCase(),
      explanation: `Complete sentence: "${item.italian}" means "${item.english}". ${item.note || ''} ${item.lesson ? `This was covered in ${item.lesson}.` : ''}`
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
      color: item.color,
      etymology: item.etymology
    };
  }

  // Add missing setupWordOrderEventListeners function
  setupWordOrderEventListeners() {
    const wordButtons = document.querySelectorAll('.word-btn');
    wordButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!e.target.disabled) {
          const word = e.target.dataset.word || e.target.textContent;
          this.selectWord(word, e.target);
        }
      });
    });
  }

  generateLetterPicker(data) {
    const vocab = data.vocabulary || [];
    if (vocab.length === 0) return null;

    const item = vocab[Math.floor(Math.random() * vocab.length)];
    const word = item.italian.toLowerCase();
    const letters = word.split('');

    const extraLetters = 'abcdefghilmnopqrstuvz'.split('').filter(l => !letters.includes(l));
    const allLetters = [...letters, ...extraLetters.slice(0, 6)].sort(() => Math.random() - 0.5);

    return {
      type: 'letterPicker',
      question: `Spell "${item.english}" in Italian by clicking the letters:`,
      letters: allLetters,
      correct: word,
      hint: `${word.length} letters`,
      explanation: `"${item.italian}" means "${item.english}". ${item.etymology || ''}`
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
      case 'wordOrder':
        html = this.renderWordOrder(quiz);
        break;
      case 'audioQuiz':
        html = this.renderAudioQuiz(quiz);
        break;
    }

    container.innerHTML = html;
    this.currentQuiz = quiz;

    // Set up event listeners based on quiz type
    setTimeout(() => {
      if (quiz.type === 'matching') {
        this.setupMatchingEventListeners();
      } else if (quiz.type === 'wordOrder') {
        this.setupWordOrderEventListeners();
      }
    }, 100);

    // Add Enter key support for text inputs
    setTimeout(() => {
      const textInputs = container.querySelectorAll('.quiz-input, .audio-input, .fill-blank, .letter-picker-text-input');
      textInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const checkButton = e.target.closest('.quiz-question').querySelector('.quiz-check');
            if (checkButton && checkButton.style.display !== 'none') {
              checkButton.click();
            }
          }
        });
      });

      // Special handling for letter picker text input
      const letterPickerInput = container.querySelector('.letter-picker-text-input');
      if (letterPickerInput) {
        letterPickerInput.addEventListener('input', (e) => {
          // Clear the letter picker answer when user types
          const letterAnswer = container.querySelector('.letter-picker-answer');
          if (letterAnswer && e.target.value.length > 0) {
            letterAnswer.textContent = '';
            // Also clear/disable letter buttons to show user is typing instead
            container.querySelectorAll('.letter-btn').forEach(btn => {
              btn.style.opacity = e.target.value.length > 0 ? '0.3' : '1';
            });
          }
        });
      }
    }, 100);
  }

  renderMultipleChoice(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <div class="quiz-options">
          ${quiz.options.map((option, index) => `
            <button class="quiz-option" onclick="quizSystem.selectOption('${option}', this)">${option}</button>
          `).join('')}
        </div>
        <button class="quiz-check" onclick="quizSystem.checkMultipleChoice()" style="display: none;">
          <i class="fas fa-check"></i> Check Answer
        </button>
        <div class="quiz-feedback" style="display: none;"></div>
      </div>
    `;
  }

  renderMatching(quiz) {
    return `
      <div class="quiz-question">
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
        <div class="quiz-feedback" style="display: none;"></div>
        <button class="quiz-check" onclick="quizSystem.checkMatching()">Check Answers</button>
      </div>
    `;
  }

  renderFillBlank(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <p class="quiz-hint"><em>${quiz.hint}</em></p>
        <input type="text" class="quiz-input fill-blank" placeholder="Type your answer...">
        <div class="quiz-feedback" style="display: none;"></div>
        <button class="quiz-check" onclick="quizSystem.checkFillBlank()">Check Answer</button>
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
            ${quiz.etymology ? `<div class="flashcard-etymology">${quiz.etymology}</div>` : ''}
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="quiz-option incorrect" onclick="quizSystem.flashcardResult(false)">Need More Practice</button>
          <button class="quiz-option correct" onclick="quizSystem.flashcardResult(true)">Got It!</button>
        </div>
      </div>
    `;
  }

  renderLetterPicker(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <div class="letter-picker-hint">${quiz.hint}</div>
        <div class="letter-picker-input-mode">
          <strong>Type directly:</strong> <input type="text" class="letter-picker-text-input" placeholder="Type the word here..." maxlength="${quiz.correct.length}">
          <br><br><strong>Or click letters below:</strong>
        </div>
        <div class="letter-picker-answer" data-correct="${quiz.correct}"></div>
        <div class="letter-picker-letters">
          ${quiz.letters.map(letter => `
            <button class="letter-btn" onclick="quizSystem.pickLetter('${letter}', this)">${letter}</button>
          `).join('')}
        </div>
        <div class="letter-picker-controls">
          <button class="quiz-option" onclick="quizSystem.clearLetters()">Clear Letters</button>
          <button class="quiz-check" onclick="quizSystem.checkLetterPicker()">
            <i class="fas fa-check"></i> Check Answer
          </button>
        </div>
        <div class="quiz-feedback" style="display: none;"></div>
      </div>
    `;
  }

  renderWordOrder(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <div class="word-order-container">
          <div class="word-bank">
            <h5>Available Words:</h5>
            <div class="word-bank-words">
              ${quiz.words.map((word, index) => `
                <button class="word-btn" data-word="${word}" data-index="${index}">${word}</button>
              `).join('')}
            </div>
          </div>
          <div class="answer-area">
            <h5>Your Answer:</h5>
            <div class="word-order-answer"></div>
            <div class="word-order-controls">
              <button class="quiz-option" onclick="quizSystem.clearWordOrder()">Clear</button>
              <button class="quiz-check" onclick="quizSystem.checkWordOrder()">
                <i class="fas fa-check"></i> Check Answer
              </button>
            </div>
          </div>
        </div>
        <div class="quiz-feedback" style="display: none;"></div>
      </div>
    `;
  }

  renderAudioQuiz(quiz) {
    return `
      <div class="quiz-question">
        <h4>${quiz.question}</h4>
        <div class="audio-quiz-container">
          <div class="pronunciation-guide">
            <button class="audio-play-btn" onclick="quizSystem.playAudio('${quiz.word}')">
              <i class="fas fa-volume-up"></i> Play Audio
            </button>
            <div class="phonetic-hint">Pronunciation: ${quiz.pronunciation}</div>
          </div>
          <input type="text" class="quiz-input audio-input" placeholder="Type what you hear...">
          <div class="audio-hint">${quiz.hint}</div>
          <button class="quiz-check" onclick="quizSystem.checkAudioQuiz()">
            <i class="fas fa-check"></i> Check Answer
          </button>
        </div>
        <div class="quiz-feedback" style="display: none;"></div>
      </div>
    `;
  }

  setupMatchingEventListeners() {
    document.querySelectorAll('.match-item').forEach(item => {
      item.addEventListener('click', (e) => this.handleMatchClick(e.target));
    });
  }

  setupWordOrderEventListeners() {
    const wordButtons = document.querySelectorAll('.word-btn');
    wordButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!e.target.disabled) {
          const word = e.target.dataset.word || e.target.textContent;
          this.selectWord(word, e.target);
        }
      });
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
    currentQuestion.querySelectorAll('.quiz-option.selected').forEach(opt => opt.classList.remove('selected'));

    button.classList.add('selected');
    this.selectedAnswer = answer;

    const checkButton = currentQuestion.querySelector('.quiz-check');
    if (checkButton) {
      checkButton.style.display = 'inline-flex';
    }
  }

  addContinueButton(feedback) {
      const continueButton = document.createElement('button');
      continueButton.className = 'quiz-continue-btn';
      continueButton.innerHTML = '<i class="fas fa-forward"></i> Continue';
      continueButton.onclick = () => {
          this.addNextQuestion();
      };
      feedback.appendChild(continueButton);
  }

  checkMultipleChoice() {
    if (!this.selectedAnswer) return;

    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    const currentQuestion = document.querySelector('.quiz-option.selected').closest('.quiz-question');
    const feedback = currentQuestion.querySelector('.quiz-feedback');
    const selectedButton = currentQuestion.querySelector('.quiz-option.selected');
    const checkButton = currentQuestion.querySelector('.quiz-check');

    currentQuestion.querySelectorAll('.quiz-option').forEach(btn => btn.disabled = true);

    if (isCorrect) {
      selectedButton.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Correct! ${this.currentQuiz.explanation || ''}</div>`;
      this.score++;
    } else {
      selectedButton.classList.add('incorrect');
      currentQuestion.querySelectorAll('.quiz-option').forEach(btn => {
        if (btn.textContent === this.currentQuiz.correct) {
          btn.classList.add('correct');
        }
      });
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "${this.currentQuiz.correct}". ${this.currentQuiz.explanation || ''}</div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    feedback.appendChild(scoreDisplay);

    // Don't auto-advance - let user control when to continue
    this.addContinueButton(feedback);
  }

  checkMatching() {
    const matchedItems = document.querySelectorAll('.match-item.matched');
    const totalItems = document.querySelectorAll('.match-item.italian').length;
    const feedback = document.querySelector('.quiz-feedback');
    const checkButton = document.querySelector('.quiz-check');

    const isFullyMatched = matchedItems.length === totalItems * 2;

    if (isFullyMatched) {
      feedback.innerHTML = `<div class="correct-feedback">
        <i class="fas fa-check"></i> Perfect! All matches are correct! 
        <br><br><strong>What you learned:</strong>
        <ul style="text-align: left; margin: 1rem 0;">
          <li><strong>Primavera</strong> (spring) - From Latin "prima" (first) + "vera" (spring)</li>
          <li><strong>Estate</strong> (summer) - From Latin "aestas", related to "estival"</li>
          <li><strong>Autunno</strong> (autumn) - Direct cognate with English "autumn"</li>
          <li><strong>Inverno</strong> (winter) - From Latin "hibernus", like "hibernate"</li>
        </ul>
        These seasonal words are essential for expressing preferences in Italian!
      </div>`;
      this.score++;
    } else {
      const correctMatches = matchedItems.length / 2;
      feedback.innerHTML = `<div class="incorrect-feedback">
        <i class="fas fa-times"></i> You matched ${correctMatches} out of ${totalItems} correctly. 
        <br><br><strong>Remember:</strong> Each Italian season has fascinating etymology:
        <ul style="text-align: left; margin: 1rem 0;">
          <li><strong>Primavera</strong> = spring (literally "first spring")</li>
          <li><strong>Estate</strong> = summer (from Latin for heat/warmth)</li>
          <li><strong>Autunno</strong> = autumn (harvest time)</li>
          <li><strong>Inverno</strong> = winter (hibernation time)</li>
        </ul>
        Keep practicing - you're learning Italian vocabulary!
      </div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    if (checkButton) checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    feedback.appendChild(scoreDisplay);

    this.addContinueButton(feedback);
  }

  checkFillBlank() {
    const input = document.querySelector('.fill-blank');
    const answer = input.value.toLowerCase().trim();
    const isCorrect = answer === this.currentQuiz.correct;
    const feedback = document.querySelector('.quiz-feedback');
    const checkButton = document.querySelector('.quiz-check');

    if (isCorrect) {
      input.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Excellent! ${this.currentQuiz.explanation || ''}</div>`;
      this.score++;
    } else {
      input.classList.add('incorrect');
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Not quite. The correct answer is "${this.currentQuiz.correct}". ${this.currentQuiz.explanation || ''}</div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    feedback.appendChild(scoreDisplay);

    // Don't auto-advance - let user control when to continue
    this.addContinueButton(feedback);
  }

  checkLetterPicker() {
    const textInput = document.querySelector('.letter-picker-text-input');
    const letterAnswer = document.querySelector('.letter-picker-answer').textContent.toLowerCase();
    const correct = document.querySelector('.letter-picker-answer').dataset.correct;

    // Check both input methods - typed text takes priority
    const typedAnswer = textInput.value.toLowerCase().trim();
    const finalAnswer = typedAnswer || letterAnswer;
    const isCorrect = finalAnswer === correct;

    const feedback = document.querySelector('.quiz-feedback');
    const checkButton = document.querySelector('.quiz-check');

    // Disable inputs
    textInput.disabled = true;
    document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);

    if (isCorrect) {
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Perfect spelling! "${correct}" is correct! ${this.currentQuiz.explanation || ''}</div>`;
      this.score++;
      if (typedAnswer) {
        textInput.classList.add('correct');
      }
    } else {
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> The correct spelling is "${correct}". You answered: "${finalAnswer}". ${this.currentQuiz.explanation || ''}</div>`;
      if (typedAnswer) {
        textInput.classList.add('incorrect');
      }
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    feedback.appendChild(scoreDisplay);

    // Don't auto-advance - let user control when to continue
    this.addContinueButton(feedback);
  }

  flashcardResult(correct) {
    if (correct) {
      this.score++;
    }
    this.totalQuestions++;

    const controls = document.querySelector('.flashcard-controls');
    const feedback = document.createElement('div');
    feedback.className = 'quiz-feedback';
    feedback.style.display = 'block';
    feedback.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    controls.parentNode.insertBefore(feedback, controls.nextSibling);
    controls.style.display = 'none';
     this.addContinueButton(feedback);
  }

  checkWordOrder() {
    const selectedWords = Array.from(document.querySelectorAll('.selected-word')).map(span => span.textContent);
    const answer = selectedWords.join(' ');
    const isCorrect = answer === this.currentQuiz.correct;
    const feedback = document.querySelector('.quiz-feedback');
    const checkButton = document.querySelector('.quiz-check');

    // Disable all word buttons to prevent further clicking
    document.querySelectorAll('.word-btn').forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
    });

    if (isCorrect) {
      feedback.innerHTML = `<div class="correct-feedback">
        <i class="fas fa-check"></i> Perfect! "${answer}" is correct! 
        <br><br><strong>Grammar note:</strong> ${this.currentQuiz.note || ''}
        <br><strong>Remember:</strong> "Preferisco" comes from Latin "praeferre" - just like English "prefer"! 
        This sentence structure is essential for expressing preferences in Italian.
      </div>`;
      this.score++;
    } else {
      feedback.innerHTML = `<div class="incorrect-feedback">
        <i class="fas fa-times"></i> The correct order is: "<strong>${this.currentQuiz.correct}</strong>"
        <br>You wrote: "${answer}"
        <br><br><strong>Grammar tip:</strong> ${this.currentQuiz.note || ''}
        <br><strong>Word order in Italian:</strong> Subject + Verb + Object (like English). "Preferisco" means "I prefer".
      </div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    feedback.appendChild(scoreDisplay);

    this.addContinueButton(feedback);
  }

  checkAudioQuiz() {
    const input = document.querySelector('.audio-input');
    const answer = input.value.toLowerCase().trim();
    const correct = this.currentQuiz.word.toLowerCase();
    const isCorrect = answer === correct;
    const feedback = document.querySelector('.quiz-feedback');
    const checkButton = document.querySelector('.quiz-check');

    if (isCorrect) {
      input.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Excellent listening! You heard "${correct}" correctly!</div>`;
      this.score++;
    } else {
      input.classList.add('incorrect');
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> The word was "${correct}" (${this.currentQuiz.english}). Listen again and practice!</div>`;
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    feedback.appendChild(scoreDisplay);

    // Don't auto-advance - let user control when to continue
    this.addContinueButton(feedback);
  }

  addNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const existingQuestions = currentContainer.querySelectorAll('.quiz-question');
    if (existingQuestions.length >= 2) {
      existingQuestions[0].remove();
    }

    const containerId = currentContainer.id;
    const topicIndex = containerId.replace('quiz', '');
    const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar']; // Reordered to match HTML quiz order
    const topic = topics[topicIndex] || 'seasons';
    const nextQuiz = this.generateQuiz(topic);

    if (nextQuiz) {
      const nextQuestionDiv = document.createElement('div');
      nextQuestionDiv.className = 'quiz-question';
      nextQuestionDiv.style.marginTop = '2rem';
      nextQuestionDiv.style.paddingTop = '2rem';
      nextQuestionDiv.style.borderTop = '2px solid #e9ecef';

      let html = '';
      switch (nextQuiz.type) {
        case 'multipleChoice':
          html = this.renderMultipleChoice(nextQuiz);
          break;
        case 'matching':
          html = this.renderMatching(nextQuiz);
          break;
        case 'fillBlank':
          html = this.renderFillBlank(nextQuiz);
          break;
        case 'flashcard':
          html = this.renderFlashcard(nextQuiz);
          break;
        case 'letterPicker':
          html = this.renderLetterPicker(nextQuiz);
          break;
        case 'wordOrder':
          html = this.renderWordOrder(nextQuiz);
          break;
        case 'audioQuiz':
          html = this.renderAudioQuiz(nextQuiz);
          break;
      }

      nextQuestionDiv.innerHTML = html;
      currentContainer.appendChild(nextQuestionDiv);

      nextQuestionDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

      this.currentQuiz = nextQuiz;

      if (nextQuiz.type === 'matching') {
        this.setupMatchingEventListeners();
      } else if (nextQuiz.type === 'wordOrder') {
        this.setupWordOrderEventListeners();
      }

      // Add Enter key support for new question
      setTimeout(() => {
        const textInputs = nextQuestionDiv.querySelectorAll('.quiz-input, .audio-input, .fill-blank');
        textInputs.forEach(input => {
          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              const checkButton = e.target.closest('.quiz-question').querySelector('.quiz-check');
              if (checkButton && checkButton.style.display !== 'none') {
                checkButton.click();
              }
            }
          });
        });
      }, 100);
    }
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

  selectWord(word, button) {
    // Prevent selecting already disabled buttons
    if (button.disabled) return;

    const answerArea = document.querySelector('.word-order-answer');
    const wordSpan = document.createElement('span');
    wordSpan.className = 'selected-word';
    wordSpan.textContent = word;
    wordSpan.onclick = () => this.removeWord(wordSpan, button);
    answerArea.appendChild(wordSpan);

    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
  }

  removeWord(wordSpan, originalButton) {
    wordSpan.remove();
    originalButton.disabled = false;
    originalButton.style.opacity = '1';
    originalButton.style.cursor = 'pointer';
  }

  clearWordOrder() {
    document.querySelector('.word-order-answer').innerHTML = '';
    document.querySelectorAll('.word-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
    });
  }

  playAudio(word) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'it-IT';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert(`Listen carefully: ${word}`);
    }
  }

  startQuiz(topicIndex) {
    const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar']; // Reordered to match HTML quiz order
    const topic = topics[topicIndex] || 'seasons';
    const quiz = this.generateQuiz(topic);

    if (quiz) {
      this.renderQuiz(quiz, `quiz${topicIndex}`);
    }
  }

  showScore() {
    return `Score: ${this.score}/${this.totalQuestions} (${Math.round((this.score/this.totalQuestions) * 100)}%)`;
  }

  endQuiz() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const finalScore = document.createElement('div');
    finalScore.className = 'quiz-final-score';
    finalScore.innerHTML = `
      <div class="final-score-content">
        <h3><i class="fas fa-trophy"></i> Quiz Complete!</h3>
        <div class="final-score">${this.showScore()}</div>
        <p>Great job practicing Italian! Keep it up!</p>
        <button class="quiz-restart-btn" onclick="location.reload()">
          <i class="fas fa-redo"></i> Start New Quiz
        </button>
      </div>
    `;

    currentContainer.innerHTML = '';
    currentContainer.appendChild(finalScore);
  }

  renderImageQuiz(quiz) {
    let imageDisplay = '';

    switch (quiz.subtype) {
      case 'identify':
        imageDisplay = `
          <div class="image-quiz-display">
            <div class="quiz-image-large">${quiz.image}</div>
            ${quiz.icon ? `<div class="quiz-icon"><i class="fas fa-${quiz.icon}" style="color: ${quiz.color}; font-size: 2rem;"></i></div>` : ''}
          </div>
        `;
        break;
      case 'scene':
        imageDisplay = `
          <div class="image-quiz-display">
            <div class="scene-description">${quiz.scene}</div>
            <div class="quiz-image-large">${quiz.image}</div>
          </div>
        `;
        break;
      case 'emoji':
        imageDisplay = `
          <div class="image-quiz-display">
            <div class="quiz-emoji-large">${quiz.image}</div>
          </div>
        `;
        break;
    }

    return `
      <div class="quiz-question image-quiz-question">
        <h4>${quiz.question}</h4>
        ${imageDisplay}
        <div class="quiz-options">
          ${quiz.options.map((option, index) => `
            <button class="quiz-option" onclick="quizSystem.selectOption('${option}', this)">${option}</button>
          `).join('')}
        </div>
        <button class="quiz-check" onclick="quizSystem.checkMultipleChoice()" style="display: none;">
          <i class="fas fa-check"></i> Check Answer
        </button>
        <div class="quiz-feedback" style="display: none;"></div>
      </div>
    `;
  }
}

const quizSystem = new QuizSystem();

function toggleQuiz(id) {
  const block = document.getElementById(id);
  const isHidden = block.classList.contains('hidden');

  document.querySelectorAll('.quiz-block').forEach(q => q.classList.add('hidden'));

  if (isHidden) {
    block.classList.remove('hidden');
    const topicIndex = id.replace('quiz', '');
    quizSystem.startQuiz(topicIndex);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.quiz-button').forEach(button => { // Renamed the quiz buttons
    button.textContent = 'Endless Quiz!';
  });

  document.querySelectorAll('.vocab-list li').forEach(item => {
    const text = item.textContent;

    // Search through all available quiz data sections safely
    let etymologyData = null;
    
    // Check if quizSystem and quizData exist
    if (quizSystem && quizSystem.quizData) {
      // Check extraVocabulary first
      if (quizSystem.quizData.extraVocabulary && quizSystem.quizData.extraVocabulary.vocabulary) {
        etymologyData = quizSystem.quizData.extraVocabulary.vocabulary.find(v => 
          v && v.italian && text.toLowerCase().includes(v.italian.toLowerCase())
        );
      }
      
      // Check vocabulary section
      if (!etymologyData && quizSystem.quizData.vocabulary && quizSystem.quizData.vocabulary.vocabulary) {
        etymologyData = quizSystem.quizData.vocabulary.vocabulary.find(v =>
          v && v.italian && text.toLowerCase().includes(v.italian.toLowerCase())
        );
      }
      
      // Check seasons section
      if (!etymologyData && quizSystem.quizData.seasons && quizSystem.quizData.seasons.vocabulary) {
        etymologyData = quizSystem.quizData.seasons.vocabulary.find(v =>
          v && v.italian && text.toLowerCase().includes(v.italian.toLowerCase())
        );
      }
    }

    if (etymologyData && etymologyData.etymology) {
      item.title = etymologyData.etymology;
      item.style.cursor = 'help';
    }
  });

  // Add smooth scrolling to quiz buttons
  document.querySelectorAll('.quiz-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const quizId = this.getAttribute('data-quiz');
      const targetElement = document.getElementById(quizId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.error('Target quiz element not found.');
      }
    });
  });
});