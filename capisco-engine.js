
// Capisco - Dynamic Language Learning Generator
class CapiscoEngine {
  constructor() {
    this.currentLesson = null;
    this.processingSteps = [
      'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'
    ];
    this.currentStep = 0;
    this.maxDuration = null; // No time limitations for now
    
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
      
      // No duration limits - process any length transcript
      const estimatedDuration = this.estimateTranscriptDuration(transcript);
      console.log(`Processing transcript: ~${Math.ceil(estimatedDuration/60)} minutes of content`);

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
    // For demo purposes, we'll use mock transcripts in different languages
    const videoId = this.extractVideoId(videoUrl);
    
    // Mock transcripts for demonstration - randomly select one to show multilingual capability
    const mockTranscripts = {
      italian: `Ciao a tutti! Mi chiamo Marco e oggi parleremo del tempo. 
      In Italia, abbiamo quattro stagioni: primavera, estate, autunno e inverno. 
      Mi piace molto l'estate perché fa caldo e posso andare al mare. 
      E voi, quale stagione preferite? La primavera è bella perché i fiori sbocciano. 
      L'autunno ha colori meravigliosi, e l'inverno... beh, fa freddo ma è romantico.
      Oggi il tempo è nuvoloso, ma domani dovrebbe fare bel tempo.
      Preferisco quando c'è il sole. Il sole mi rende felice!`,
      
      english: `Hi everyone! Welcome to my cooking channel. Today we're making traditional pasta carbonara. 
      First, you'll need eggs, pecorino cheese, guanciale, and spaghetti. 
      The key is timing - you want the pasta hot but not so hot that it scrambles the eggs.
      Many people add cream, but that's not authentic. The creaminess comes from the eggs and cheese.
      Let me show you step by step how to get that perfect silky texture.`,
      
      french: `Bonjour tout le monde! Aujourd'hui nous visitons le marché aux puces de Paris.
      C'est un endroit magnifique pour trouver des antiquités et des objets vintage.
      Regardez cette belle lampe art déco! Le vendeur dit qu'elle date des années 1920.
      J'adore flâner dans ces allées et découvrir des trésors cachés.
      Combien coûte ce vase? Ah, c'est un peu cher pour moi aujourd'hui.`,
      
      spanish: `¡Hola amigos! Estamos en Barcelona y vamos a explorar las tapas típicas.
      Aquí tenemos jamón ibérico, manchego, y estas deliciosas croquetas.
      La cultura de las tapas es muy importante en España. No es solo comida, es socializar.
      Nos gusta ir de bar en bar, tomando una tapa y una cerveza en cada sitio.
      ¿Cuál es vuestra tapa favorita? ¡Déjamelo en los comentarios!`
    };
    
    // Randomly return one for demo - in real app would be based on actual video content
    const languages = Object.keys(mockTranscripts);
    const randomLang = languages[Math.floor(Math.random() * languages.length)];
    return mockTranscripts[randomLang];
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
    // Enhanced content analysis - in real app would use advanced NLP/AI
    const wordCount = transcript.split(/\s+/).length;
    const avgWordsPerSentence = transcript.split(/[.!?]+/).length > 0 ? 
      wordCount / transcript.split(/[.!?]+/).length : 10;
    
    // Determine difficulty based on sentence complexity and vocabulary
    let difficultyLevel = 'beginner';
    if (avgWordsPerSentence > 15 || wordCount > 500) difficultyLevel = 'intermediate';
    if (avgWordsPerSentence > 20 || wordCount > 1000) difficultyLevel = 'advanced';
    
    return {
      detectedLanguage: sourceLanguage || 'it',
      topics: this.extractTopicsFromTranscript(transcript),
      difficultyLevel: difficultyLevel,
      keyThemes: this.extractKeyThemes(transcript),
      wordCount: wordCount,
      estimatedStudyTime: Math.ceil(wordCount / 100) * 5 // 5 min per 100 words
    };
  }

