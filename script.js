
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
      correct: correct.italian.toLowerCase(),
      explanation: 'You heard "' + correct.italian + '" which means "' + correct.english + '".',
      vocab: correct
    };
  }

  generateTyping(vocab) {
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    
    return {
      type: 'typing',
      question: 'Type the Italian word for "' + correct.english + '":',
      correct: correct.italian.toLowerCase(),
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

    let html = '<div class="quiz-question">';
    
    switch (quiz.type) {
      case 'multipleChoice':
        html += this.renderMultipleChoice(quiz);
        break;
      case 'matching':
        html += this.renderMatching(quiz);
        break;
      case 'listening':
        html += this.renderListening(quiz);
        break;
      case 'typing':
        html += this.renderTyping(quiz);
        break;
      case 'dragDrop':
        html += this.renderDragDrop(quiz);
        break;
    }

    html += '<div class="quiz-feedback" style="display: none;"></div>';
    html += '</div>';

    container.innerHTML = html;
    this.currentQuiz = quiz;
  }

  renderMultipleChoice(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += '<div class="quiz-options">';
    for (let i = 0; i < quiz.options.length; i++) {
      html += '<button class="quiz-option" onclick="quizSystem.selectOption(\'' + quiz.options[i] + '\', this)">' + quiz.options[i] + '</button>';
    }
    html += '</div>';
    return html;
  }

  renderMatching(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += '<div class="matching-container">';
    html += '<div class="italian-column">';
    quiz.pairs.forEach((pair, index) => {
      html += '<div class="match-item italian-item" data-italian="' + pair.italian + '" onclick="quizSystem.selectMatchItem(this)">' + pair.italian + '</div>';
    });
    html += '</div>';
    html += '<div class="english-column">';
    quiz.shuffledEnglish.forEach((english, index) => {
      html += '<div class="match-item english-item" data-english="' + english + '" onclick="quizSystem.selectMatchItem(this)">' + english + '</div>';
    });
    html += '</div>';
    html += '</div>';
    html += '<button class="quiz-check" onclick="quizSystem.checkMatching()" style="margin-top: 1rem;">Check Answers</button>';
    return html;
  }

  renderListening(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += '<div class="audio-container">';
    html += '<button class="play-audio-btn" onclick="quizSystem.playQuizAudio(\'' + quiz.audio + '\')"><i class="fas fa-play"></i> Play Audio</button>';
    html += '<input type="text" class="quiz-input audio-input" placeholder="Type what you hear..." onkeyup="quizSystem.handleTypingInput(event)">';
    html += '<button class="quiz-check" onclick="quizSystem.checkTyping()" style="margin-top: 1rem;">Check Answer</button>';
    html += '</div>';
    return html;
  }

  renderTyping(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += '<input type="text" class="quiz-input" placeholder="Type your answer..." onkeyup="quizSystem.handleTypingInput(event)">';
    html += '<button class="quiz-check" onclick="quizSystem.checkTyping()" style="margin-top: 1rem;">Check Answer</button>';
    return html;
  }

  renderDragDrop(quiz) {
    let html = '<h4>' + quiz.question + '</h4>';
    html += '<div class="drop-zone" ondrop="quizSystem.dropLetter(event)" ondragover="quizSystem.allowDrop(event)">';
    html += '<div class="current-word" id="currentWord"></div>';
    html += '</div>';
    html += '<div class="letter-bank">';
    quiz.letters.forEach((letter, index) => {
      html += '<span class="draggable-letter" draggable="true" data-letter="' + letter + '" onclick="quizSystem.addLetter(\'' + letter + '\', this)">' + letter + '</span>';
    });
    html += '</div>';
    html += '<div style="margin: 1rem 0; text-align: center; color: #666;">Or type your answer:</div>';
    html += '<input type="text" class="quiz-input drag-type-input" placeholder="Type your answer..." onkeyup="quizSystem.handleDragDropTyping(event)" style="margin: 0.5rem 0;">';
    html += '<div class="drag-drop-controls">';
    html += '<button class="quiz-check" onclick="quizSystem.checkDragDrop()" style="margin-top: 1rem;">Check Answer</button>';
    html += '<button class="clear-word" onclick="quizSystem.clearWord()" style="margin-top: 0.5rem; margin-left: 0.5rem;">Clear</button>';
    html += '</div>';
    return html;
  }

  selectOption(answer, button) {
    if (button.disabled) return;

    const options = button.parentNode.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));

    button.classList.add('selected');
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
  }

  handleTypingInput(event) {
    if (event.key === 'Enter') {
      this.checkTyping();
    }
  }

  checkTyping() {
    const input = document.querySelector('.quiz-input');
    const userAnswer = input.value.toLowerCase().trim();
    const correctAnswer = this.currentQuiz.correct.toLowerCase().trim();
    
    // For listening questions, be more flexible with accents and case
    const normalizedUser = userAnswer.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedCorrect = correctAnswer.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Check exact match first, then normalized match
    const isCorrect = userAnswer === correctAnswer || normalizedUser === normalizedCorrect;
    
    this.selectedAnswer = userAnswer;
    this.showFeedback(isCorrect, this.currentQuiz.explanation);
  }

  addLetter(letter, element) {
    if (element.style.visibility === 'hidden') return;
    
    const currentWordDiv = document.getElementById('currentWord');
    const letterSpan = document.createElement('span');
    letterSpan.textContent = letter;
    letterSpan.className = 'word-letter';
    letterSpan.onclick = () => this.removeLetter(letterSpan, letter, element);
    
    currentWordDiv.appendChild(letterSpan);
    this.currentQuiz.currentWord.push(letter);
    
    element.style.visibility = 'hidden';
  }

  removeLetter(letterSpan, letter, originalElement) {
    letterSpan.remove();
    const index = this.currentQuiz.currentWord.indexOf(letter);
    if (index > -1) {
      this.currentQuiz.currentWord.splice(index, 1);
    }
    originalElement.style.visibility = 'visible';
  }

  clearWord() {
    document.getElementById('currentWord').innerHTML = '';
    this.currentQuiz.currentWord = [];
    document.querySelectorAll('.draggable-letter').forEach(letter => {
      letter.style.visibility = 'visible';
    });
  }

  handleDragDropTyping(event) {
    if (event.key === 'Enter') {
      this.checkDragDrop();
    }
  }

  checkDragDrop() {
    const typedInput = document.querySelector('.drag-type-input');
    let userWord = '';
    
    // Check if user typed or used drag-drop
    if (typedInput && typedInput.value.trim()) {
      userWord = typedInput.value.toLowerCase().trim();
    } else {
      userWord = this.currentQuiz.currentWord.join('').toLowerCase();
    }
    
    if (!userWord) {
      alert('Please provide an answer using either the letters or the text input.');
      return;
    }
    
    const isCorrect = userWord === this.currentQuiz.correct.toLowerCase();
    
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
    const feedback = currentQuestion.querySelector('.quiz-feedback');
    
    // Mark question as answered
    currentQuestion.classList.add('answered');
    
    // Disable all interactive elements
    currentQuestion.querySelectorAll('button, input, .match-item, .draggable-letter').forEach(el => {
      el.disabled = true;
      el.style.pointerEvents = 'none';
    });

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

  transitionToNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const containerId = currentContainer.id;
    const topic = this.getTopicFromQuizId(containerId);

    const nextQuiz = this.generateQuiz(topic);
    if (!nextQuiz) return;

    // Store the current scroll position relative to the quiz container
    const containerRect = currentContainer.getBoundingClientRect();
    const initialScrollTop = window.pageYOffset;

    // Remove all but the last answered question to keep only 2 questions visible max
    const allQuestions = currentContainer.querySelectorAll('.quiz-question');
    if (allQuestions.length > 1) {
      // Keep only the most recent answered question, remove older ones
      for (let i = 0; i < allQuestions.length - 1; i++) {
        if (allQuestions[i].classList.contains('answered')) {
          allQuestions[i].remove();
        }
      }
      
      // Also remove any separators that are no longer needed
      const separators = currentContainer.querySelectorAll('.quiz-separator');
      if (separators.length > 0) {
        for (let i = 0; i < separators.length - 1; i++) {
          separators[i].remove();
        }
      }
    }

    const currentQuestion = currentContainer.querySelector('.quiz-question:last-child');
    
    // Compact the current question smoothly
    currentQuestion.style.transition = 'all 0.5s ease-out';
    currentQuestion.style.transform = 'scale(0.95)';
    currentQuestion.style.marginBottom = '0.5rem';
    currentQuestion.style.opacity = '0.7';

    // Create separator
    const separator = document.createElement('div');
    separator.className = 'quiz-separator';
    separator.innerHTML = '<div style="text-align: center; margin: 0.3rem 0; color: #ccc; font-size: 0.8rem;">• • •</div>';
    
    // Create next question container
    const nextQuestionDiv = document.createElement('div');
    nextQuestionDiv.className = 'quiz-question new-question';
    nextQuestionDiv.style.opacity = '0';
    nextQuestionDiv.style.transform = 'translateY(20px)';
    nextQuestionDiv.style.transition = 'all 0.6s ease-out';

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
    
    // Insert separator and next question
    currentQuestion.parentNode.insertBefore(separator, currentQuestion.nextSibling);
    separator.parentNode.insertBefore(nextQuestionDiv, separator.nextSibling);

    this.currentQuiz = nextQuiz;

    // Animate the new question in without affecting page scroll
    setTimeout(() => {
      nextQuestionDiv.style.opacity = '1';
      nextQuestionDiv.style.transform = 'translateY(0)';
      
      // Maintain scroll position - don't auto-scroll to new question
      // Only adjust scroll if the new question would be completely out of view
      const newQuestionRect = nextQuestionDiv.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Only scroll if the new question is significantly below the viewport
      if (newQuestionRect.top > viewportHeight - 100) {
        // Smooth, minimal scroll to just bring the question into view
        nextQuestionDiv.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',
          inline: 'nearest'
        });
      }
    }, 100);
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

  const quiz = document.getElementById(quizId);
  if (!quiz) {
    console.log('Quiz element not found:', quizId);
    return;
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
