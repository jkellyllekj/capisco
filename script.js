
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
      introductions: {
        vocabulary: [
          {
            italian: "Mi chiamo",
            english: "My name is",
            gender: "",
            plural: "",
            info: "Reflexive verb from 'chiamarsi'. Much more common than 'il mio nome è'. Literally means 'I call myself'. Essential for all introductions!",
            audio: "mi chiamo"
          },
          {
            italian: "Allegra",
            english: "Cheerful (feminine)",
            gender: "f",
            plural: "allegre",
            info: "From Latin 'alacer' meaning lively. Adjectives must agree with your gender: allegra (f), allegro (m). Perfect for names starting with 'A'!",
            audio: "allegra"
          },
          {
            italian: "Giovane",
            english: "Young",
            gender: "m/f",
            plural: "giovani",
            info: "From Latin 'juvenis'. Related to English 'juvenile'. Adjectives ending in -e don't change with gender! Perfect for names starting with 'G'.",
            audio: "giovane"
          },
          {
            italian: "Gioiosa",
            english: "Joyful (feminine)",
            gender: "f",
            plural: "gioiose",
            info: "From 'gioia' (joy). Related to English 'joy' through French. Another great adjective for names starting with 'G'!",
            audio: "gioiosa"
          },
          {
            italian: "Grande",
            english: "Big/great",
            gender: "m/f",
            plural: "grandi",
            info: "From Latin 'grandis'. Related to English 'grand'. Can mean big, great, or important. Another -e adjective that doesn't change with gender!",
            audio: "grande"
          }
        ]
      },
      places: {
        vocabulary: [
          {
            italian: "Vengo da Palermo",
            english: "I come from Palermo",
            gender: "",
            plural: "",
            info: "Capital of Sicily! From Arabic 'Balarm' meaning 'port'. Famous for its markets, Norman architecture, and incredible street food like arancini!",
            audio: "vengo da Palermo"
          },
          {
            italian: "Abito a Milano",
            english: "I live in Milan",
            gender: "",
            plural: "",
            info: "From Latin 'habitare'. Use 'a' with cities, 'in' with countries. 'Vivo a' is also correct but 'abito a' is more formal.",
            audio: "abito a Milano"
          },
          {
            italian: "Londra",
            english: "London",
            gender: "",
            plural: "",
            info: "Capital of England. From Latin 'Londinium'. Note the Italian pronunciation: 'LON-dra' with clear vowels, not the English 'LUN-don'!",
            audio: "Londra"
          },
          {
            italian: "Germania",
            english: "Germany",
            gender: "f",
            plural: "",
            info: "Note: 'dalla Germania' (from Germany) because 'Germania' is feminine. Countries often take the article in Italian!",
            audio: "Germania"
          },
          {
            italian: "Brighton",
            english: "Brighton",
            gender: "",
            plural: "",
            info: "Coastal city in southern England. Famous for its pier, pebble beach, and vibrant arts scene. Italians would say 'BRIGH-ton' with clear vowels!",
            audio: "Brighton"
          }
        ]
      },
      weather: {
        vocabulary: [
          {
            italian: "Fa caldo",
            english: "It's hot",
            gender: "",
            plural: "",
            info: "From Latin 'calidus'. Use 'fa caldo' (it makes hot) for weather. 'Sono caldo' means 'I am hot' (body temperature), but sounds strange - say 'ho caldo' (I have heat)!",
            audio: "fa caldo"
          },
          {
            italian: "È nuvoloso",
            english: "It's cloudy",
            gender: "",
            plural: "",
            info: "From 'nuvola' (cloud). Unlike temperature, use 'è nuvoloso' (it is cloudy). You can also say 'il cielo è nuvoloso' (the sky is cloudy).",
            audio: "è nuvoloso"
          },
          {
            italian: "È piovoso",
            english: "It's rainy",
            gender: "",
            plural: "",
            info: "From 'pioggia' (rain). 'È piovoso' describes the general condition, while 'piove' means it's actively raining right now. Also: 'sta piovendo' (it's raining now).",
            audio: "è piovoso"
          },
          {
            italian: "Sabato",
            english: "Saturday",
            gender: "m",
            plural: "i sabati",
            info: "From Latin 'Sabbatum' (Sabbath). In Italy, Saturday is when families often get together for dinner or aperitivo!",
            audio: "sabato"
          },
          {
            italian: "Domenica",
            english: "Sunday",
            gender: "f",
            plural: "le domeniche",
            info: "From Latin 'Dies Dominicus' (Lord's Day). Note: feminine gender! Traditional day for family lunch and rest in Italy.",
            audio: "domenica"
          }
        ]
      },
      activities: {
        vocabulary: [
          {
            italian: "Camminare",
            english: "To walk",
            gender: "",
            plural: "",
            info: "From Latin 'ambulare'. Italians love walking - especially the evening 'passeggiata' when the whole town comes out to stroll and socialize!",
            audio: "camminare"
          },
          {
            italian: "Giardinaggio",
            english: "Gardening",
            gender: "m",
            plural: "",
            info: "From French 'jardinage'. Italians are passionate about growing their own vegetables, herbs, and especially tomatoes! Many have small plots or balcony gardens.",
            audio: "giardinaggio"
          },
          {
            italian: "Fare yoga",
            english: "To do yoga",
            gender: "m",
            plural: "",
            info: "From Sanskrit through English. 'Yoga' is masculine in Italian! Popular in Italy, especially in larger cities and wellness centers.",
            audio: "fare yoga"
          },
          {
            italian: "Felice",
            english: "Happy",
            gender: "m/f",
            plural: "felici",
            info: "From Latin 'felix' (fruitful, lucky). Adjectives ending in -e don't change with gender. 'Sono felice' works for everyone!",
            audio: "felice"
          },
          {
            italian: "Mi fa stare bene",
            english: "It makes me feel good",
            gender: "",
            plural: "",
            info: "Literally 'it makes me stay well'. 'Fare stare' is a causative construction - something causes a feeling or state. Very Italian way to express how activities affect you!",
            audio: "mi fa stare bene"
          },
          {
            italian: "Mi rende felice",
            english: "It makes me happy",
            gender: "",
            plural: "",
            info: "'Rendere' means to make/render. Different from 'fare' - 'rendere' focuses on the result/outcome. Great for expressing emotional results of activities!",
            audio: "mi rende felice"
          }
        ]
      },
      dialogue_presentazioni: {
        vocabulary: [
          {
            italian: "Mi chiamo Alessia. Sono allegra.",
            english: "My name is Alessia. I am cheerful.",
            gender: "",
            plural: "",
            info: "Perfect example of name + matching adjective alliteration. Creates a memorable introduction pattern.",
            audio: "mi chiamo Alessia sono allegra"
          },
          {
            italian: "Da dove vieni?",
            english: "Where do you come from?",
            gender: "",
            plural: "",
            info: "Essential question for learning about someone's background. 'Da dove' (from where) + 'vieni' (you come).",
            audio: "da dove vieni"
          },
          {
            italian: "Che cosa ti piace fare?",
            english: "What do you like to do?",
            gender: "",
            plural: "",
            info: "'Che cosa' (what) + 'ti piace fare' (you like to do). Great way to learn about someone's interests and hobbies.",
            audio: "che cosa ti piace fare"
          },
          {
            italian: "Mi piace camminare e fare giardinaggio",
            english: "I like walking and gardening",
            gender: "",
            plural: "",
            info: "Perfect way to list multiple activities you enjoy. Use 'e' (and) to connect activities.",
            audio: "mi piace camminare e fare giardinaggio"
          }
        ]
      },
      grammar_reflexive: {
        vocabulary: [
          {
            italian: "Mi chiamo",
            english: "My name is (I call myself)",
            gender: "",
            plural: "",
            info: "Most common way to say your name. Conjugation: mi chiamo, ti chiami, si chiama, ci chiamiamo, vi chiamate, si chiamano. Essential for introductions!",
            audio: "mi chiamo"
          },
          {
            italian: "Ti chiami",
            english: "Your name is (you call yourself)",
            gender: "",
            plural: "",
            info: "Used in questions: 'Come ti chiami?' (What's your name?). The reflexive pronoun 'ti' agrees with the subject 'tu' (you).",
            audio: "ti chiami"
          },
          {
            italian: "Mi alzo",
            english: "I get up",
            gender: "",
            plural: "",
            info: "Literally 'to lift oneself up'. Conjugation: mi alzo, ti alzi, si alza, ci alziamo, vi alzate, si alzano. Perfect for talking about daily routines!",
            audio: "mi alzo"
          },
          {
            italian: "A che ora ti alzi?",
            english: "What time do you get up?",
            gender: "",
            plural: "",
            info: "Essential question about daily routines. Notice 'ti alzi' uses the reflexive pronoun 'ti' with the conjugated verb.",
            audio: "a che ora ti alzi"
          }
        ]
      },
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
    document.removeEventListener('keydown', this.handleGlobalSpaceBar.bind(this));

    // Add global keyboard listener
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));

    // Add separate global space bar listener for audio playback
    document.addEventListener('keydown', this.handleGlobalSpaceBar.bind(this));
  }

  handleGlobalSpaceBar(event) {
    // Only handle space bar for listening questions
    if (event.key === ' ' && this.currentQuiz && this.currentQuiz.type === 'listening') {
      // Check if we're in an input field
      if (event.target.matches('input')) {
        const input = event.target;
        const cursorPos = input.selectionStart;
        const inputValue = input.value;

        // Only play audio if input is empty or cursor is at very beginning
        if (inputValue.length === 0 || cursorPos === 0) {
          event.preventDefault();
          const playBtn = document.querySelector('.play-audio-btn');
          if (playBtn) {
            playBtn.click();
            // Re-focus input after audio
            setTimeout(() => {
              input.focus();
            }, 100);
          }
        }
        // Otherwise, let normal space typing happen
      } else {
        // Not in input field, play audio and focus input
        event.preventDefault();
        const playBtn = document.querySelector('.play-audio-btn');
        if (playBtn) {
          playBtn.click();
          setTimeout(() => {
            const input = document.querySelector('.audio-input');
            if (input) {
              input.focus();
            }
          }, 100);
        }
      }
    }
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
    // Hide this hint entirely to prevent unwanted popups
    return;
  }

  hideKeyboardMatchingHint() {
    const hint = document.querySelector('.keyboard-matching-hint');
    if (hint) {
      hint.style.display = 'none';
    }
  }

  handleTypingKeyboard(event) {
    const key = event.key;

    // Space bar to play audio for listening questions - handle even when input is focused
    if (key === ' ' && this.currentQuiz.type === 'listening') {
      // Check if we're in an input field
      if (event.target.matches('input')) {
        // If cursor is at the beginning of the input or input is empty, play audio
        const input = event.target;
        const cursorPos = input.selectionStart;
        const inputValue = input.value;

        // Play audio if input is empty or cursor is at beginning and first char would be space
        if (inputValue.length === 0 || (cursorPos === 0 && inputValue[0] !== ' ')) {
          event.preventDefault();
          const playBtn = document.querySelector('.play-audio-btn');
          if (playBtn) {
            playBtn.click();
          }
          return;
        }
        // Otherwise, let the space be typed normally
      } else {
        // Not in input field, definitely play audio
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
    if (!data || !data.vocabulary || data.vocabulary.length === 0) {
      console.log('No data found for topic:', topic);
      console.log('Available topics:', Object.keys(this.quizData));
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

      try {
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
      } catch (error) {
        console.error('Error generating quiz:', error);
      }

      attempts++;
      if (attempts >= 50) break;
    }

    // If we can't find a unique question, clear used questions and try again
    this.usedQuestions.clear();
    return this.generateMultipleChoice(vocab);
  }

  generateMultipleChoice(vocab) {
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    const options = [correct];

    // If we have less than 4 vocab items, pad with duplicates but different answer text
    while (options.length < 4 && options.length < vocab.length) {
      const random = vocab[Math.floor(Math.random() * vocab.length)];
      if (!options.find(opt => opt.italian === random.italian)) {
        options.push(random);
      }
    }

    // If we still don't have 4 options, create fake ones
    while (options.length < 4) {
      const fakeOption = {
        italian: 'fake_' + Math.random().toString(36).substr(2, 9),
        english: 'fake answer'
      };
      options.push(fakeOption);
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

  renderTypingContent(quiz) {
    let html = '<div class="keyboard-hint">Type your answer and press Enter to submit</div>';
    html += '<input type="text" class="quiz-input" placeholder="Type your answer..." onkeyup="quizSystem.handleTypingInput(event)" autofocus>';
    html += '<button class="quiz-check" onclick="quizSystem.checkTyping()" style="margin-top: 1rem;">Check Answer (Enter)</button>';
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
  }

  selectOption(answer, button) {
    if (button.disabled || button.style.pointerEvents === 'none') return;

    const options = button.parentNode.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));

    button.classList.add('selected');

    // Store the clean answer without any formatting
    this.selectedAnswer = answer;

    console.log('=== OPTION SELECTED DEBUG ===');
    console.log('Selected answer:', JSON.stringify(this.selectedAnswer));
    console.log('Current quiz correct:', JSON.stringify(this.currentQuiz.correct));
    console.log('Button text:', button.textContent);
    console.log('=== END OPTION SELECT DEBUG ===');

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

    // Simple validation - normalize whitespace and case
    const cleanUser = userAnswer.toLowerCase().trim();
    const cleanCorrect = correctAnswer.toLowerCase().trim();

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

    // Simple validation - normalize whitespace and case
    const cleanUser = userAnswer.toLowerCase().trim();
    const cleanCorrect = correctAnswer.toLowerCase().trim();

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

    // Simple validation - normalize whitespace and case
    const cleanUser = userWord.toLowerCase().trim();
    const cleanCorrect = correctAnswer.toLowerCase().trim();

    console.log('Clean user:', JSON.stringify(cleanUser));
    console.log('Clean correct:', JSON.stringify(cleanCorrect));

    const isCorrect = cleanUser === cleanCorrect;
    console.log('Final result:', isCorrect);
    console.log('=== END DRAG-DROP VALIDATION DEBUG ===');

    this.selectedAnswer = userWord;
    this.showFeedback(isCorrect, this.currentQuiz.explanation);
  }

  checkAnswer() {
    if (!this.currentQuiz) {
      console.log('No current quiz found');
      return;
    }

    if (!this.selectedAnswer) {
      console.log('No answer selected');
      return;
    }

    // Prevent multiple submissions
    if (this.isChecking) {
      console.log('Already checking answer, ignoring...');
      return;
    }

    this.isChecking = true;

    console.log('=== CHECKING ANSWER DEBUG ===');
    console.log('Selected answer:', JSON.stringify(this.selectedAnswer));
    console.log('Correct answer:', JSON.stringify(this.currentQuiz.correct));
    console.log('Quiz type:', this.currentQuiz.type);

    const isCorrect = this.selectedAnswer === this.currentQuiz.correct;
    console.log('Is correct:', isCorrect);
    console.log('=== END CHECK ANSWER DEBUG ===');

    this.showFeedback(isCorrect, this.currentQuiz.explanation);

    // Reset checking flag after feedback is shown
    setTimeout(() => {
      this.isChecking = false;
    }, 1000);
  }

  showFeedback(isCorrect, explanation) {
    console.log('=== SHOWING FEEDBACK ===');
    console.log('Is correct:', isCorrect);
    console.log('Explanation:', explanation);

    // Find the current active quiz container
    const activeQuizContainer = document.querySelector('.quiz-block:not(.hidden)');
    if (!activeQuizContainer) {
      console.log('No active quiz container found');
      return;
    }

    const currentQuestion = activeQuizContainer.querySelector('.quiz-question:last-child');
    if (!currentQuestion) {
      console.log('No current question found for feedback');
      return;
    }

    const feedback = currentQuestion.querySelector('.quiz-feedback');
    if (!feedback) {
      console.log('No feedback element found');
      return;
    }

    console.log('=== SHOWING FEEDBACK ===');
    console.log('Is correct:', isCorrect);
    console.log('Explanation:', explanation);

    // Mark question as answered
    currentQuestion.classList.add('answered');

    // Disable all interactive elements immediately and comprehensively
    currentQuestion.querySelectorAll('button, input, .match-item, .draggable-letter, .quiz-option').forEach(el => {
      el.disabled = true;
      el.style.pointerEvents = 'none';
      el.style.opacity = '0.7';
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
          if (opt.textContent.includes(this.currentQuiz.correct)) {
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
    if (!currentContainer) {
      console.log('No current container found for transition');
      return;
    }

    const containerId = currentContainer.id;
    const topic = this.getTopicFromQuizId(containerId);

    console.log('=== TRANSITION TO NEXT QUESTION ===');
    console.log('Container ID:', containerId);
    console.log('Topic:', topic);

    const nextQuiz = this.generateQuiz(topic);
    if (!nextQuiz) {
      console.log('Failed to generate next quiz for topic:', topic);
      return;
    }

    console.log('Generated next quiz:', nextQuiz.type);
    console.log('=== END TRANSITION DEBUG ===');

    const allQuestions = currentContainer.querySelectorAll('.quiz-question');

    // Step 1: Remove the oldest question if we have more than 1
    if (allQuestions.length > 1) {
      const oldestQuestion = allQuestions[0];
      oldestQuestion.style.transition = 'all 0.4s ease-out';
      oldestQuestion.style.opacity = '0';
      oldestQuestion.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        oldestQuestion.remove();
        // Remove corresponding separator
        const separators = currentContainer.querySelectorAll('.quiz-separator');
        if (separators.length > 0) {
          separators[0].remove();
        }
      }, 400);
    }

    // Step 2: Get the current answered question
    const currentQuestion = allQuestions[allQuestions.length - 1];

    // Step 3: Compact the current answered question
    setTimeout(() => {
      currentQuestion.style.transition = 'all 0.6s ease-out';
      currentQuestion.style.transform = 'scale(0.95)';
      currentQuestion.style.opacity = '0.7';
      currentQuestion.style.marginBottom = '0.5rem';
    }, 200);

    // Step 4: Create separator
    const separator = document.createElement('div');
    separator.className = 'quiz-separator';
    separator.innerHTML = '<div style="text-align: center; margin: 0.3rem 0; color: #ccc; font-size: 0.8rem;">• • •</div>';
    separator.style.opacity = '0';
    separator.style.transition = 'opacity 0.4s ease-out';

    // Step 5: Create new question
    const nextQuestionDiv = document.createElement('div');
    nextQuestionDiv.className = 'quiz-question new-question';
    nextQuestionDiv.style.opacity = '0';
    nextQuestionDiv.style.transform = 'translateY(30px)';
    nextQuestionDiv.style.transition = 'all 0.7s ease-out';

    // Generate the HTML content using the existing render method
    this.renderQuiz(nextQuiz, 'temp-container');
    const tempContainer = document.getElementById('temp-container');
    if (tempContainer) {
      nextQuestionDiv.innerHTML = tempContainer.innerHTML;
      tempContainer.remove();
    }

    // Step 6: Insert elements into DOM
    currentQuestion.parentNode.insertBefore(separator, currentQuestion.nextSibling);
    separator.parentNode.insertBefore(nextQuestionDiv, separator.nextSibling);

    // CRITICAL: Update currentQuiz BEFORE any animations or interactions
    this.currentQuiz = nextQuiz;

    // Initialize keyboard navigation for the new question
    this.initializeKeyboardNavigation();
    this.currentHighlight = 0;

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

      // Auto-focus first input if available
      const input = nextQuestionDiv.querySelector('input[autofocus]');
      if (input) {
        input.focus();
      }

      // Highlight first option for multiple choice
      if (nextQuiz.type === 'multipleChoice') {
        const options = nextQuestionDiv.querySelectorAll('.quiz-option');
        if (options.length > 0) {
          options[0].classList.add('keyboard-highlight');
        }
      }
    }, 800);
  }

  getTopicFromQuizId(quizId) {
    // Detect which page we're on to determine correct topic mapping
    const currentPath = window.location.pathname;
    const isAlMercato = currentPath.includes('al-mercato');
    const isPresentazioni = currentPath.includes('presentazioni-personali');
    
    // Map quiz IDs to topics based on the lesson structure and current page
    let quizIdToTopic = {};
    
    if (isAlMercato) {
      quizIdToTopic = {
        'quiz0': 'seasons',           // Seasons quiz
        'quiz1': 'vocabulary',        // Main vocabulary quiz  
        'quiz2': 'expressions',       // Expressions quiz
        'quiz3': 'dialogue',          // Dialogue quiz
        'quiz4': 'extraVocabulary',   // Extra vocabulary
        'quiz5': 'grammar'            // Grammar quiz
      };
    } else if (isPresentazioni) {
      quizIdToTopic = {
        'quiz0': 'introductions',     // Introductions quiz
        'quiz1': 'places',            // Places quiz
        'quiz2': 'weather',           // Weather quiz
        'quiz3': 'activities',        // Activities quiz
        'quiz4': 'dialogue_presentazioni', // Dialogue quiz
        'quiz5': 'grammar_reflexive'  // Grammar quiz
      };
    } else {
      // Default mapping for main page or other pages
      quizIdToTopic = {
        'quiz0': 'seasons',
        'quiz1': 'vocabulary',
        'quiz2': 'expressions',
        'quiz3': 'dialogue',
        'quiz4': 'extraVocabulary',
        'quiz5': 'grammar'
      };
    }

    // If the quizId matches our predefined ones, return the topic
    if (quizIdToTopic[quizId]) {
      return quizIdToTopic[quizId];
    }

    // Default mapping based on common patterns
    if (quizId.includes('introductions') || quizId.includes('6')) {
      return 'introductions';
    } else if (quizId.includes('places') || quizId.includes('7')) {
      return 'places';
    } else if (quizId.includes('weather') || quizId.includes('8')) {
      return 'weather';
    } else if (quizId.includes('activities') || quizId.includes('9')) {
      return 'activities';
    } else if (quizId.includes('dialogue_presentazioni') || quizId.includes('10')) {
      return 'dialogue_presentazioni';
    } else if (quizId.includes('grammar_reflexive') || quizId.includes('11')) {
      return 'grammar_reflexive';
    }
    else if (quizId.includes('seasons') || quizId.includes('0')) {
      return 'seasons';
    } else if (quizId.includes('expressions') || quizId.includes('2')) {
      return 'expressions';
    } else if (quizId.includes('dialogue') || quizId.includes('3')) {
      return 'dialogue';
    } else if (quizId.includes('extra') || quizId.includes('4')) {
      return 'extraVocabulary';
    } else if (quizId.includes('grammar') || quizId.includes('5')) {
      return 'grammar';
    }

    // Default fallback based on current page
    if (isPresentazioni) {
      return 'introductions';
    } else {
      return 'vocabulary';
    }
  }
}

