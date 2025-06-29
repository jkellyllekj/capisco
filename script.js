
class QuizSystem {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.questionsAnswered = 0;
    this.autoNextEnabled = true;
    this.quizData = {
      seasons: {
        vocabulary: [
          { italian: 'primavera', english: 'spring', icon: 'seedling', color: '#28a745', etymology: 'From Latin "prima" (first) + "vera" (spring). Related to English "prime" and "vernal".' },
          { italian: 'estate', english: 'summer', icon: 'sun', color: '#ffc107', etymology: 'From Latin "aestas". Related to English "estival" (relating to summer).' },
          { italian: 'autunno', english: 'autumn', icon: 'leaf', color: '#fd7e14', etymology: 'From Latin "autumnus". Direct cognate with English "autumn".' },
          { italian: 'inverno', english: 'winter', icon: 'snowflake', color: '#17a2b8', etymology: 'From Latin "hibernus". Related to English "hibernate" (winter sleep).' }
        ],
        phrases: [
          { italian: 'Quale stagione preferisci?', english: 'Which season do you prefer?', note: 'Common conversation starter' },
          { italian: 'Preferisco la primavera', english: 'I prefer spring', note: '"Preferisco" comes from Latin - like English "prefer"!' },
          { italian: 'Mi piace l\'estate', english: 'I like summer', note: 'Literally means "summer pleases me"' }
        ]
      },
      market: {
        vocabulary: [
          { italian: 'formaggio', english: 'cheese', category: 'dairy', etymology: 'From Latin "formaticus" - related to "form" because cheese is formed/shaped. Fun fact: Italy produces over 400 types of cheese!' },
          { italian: 'pesce', english: 'fish', category: 'protein', etymology: 'From Latin "piscis" - related to English "Pisces" (fish constellation). Italy has the longest coastline in Europe!' },
          { italian: 'mele', english: 'apples', category: 'fruit', etymology: 'From Latin "malum" - appears in many languages. Italian apples are famous worldwide, especially from Alto Adige!' },
          { italian: 'pomodori', english: 'tomatoes', category: 'vegetables', etymology: 'Literally "golden apples" - "pomo" (apple) + "d\'oro" (of gold)! Originally yellow when first brought to Italy.' },
          { italian: 'pane', english: 'bread', category: 'carbs', etymology: 'From Latin "panis" - related to English "pantry" and "company" (sharing bread). Each Italian region has its own bread style!' },
          { italian: 'burro', english: 'butter', category: 'dairy', etymology: 'From Latin "butyrum" via Greek. Romans didn\'t eat much butter - they preferred olive oil!' },
          { italian: 'latte', english: 'milk', category: 'dairy', etymology: 'From Latin "lac/lactis" - related to English "lactose" and "galaxy" (milky way). Italian milk is often sold in glass bottles!' },
          { italian: 'carote', english: 'carrots', category: 'vegetables', etymology: 'From Greek "karoton". Orange carrots were developed in Holland - original carrots were purple!' },
          { italian: 'cipolle', english: 'onions', category: 'vegetables', etymology: 'From Latin "cepa". Onions were used as currency in ancient Egypt!' },
          { italian: 'patate', english: 'potatoes', category: 'vegetables', etymology: 'From Spanish "patata" from Taíno "batata". Potatoes came to Italy from the Americas in the 1500s!' }
        ],
        expressions: [
          { italian: 'Vorrei del parmigiano', english: 'I would like some parmesan', note: 'Polite way to request. "Vorrei" is conditional form.' },
          { italian: 'Quanto costa?', english: 'How much does it cost?', note: 'Essential shopping phrase. "Costa" comes from "costare" (to cost).' },
          { italian: 'Posso assaggiare?', english: 'Can I taste it?', note: 'Very common at Italian markets - vendors encourage tasting!' },
          { italian: 'È fresco?', english: 'Is it fresh?', note: 'Quality is very important in Italian food culture.' },
          { italian: 'Un chilo di...', english: 'A kilo of...', note: 'Italy uses metric system. 1 kg = about 2.2 pounds.' },
          { italian: 'Tre etti', english: '300 grams', note: 'An "etto" is 100 grams - very common measurement.' }
        ]
      }
    };
    this.selectedMatches = new Map();
  }

  generateQuiz(topic, type = 'mixed') {
    const data = this.quizData[topic];
    if (!data) return null;

    const quizTypes = ['multipleChoice', 'matching', 'fillBlank', 'flashcard', 'letterPicker', 'wordOrder', 'audioQuiz'];
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
    // Simple phonetic guide for Italian words
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
      explanation: `"${correct.italian}" means "${correct.english}" in English. ${correct.etymology || ''}`
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
      explanation: `Complete sentence: "${item.italian}" means "${item.english}". ${item.note || ''}`
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

    // Add event listeners for matching
    if (quiz.type === 'matching') {
      this.setupMatchingEventListeners();
    }
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
        <div class="quiz-controls" style="display: none;">
          <button class="quiz-end-btn" onclick="quizSystem.endQuiz()">
            <i class="fas fa-stop"></i> End After This Question
          </button>
        </div>
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
        <div class="letter-picker-answer" data-correct="${quiz.correct}"></div>
        <div class="letter-picker-letters">
          ${quiz.letters.map(letter => `
            <button class="letter-btn" onclick="quizSystem.pickLetter('${letter}', this)">${letter}</button>
          `).join('')}
        </div>
        <div class="letter-picker-controls">
          <button class="quiz-option" onclick="quizSystem.clearLetters()">Clear</button>
          <button class="quiz-check" onclick="quizSystem.checkLetterPicker()">
            <i class="fas fa-check"></i> Check Answer
          </button>
        </div>
        <div class="quiz-feedback" style="display: none;"></div>
        <div class="quiz-controls" style="display: none;">
          <button class="quiz-end-btn" onclick="quizSystem.endQuiz()">
            <i class="fas fa-stop"></i> End After This Question
          </button>
        </div>
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
              ${quiz.words.map(word => `
                <button class="word-btn" onclick="quizSystem.selectWord('${word}', this)">${word}</button>
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
        <div class="quiz-controls" style="display: none;">
          <button class="quiz-end-btn" onclick="quizSystem.endQuiz()">
            <i class="fas fa-stop"></i> End After This Question
          </button>
        </div>
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
        <div class="quiz-controls" style="display: none;">
          <button class="quiz-end-btn" onclick="quizSystem.endQuiz()">
            <i class="fas fa-stop"></i> End After This Question
          </button>
        </div>
      </div>
    `;
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

    // Deselect other items of the same type
    document.querySelectorAll(`.match-item.${isItalian ? 'italian' : 'english'}.selected`).forEach(sel => {
      sel.classList.remove('selected');
    });

    item.classList.add('selected');
    
    if (isItalian) {
      this.selectedMatches.set('italian', { element: item, word: word });
    } else {
      this.selectedMatches.set('english', { element: item, word: word });
    }

    // Check if we have both selections
    if (this.selectedMatches.has('italian') && this.selectedMatches.has('english')) {
      const italianMatch = this.selectedMatches.get('italian');
      const englishMatch = this.selectedMatches.get('english');
      
      // Check if it's a correct match
      if (this.currentQuiz.correct[italianMatch.word] === englishMatch.word) {
        italianMatch.element.classList.add('matched');
        englishMatch.element.classList.add('matched');
        italianMatch.element.classList.remove('selected');
        englishMatch.element.classList.remove('selected');
      } else {
        // Wrong match - just deselect
        setTimeout(() => {
          italianMatch.element.classList.remove('selected');
          englishMatch.element.classList.remove('selected');
        }, 500);
      }
      
      this.selectedMatches.clear();
    }
  }

  selectOption(answer, button) {
    // Remove previous selections from current question
    const currentQuestion = button.closest('.quiz-question');
    currentQuestion.querySelectorAll('.quiz-option.selected').forEach(opt => opt.classList.remove('selected'));
    
    // Mark this option as selected
    button.classList.add('selected');
    this.selectedAnswer = answer;
    
    // Show check button for this question
    const checkButton = currentQuestion.querySelector('.quiz-check');
    if (checkButton) {
      checkButton.style.display = 'inline-flex';
    }
  }

  checkMultipleChoice() {
    if (!this.selectedAnswer) return;
    
    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    const currentQuestion = document.querySelector('.quiz-option.selected').closest('.quiz-question');
    const feedback = currentQuestion.querySelector('.quiz-feedback');
    const selectedButton = currentQuestion.querySelector('.quiz-option.selected');
    const checkButton = currentQuestion.querySelector('.quiz-check');
    const controlsDiv = currentQuestion.querySelector('.quiz-controls');
    
    // Disable all option buttons in this question
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
    
    // Show score and controls
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = `<div class="score-text">${this.showScore()}</div>`;
    feedback.appendChild(scoreDisplay);
    
    // Show end quiz button
    if (controlsDiv) {
      controlsDiv.style.display = 'flex';
    }
    
    // Auto-generate next question after 3 seconds
    setTimeout(() => {
      this.addNextQuestion();
    }, 3000);
  }

  showQuizProgress() {
    const progressDiv = document.createElement('div');
    progressDiv.className = 'quiz-progress';
    progressDiv.innerHTML = `
      <div class="score-display">${this.showScore()}</div>
      <div class="quiz-controls">
        <button class="quiz-end-btn" onclick="quizSystem.endQuiz()">
          <i class="fas fa-stop"></i> End Quiz
        </button>
      </div>
    `;
    
    const feedback = document.querySelector('.quiz-feedback');
    feedback.appendChild(progressDiv);
  }

  checkMatching() {
    const matchedItems = document.querySelectorAll('.match-item.matched');
    const totalItems = document.querySelectorAll('.match-item.italian').length;
    const feedback = document.querySelector('.quiz-feedback');
    
    if (matchedItems.length === totalItems * 2) {
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Perfect! All matches are correct!</div>`;
      this.score++;
    } else {
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> You matched ${matchedItems.length / 2} out of ${totalItems} correctly. Try again!</div>`;
    }
    
    this.totalQuestions++;
    feedback.style.display = 'block';
    
    // Auto-generate next question after 2 seconds
    setTimeout(() => {
      this.addNextQuestion();
    }, 2000);
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
    document.querySelector('.quiz-check').style.display = 'none';
    
    // Auto-generate next question after 2 seconds
    setTimeout(() => {
      this.addNextQuestion();
    }, 2000);
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
    document.querySelector('.quiz-check').style.display = 'none';
    
    // Auto-generate next question after 2 seconds
    setTimeout(() => {
      this.addNextQuestion();
    }, 2000);
  }

  flashcardResult(correct) {
    if (correct) {
      this.score++;
    }
    this.totalQuestions++;
    document.querySelector('.flashcard-controls').style.display = 'none';
    
    // Auto-generate next question after 2 seconds
    setTimeout(() => {
      this.addNextQuestion();
    }, 2000);
  }

  addNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    // Hide controls from previous question
    const lastControls = currentContainer.querySelector('.quiz-controls[style*="flex"]');
    if (lastControls) {
      lastControls.style.display = 'none';
    }

    // Check if we have too many questions - keep only current and previous
    const existingQuestions = currentContainer.querySelectorAll('.quiz-question');
    if (existingQuestions.length >= 2) {
      // Remove the oldest question (first one)
      existingQuestions[0].remove();
    }

    const containerId = currentContainer.id;
    const topicIndex = containerId.replace('quiz', '');
    const topics = ['seasons', 'market', 'market', 'market', 'market'];
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
      
      // Scroll to new question
      nextQuestionDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      this.currentQuiz = nextQuiz;
      
      // Setup event listeners for interactive types
      if (nextQuiz.type === 'matching') {
        this.setupMatchingEventListeners();
      } else if (nextQuiz.type === 'wordOrder') {
        this.setupWordOrderEventListeners();
      }
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
    const answerArea = document.querySelector('.word-order-answer');
    const wordSpan = document.createElement('span');
    wordSpan.className = 'selected-word';
    wordSpan.textContent = word;
    wordSpan.onclick = () => this.removeWord(wordSpan, button);
    answerArea.appendChild(wordSpan);
    
    button.disabled = true;
    button.style.opacity = '0.5';
  }

  removeWord(wordSpan, originalButton) {
    wordSpan.remove();
    originalButton.disabled = false;
    originalButton.style.opacity = '1';
  }

  clearWordOrder() {
    document.querySelector('.word-order-answer').innerHTML = '';
    document.querySelectorAll('.word-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
    });
  }

  checkWordOrder() {
    const selectedWords = Array.from(document.querySelectorAll('.selected-word')).map(span => span.textContent);
    const answer = selectedWords.join(' ');
    const isCorrect = answer === this.currentQuiz.correct;
    const feedback = document.querySelector('.quiz-feedback');
    
    if (isCorrect) {
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Perfect! "${answer}" is correct!</div>`;
      this.score++;
    } else {
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Not quite. The correct order is: "${this.currentQuiz.correct}"</div>`;
    }
    
    this.totalQuestions++;
    feedback.style.display = 'block';
    document.querySelector('.quiz-check').style.display = 'none';
    
    // Show controls
    const controlsDiv = document.querySelector('.quiz-controls');
    if (controlsDiv) {
      controlsDiv.style.display = 'flex';
    }
    
    setTimeout(() => {
      this.addNextQuestion();
    }, 3000);
  }

  playAudio(word) {
    // Simple text-to-speech for Italian pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'it-IT';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert(`Listen carefully: ${word}`);
    }
  }

  checkAudioQuiz() {
    const input = document.querySelector('.audio-input');
    const answer = input.value.toLowerCase().trim();
    const correct = this.currentQuiz.word.toLowerCase();
    const isCorrect = answer === correct;
    const feedback = document.querySelector('.quiz-feedback');
    
    if (isCorrect) {
      input.classList.add('correct');
      feedback.innerHTML = `<div class="correct-feedback"><i class="fas fa-check"></i> Excellent! You heard "${correct}" correctly!</div>`;
      this.score++;
    } else {
      input.classList.add('incorrect');
      feedback.innerHTML = `<div class="incorrect-feedback"><i class="fas fa-times"></i> Not quite. The word was "${correct}" (${this.currentQuiz.english})</div>`;
    }
    
    this.totalQuestions++;
    feedback.style.display = 'block';
    document.querySelector('.quiz-check').style.display = 'none';
    
    // Show controls
    const controlsDiv = document.querySelector('.quiz-controls');
    if (controlsDiv) {
      controlsDiv.style.display = 'flex';
    }
    
    setTimeout(() => {
      this.addNextQuestion();
    }, 3000);
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

// Add tooltip functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add tooltips to vocabulary items
  document.querySelectorAll('.vocab-list li').forEach(item => {
    const text = item.textContent;
    const italian = text.split(' – ')[0];
    
    // Find etymology data
    const etymologyData = quizSystem.quizData.market.vocabulary.find(v => 
      text.toLowerCase().includes(v.italian.toLowerCase())
    ) || quizSystem.quizData.seasons.vocabulary.find(v => 
      text.toLowerCase().includes(v.italian.toLowerCase())
    );
    
    if (etymologyData && etymologyData.etymology) {
      item.title = etymologyData.etymology;
      item.style.cursor = 'help';
    }
  });
});
