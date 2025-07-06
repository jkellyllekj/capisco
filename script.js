
// Initialize interactive vocab elements
function initializeVocabInteractions() {
  // Initialize info buttons
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showInfoTooltip(btn);
    });

    btn.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      showInfoTooltip(btn);
    });

    btn.addEventListener('mouseleave', (e) => {
      hideInfoTooltip();
    });
  });

  // Initialize speaker buttons
  document.querySelectorAll('.speaker-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const italian = btn.getAttribute('data-italian');
      if (italian) {
        playItalianAudio(italian);
      }
    });

    btn.addEventListener('mouseenter', (e) => {
      const italian = btn.getAttribute('data-italian');
      if (italian) {
        playItalianAudio(italian);
      }
    });
  });
}

function showInfoTooltip(btn) {
  hideInfoTooltip();

  const info = btn.getAttribute('data-info');
  const gender = btn.getAttribute('data-gender');
  const plural = btn.getAttribute('data-plural');
  const singular = btn.getAttribute('data-singular');

  if (!info) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'info-tooltip';
  
  let genderInfo = '';
  if (gender || plural || singular) {
    genderInfo = '<div class="gender-info">';
    if (gender) {
      const genderClass = gender === 'm' ? 'masculine' : 'feminine';
      const genderText = gender === 'm' ? 'Masculine (il/lo)' : 'Feminine (la)';
      genderInfo += `<div><strong>Gender:</strong> <span class="gender-${genderClass}">${genderText}</span></div>`;
    }
    if (singular) {
      genderInfo += `<div><strong>Singular:</strong> ${singular}</div>`;
    }
    if (plural) {
      genderInfo += `<div><strong>Plural:</strong> ${plural}</div>`;
    }
    genderInfo += '</div>';
  }

  tooltip.innerHTML = `<div class="info-content">${info}</div>${genderInfo}`;
  document.body.appendChild(tooltip);

  const btnRect = btn.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  let left = btnRect.left + scrollLeft + (btnRect.width / 2) - (tooltipRect.width / 2);
  let top = btnRect.top + scrollTop - tooltipRect.height - 10;

  if (left < 10) left = 10;
  if (left + tooltipRect.width > window.innerWidth - 10) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  if (top < scrollTop + 10) {
    top = btnRect.bottom + scrollTop + 10;
  }

  tooltip.style.position = 'absolute';
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.classList.add('show');
}

function hideInfoTooltip() {
  const existingTooltip = document.querySelector('.info-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
}

function playItalianAudio(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Ensure voices are loaded
    function setVoice() {
      const voices = speechSynthesis.getVoices();
      
      // Debug: log available voices (can be removed later)
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      
      // Try to find the best Italian voice
      let italianVoice = voices.find(voice => 
        voice.lang === 'it-IT' && voice.localService === true
      ) || voices.find(voice => 
        voice.lang === 'it-IT'
      ) || voices.find(voice => 
        voice.lang.startsWith('it')
      );
      
      if (italianVoice) {
        utterance.voice = italianVoice;
        console.log('Selected Italian voice:', italianVoice.name, italianVoice.lang);
      } else {
        console.log('No Italian voice found, using default with it-IT lang');
      }
      
      speechSynthesis.speak(utterance);
    }

    // Voices might not be loaded immediately
    if (speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
    }
  } else {
    console.log('Would play audio for: ' + text);
    alert('Audio not supported. Text: ' + text);
  }
}

