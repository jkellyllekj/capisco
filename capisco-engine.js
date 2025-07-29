
// Capisco - Dynamic Language Learning Generator
class CapiscoEngine {
  constructor() {
    this.currentLesson = null;
    this.processingSteps = [
      'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'
    ];
    this.currentStep = 0;
    this.maxDuration = 120; // 2 minutes for free version
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.getElementById('lesson-generator').addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateLesson();
    });
  }

  async generateLesson() {
    const videoUrl = document.getElementById('video-url').value;
    const transcriptFile = document.getElementById('transcript-file').files[0];
    const sourceLanguage = document.getElementById('source-language').value;
    const targetLanguage = document.getElementById('target-language').value;

    if (!videoUrl && !transcriptFile) {
      alert('Please provide either a YouTube URL or upload a transcript file.');
      return;
    }

    this.showProcessingStatus();
    
    try {
      // Step 1: Extract transcript
      await this.updateProcessingStep(0);
      const transcript = await this.extractTranscript(videoUrl, transcriptFile);
      
      // Check duration limit
      if (this.estimateTranscriptDuration(transcript) > this.maxDuration) {
        throw new Error('Video exceeds 2-minute limit for free version. Please upgrade or use a shorter video.');
      }

      // Step 2: Analyze language and content
      await this.updateProcessingStep(1);
      const analysis = await this.analyzeContent(transcript, sourceLanguage);

      // Step 3: Identify vocabulary
      await this.updateProcessingStep(2);
      const vocabulary = await this.extractVocabulary(transcript, analysis);

      // Step 4: Generate translations
      await this.updateProcessingStep(3);
      const translations = await this.generateTranslations(vocabulary, sourceLanguage, targetLanguage);

      // Step 5: Create interactive elements
      await this.updateProcessingStep(4);
      const quizData = await this.generateQuizData(vocabulary, translations);

      // Step 6: Build lesson
      await this.updateProcessingStep(5);
      const lesson = await this.buildLesson(transcript, vocabulary, translations, quizData, analysis);

      this.hideProcessingStatus();
      this.displayLesson(lesson);

    } catch (error) {
      console.error('Error generating lesson:', error);
      alert('Error: ' + error.message);
      this.hideProcessingStatus();
    }
  }

  async updateProcessingStep(stepIndex) {
    // Mark previous steps as complete
    for (let i = 0; i < stepIndex; i++) {
      document.getElementById(this.processingSteps[i]).classList.add('complete');
      document.getElementById(this.processingSteps[i]).classList.remove('active');
    }
    
    // Mark current step as active
    document.getElementById(this.processingSteps[stepIndex]).classList.add('active');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  }

  showProcessingStatus() {
    document.getElementById('processing-status').classList.add('active');
    document.getElementById('generate-btn').disabled = true;
  }

  hideProcessingStatus() {
    document.getElementById('processing-status').classList.remove('active');
    document.getElementById('generate-btn').disabled = false;
    
    // Reset all steps
    this.processingSteps.forEach(step => {
      document.getElementById(step).classList.remove('active', 'complete');
    });
  }

  async extractTranscript(videoUrl, transcriptFile) {
    if (transcriptFile) {
      return await this.readTranscriptFile(transcriptFile);
    } else {
      return await this.extractYouTubeTranscript(videoUrl);
    }
  }

  async readTranscriptFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = () => reject(new Error('Failed to read transcript file'));
      reader.readAsText(file);
    });
  }

  async extractYouTubeTranscript(videoUrl) {
    // In a real implementation, this would use YouTube API or a transcript extraction service
    // For demo purposes, we'll use a mock transcript
    const videoId = this.extractVideoId(videoUrl);
    
    // Mock Italian transcript for demonstration
    return `Ciao a tutti! Mi chiamo Marco e oggi parleremo del tempo. 
    In Italia, abbiamo quattro stagioni: primavera, estate, autunno e inverno. 
    Mi piace molto l'estate perché fa caldo e posso andare al mare. 
    E voi, quale stagione preferite? La primavera è bella perché i fiori sbocciano. 
    L'autunno ha colori meravigliosi, e l'inverno... beh, fa freddo ma è romantico.
    Oggi il tempo è nuvoloso, ma domani dovrebbe fare bel tempo.
    Preferisco quando c'è il sole. Il sole mi rende felice!`;
  }

  extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }

  estimateTranscriptDuration(transcript) {
    // Rough estimate: average speaking rate is about 150 words per minute
    const wordCount = transcript.split(/\s+/).length;
    return Math.ceil(wordCount / 2.5); // seconds (150 words/min = 2.5 words/sec)
  }

  async analyzeContent(transcript, sourceLanguage) {
    // Mock content analysis - in real app would use NLP/AI
    return {
      detectedLanguage: sourceLanguage || 'it',
      topics: ['weather', 'seasons', 'preferences'],
      difficultyLevel: 'beginner',
      keyThemes: ['Tempo (Weather)', 'Stagioni (Seasons)', 'Preferenze (Preferences)']
    };
  }

  async extractVocabulary(transcript, analysis) {
    // Mock vocabulary extraction - in real app would use advanced NLP
    return [
      {
        word: 'stagioni',
        baseForm: 'stagione',
        partOfSpeech: 'noun',
        gender: 'f',
        context: 'abbiamo quattro stagioni',
        frequency: 2
      },
      {
        word: 'primavera',
        baseForm: 'primavera',
        partOfSpeech: 'noun',
        gender: 'f',
        context: 'La primavera è bella',
        frequency: 2
      },
      {
        word: 'estate',
        baseForm: 'estate',
        partOfSpeech: 'noun',
        gender: 'f',
        context: 'Mi piace molto l\'estate',
        frequency: 1
      },
      {
        word: 'autunno',
        baseForm: 'autunno',
        partOfSpeech: 'noun',
        gender: 'm',
        context: 'L\'autunno ha colori meravigliosi',
        frequency: 1
      },
      {
        word: 'inverno',
        baseForm: 'inverno',
        partOfSpeech: 'noun',
        gender: 'm',
        context: 'l\'inverno... fa freddo',
        frequency: 1
      },
      {
        word: 'preferite',
        baseForm: 'preferire',
        partOfSpeech: 'verb',
        gender: null,
        context: 'quale stagione preferite?',
        frequency: 1
      },
      {
        word: 'sole',
        baseForm: 'sole',
        partOfSpeech: 'noun',
        gender: 'm',
        context: 'quando c\'è il sole',
        frequency: 2
      }
    ];
  }

  async generateTranslations(vocabulary, sourceLanguage, targetLanguage) {
    // Mock translations - in real app would use translation API
    const translations = {
      'stagione': { 
        english: 'season', 
        pronunciation: 'sta-JO-ne',
        etymology: 'From Latin "statio" (standing, position)',
        usage: 'Feminine noun, plural: stagioni'
      },
      'primavera': { 
        english: 'spring', 
        pronunciation: 'pri-ma-VE-ra',
        etymology: 'From Latin "prima" (first) + "vera" (spring)',
        usage: 'Feminine noun, plural: primavere'
      },
      'estate': { 
        english: 'summer', 
        pronunciation: 'e-STA-te',
        etymology: 'From Latin "aestas"',
        usage: 'Feminine noun, plural: estati'
      },
      'autunno': { 
        english: 'autumn/fall', 
        pronunciation: 'au-TUN-no',
        etymology: 'From Latin "autumnus"',
        usage: 'Masculine noun, plural: autunni'
      },
      'inverno': { 
        english: 'winter', 
        pronunciation: 'in-VER-no',
        etymology: 'From Latin "hibernus"',
        usage: 'Masculine noun, plural: inverni'
      },
      'preferire': { 
        english: 'to prefer', 
        pronunciation: 'pre-fe-RI-re',
        etymology: 'From Latin "praeferre"',
        usage: 'Regular -ire verb'
      },
      'sole': { 
        english: 'sun', 
        pronunciation: 'SO-le',
        etymology: 'From Latin "sol"',
        usage: 'Masculine noun, no plural (uncountable)'
      }
    };

    return translations;
  }

  async generateQuizData(vocabulary, translations) {
    return {
      multipleChoice: vocabulary.slice(0, 4),
      matching: vocabulary.slice(0, 5),
      listening: vocabulary.slice(0, 3),
      typing: vocabulary.slice(0, 4),
      dragDrop: vocabulary.slice(0, 3)
    };
  }

  async buildLesson(transcript, vocabulary, translations, quizData, analysis) {
    return {
      title: `Learn from: "${analysis.keyThemes.join(', ')}"`,
      sourceLanguage: analysis.detectedLanguage,
      difficulty: analysis.difficultyLevel,
      transcript: transcript,
      vocabulary: vocabulary,
      translations: translations,
      quizData: quizData,
      sections: this.generateLessonSections(vocabulary, translations, analysis)
    };
  }

  generateLessonSections(vocabulary, translations, analysis) {
    const sections = [];

    // Group vocabulary by themes
    const themes = {
      'Seasons': ['primavera', 'estate', 'autunno', 'inverno'],
      'Weather': ['sole', 'tempo', 'caldo', 'freddo'],
      'Actions & Preferences': ['preferire', 'piace']
    };

    Object.entries(themes).forEach(([theme, words]) => {
      const themeVocab = vocabulary.filter(v => words.includes(v.baseForm));
      if (themeVocab.length > 0) {
        sections.push({
          title: theme,
          vocabulary: themeVocab,
          icon: this.getThemeIcon(theme)
        });
      }
    });

    return sections;
  }

  getThemeIcon(theme) {
    const icons = {
      'Seasons': 'fa-calendar-alt',
      'Weather': 'fa-cloud-sun',
      'Actions & Preferences': 'fa-heart',
      'Food': 'fa-apple-alt',
      'Travel': 'fa-plane',
      'Family': 'fa-home'
    };
    return icons[theme] || 'fa-book';
  }

  displayLesson(lesson) {
    const lessonContainer = document.getElementById('generated-lesson');
    const html = this.generateLessonHTML(lesson);
    lessonContainer.innerHTML = html;
    lessonContainer.classList.add('active');
    lessonContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize interactive elements
    this.initializeLessonInteractivity();
  }

  generateLessonHTML(lesson) {
    let html = `
      <div class="lesson-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 20px; margin-bottom: 2rem;">
        <h2><i class="fas fa-graduation-cap"></i> ${lesson.title}</h2>
        <p>Difficulty: ${lesson.difficulty} | Language: ${lesson.sourceLanguage.toUpperCase()}</p>
        <div class="original-transcript" style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
          <h4><i class="fas fa-quote-left"></i> Original Content</h4>
          <p style="font-style: italic;">${lesson.transcript}</p>
          <button class="play-transcript-btn" onclick="capisco.playTranscript('${lesson.transcript}')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-play"></i> Listen to Original
          </button>
        </div>
      </div>
    `;

    // Generate sections
    lesson.sections.forEach((section, index) => {
      html += `
        <div class="lesson-section" style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div class="section-header">
            <h3><i class="fas ${section.icon}"></i> ${section.title}</h3>
          </div>
          <div class="vocabulary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
      `;

      section.vocabulary.forEach(vocab => {
        const translation = lesson.translations[vocab.baseForm];
        if (translation) {
          html += `
            <div class="vocab-card" style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 1rem; transition: all 0.3s ease;">
              <div class="vocab-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #667eea;">${vocab.baseForm}</h4>
                <div class="vocab-controls">
                  <button class="info-btn" onclick="capisco.showWordInfo('${vocab.baseForm}')" style="background: none; border: none; color: #667eea; cursor: pointer; margin-right: 0.5rem;">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <button class="speaker-btn" onclick="capisco.pronounceWord('${vocab.baseForm}')" style="background: none; border: none; color: #10b981; cursor: pointer;">
                    <i class="fas fa-volume-up"></i>
                  </button>
                </div>
              </div>
              <p style="margin: 0.5rem 0; font-weight: 600;">${translation.english}</p>
              <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #64748b;">/${translation.pronunciation}/</p>
              ${vocab.gender ? `<span class="gender-badge" style="background: ${vocab.gender === 'f' ? '#f472b6' : '#60a5fa'}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">${vocab.gender}</span>` : ''}
              <div class="context" style="margin-top: 0.5rem; font-style: italic; font-size: 0.9rem; color: #64748b;">
                "${vocab.context}"
              </div>
            </div>
          `;
        }
      });

      html += `
          </div>
          <button class="quiz-btn" onclick="capisco.startQuiz('${section.title.toLowerCase()}', ${index})" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-weight: 600; cursor: pointer; margin-top: 1rem;">
            <i class="fas fa-gamepad"></i> Practice ${section.title}
          </button>
          <div id="quiz-${index}" class="quiz-container" style="display: none; margin-top: 1rem;"></div>
        </div>
      `;
    });

    return html;
  }

  initializeLessonInteractivity() {
    // Initialize the existing quiz system with the new dynamic data
    if (typeof quizSystem !== 'undefined') {
      // Update quiz data with the generated content
      this.integrateWithExistingQuizSystem();
    }
  }

  integrateWithExistingQuizSystem() {
    // This will integrate the dynamically generated content with your existing quiz system
    // We'll expand this based on how you want to handle the integration
  }

  showWordInfo(word) {
    const translation = this.currentLesson.translations[word];
    if (translation) {
      alert(`${word}\n\nMeaning: ${translation.english}\nPronunciation: ${translation.pronunciation}\nEtymology: ${translation.etymology}\nUsage: ${translation.usage}`);
    }
  }

  pronounceWord(word) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'it-IT';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  playTranscript(transcript) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = 'it-IT';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  }

  startQuiz(section, index) {
    // Integrate with your existing quiz system
    const quizContainer = document.getElementById(`quiz-${index}`);
    quizContainer.style.display = quizContainer.style.display === 'none' ? 'block' : 'none';
    
    if (quizContainer.style.display === 'block') {
      // Generate quiz content using your existing system
      quizContainer.innerHTML = `
        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; border: 2px solid #e2e8f0;">
          <h4>Interactive Quiz - ${section}</h4>
          <p>Quiz content will be generated here using your existing quiz system...</p>
          <button onclick="this.parentElement.parentElement.style.display='none'" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Close Quiz</button>
        </div>
      `;
    }
  }
}

// Initialize Capisco when page loads
let capisco;
document.addEventListener('DOMContentLoaded', function() {
  capisco = new CapiscoEngine();
});