// Create global quiz system instance
const quizSystem = new QuizSystem();

// Global toggle function
function toggleQuiz(quizId) {
  let quiz = document.getElementById(quizId);
  if (!quiz) {
    quiz = document.createElement('div');
    quiz.id = quizId;
    quiz.className = 'quiz-block';
    const clickedButton = Array.from(document.querySelectorAll('button')).find(btn => {
      return btn.dataset.quizId === quizId || 
             (btn.getAttribute('onclick') || '').includes(quizId);
    });
    if (clickedButton) {
      clickedButton.insertAdjacentElement('afterend', quiz);
    } else {
      const allButtons = document.querySelectorAll('.quiz-btn');
      if (allButtons.length > 0) {
        const buttonIndex = parseInt(quizId.replace('quiz', '')) || 0;
        const targetButton = allButtons[buttonIndex] || allButtons[allButtons.length - 1];
        targetButton.insertAdjacentElement('afterend', quiz);
      } else {
        document.body.appendChild(quiz);
      }
    }
  }
  quiz.classList.remove('hidden');
  quiz.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; margin: 1rem 0; padding: 1rem; border: 2px solid #e9ecef; border-radius: 8px; background: #f8f9ff; min-height: 200px;';
  const topic = quizSystem.getTopicFromQuizId(quizId);
  const quizData = quizSystem.generateQuiz(topic);
  if (quizData) {
    quizSystem.renderQuiz(quizData, quizId);
    quiz.style.display = 'block';
    quiz.style.visibility = 'visible';
    quiz.style.opacity = '1';
    quiz.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    quiz.innerHTML = '<p style="color: red; font-weight: bold;">Error: Could not generate quiz. Please try again.</p>';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeVocabInteractions();
  const quizButtons = document.querySelectorAll('.quiz-btn, button[onclick*="toggleQuiz"]');
  quizButtons.forEach((btn, index) => {
    const onclickValue = btn.getAttribute('onclick');
    let quizId = null;
    if (onclickValue) {
      const match = onclickValue.match(/toggleQuiz\('([^']+)'\)/);
      if (match) {
        quizId = match[1];
      }
    }
    if (!quizId) {
      quizId = 'quiz' + index;
    }
    btn.dataset.quizId = quizId;
    btn.removeAttribute('onclick');
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleQuiz(quizId);
    });
  });
});