  extractTopicsFromTranscript(transcript) {
    // Simple topic detection - in real app would use advanced NLP
    const topics = [];
    const topicKeywords = {
      'food': ['mangiare', 'cibo', 'ristorante', 'cucinare', 'ricetta'],
      'travel': ['viaggiare', 'aereo', 'hotel', 'vacanza', 'paese'],
      'family': ['famiglia', 'madre', 'padre', 'figlio', 'fratello'],
      'work': ['lavoro', 'ufficio', 'collega', 'riunione', 'progetto'],
      'hobbies': ['tempo libero', 'sport', 'musica', 'leggere', 'film'],
      'weather': ['tempo', 'sole', 'pioggia', 'freddo', 'caldo'],
      'shopping': ['comprare', 'negozio', 'mercato', 'prezzo', 'soldi']
    };
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => transcript.toLowerCase().includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics.length > 0 ? topics : ['general conversation'];
  }

  extractKeyThemes(transcript) {
    // Extract 3-5 key themes from the content
    const themes = [];
    const text = transcript.toLowerCase();
    
    // This would be much more sophisticated in a real implementation
    if (text.includes('mangiare') || text.includes('cibo')) themes.push('Food & Dining');
    if (text.includes('famiglia') || text.includes('casa')) themes.push('Family & Home');
    if (text.includes('lavoro') || text.includes('ufficio')) themes.push('Work & Career');
    if (text.includes('viaggiare') || text.includes('vacanza')) themes.push('Travel & Adventure');
    if (text.includes('tempo') && text.includes('pioggia')) themes.push('Weather & Climate');
    if (text.includes('sport') || text.includes('giocare')) themes.push('Sports & Recreation');
    
    return themes.length > 0 ? themes : ['Daily Conversation'];
  }