class QuizSystem {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.questionsAnswered = 0;
    this.autoNextEnabled = true;
    this.recentQuizTypes = [];
    this.maxRecentTypes = 3;
    this.spacedRepetition = new Map();
    this.difficultyLevel = 'improver';
    this.currentKeyboardInput = '';
    this.selectedMatches = new Map();
    this.selectedAnswer = null;
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
          { italian: 'panini', english: 'bread rolls', category: 'bread' },
          { italian: 'pane', english: 'bread', category: 'bread' },
          { italian: 'pasta', english: 'pasta', category: 'bread' },
          { italian: 'riso', english: 'rice', category: 'bread' },
          { italian: 'cocomero', english: 'watermelon', category: 'fruit' },
          { italian: 'pesche', english: 'peaches', category: 'fruit' },
          { italian: 'mele', english: 'apples', category: 'fruit' },
          { italian: 'banane', english: 'bananas', category: 'fruit' },
          { italian: 'arance', english: 'oranges', category: 'fruit' },
          { italian: 'uva', english: 'grapes', category: 'fruit' },
          { italian: 'patate', english: 'potatoes', category: 'vegetables' },
          { italian: 'pomodori', english: 'tomatoes', category: 'vegetables' },
          { italian: 'carote', english: 'carrots', category: 'vegetables' },
          { italian: 'insalata', english: 'lettuce', category: 'vegetables' },
          { italian: 'cipolle', english: 'onions', category: 'vegetables' },
          { italian: 'pesce', english: 'fish', category: 'protein' },
          { italian: 'salmone', english: 'salmon', category: 'protein' },
          { italian: 'pollo', english: 'chicken', category: 'protein' },
          { italian: 'manzo', english: 'beef', category: 'protein' },
          { italian: 'formaggio', english: 'cheese', category: 'dairy' },
          { italian: 'parmigiano', english: 'parmesan', category: 'dairy' },
          { italian: 'mozzarella', english: 'mozzarella', category: 'dairy' },
          { italian: 'latte', english: 'milk', category: 'dairy' },
          { italian: 'burro', english: 'butter', category: 'dairy' }
        ]
      },
      expressions: {
        expressions: [
          { italian: 'Vorrei...', english: 'I would like...', category: 'asking' },
          { italian: 'Quanto costa?', english: 'How much does it cost?', category: 'asking' },
          { italian: 'Quanto costano?', english: 'How much do they cost?', category: 'asking' },
          { italian: 'Posso assaggiare?', english: 'Can I taste it?', category: 'asking' },
          { italian: 'Quanto ne vuole?', english: 'How much do you want?', category: 'asking' },
          { italian: 'Questo è tutto', english: 'That\'s all', category: 'asking' },
          { italian: 'Un chilo di...', english: 'A kilo of...', category: 'quantity' },
          { italian: 'Mezzo chilo', english: 'Half a kilo', category: 'quantity' },
          { italian: 'Tre etti', english: '300 grams', category: 'quantity' },
          { italian: 'Un etto', english: '100 grams', category: 'quantity' },
          { italian: 'Una dozzina', english: 'A dozen', category: 'quantity' },
          { italian: 'Un pezzo', english: 'One piece', category: 'quantity' },
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
  }

  generateQuiz(topic, type) {
    const data = this.quizData[topic];
    if (!data) return null;

    const allQuizTypes = ['multipleChoice', 'matching', 'fillBlank', 'flashcard'];
    let selectedType = type || 'mixed';

    if (selectedType === 'mixed') {
      const availableTypes = allQuizTypes.filter(qType => !this.recentQuizTypes.includes(qType));
      if (availableTypes.length > 0) {
        selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      } else {
        selectedType = allQuizTypes[Math.floor(Math.random() * allQuizTypes.length)];
      }

      this.recentQuizTypes.push(selectedType);
      if (this.recentQuizTypes.length > this.maxRecentTypes) {
        this.recentQuizTypes.shift();
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

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = options[i];
      options[i] = options[j];
      options[j] = temp;
    }

    return {
      type: 'multipleChoice',
      question: 'What is the Italian word for "' + correct.english + '"?',
      options: options.map(opt => opt.italian),
      correct: correct.italian,
      explanation: '"' + correct.italian + '" means "' + correct.english + '" in English.'
    };
  }

  generateMatching(data) {
    let vocab = [];
    if (data && data.vocabulary && Array.isArray(data.vocabulary)) {
      vocab = data.vocabulary.slice(0, 4);
    } else if (data && data.phrases && Array.isArray(data.phrases)) {
      vocab = data.phrases.slice(0, 4);
    }

    if (!vocab || vocab.length < 3) return null;

    const validVocab = vocab.filter(v => v && v.italian && v.english);
    if (validVocab.length < 3) return null;

    const shuffledEnglish = validVocab.map(v => v.english).sort(() => Math.random() - 0.5);

    const correct = {};
    for (let i = 0; i < validVocab.length; i++) {
      correct[validVocab[i].italian] = validVocab[i].english;
    }

    return {
      type: 'matching',
      question: 'Match the Italian words with their English translations:',
      italian: validVocab.map(v => v.italian),
      english: shuffledEnglish,
      correct: correct
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
      question: 'Fill in the blank: ' + words.join(' '),
      hint: 'Translation: "' + item.english + '"',
      correct: correctWord.toLowerCase(),
      explanation: 'Complete sentence: "' + item.italian + '" means "' + item.english + '".'
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
    }

    container.innerHTML = html;
    this.currentQuiz = quiz;

    const self = this;
    setTimeout(function() {
      if (quiz.type === 'matching') {
        self.setupMatchingEventListeners();
      }
    }, 100);
  }

  renderMultipleChoice(quiz) {
    const self = this;
    let html = '<div class="quiz-question"><h4>' + quiz.question + '</h4><div class="quiz-options">';
    
    for (let i = 0; i < quiz.options.length; i++) {
      html += '<button class="quiz-option" onclick="quizSystem.selectOption(\'' + quiz.options[i] + '\', this)">' + quiz.options[i] + '</button>';
    }
    
    html += '</div><div class="quiz-feedback" style="display: none; margin-top: 1rem;"></div></div>';
    return html;
  }

  renderMatching(quiz) {
    let html = '<div class="quiz-question"><h4>' + quiz.question + '</h4><div class="matching-container">';
    html += '<div class="italian-column"><h5>Italian</h5>';
    
    for (let i = 0; i < quiz.italian.length; i++) {
      html += '<div class="match-item italian" data-word="' + quiz.italian[i] + '">' + quiz.italian[i] + '</div>';
    }
    
    html += '</div><div class="english-column"><h5>English</h5>';
    
    for (let i = 0; i < quiz.english.length; i++) {
      html += '<div class="match-item english" data-word="' + quiz.english[i] + '">' + quiz.english[i] + '</div>';
    }
    
    html += '</div></div><button class="quiz-check" onclick="quizSystem.checkMatching()">Check Answers</button>';
    html += '<div class="quiz-feedback" style="display: none; margin-top: 1rem;"></div></div>';
    return html;
  }

  renderFillBlank(quiz) {
    let html = '<div class="quiz-question"><h4>' + quiz.question + '</h4>';
    html += '<p class="quiz-hint"><em>' + quiz.hint + '</em></p>';
    html += '<input type="text" class="quiz-input fill-blank" placeholder="Type your answer...">';
    html += '<button class="quiz-check" onclick="quizSystem.checkFillBlank()">Check Answer</button>';
    html += '<div class="quiz-feedback" style="display: none; margin-top: 1rem;"></div></div>';
    return html;
  }

  renderFlashcard(quiz) {
    let html = '<div class="quiz-question"><h4>Flashcard - Click to reveal the answer</h4>';
    html += '<div class="flashcard" onclick="this.classList.toggle(\'flipped\')">';
    html += '<div class="flashcard-front">';
    
    if (quiz.icon) {
      html += '<i class="fas fa-' + quiz.icon + '" style="color: ' + quiz.color + '; font-size: 2rem;"></i>';
    }
    
    html += '<div class="flashcard-word">' + quiz.question + '</div></div>';
    html += '<div class="flashcard-back"><div class="flashcard-word">' + quiz.answer + '</div></div></div>';
    html += '<div class="flashcard-controls">';
    html += '<button class="quiz-option incorrect" onclick="quizSystem.flashcardResult(false)">Need More Practice</button>';
    html += '<button class="quiz-option correct" onclick="quizSystem.flashcardResult(true)">Got It!</button>';
    html += '</div></div>';
    return html;
  }

  setupMatchingEventListeners() {
    const self = this;
    document.querySelectorAll('.match-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        self.handleMatchClick(e.target);
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

    const selectedClass = isItalian ? 'italian' : 'english';
    const selectedItems = document.querySelectorAll('.match-item.' + selectedClass + '.selected');
    for (let i = 0; i < selectedItems.length; i++) {
      selectedItems[i].classList.remove('selected');
    }

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
        const self = this;
        setTimeout(function() {
          italianMatch.element.classList.remove('selected');
          englishMatch.element.classList.remove('selected');
        }, 500);
      }

      this.selectedMatches.clear();
    }
  }

  selectOption(answer, button) {
    if (button.disabled) return;

    const currentQuestion = button.closest('.quiz-question');
    if (!currentQuestion) return;

    const selectedOptions = currentQuestion.querySelectorAll('.quiz-option.selected');
    for (let i = 0; i < selectedOptions.length; i++) {
      selectedOptions[i].classList.remove('selected');
    }
    
    button.classList.add('selected');
    this.selectedAnswer = answer;

    const self = this;
    setTimeout(function() {
      self.checkMultipleChoice();
    }, 300);
  }

  checkMultipleChoice() {
    if (!this.selectedAnswer) return;

    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    const selectedButton = document.querySelector('.quiz-option.selected');
    if (!selectedButton) return;

    const currentQuestion = selectedButton.closest('.quiz-question');
    if (!currentQuestion) return;

    const feedback = currentQuestion.querySelector('.quiz-feedback');
    if (!feedback) return;

    const optionButtons = currentQuestion.querySelectorAll('.quiz-option');
    for (let i = 0; i < optionButtons.length; i++) {
      optionButtons[i].disabled = true;
    }

    if (isCorrect) {
      selectedButton.classList.add('correct');
      feedback.innerHTML = '<div class="correct-feedback"><i class="fas fa-check"></i> Correct! ' + (this.currentQuiz.explanation || '') + '</div>';
      this.score++;
    } else {
      selectedButton.classList.add('incorrect');
      const correctButtons = currentQuestion.querySelectorAll('.quiz-option');
      for (let i = 0; i < correctButtons.length; i++) {
        if (correctButtons[i].textContent === this.currentQuiz.correct) {
          correctButtons[i].classList.add('correct');
        }
      }
      feedback.innerHTML = '<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "' + this.currentQuiz.correct + '". ' + (this.currentQuiz.explanation || '') + '</div>';
    }

    this.totalQuestions++;
    feedback.style.display = 'block';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = '<div class="score-text">' + this.showScore() + '</div>';
    feedback.appendChild(scoreDisplay);

    this.selectedAnswer = null;
    this.autoProgressToNext(feedback);
  }

  checkMatching() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const matchedItems = currentContainer.querySelectorAll('.match-item.matched');
    const totalItems = currentContainer.querySelectorAll('.match-item.italian').length;
    const feedback = currentContainer.querySelector('.quiz-feedback');
    const checkButton = currentContainer.querySelector('.quiz-check');

    if (!feedback || !checkButton || totalItems === 0) return;

    const isFullyMatched = matchedItems.length === totalItems * 2;

    if (isFullyMatched) {
      feedback.innerHTML = '<div class="correct-feedback"><i class="fas fa-check"></i> Perfect! All matches are correct!</div>';
      this.score++;
    } else {
      const correctMatches = Math.floor(matchedItems.length / 2);
      feedback.innerHTML = '<div class="incorrect-feedback"><i class="fas fa-times"></i> You matched ' + correctMatches + ' out of ' + totalItems + ' correctly.</div>';
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = '<div class="score-text">' + this.showScore() + '</div>';
    feedback.appendChild(scoreDisplay);

    this.autoProgressToNext(feedback);
  }

  checkFillBlank() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const input = currentContainer.querySelector('.fill-blank');
    if (!input) return;

    const answer = input.value.toLowerCase().trim();
    const isCorrect = answer === this.currentQuiz.correct;
    const feedback = currentContainer.querySelector('.quiz-feedback');
    const checkButton = currentContainer.querySelector('.quiz-check');

    if (!feedback || !checkButton) return;

    if (isCorrect) {
      input.classList.add('correct');
      feedback.innerHTML = '<div class="correct-feedback"><i class="fas fa-check"></i> Excellent! ' + (this.currentQuiz.explanation || '') + '</div>';
      this.score++;
    } else {
      input.classList.add('incorrect');
      feedback.innerHTML = '<div class="incorrect-feedback"><i class="fas fa-times"></i> Not quite. The correct answer is "' + this.currentQuiz.correct + '". ' + (this.currentQuiz.explanation || '') + '</div>';
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    checkButton.style.display = 'none';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = '<div class="score-text">' + this.showScore() + '</div>';
    feedback.appendChild(scoreDisplay);

    this.autoProgressToNext(feedback);
  }

  flashcardResult(correct) {
    if (correct) {
      this.score++;
    }
    this.totalQuestions++;

    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const controls = currentContainer.querySelector('.flashcard-controls');
    if (!controls) return;

    const feedback = document.createElement('div');
    feedback.className = 'quiz-feedback';
    feedback.style.display = 'block';
    feedback.innerHTML = '<div class="score-text">' + this.showScore() + '</div>';
    controls.parentNode.insertBefore(feedback, controls.nextSibling);
    controls.style.display = 'none';
    this.autoProgressToNext(feedback);
  }

  autoProgressToNext(feedback) {
    const self = this;
    setTimeout(function() {
      self.addNextQuestion();
    }, 4000);
  }

  addNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const existingQuestions = currentContainer.querySelectorAll('.quiz-question');

    if (existingQuestions.length >= 3) {
      const oldestQuestion = existingQuestions[0];
      oldestQuestion.style.opacity = '0.5';
      oldestQuestion.style.transform = 'scale(0.95)';
      setTimeout(function() {
        oldestQuestion.remove();
      }, 1000);
    }

    const containerId = currentContainer.id;
    const topicIndex = containerId.replace('quiz', '');
    const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar'];
    const topic = topics[topicIndex] || 'seasons';
    const nextQuiz = this.generateQuiz(topic);

    if (nextQuiz) {
      const separator = document.createElement('div');
      separator.className = 'quiz-separator';
      separator.innerHTML = '<div style="text-align: center; margin: 1.5rem 0; padding: 0.75rem;"><div style="height: 2px; background: linear-gradient(to right, transparent, #e9ecef, transparent); margin: 0.75rem 0;"></div><span style="color: #6c757d; font-size: 0.9rem; background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid #e9ecef;"><i class="fas fa-arrow-down"></i> Next Question</span></div>';
      currentContainer.appendChild(separator);

      const nextQuestionDiv = document.createElement('div');
      nextQuestionDiv.className = 'quiz-question new-question';

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
      }

      nextQuestionDiv.innerHTML = html;
      currentContainer.appendChild(nextQuestionDiv);

      const self = this;
      setTimeout(function() {
        currentContainer.scrollTop = currentContainer.scrollHeight - currentContainer.clientHeight;
        nextQuestionDiv.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 20%, white 100%)';
        nextQuestionDiv.style.borderRadius = '12px';
        nextQuestionDiv.style.padding = '1.5rem';
        nextQuestionDiv.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';

        setTimeout(function() {
          nextQuestionDiv.style.background = '';
          nextQuestionDiv.style.boxShadow = '';
          nextQuestionDiv.classList.remove('new-question');
        }, 2000);
      }, 300);

      this.currentQuiz = nextQuiz;

      if (nextQuiz.type === 'matching') {
        setTimeout(function() {
          self.setupMatchingEventListeners();
        }, 400);
      }
    }
  }

  showScore() {
    const percentage = Math.round((this.score / this.totalQuestions) * 100);
    return 'Score: ' + this.score + '/' + this.totalQuestions + ' (' + percentage + '%)';
  }
}

const quizSystem = new QuizSystem();

function toggleQuiz(quizId) {
  const quiz = document.getElementById(quizId);
  if (!quiz) return;

  if (quiz.classList.contains('hidden')) {
    quiz.classList.remove('hidden');
    quiz.style.display = 'block';

    const topicIndex = quizId.replace('quiz', '');
    const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar'];
    const topic = topics[parseInt(topicIndex)] || 'vocabulary';

    quizSystem.score = 0;
    quizSystem.totalQuestions = 0;
    quizSystem.questionsAnswered = 0;

    const quizData = quizSystem.generateQuiz(topic);
    if (quizData) {
      quizSystem.renderQuiz(quizData, quizId);
    }
  } else {
    quiz.classList.add('hidden');
    quiz.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initializeVocabInteractions();

  const quizButtons = document.querySelectorAll('.quiz-btn');
  for (let i = 0; i < quizButtons.length; i++) {
    quizButtons[i].addEventListener('click', function(e) {
      e.preventDefault();
      const onclickAttr = this.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/toggleQuiz\('([^']+)'\)/);
        if (match && match[1]) {
          toggleQuiz(match[1]);
        }
      }
    });
  }
});
