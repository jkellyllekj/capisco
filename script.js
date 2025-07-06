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

// Quiz System - Simplified and Working Version
class QuizSystem {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.questionsAnswered = 0;
    this.selectedAnswer = null;
    this.selectedMatches = new Map();
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
          { italian: 'formaggio', english: 'cheese' }
        ]
      },
      expressions: {
        vocabulary: [
          { italian: 'Vorrei', english: 'I would like' },
          { italian: 'Quanto costa', english: 'How much does it cost' },
          { italian: 'Un chilo di', english: 'A kilo of' },
          { italian: 'Mezzo chilo', english: 'Half a kilo' }
        ]
      },
      dialogue: {
        vocabulary: [
          { italian: 'fresco', english: 'fresh' },
          { italian: 'stagionato', english: 'aged' },
          { italian: 'ne', english: 'of it/them' }
        ]
      },
      extraVocabulary: {
        vocabulary: [
          { italian: 'abito', english: 'suit' },
          { italian: 'passi', english: 'steps' },
          { italian: 'cinquanta', english: 'fifty' }
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

  generateQuiz(topic) {
    const data = this.quizData[topic];
    if (!data || !data.vocabulary || data.vocabulary.length < 4) return null;

    const vocab = data.vocabulary;
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
      question: 'What is the Italian word for "' + correct.english + '"?',
      options: options.map(opt => opt.italian),
      correct: correct.italian,
      explanation: '"' + correct.italian + '" means "' + correct.english + '" in English.'
    };
  }

  renderQuiz(quiz, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !quiz) return;

    let html = '<div class="quiz-question">';
    html += '<h4>' + quiz.question + '</h4>';
    html += '<div class="quiz-options">';

    for (let i = 0; i < quiz.options.length; i++) {
      html += '<button class="quiz-option" onclick="quizSystem.selectOption(\'' + quiz.options[i] + '\', this)">' + quiz.options[i] + '</button>';
    }

    html += '</div>';
    html += '<div class="quiz-feedback" style="display: none;"></div>';
    html += '</div>';

    container.innerHTML = html;
    this.currentQuiz = quiz;
  }

  selectOption(answer, button) {
    if (button.disabled) return;

    // Remove previous selections
    const options = button.parentNode.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));

    button.classList.add('selected');
    this.selectedAnswer = answer;

    // Auto-check after short delay
    setTimeout(() => {
      this.checkAnswer();
    }, 500);
  }

  checkAnswer() {
    if (!this.selectedAnswer || !this.currentQuiz) return;

    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    const selectedButton = document.querySelector('.quiz-option.selected');
    if (!selectedButton) return;

    const feedback = selectedButton.closest('.quiz-question').querySelector('.quiz-feedback');
    const options = selectedButton.parentNode.querySelectorAll('.quiz-option');

    // Disable all options
    options.forEach(opt => opt.disabled = true);

    if (isCorrect) {
      selectedButton.classList.add('correct');
      feedback.innerHTML = '<div class="correct-feedback"><i class="fas fa-check"></i> Correct! ' + this.currentQuiz.explanation + '</div>';
      this.score++;
    } else {
      selectedButton.classList.add('incorrect');
      // Show correct answer
      options.forEach(opt => {
        if (opt.textContent === this.currentQuiz.correct) {
          opt.classList.add('correct');
        }
      });
      feedback.innerHTML = '<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "' + this.currentQuiz.correct + '". ' + this.currentQuiz.explanation + '</div>';
    }

    this.totalQuestions++;
    feedback.style.display = 'block';

    // Show score
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = '<div class="score-text">Score: ' + this.score + '/' + this.totalQuestions + ' (' + Math.round((this.score / this.totalQuestions) * 100) + '%)</div>';
    feedback.appendChild(scoreDisplay);

    // Reset for next question
    this.selectedAnswer = null;

    // Generate next question after delay
    setTimeout(() => {
      this.addNextQuestion();
    }, 3000);
  }

  addNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    // Get topic from container ID
    const containerId = currentContainer.id;
    const topicIndex = containerId.replace('quiz', '');
    const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar'];
    const topic = topics[parseInt(topicIndex)] || 'vocabulary';

    const nextQuiz = this.generateQuiz(topic);
    if (!nextQuiz) return;

    // Add separator
    const separator = document.createElement('div');
    separator.className = 'quiz-separator';
    separator.innerHTML = '<div style="text-align: center; margin: 1.5rem 0;"><span style="color: #6c757d; font-size: 0.9rem;"><i class="fas fa-arrow-down"></i> Next Question</span></div>';
    currentContainer.appendChild(separator);

    // Add new question
    const nextQuestionDiv = document.createElement('div');
    nextQuestionDiv.className = 'quiz-question';

    let html = '<h4>' + nextQuiz.question + '</h4>';
    html += '<div class="quiz-options">';

    for (let i = 0; i < nextQuiz.options.length; i++) {
      html += '<button class="quiz-option" onclick="quizSystem.selectOption(\'' + nextQuiz.options[i] + '\', this)">' + nextQuiz.options[i] + '</button>';
    }

    html += '</div>';
    html += '<div class="quiz-feedback" style="display: none;"></div>';

    nextQuestionDiv.innerHTML = html;
    currentContainer.appendChild(nextQuestionDiv);

    // Update current quiz
    this.currentQuiz = nextQuiz;

    // Scroll to new question
    setTimeout(() => {
      currentContainer.scrollTop = currentContainer.scrollHeight;
    }, 100);
  }
}

// Create global quiz system instance
const quizSystem = new QuizSystem();

// Toggle quiz function - FIXED VERSION
function toggleQuiz(quizId) {
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

    // Determine topic from quiz ID
    const topicIndex = quizId.replace('quiz', '');
    const topics = ['seasons', 'vocabulary', 'expressions', 'dialogue', 'extraVocabulary', 'grammar'];
    const topic = topics[parseInt(topicIndex)] || 'vocabulary';

    console.log('Topic:', topic);

    // Reset scores
    quizSystem.score = 0;
    quizSystem.totalQuestions = 0;

    // Generate and render first quiz
    const quizData = quizSystem.generateQuiz(topic);
    if (quizData) {
      console.log('Generated quiz:', quizData);
      quizSystem.renderQuiz(quizData, quizId);
    } else {
      console.log('Failed to generate quiz');
    }
  } else {
    quiz.classList.add('hidden');
    quiz.style.display = 'none';
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');

  initializeVocabInteractions();

  // Set up quiz button listeners - FIXED VERSION
  const quizButtons = document.querySelectorAll('.quiz-btn');
  console.log('Found quiz buttons:', quizButtons.length);

  quizButtons.forEach((btn, index) => {
    console.log('Setting up quiz button:', index);

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Quiz button clicked');

      // Extract quiz ID from onclick attribute
      const onclickAttr = this.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/toggleQuiz\('([^']+)'\)/);
        if (match && match[1]) {
          console.log('Calling toggleQuiz with:', match[1]);
          toggleQuiz(match[1]);
        }
      }
    });
  });

  console.log('Initialization complete');
});