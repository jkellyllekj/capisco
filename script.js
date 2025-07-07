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

    function setVoice() {
      const voices = speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));

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

// Enhanced Quiz System with Multiple Question Types
class QuizSystem {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.questionsAnswered = 0;
    this.selectedAnswer = null;
    this.selectedMatches = new Map();
    this.usedQuestions = new Set(); // Track used questions to avoid repetition
    this.isChecking = false; // Prevent double submissions
    this.keyboardMode = true; // Enable keyboard navigation
    this.currentHighlight = 0; // For keyboard navigation
    this.matchingSelection = { italian: null, english: null }; // For matching games
    this.quizData = {
      seasons: {
        vocabulary: [
          { italian: 'primavera', english: 'spring' },
          { italian: 'estate', english: 'summer' },
          { italian: 'autunno', english: 'autumn' },
          { italian: 'inverno', english: 'winter' }
        ]
      },
      vocabulary: {
        vocabulary: [
          { italian: 'panini', english: 'bread rolls' },
          { italian: 'pane', english: 'bread' },
          { italian: 'cocomero', english: 'watermelon' },
          { italian: 'pesche', english: 'peaches' },
          { italian: 'mele', english: 'apples' },
          { italian: 'patate', english: 'potatoes' },
          { italian: 'pomodori', english: 'tomatoes' },
          { italian: 'formaggio', english: 'cheese' },
          { italian: 'burro', english: 'butter' },
          { italian: 'latte', english: 'milk' },
          { italian: 'uova', english: 'eggs' },
          { italian: 'carne', english: 'meat' },
          { italian: 'pesce', english: 'fish' },
          { italian: 'verdure', english: 'vegetables' },
          { italian: 'frutta', english: 'fruit' }
        ]
      },
      expressions: {
        vocabulary: [
          { italian: 'Vorrei', english: 'I would like' },
          { italian: 'Quanto costa', english: 'How much does it cost' },
          { italian: 'Un chilo di', english: 'A kilo of' },
          { italian: 'Mezzo chilo', english: 'Half a kilo' },
          { italian: 'Mi piace', english: 'I like' },
          { italian: 'Non mi piace', english: 'I don\'t like' },
          { italian: 'Perché fa caldo', english: 'Because it\'s hot' },
          { italian: 'Perché fa freddo', english: 'Because it\'s cold' }
        ]
      },
      dialogue: {
        vocabulary: [
          { italian: 'fresco', english: 'fresh' },
          { italian: 'stagionato', english: 'aged' },
          { italian: 'ne', english: 'of it/them' },
          { italian: 'giovane', english: 'young (cheese)' },
          { italian: 'tre etti', english: 'three hundred grams' },
          { italian: 'posso assaggiare', english: 'can I taste' },
          { italian: 'è fresco', english: 'is it fresh' }
        ]
      },
      extraVocabulary: {
        vocabulary: [
          { italian: 'abito', english: 'suit' },
          { italian: 'passi', english: 'steps' },
          { italian: 'cinquanta', english: 'fifty' },
          { italian: 'euro', english: 'euros' },
          { italian: 'centesimi', english: 'cents' }
        ]
      },
      grammar: {
        vocabulary: [
          { italian: 'ne', english: 'of it/them' },
          { italian: 'lo', english: 'it (masculine)' },
          { italian: 'la', english: 'it (feminine)' },
          { italian: 'li', english: 'them (masculine)' },
          { italian: 'le', english: 'them (feminine)' },
          { italian: 'mi', english: 'to me' },
          { italian: 'ti', english: 'to you' },
          { italian: 'ci', english: 'to us' }
        ]
      }
    };
    this.questionTypes = ['multipleChoice', 'matching', 'listening', 'typing', 'dragDrop'];
  }

  initializeKeyboardNavigation() {
    // Remove existing keyboard listeners to prevent duplicates
    document.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    
    // Add global keyboard listener
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
  }

  handleKeyboardNavigation(event) {
    if (!this.currentQuiz) return;

    const key = event.key.toLowerCase();
    const keyCode = event.keyCode;

    // Prevent default for navigation keys
    const navigationKeys = ['enter', 'escape', 'f', '1', '2', '3', '4', 'a', 'b', 'c', 'd'];
    if (navigationKeys.includes(key) || (keyCode >= 49 && keyCode <= 52)) {
      // Only prevent default if not typing in an input field
      if (!event.target.matches('input[type="text"], textarea')) {
        event.preventDefault();
      }
    }

    switch (this.currentQuiz.type) {
      case 'multipleChoice':
        this.handleMultipleChoiceKeyboard(event);
        break;
      case 'matching':
        this.handleMatchingKeyboard(event);
        break;
      case 'listening':
      case 'typing':
        this.handleTypingKeyboard(event);
        break;
      case 'dragDrop':
        this.handleDragDropKeyboard(event);
        break;
    }
  }

  handleMultipleChoiceKeyboard(event) {
    const key = event.key;
    const options = document.querySelectorAll('.quiz-option');
    
    if (!options.length) return;

    // Number keys 1-4 for direct selection
    if (key >= '1' && key <= '4') {
      const index = parseInt(key) - 1;
      if (index < options.length) {
        // Clear previous selections
        options.forEach(opt => opt.classList.remove('selected', 'keyboard-highlight'));
        
        // Select and highlight the option
        const selectedOption = options[index];
        selectedOption.classList.add('selected', 'keyboard-highlight');
        // Get the correct answer from the quiz options array
        this.selectedAnswer = this.currentQuiz.options[index];
        
        // Auto-submit after short delay
        setTimeout(() => {
          this.checkAnswer();
        }, 500);
      }
    }
    
    // Arrow keys for navigation
    else if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      
      if (key === 'ArrowUp') {
        this.currentHighlight = Math.max(0, this.currentHighlight - 1);
      } else {
        this.currentHighlight = Math.min(options.length - 1, this.currentHighlight + 1);
      }
      
      // Update visual highlight
      options.forEach((opt, index) => {
        opt.classList.toggle('keyboard-highlight', index === this.currentHighlight);
      });
    }
    
    // Enter to select highlighted option
    else if (key === 'Enter' && !event.target.matches('input')) {
      const highlightedOption = options[this.currentHighlight];
      if (highlightedOption) {
        options.forEach(opt => opt.classList.remove('selected'));
        highlightedOption.classList.add('selected');
        // Get the correct answer from the quiz options array
        this.selectedAnswer = this.currentQuiz.options[this.currentHighlight];
        
        setTimeout(() => {
          this.checkAnswer();
        }, 500);
      }
    }
  }

  handleMatchingKeyboard(event) {
    const key = event.key.toLowerCase();
    
    // Numbers 1-4 for Italian column
    if (key >= '1' && key <= '4') {
      const index = parseInt(key) - 1;
      const italianItems = document.querySelectorAll('.italian-item');
      
      if (index < italianItems.length) {
        // Clear previous Italian selection
        italianItems.forEach(item => item.classList.remove('selected', 'keyboard-highlight'));
        
        const selectedItem = italianItems[index];
        selectedItem.classList.add('selected', 'keyboard-highlight');
        this.matchingSelection.italian = selectedItem;
        
        this.showKeyboardMatchingHint('Italian word selected. Now press A, B, C, or D for English translation.');
      }
    }
    
    // Letters A-D for English column
    else if (['a', 'b', 'c', 'd'].includes(key)) {
      const index = key.charCodeAt(0) - 97; // Convert a-d to 0-3
      const englishItems = document.querySelectorAll('.english-item');
      
      if (index < englishItems.length) {
        // Clear previous English selection
        englishItems.forEach(item => item.classList.remove('selected', 'keyboard-highlight'));
        
        const selectedItem = englishItems[index];
        selectedItem.classList.add('selected', 'keyboard-highlight');
        this.matchingSelection.english = selectedItem;
        
        // If we have both selections, attempt to match
        if (this.matchingSelection.italian && this.matchingSelection.english) {
          this.attemptKeyboardMatch();
        } else {
          this.showKeyboardMatchingHint('English word selected. Now press 1, 2, 3, or 4 for Italian word.');
        }
      }
    }
    
    // Enter to check all matches
    else if (key === 'enter') {
      const matchedItems = document.querySelectorAll('.match-item.matched');
      if (matchedItems.length > 0) {
        this.checkMatching();
      }
    }
    
    // Escape to clear selections
    else if (key === 'escape') {
      this.clearMatchingSelections();
    }
  }

  attemptKeyboardMatch() {
    const italian = this.matchingSelection.italian;
    const english = this.matchingSelection.english;
    
    if (!italian || !english) return;
    
    // Check if this is a correct match
    const isCorrectMatch = this.currentQuiz.pairs.some(pair => 
      pair.italian === italian.dataset.italian && pair.english === english.dataset.english
    );
    
    if (isCorrectMatch) {
      // Correct match
      italian.classList.add('matched');
      english.classList.add('matched');
      italian.classList.remove('selected', 'keyboard-highlight');
      english.classList.remove('selected', 'keyboard-highlight');
      
      this.selectedMatches.set(italian.dataset.italian, english.dataset.english);
      this.showKeyboardMatchingHint('✓ Correct match! Continue matching or press Enter to check answers.');
    } else {
      // Incorrect match - show briefly then clear
      italian.classList.add('incorrect-match');
      english.classList.add('incorrect-match');
      
      setTimeout(() => {
        italian.classList.remove('incorrect-match', 'selected', 'keyboard-highlight');
        english.classList.remove('incorrect-match', 'selected', 'keyboard-highlight');
        this.showKeyboardMatchingHint('✗ Incorrect match. Try again!');
      }, 1000);
    }
    
    // Clear selections
    this.matchingSelection = { italian: null, english: null };
  }

  clearMatchingSelections() {
    document.querySelectorAll('.match-item').forEach(item => {
      item.classList.remove('selected', 'keyboard-highlight');
    });
    this.matchingSelection = { italian: null, english: null };
    this.hideKeyboardMatchingHint();
  }

  showKeyboardMatchingHint(message) {
    let hint = document.querySelector('.keyboard-matching-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'keyboard-matching-hint';
      hint.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: fadeInUp 0.3s ease;
      `;
      document.body.appendChild(hint);
    }
    hint.textContent = message;
    hint.style.display = 'block';
  }

  hideKeyboardMatchingHint() {
    const hint = document.querySelector('.keyboard-matching-hint');
    if (hint) {
      hint.style.display = 'none';
    }
  }

  handleTypingKeyboard(event) {
    const key = event.key;
    
    // Space bar to play audio for listening questions
    if (key === ' ' && !event.target.matches('input') && this.currentQuiz.type === 'listening') {
      event.preventDefault();
      const playBtn = document.querySelector('.play-audio-btn');
      if (playBtn) {
        playBtn.click();
        // Auto-focus input after playing audio
        setTimeout(() => {
          const input = document.querySelector('.audio-input');
          if (input) {
            input.focus();
          }
        }, 100);
      }
      return;
    }
    
    // Auto-focus input if it exists and user starts typing
    if (key.length === 1 && !event.target.matches('input')) {
      const input = document.querySelector('.quiz-input:not([disabled])');
      if (input) {
        input.focus();
        // Don't add the character here, let the focus handle it
        return;
      }
    }
    
    // Enter to submit (handled in existing handleTypingInput/handleListeningInput)
    if (key === 'Enter' && event.target.matches('input')) {
      // Existing logic handles this
      return;
    }
  }

  handleDragDropKeyboard(event) {
    const key = event.key.toLowerCase();
    
    // Auto-focus text input if user starts typing
    if (key.length === 1 && !event.target.matches('input')) {
      const input = document.querySelector('.drag-type-input:not([disabled])');
      if (input) {
        input.focus();
        return;
      }
    }
    
    // Enter to submit (handled in existing handleDragDropTyping)
    if (key === 'Enter' && event.target.matches('input')) {
      // Existing logic handles this
      return;
    }
    
    // Escape to clear
    if (key === 'escape') {
      const clearBtn = document.querySelector('.clear-word');
      if (clearBtn) {
        clearBtn.click();
      }
    }
  }

  generateQuiz(topic) {
    const data = this.quizData[topic];
    if (!data || !data.vocabulary || data.vocabulary.length < 4) {
      console.log('No data found for topic:', topic);
      return null;
    }

    const vocab = data.vocabulary;

    // Reset used questions if we've used them all
    if (this.usedQuestions.size >= vocab.length * this.questionTypes.length) {
      this.usedQuestions.clear();
    }

    let attempts = 0;
    let quiz = null;

    // Try to generate a unique question
    while (attempts < 50) {
      const questionType = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];

      switch (questionType) {
        case 'multipleChoice':
          quiz = this.generateMultipleChoice(vocab);
          break;
        case 'matching':
          quiz = this.generateMatching(vocab);
          break;
        case 'listening':
          quiz = this.generateListening(vocab);
          break;
        case 'typing':
          quiz = this.generateTyping(vocab);
          break;
        case 'dragDrop':
          quiz = this.generateDragDrop(vocab);
          break;
        default:
          quiz = this.generateMultipleChoice(vocab);
      }

      if (quiz) {
        const questionKey = `${questionType}-${quiz.vocab ? quiz.vocab.italian : 'matching'}`;
        if (!this.usedQuestions.has(questionKey)) {
          this.usedQuestions.add(questionKey);
          return quiz;
        }
      }

      attempts++;
    }

    // If we can't find a unique question, just return any question
    return this.generateMultipleChoice(vocab);
  }

  generateMultipleChoice(vocab) {
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
      question: 'What is the Italian word for "' + correct.english + '"?',
      options: options.map(opt => opt.italian),
      correct: correct.italian,
      explanation: '"' + correct.italian + '" means "' + correct.english + '" in English.',
      vocab: correct
    };
  }

  generateMatching(vocab) {
    const pairs = vocab.slice(0, Math.min(4, vocab.length));
    const shuffledEnglish = [...pairs.map(p => p.english)].sort(() => Math.random() - 0.5);

    return {
      type: 'matching',
      question: 'Match the Italian words with their English translations',
      pairs: pairs,
      shuffledEnglish: shuffledEnglish,
      explanation: 'Great matching! These are important vocabulary words.',
      matches: new Map()
    };
  }

  generateListening(vocab) {
    const correct = vocab[Math.floor(Math.random() * vocab.length)];

    return {
      type: 'listening',
      question: 'Listen to the Italian word and type what you hear:',
      audio: correct.italian,
      correct: correct.italian, // Keep this for compatibility
      correctItalian: correct.italian.toLowerCase(),
      correctEnglish: correct.english.toLowerCase(),
      explanation: 'You heard "' + correct.italian + '" which means "' + correct.english + '".',
      vocab: correct,
      part: 1, // Track which part we're on (1 = Italian, 2 = English)
      userItalian: '', // Store user's Italian answer
      userEnglish: '' // Store user's English answer
    };
  }

  generateTyping(vocab) {
    const correct = vocab[Math.floor(Math.random() * vocab.length)];

    return {
      type: 'typing',
      question: 'Type the Italian word for "' + correct.english + '":',
      correct: correct.italian,
      explanation: 'The correct answer is "' + correct.italian + '".',
      vocab: correct
    };
  }

  generateDragDrop(vocab) {
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    const letters = correct.italian.split('').sort(() => Math.random() - 0.5);

    return {
      type: 'dragDrop',
      question: 'Drag the letters to spell the Italian word for "' + correct.english + '":',
      letters: letters,
      correct: correct.italian,
      explanation: 'The correct spelling is "' + correct.italian + '".',
      vocab: correct,
      currentWord: []
    };
  }

  renderQuiz(quiz, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !quiz) return;

    console.log('=== RENDERING QUIZ DEBUG ===');
    console.log('Quiz type:', quiz.type);
    console.log('Quiz correct answer:', quiz.correct);
    console.log('Quiz vocab:', quiz.vocab);
    console.log('=== END RENDER DEBUG ===');

    let html = '<div class="quiz-question">';

    // Always put question at the top for ALL question types
    html += '<div class="quiz-question-header">';
    html += '<h4>' + quiz.question + '</h4>';
    html += '</div>';

    switch (quiz.type) {
      case 'multipleChoice':
        html += this.renderMultipleChoiceContent(quiz);
        break;
      case 'matching':
        html += this.renderMatchingContent(quiz);
        break;
      case 'listening':
        html += this.renderListeningContent(quiz);
        break;
      case 'typing':
        html += this.renderTypingContent(quiz);
        break;
      case 'dragDrop':
        html += this.renderDragDropContent(quiz);
        break;
    }

    html += '<div class="quiz-feedback" style="display: none;"></div>';
    html += '</div>';

    container.innerHTML = html;
    
    // CRITICAL: Set currentQuiz BEFORE any other operations
    this.currentQuiz = quiz;
    
    // Initialize keyboard navigation for this quiz
    this.initializeKeyboardNavigation();
    this.currentHighlight = 0;
    
    // Auto-focus first input if available
    setTimeout(() => {
      const input = container.querySelector('input[autofocus]');
      if (input) {
        input.focus();
      }
      
      // Also highlight first option for multiple choice
      if (quiz.type === 'multipleChoice') {
        const options = container.querySelectorAll('.quiz-option');
        if (options.length > 0) {
          options[0].classList.add('keyboard-highlight');
        }
      }
    }, 100);
  }

  renderMultipleChoice(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += this.renderMultipleChoiceContent(quiz);
    return html;
  }

  renderMultipleChoiceContent(quiz) {
    let html = '<div class="keyboard-hint">Use keys 1-4 or arrow keys + Enter to select</div>';
    html += '<div class="quiz-options">';
    for (let i = 0; i < quiz.options.length; i++) {
      html += '<button class="quiz-option" onclick="quizSystem.selectOption(\'' + quiz.options[i] + '\', this)">';
      html += '<span class="option-key">' + (i + 1) + '</span> ' + quiz.options[i];
      html += '</button>';
    }
    html += '</div>';
    return html;
  }

  renderMatching(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += this.renderMatchingContent(quiz);
    return html;
  }

  renderMatchingContent(quiz) {
    let html = '<div class="keyboard-hint">Use keys 1-4 for Italian words, A-D for English words, Enter to check answers</div>';
    html += '<div class="matching-container">';
    html += '<div class="italian-column">';
    html += '<h5>Italian (Keys 1-4)</h5>';
    quiz.pairs.forEach((pair, index) => {
      html += '<div class="match-item italian-item" data-italian="' + pair.italian + '" onclick="quizSystem.selectMatchItem(this)">';
      html += '<span class="option-key">' + (index + 1) + '</span> ' + pair.italian;
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="english-column">';
    html += '<h5>English (Keys A-D)</h5>';
    quiz.shuffledEnglish.forEach((english, index) => {
      const letter = String.fromCharCode(65 + index); // A, B, C, D
      html += '<div class="match-item english-item" data-english="' + english + '" onclick="quizSystem.selectMatchItem(this)">';
      html += '<span class="option-key">' + letter + '</span> ' + english;
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';
    html += '<button class="quiz-check" onclick="quizSystem.checkMatching()" style="margin-top: 1rem;">Check Answers (Enter)</button>';
    return html;
  }

  renderListening(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += this.renderListeningContent(quiz);
    return html;
  }

  renderListeningContent(quiz) {
    let html = '<div class="keyboard-hint">Press SPACE to play audio, then type your answer and press Enter to submit</div>';
    html += '<div class="audio-container">';
    html += '<button class="play-audio-btn" onclick="quizSystem.playQuizAudio(\'' + quiz.audio + '\')"><i class="fas fa-play"></i> Play Audio (Space)</button>';
    html += '<input type="text" class="quiz-input audio-input" placeholder="Type the Italian word..." onkeyup="quizSystem.handleListeningInput(event)" autofocus>';
    html += '<div class="audio-controls">';
    html += '<button class="quiz-check" onclick="quizSystem.checkListening()">Check Answer (Enter)</button>';
    html += '<button class="skip-audio-btn" onclick="quizSystem.skipAudioQuestion()">Skip (Can\'t hear audio)</button>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  renderTyping(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += this.renderTypingContent(quiz);
    return html;
  }

  renderTypingContent(quiz) {
    let html = '<div class="keyboard-hint">Type your answer and press Enter to submit</div>';
    html += '<input type="text" class="quiz-input" placeholder="Type your answer..." onkeyup="quizSystem.handleTypingInput(event)" autofocus>';
    html += '<button class="quiz-check" onclick="quizSystem.checkTyping()" style="margin-top: 1rem;">Check Answer (Enter)</button>';
    return html;
  }

  renderDragDrop(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += this.renderDragDropContent(quiz);
    return html;
  }

  renderDragDropContent(quiz) {
    let quizId = quiz.vocab.italian; // Use Italian word as unique ID

    let html = '<div class="keyboard-hint">Type your answer and press Enter, or use Escape to clear</div>';
    html += '<div class="drag-drop-container">';
    html += '<div class="drop-zone">';
    html += '<div class="current-word" id="current-word-' + quizId + '"></div>';
    html += '</div>';
    html += '<div class="letter-bank">';
    quiz.letters.forEach((letter, index) => {
      html += '<span class="draggable-letter" data-letter="' + letter + '" onclick="quizSystem.addLetter(\'' + letter + '\', this, \'' + quizId + '\')">' + letter.toUpperCase() + '</span>';
    });
    html += '</div>';
    html += '<div class="drag-drop-input-section">';
    html += '<p>Type your answer:</p>';
    html += '<input type="text" class="quiz-input drag-type-input" placeholder="Type here..." onkeyup="quizSystem.handleDragDropTyping(event)" autofocus>';
    html += '<div class="drag-drop-buttons">';
    html += '<button class="quiz-check" onclick="quizSystem.checkDragDrop()">Check Answer (Enter)</button>';
    html += '<button class="clear-word" onclick="quizSystem.clearWord(\'' + quizId + '\')">Clear (Escape)</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }</old_str>

  selectOption(answer, button) {
    if (button.disabled) return;

    const options = button.parentNode.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));

    button.classList.add('selected');
    // Store the clean answer without any prefix
    this.selectedAnswer = answer;

    setTimeout(() => {
      this.checkAnswer();
    }, 500);
  }

  selectMatchItem(item) {
    // Don't allow interaction if already matched
    if (item.classList.contains('matched')) return;

    const container = item.parentNode.parentNode;
    const selectedItems = container.querySelectorAll('.match-item.selected');

    if (item.classList.contains('selected')) {
      item.classList.remove('selected');
      return;
    }

    // If we already have 2 selected items, clear them first
    if (selectedItems.length >= 2) {
      selectedItems.forEach(si => si.classList.remove('selected'));
    }

    item.classList.add('selected');

    const newSelected = container.querySelectorAll('.match-item.selected');
    if (newSelected.length === 2) {
      const italian = newSelected[0].classList.contains('italian-item') ? newSelected[0] : newSelected[1];
      const english = newSelected[0].classList.contains('english-item') ? newSelected[0] : newSelected[1];

      if (italian && english && italian !== english) {
        // Check if this is a correct match
        const isCorrectMatch = this.currentQuiz.pairs.some(pair => 
          pair.italian === italian.dataset.italian && pair.english === english.dataset.english
        );

        if (isCorrectMatch) {
          // Correct match - mark as matched with green
          italian.classList.add('matched');
          english.classList.add('matched');
          this.selectedMatches.set(italian.dataset.italian, english.dataset.english);
        } else {
          // Incorrect match - flash red and clear selection
          italian.classList.add('incorrect-match');
          english.classList.add('incorrect-match');

          setTimeout(() => {
            italian.classList.remove('incorrect-match');
            english.classList.remove('incorrect-match');
          }, 1000);
        }

        newSelected.forEach(item => item.classList.remove('selected'));
      }
    }
  }

  checkMatching() {
    const pairs = this.currentQuiz.pairs;
    let correct = 0;
    let detailedFeedback = '';

    pairs.forEach(pair => {
      if (this.selectedMatches.get(pair.italian) === pair.english) {
        correct++;
      } else {
        detailedFeedback += `"${pair.italian}" means "${pair.english}". `;
      }
    });

    const isCorrect = correct === pairs.length;
    const explanation = isCorrect ? 
      'Perfect matching! You got all the translations correct.' : 
      `You matched ${correct} out of ${pairs.length} correctly. ${detailedFeedback}`;

    this.showFeedback(isCorrect, explanation);
  }

  playQuizAudio(text) {
    playItalianAudio(text);
    // Auto-focus input after audio starts playing
    setTimeout(() => {
      const input = document.querySelector('.audio-input');
      if (input) {
        input.focus();
      }
    }, 300);
  }

  handleTypingInput(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      // Prevent multiple submissions
      if (this.isChecking) return;
      this.isChecking = true;
      
      setTimeout(() => {
        this.checkTyping();
        this.isChecking = false;
      }, 100);
    }
  }

  handleListeningInput(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      // Prevent multiple submissions
      if (this.isChecking) return;
      this.isChecking = true;
      
      setTimeout(() => {
        this.checkListening();
        this.isChecking = false;
      }, 100);
    }
  }

  checkTyping() {
    const input = document.querySelector('.quiz-input');
    if (!input || !this.currentQuiz) {
      console.log('Input or quiz not found');
      return;
    }

    const userAnswer = input.value.trim();
    const correctAnswer = this.currentQuiz.correct;

    console.log('=== TYPING VALIDATION DEBUG ===');
    console.log('User typed:', JSON.stringify(userAnswer));
    console.log('Correct answer:', JSON.stringify(correctAnswer));
    console.log('Quiz type:', this.currentQuiz.type);
    console.log('Quiz vocab:', this.currentQuiz.vocab);

    // Extremely simple validation - just clean whitespace and make lowercase
    const cleanUser = userAnswer.replace(/\s+/g, '').toLowerCase();
    const cleanCorrect = correctAnswer.replace(/\s+/g, '').toLowerCase();

    console.log('Clean user:', JSON.stringify(cleanUser));
    console.log('Clean correct:', JSON.stringify(cleanCorrect));

    const isCorrect = cleanUser === cleanCorrect;
    console.log('Final result:', isCorrect);
    console.log('=== END VALIDATION DEBUG ===');

    this.selectedAnswer = userAnswer;
    this.showFeedback(isCorrect, this.currentQuiz.explanation);
  }

  checkListening() {
    const input = document.querySelector('.audio-input');
    if (!input || !this.currentQuiz) {
      console.log('Input or quiz not found');
      return;
    }

    const userAnswer = input.value.trim();
    const correctAnswer = this.currentQuiz.correct;

    console.log('=== LISTENING VALIDATION DEBUG ===');
    console.log('User typed:', JSON.stringify(userAnswer));
    console.log('Correct answer:', JSON.stringify(correctAnswer));
    console.log('Quiz type:', this.currentQuiz.type);
    console.log('Quiz vocab:', this.currentQuiz.vocab);

    // Extremely simple validation - just clean whitespace and make lowercase
    const cleanUser = userAnswer.replace(/\s+/g, '').toLowerCase();
    const cleanCorrect = correctAnswer.replace(/\s+/g, '').toLowerCase();

    console.log('Clean user:', JSON.stringify(cleanUser));
    console.log('Clean correct:', JSON.stringify(cleanCorrect));

    const isCorrect = cleanUser === cleanCorrect;
    console.log('Final result:', isCorrect);
    console.log('=== END LISTENING VALIDATION DEBUG ===');

    this.selectedAnswer = userAnswer;
    this.showFeedback(isCorrect, this.currentQuiz.explanation);
  }

  skipAudioQuestion() {
    if (this.currentQuiz && this.currentQuiz.type === 'listening') {
      const explanation = 'Audio question skipped for accessibility. The answer was "' + this.currentQuiz.correct + '" which means "' + this.currentQuiz.vocab.english + '".';
      this.selectedAnswer = 'skipped';
      // Don't count as incorrect - treat as neutral
      this.showSkippedFeedback(explanation);
    }
  }

  addLetter(letter, element, quizId) {
    if (element.style.visibility === 'hidden') return;

    const currentWordDiv = document.getElementById('current-word-' + quizId);
    const letterSpan = document.createElement('span');
    letterSpan.textContent = letter;
    letterSpan.className = 'word-letter';
    letterSpan.onclick = () => this.removeLetter(letterSpan, letter, element, quizId);

    currentWordDiv.appendChild(letterSpan);
    this.currentQuiz.currentWord.push(letter);

    element.style.visibility = 'hidden';
  }

  removeLetter(letterSpan, letter, originalElement, quizId) {
    letterSpan.remove();
    const index = this.currentQuiz.currentWord.indexOf(letter);
    if (index > -1) {
      this.currentQuiz.currentWord.splice(index, 1);
    }
    originalElement.style.visibility = 'visible';
  }

  clearWord(quizId) {
    const currentWordDiv = document.getElementById('current-word-' + quizId);
    if (currentWordDiv) {
      currentWordDiv.innerHTML = '';
    }
    this.currentQuiz.currentWord = [];
    document.querySelectorAll('.draggable-letter').forEach(letter => {
      letter.style.visibility = 'visible';
    });
  }

  handleDragDropTyping(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      // Prevent multiple submissions
      if (this.isChecking) return;
      this.isChecking = true;
      
      setTimeout(() => {
        this.checkDragDrop();
        this.isChecking = false;
      }, 100);
    }
  }

  checkDragDrop() {
    const typedInput = document.querySelector('.drag-type-input');
    let userWord = '';

    // Check if user typed or used drag-drop
    if (typedInput && typedInput.value.trim()) {
      userWord = typedInput.value.trim();
    } else {
      userWord = this.currentQuiz.currentWord.join('');
    }

    if (!userWord) {
      alert('Please provide an answer using either the letters or the text input.');
      return;
    }

    const correctAnswer = this.currentQuiz.correct;

    console.log('=== DRAG-DROP VALIDATION DEBUG ===');
    console.log('User answer:', JSON.stringify(userWord));
    console.log('Correct answer:', JSON.stringify(correctAnswer));
    console.log('User length:', userWord.length);
    console.log('Correct length:', correctAnswer.length);

    // Extremely simple validation - just clean whitespace and make lowercase
    const cleanUser = userWord.replace(/\s+/g, '').toLowerCase();
    const cleanCorrect = correctAnswer.replace(/\s+/g, '').toLowerCase();

    console.log('Clean user:', JSON.stringify(cleanUser));
    console.log('Clean correct:', JSON.stringify(cleanCorrect));

    const isCorrect = cleanUser === cleanCorrect;
    console.log('Final result:', isCorrect);
    console.log('=== END DRAG-DROP VALIDATION DEBUG ===');

    this.selectedAnswer = userWord;
    this.showFeedback(isCorrect, this.currentQuiz.explanation);
  }

  checkAnswer() {
    if (!this.selectedAnswer || !this.currentQuiz) return;

    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    this.showFeedback(isCorrect, this.currentQuiz.explanation);
  }

  showFeedback(isCorrect, explanation) {
    const currentQuestion = document.querySelector('.quiz-question:last-child');
    if (!currentQuestion) return;

    const feedback = currentQuestion.querySelector('.quiz-feedback');
    if (!feedback) return;

    // Mark question as answered
    currentQuestion.classList.add('answered');

    // Disable all interactive elements more carefully
    currentQuestion.querySelectorAll('button:not(.quiz-check), input, .match-item, .draggable-letter').forEach(el => {
      el.disabled = true;
      el.style.pointerEvents = 'none';
    });

    // Disable check button separately after a short delay
    setTimeout(() => {
      currentQuestion.querySelectorAll('.quiz-check').forEach(el => {
        el.disabled = true;
        el.style.pointerEvents = 'none';
      });
    }, 100);

    if (isCorrect) {
      feedback.innerHTML = '<div class="correct-feedback"><i class="fas fa-check"></i> Correct! ' + explanation + '</div>';
      this.score++;
    } else {
      let correctAnswer = '';
      if (this.currentQuiz.type === 'multipleChoice') {
        correctAnswer = ' The correct answer is "' + this.currentQuiz.correct + '".';
        // Highlight correct option
        currentQuestion.querySelectorAll('.quiz-option').forEach(opt => {
          if (opt.textContent === this.currentQuiz.correct) {
            opt.classList.add('correct');
          } else if (opt.classList.contains('selected')) {
            opt.classList.add('incorrect');
          }
        });
      } else if (this.currentQuiz.type !== 'matching') {
        correctAnswer = ' The correct answer is "' + this.currentQuiz.correct + '".';
      }
      feedback.innerHTML = '<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect.' + correctAnswer + ' ' + explanation + '</div>';
    }

    this.totalQuestions++;
    feedback.style.display = 'block';
    feedback.setAttribute('data-persistent', 'true');

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = '<div class="score-text">Score: ' + this.score + '/' + this.totalQuestions + ' (' + Math.round((this.score / this.totalQuestions) * 100) + '%)</div>';
    feedback.appendChild(scoreDisplay);

    this.selectedAnswer = null;
    this.selectedMatches.clear();

    setTimeout(() => {
      this.transitionToNextQuestion();
    }, 3000);
  }

  showSkippedFeedback(explanation) {
    const currentQuestion = document.querySelector('.quiz-question:last-child');
    if (!currentQuestion) return;

    const feedback = currentQuestion.querySelector('.quiz-feedback');
    if (!feedback) return;

    // Mark question as answered
    currentQuestion.classList.add('answered');

    // Disable all interactive elements more carefully
    currentQuestion.querySelectorAll('button:not(.quiz-check), input, .match-item, .draggable-letter').forEach(el => {
      el.disabled = true;
      el.style.pointerEvents = 'none';
    });

    // Disable check button separately after a short delay
    setTimeout(() => {
      currentQuestion.querySelectorAll('.quiz-check').forEach(el => {
        el.disabled = true;
        el.style.pointerEvents = 'none';
      });
    }, 100);

    feedback.innerHTML = '<div class="skipped-feedback"><i class="fas fa-forward"></i> ' + explanation + '</div>';

    // Don't increment total questions for skipped items
    feedback.style.display = 'block';
    feedback.setAttribute('data-persistent', 'true');

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    if (this.totalQuestions > 0) {
      scoreDisplay.innerHTML = '<div class="score-text">Score: ' + this.score + '/' + this.totalQuestions + ' (' + Math.round((this.score / this.totalQuestions) * 100) + '%)</div>';
    } else {
      scoreDisplay.innerHTML = '<div class="score-text">Score: ' + this.score + '/0 (skipped questions not counted)</div>';
    }
    feedback.appendChild(scoreDisplay);

    this.selectedAnswer = null;
    this.selectedMatches.clear();

    setTimeout(() => {
      this.transitionToNextQuestion();
    }, 3000);
  }

  transitionToNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const containerId = currentContainer.id;
    const topic = this.getTopicFromQuizId(containerId);

    const nextQuiz = this.generateQuiz(topic);
    if (!nextQuiz) return;

    const allQuestions = currentContainer.querySelectorAll('.quiz-question');

    // Step 1: Remove the oldest question (previously answered) with smooth fade out
    if (allQuestions.length > 1) {
      const oldestQuestion = allQuestions[0];
      oldestQuestion.style.transition = 'all 0.4s ease-out';
      oldestQuestion.style.height = oldestQuestion.offsetHeight + 'px';
      oldestQuestion.style.opacity = '0';
      oldestQuestion.style.transform = 'translateY(-20px)';
      oldestQuestion.style.marginBottom = '0';

      setTimeout(() => {
        oldestQuestion.style.height = '0';
        oldestQuestion.style.padding = '0';
        oldestQuestion.style.margin = '0';

        setTimeout(() => {
          oldestQuestion.remove();

          // Remove corresponding separator
          const separators = currentContainer.querySelectorAll('.quiz-separator');
          if (separators.length > 0) {
            separators[0].remove();
          }
        }, 400);
      }, 200);
    }

    // Step 2: Get the current (most recent) answered question
    const currentQuestion = allQuestions[allQuestions.length - 1];

    // Step 3: Smoothly compact and slide up the current answered question
    setTimeout(() => {
      currentQuestion.style.transition = 'all 0.6s ease-out';
      currentQuestion.style.transform = 'scale(0.95) translateY(-10px)';
      currentQuestion.style.opacity = '0.7';
      currentQuestion.style.marginBottom = '0.5rem';
      currentQuestion.style.filter = 'blur(0.5px)';
    }, 200);

    // Step 4: Create separator with initial hidden state
    const separator = document.createElement('div');
    separator.className = 'quiz-separator';
    separator.innerHTML = '<div style="text-align: center; margin: 0.3rem 0; color: #ccc; font-size: 0.8rem;">• • •</div>';
    separator.style.opacity = '0';
    separator.style.transition = 'opacity 0.4s ease-out';

    // Step 5: Create new question with fixed height to prevent jumping
    const nextQuestionDiv = document.createElement('div');
    nextQuestionDiv.className = 'quiz-question new-question';

    // Set up initial state - invisible but reserve space
    nextQuestionDiv.style.opacity = '0';
    nextQuestionDiv.style.transform = 'translateY(30px)';
    nextQuestionDiv.style.transition = 'all 0.7s ease-out';

    // Generate the HTML content
    let html = '';
    switch (nextQuiz.type) {
      case 'multipleChoice':
        html += this.renderMultipleChoice(nextQuiz);
        break;
      case 'matching':
        html += this.renderMatching(nextQuiz);
        break;
      case 'listening':
        html += this.renderListening(nextQuiz);
        break;
      case 'typing':
        html += this.renderTyping(nextQuiz);
        break;
      case 'dragDrop':
        html += this.renderDragDrop(nextQuiz);
        break;
    }

    html += '<div class="quiz-feedback" style="display: none;"></div>';
    nextQuestionDiv.innerHTML = html;

    // Step 6: Insert elements into DOM
    currentQuestion.parentNode.insertBefore(separator, currentQuestion.nextSibling);
    separator.parentNode.insertBefore(nextQuestionDiv, separator.nextSibling);

    // CRITICAL: Update currentQuiz BEFORE any animations or interactions
    this.currentQuiz = nextQuiz;
    
    console.log('=== TRANSITION DEBUG ===');
    console.log('New quiz type:', nextQuiz.type);
    console.log('New quiz correct:', nextQuiz.correct);
    console.log('New quiz vocab:', nextQuiz.vocab);
    console.log('=== END TRANSITION DEBUG ===');

    // Step 7: Animate separator and new question in sequence
    setTimeout(() => {
      separator.style.opacity = '0.5';
    }, 600);

    setTimeout(() => {
      nextQuestionDiv.style.opacity = '1';
      nextQuestionDiv.style.transform = 'translateY(0)';

      // Gentle scroll adjustment only if needed
      const containerRect = currentContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only scroll if the container is mostly out of view
      if (containerRect.bottom > viewportHeight + 50) {
        // Use a gentle scroll that doesn't jump
        window.scrollBy({
          top: Math.min(100, containerRect.bottom - viewportHeight + 50),
          behavior: 'smooth'
        });
      }
    }, 800);
  }

  getTopicFromQuizId(quizId) {
    // Map quiz IDs to topics based on the lesson structure
    const quizIdToTopic = {
      'quiz0': 'seasons',      // Seasons quiz
      'quiz1': 'vocabulary',   // Main vocabulary quiz  
      'quiz2': 'expressions',  // Expressions quiz
      'quiz3': 'dialogue',     // Dialogue quiz
      'quiz4': 'extraVocabulary', // Extra vocabulary
      'quiz5': 'grammar'       // Grammar quiz
    };

    return quizIdToTopic[quizId] || 'vocabulary';
  }
}

// Create global quiz system instance
const quizSystem = new QuizSystem();

// Global toggle function
window.toggleQuiz = function(quizId) {
  console.log('toggleQuiz called with:', quizId);

  let quiz = document.getElementById(quizId);
  
  // If quiz container doesn't exist, create it
  if (!quiz) {
    console.log('Creating quiz container for:', quizId);
    quiz = document.createElement('div');
    quiz.id = quizId;
    quiz.className = 'quiz-block hidden';
    
    // Find the quiz button that was clicked
    const quizButton = document.querySelector(`[onclick*="${quizId}"], .quiz-btn`);
    if (quizButton && quizButton.parentNode) {
      // Insert the quiz container after the button's parent element
      quizButton.parentNode.insertAdjacentElement('afterend', quiz);
    } else {
      // Fallback: append to document body
      document.body.appendChild(quiz);
    }
  }

  if (quiz.classList.contains('hidden')) {
    quiz.classList.remove('hidden');
    quiz.style.display = 'block';

    console.log('Starting quiz for:', quizId);

    const topic = quizSystem.getTopicFromQuizId(quizId);
    console.log('Topic:', topic);

    // Reset quiz state for new topic
    quizSystem.score = 0;
    quizSystem.totalQuestions = 0;
    quizSystem.usedQuestions.clear();

    const quizData = quizSystem.generateQuiz(topic);
    if (quizData) {
      console.log('Generated quiz:', quizData);
      quizSystem.renderQuiz(quizData, quizId);
    } else {
      console.log('Failed to generate quiz for topic:', topic);
    }
  } else {
    quiz.classList.add('hidden');
    quiz.style.display = 'none';
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');

  initializeVocabInteractions();

  // Look for quiz buttons with multiple selectors
  const quizButtons = document.querySelectorAll('.quiz-btn, button[onclick*="toggleQuiz"]');
  console.log('Found quiz buttons:', quizButtons.length);

  quizButtons.forEach((btn, index) => {
    console.log('Setting up quiz button:', index);

    // Get the original onclick value to extract quiz ID
    const onclickValue = btn.getAttribute('onclick');
    let quizId = null;

    if (onclickValue) {
      const match = onclickValue.match(/toggleQuiz\('([^']+)'\)/);
      if (match) {
        quizId = match[1];
      }
    }

    // If no quiz ID found, generate one based on index
    if (!quizId) {
      quizId = 'quiz' + index;
    }

    // Remove existing onclick handlers to prevent conflicts
    btn.removeAttribute('onclick');

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Quiz button clicked, quiz ID:', quizId);
      toggleQuiz(quizId);
    });
  });

  console.log('Initialization complete');
});