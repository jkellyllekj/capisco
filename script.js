
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

// Quiz System
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
  }

  generateQuiz(topic) {
    const data = this.quizData[topic];
    if (!data || !data.vocabulary || data.vocabulary.length < 4) {
      console.log('No data found for topic:', topic);
      return null;
    }

    const vocab = data.vocabulary;
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

    const options = button.parentNode.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));

    button.classList.add('selected');
    this.selectedAnswer = answer;

    setTimeout(() => {
      this.checkAnswer();
    }, 500);
  }

  checkAnswer() {
    if (!this.selectedAnswer || !this.currentQuiz) return;

    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    const selectedButton = document.querySelector('.quiz-option.selected');
    if (!selectedButton) return;

    const currentQuestion = selectedButton.closest('.quiz-question');
    const feedback = currentQuestion.querySelector('.quiz-feedback');
    const options = selectedButton.parentNode.querySelectorAll('.quiz-option');

    options.forEach(opt => opt.disabled = true);

    if (isCorrect) {
      selectedButton.classList.add('correct');
      feedback.innerHTML = '<div class="correct-feedback"><i class="fas fa-check"></i> Correct! ' + this.currentQuiz.explanation + '</div>';
      this.score++;
    } else {
      selectedButton.classList.add('incorrect');
      options.forEach(opt => {
        if (opt.textContent === this.currentQuiz.correct) {
          opt.classList.add('correct');
        }
      });
      feedback.innerHTML = '<div class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect. The correct answer is "' + this.currentQuiz.correct + '". ' + this.currentQuiz.explanation + '</div>';
    }

    this.totalQuestions++;
    feedback.style.display = 'block';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'quiz-score-display';
    scoreDisplay.innerHTML = '<div class="score-text">Score: ' + this.score + '/' + this.totalQuestions + ' (' + Math.round((this.score / this.totalQuestions) * 100) + '%)</div>';
    feedback.appendChild(scoreDisplay);

    // Hide previous questions (keep only the last answered one visible)
    const allQuestions = currentQuestion.parentNode.querySelectorAll('.quiz-question');
    if (allQuestions.length > 1) {
      // Hide all but the current (last) question
      for (let i = 0; i < allQuestions.length - 1; i++) {
        allQuestions[i].style.display = 'none';
      }
      
      // Also hide separators except the last one
      const separators = currentQuestion.parentNode.querySelectorAll('.quiz-separator');
      for (let i = 0; i < separators.length - 1; i++) {
        separators[i].style.display = 'none';
      }
    }

    this.selectedAnswer = null;

    setTimeout(() => {
      this.addNextQuestion();
    }, 3000);
  }

  addNextQuestion() {
    const currentContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!currentContainer) return;

    const containerId = currentContainer.id;
    const topic = this.getTopicFromQuizId(containerId);

    const nextQuiz = this.generateQuiz(topic);
    if (!nextQuiz) return;

    const separator = document.createElement('div');
    separator.className = 'quiz-separator';
    separator.innerHTML = '<div style="text-align: center; margin: 1.5rem 0;"><span style="color: #6c757d; font-size: 0.9rem;"><i class="fas fa-arrow-down"></i> Next Question</span></div>';
    currentContainer.appendChild(separator);

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

    this.currentQuiz = nextQuiz;

    setTimeout(() => {
      currentContainer.scrollTop = currentContainer.scrollHeight;
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

    quizSystem.score = 0;
    quizSystem.totalQuestions = 0;

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