  async extractVocabulary(transcript, analysis) {
    // Enhanced vocabulary extraction - in real app would use advanced NLP
    const words = transcript.toLowerCase().match(/\b[a-zA-Zàáâäãåąčćđèéêëēėęğìíîïıķľłńññòóôöõøœř][a-zA-Zàáâäãåąčćđèéêëēėęğìíîïıķľłńññòóôöõøœř']*\b/g) || [];
    const wordFrequency = {};
    
    // Count word frequency
    words.forEach(word => {
      if (word.length > 2) { // Skip very short words
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    // Get most frequent meaningful words
    const sortedWords = Object.entries(wordFrequency)
      .filter(([word, freq]) => freq >= 1 && !this.isCommonWord(word))
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15); // Take top 15 words
    
    return sortedWords.map(([word, frequency]) => {
      const context = this.findWordContext(word, transcript);
      return {
        word: word,
        baseForm: this.getBaseForm(word),
        partOfSpeech: this.guessPartOfSpeech(word),
        gender: this.guessGender(word),
        context: context,
        frequency: frequency,
        difficulty: this.assessWordDifficulty(word),
        category: this.categorizeWord(word, analysis.topics)
      };
    });
  }

  isCommonWord(word) {
    const commonWords = ['che', 'con', 'per', 'una', 'del', 'della', 'degli', 'delle', 'sono', 'hanno', 'molto', 'anche', 'quando', 'dove', 'come', 'cosa', 'tutto', 'tutti', 'ogni', 'più', 'meno'];
    return commonWords.includes(word.toLowerCase());
  }

  findWordContext(word, transcript) {
    const sentences = transcript.split(/[.!?]+/);
    for (let sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        return sentence.trim();
      }
    }
    return `Context with "${word}"`;
  }

  getBaseForm(word) {
    // Simple heuristics - in real app would use proper lemmatization
    if (word.endsWith('are') || word.endsWith('ere') || word.endsWith('ire')) return word;
    if (word.endsWith('i') && word.length > 3) return word.slice(0, -1) + 'o';
    if (word.endsWith('e') && word.length > 3) return word.slice(0, -1) + 'a';
    return word;
  }

  guessPartOfSpeech(word) {
    if (word.endsWith('are') || word.endsWith('ere') || word.endsWith('ire')) return 'verb';
    if (word.endsWith('mente')) return 'adverb';
    if (word.endsWith('zione') || word.endsWith('sione')) return 'noun';
    return 'noun'; // Default assumption
  }

  guessGender(word) {
    if (word.endsWith('a') || word.endsWith('e') || word.endsWith('zione')) return 'f';
    if (word.endsWith('o') || word.endsWith('ore')) return 'm';
    return null;
  }

  assessWordDifficulty(word) {
    if (word.length <= 4) return 'basic';
    if (word.length <= 7) return 'intermediate';
    return 'advanced';
  }

  categorizeWord(word, topics) {
    // Categorize based on detected topics
    const foodWords = ['mangiare', 'cibo', 'pane', 'pasta', 'pizza'];
    const familyWords = ['famiglia', 'madre', 'padre', 'figlio'];
    const travelWords = ['viaggiare', 'aereo', 'hotel', 'paese'];
    
    if (foodWords.some(fw => word.includes(fw))) return 'food';
    if (familyWords.some(fw => word.includes(fw))) return 'family';
    if (travelWords.some(tw => word.includes(tw))) return 'travel';
    
    return topics[0] || 'general';
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
      sections: this.generateLessonSections(vocabulary, translations, analysis),
      learningPath: this.createLearningPath(analysis, vocabulary),
      studyGuide: this.generateStudyGuide(analysis, vocabulary, transcript)
    };
  }

  createLearningPath(analysis, vocabulary) {
    const path = [];
    
    // Step 1: Introduction & Context
    path.push({
      step: 1,
      title: 'Context & Overview',
      description: `Understand the main topic: ${analysis.keyThemes.join(', ')}`,
      activities: ['Listen to original', 'Read transcript', 'Identify main ideas']
    });

    // Step 2: Core Vocabulary
    path.push({
      step: 2,
      title: 'Essential Words',
      description: 'Master the most important vocabulary',
      activities: ['Study word meanings', 'Practice pronunciation', 'Learn gender/forms']
    });

    // Step 3: Grammar in Context
    path.push({
      step: 3,
      title: 'Language Patterns',
      description: 'Understand how the language works',
      activities: ['Identify verb forms', 'Study sentence structure', 'Practice patterns']
    });

    // Step 4: Active Practice
    path.push({
      step: 4,
      title: 'Interactive Practice',
      description: 'Test your understanding',
      activities: ['Complete quizzes', 'Practice speaking', 'Write examples']
    });

    // Step 5: Integration
    path.push({
      step: 5,
      title: 'Full Comprehension',
      description: 'Put it all together',
      activities: ['Listen again', 'Summarize content', 'Create your own examples']
    });

    return path;
  }

  generateStudyGuide(analysis, vocabulary, transcript) {
    return {
      overview: `This ${analysis.difficulty} level content covers ${analysis.keyThemes.join(', ')}. Estimated study time: ${analysis.estimatedStudyTime} minutes.`,
      keyPoints: this.extractKeyPoints(transcript),
      grammarNotes: this.identifyGrammarPatterns(vocabulary),
      culturalNotes: this.generateCulturalNotes(analysis.topics),
      practiceActivities: this.suggestPracticeActivities(analysis.topics, analysis.difficulty)
    };
  }

  extractKeyPoints(transcript) {
    // Extract 3-5 key points from the content
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 3).map(s => s.trim());
  }

  identifyGrammarPatterns(vocabulary) {
    const patterns = [];
    const verbs = vocabulary.filter(v => v.partOfSpeech === 'verb');
    const nouns = vocabulary.filter(v => v.partOfSpeech === 'noun');
    
    if (verbs.length > 0) {
      patterns.push(`Verb forms: ${verbs.map(v => v.baseForm).join(', ')}`);
    }
    if (nouns.filter(n => n.gender === 'f').length > 0) {
      patterns.push('Feminine nouns (use "la/una")');
    }
    if (nouns.filter(n => n.gender === 'm').length > 0) {
      patterns.push('Masculine nouns (use "il/un")');
    }
    
    return patterns;
  }

  generateCulturalNotes(topics) {
    const notes = [];
    if (topics.includes('food')) {
      notes.push('Italian food culture: meals are social events, quality ingredients matter');
    }
    if (topics.includes('family')) {
      notes.push('Family is central in Italian culture - formal/informal address is important');
    }
    if (topics.includes('work')) {
      notes.push('Italian business culture values relationships and personal connections');
    }
    return notes;
  }

  suggestPracticeActivities(topics, difficulty) {
    const activities = [
      'Re-watch the original video with subtitles',
      'Practice repeating key phrases aloud',
      'Write your own sentences using the new vocabulary'
    ];
    
    if (difficulty !== 'beginner') {
      activities.push('Try to summarize the content in Italian');
      activities.push('Find similar videos on the same topic');
    }
    
    return activities;
  }

  generateLessonSections(vocabulary, translations, analysis) {
    const sections = [];

    // 1. Core Vocabulary Section (most frequent words)
    const coreVocab = vocabulary.filter(v => v.frequency >= 2).slice(0, 8);
    if (coreVocab.length > 0) {
      sections.push({
        title: 'Core Vocabulary',
        vocabulary: coreVocab,
        icon: 'fa-star',
        description: 'The most important words from this content'
      });
    }

    // 2. Group by categories/topics
    const categories = this.groupVocabularyByCategory(vocabulary);
    Object.entries(categories).forEach(([category, words]) => {
      if (words.length >= 2) {
        sections.push({
          title: this.formatCategoryTitle(category),
          vocabulary: words,
          icon: this.getThemeIcon(category),
          description: `Key terms related to ${category}`
        });
      }
    });

    // 3. Grammar Patterns Section (verbs and complex structures)
    const grammarWords = vocabulary.filter(v => v.partOfSpeech === 'verb' || v.difficulty === 'advanced');
    if (grammarWords.length > 0) {
      sections.push({
        title: 'Grammar & Advanced Terms',
        vocabulary: grammarWords,
        icon: 'fa-cogs',
        description: 'Verbs and more complex language structures'
      });
    }

    // 4. Cultural Context Section (if content seems culturally specific)
    const culturalWords = vocabulary.filter(v => this.isCulturallySpecific(v.word));
    if (culturalWords.length > 0) {
      sections.push({
        title: 'Cultural Context',
        vocabulary: culturalWords,
        icon: 'fa-globe-europe',
        description: 'Terms with cultural significance'
      });
    }

    return sections.length > 0 ? sections : [
      {
        title: 'All Vocabulary',
        vocabulary: vocabulary,
        icon: 'fa-book',
        description: 'Complete vocabulary from this content'
      }
    ];
  }

  groupVocabularyByCategory(vocabulary) {
    const categories = {};
    vocabulary.forEach(word => {
      const category = word.category || 'general';
      if (!categories[category]) categories[category] = [];
      categories[category].push(word);
    });
    return categories;
  }

  formatCategoryTitle(category) {
    const titles = {
      'food': 'Food & Dining',
      'family': 'Family & Relationships',
      'travel': 'Travel & Places',
      'work': 'Work & Professional',
      'hobbies': 'Hobbies & Interests',
      'weather': 'Weather & Nature',
      'shopping': 'Shopping & Commerce',
      'general': 'General Vocabulary'
    };
    return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  isCulturallySpecific(word) {
    const culturalWords = ['piazza', 'gelato', 'cappuccino', 'pasta', 'pizza', 'ciao', 'bene', 'grazie'];
    return culturalWords.includes(word.toLowerCase());
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
