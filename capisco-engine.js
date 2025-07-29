
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
      studyGuide: this.generateStudyGuide(analysis, vocabulary, transcript),
      videoData: this.prepareVideoData(transcript, vocabulary),
      interactiveElements: this.createInteractiveVideoElements(transcript, vocabulary)
    };
  }

  prepareVideoData(transcript, vocabulary) {
    // Split transcript into timed segments for interactive playback
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const segments = sentences.map((sentence, index) => ({
      id: index,
      text: sentence.trim(),
      startTime: index * 3, // Approximate 3 seconds per sentence
      endTime: (index + 1) * 3,
      vocabulary: this.findVocabularyInSentence(sentence, vocabulary),
      hasInteraction: this.findVocabularyInSentence(sentence, vocabulary).length > 0
    }));

    return {
      segments: segments,
      totalDuration: segments.length * 3,
      interactivePoints: segments.filter(s => s.hasInteraction)
    };
  }

  findVocabularyInSentence(sentence, vocabulary) {
    return vocabulary.filter(vocab => 
      sentence.toLowerCase().includes(vocab.word.toLowerCase()) ||
      sentence.toLowerCase().includes(vocab.baseForm.toLowerCase())
    );
  }

  createInteractiveVideoElements(transcript, vocabulary) {
    return {
      clickableSubtitles: true,
      vocabularyOverlays: true,
      pauseOnNewWords: true,
      replaySegments: true,
      speedControl: true,
      comprehensionCheckpoints: this.createCheckpoints(transcript, vocabulary)
    };
  }

  createCheckpoints(transcript, vocabulary) {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const checkpoints = [];
    
    // Create checkpoints every 3-4 sentences
    for (let i = 0; i < sentences.length; i += 3) {
      const segmentVocab = sentences.slice(i, i + 3).join('. ')
        .split(' ')
        .filter(word => vocabulary.some(v => v.baseForm.toLowerCase() === word.toLowerCase()));
      
      if (segmentVocab.length > 0) {
        checkpoints.push({
          time: i * 3,
          type: 'comprehension',
          question: `What does "${segmentVocab[0]}" mean in this context?`,
          vocabulary: segmentVocab.slice(0, 2)
        });
      }
    }
    
    return checkpoints;
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
        
        <!-- Interactive Video Player -->
        <div class="interactive-video-container" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; margin-top: 1rem;">
          <div class="video-controls-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4><i class="fas fa-play-circle"></i> Interactive Video Learning</h4>
            <div class="learning-mode-toggle">
              <button id="study-mode-btn" class="mode-btn active" onclick="capisco.setLearningMode('study')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; margin-right: 0.5rem; cursor: pointer;">
                <i class="fas fa-book"></i> Study Mode
              </button>
              <button id="watch-mode-btn" class="mode-btn" onclick="capisco.setLearningMode('watch')" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                <i class="fas fa-eye"></i> Watch Mode
              </button>
            </div>
          </div>
          
          <!-- Video Player Simulation -->
          <div id="video-player" style="background: #000; border-radius: 8px; padding: 2rem; text-align: center; position: relative; min-height: 300px;">
            <div id="video-content" style="color: white;">
              <div class="video-placeholder" style="background: linear-gradient(45deg, #333, #555); padding: 4rem 2rem; border-radius: 8px;">
                <i class="fas fa-video" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.7;"></i>
                <h3>Interactive Video Player</h3>
                <p style="opacity: 0.8;">Original YouTube video would play here with interactive subtitles</p>
                <button onclick="capisco.startInteractiveVideo()" style="background: #667eea; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; margin-top: 1rem;">
                  <i class="fas fa-play"></i> Start Interactive Learning
                </button>
              </div>
            </div>
            
            <!-- Interactive Subtitle Overlay -->
            <div id="subtitle-overlay" style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; padding: 1rem; border-radius: 8px; display: none;">
              <div id="current-subtitle" style="font-size: 1.2rem; margin-bottom: 0.5rem;"></div>
              <div id="subtitle-controls" style="display: flex; gap: 0.5rem; justify-content: center;">
                <button class="subtitle-btn" onclick="capisco.translateCurrentSegment()" style="background: #667eea; border: none; color: white; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer;">
                  <i class="fas fa-language"></i> Translate
                </button>
                <button class="subtitle-btn" onclick="capisco.showVocabularyHelp()" style="background: #10b981; border: none; color: white; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer;">
                  <i class="fas fa-book"></i> Vocabulary
                </button>
                <button class="subtitle-btn" onclick="capisco.replaySegment()" style="background: #f59e0b; border: none; color: white; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer;">
                  <i class="fas fa-redo"></i> Replay
                </button>
              </div>
            </div>
          </div>
          
          <!-- Video Learning Controls -->
          <div class="video-learning-controls" style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button onclick="capisco.toggleSubtitles()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-closed-captioning"></i> Interactive Subtitles
            </button>
            <button onclick="capisco.enableVocabularyMode()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-highlight"></i> Highlight Vocabulary
            </button>
            <button onclick="capisco.setVideoSpeed(0.75)" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-tachometer-alt"></i> Slow (0.75x)
            </button>
            <button onclick="capisco.pauseOnNewWords()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-pause"></i> Pause on New Words
            </button>
          </div>
        </div>
        
        <!-- Learning Progress -->
        <div class="learning-progress" style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
          <h4><i class="fas fa-chart-line"></i> Your Progress</h4>
          <div class="progress-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
            <div class="stat-item">
              <div style="font-size: 1.5rem; font-weight: bold;">0%</div>
              <div style="font-size: 0.9rem; opacity: 0.8;">Video Watched</div>
            </div>
            <div class="stat-item">
              <div style="font-size: 1.5rem; font-weight: bold;">0/${lesson.vocabulary.length}</div>
              <div style="font-size: 0.9rem; opacity: 0.8;">Words Learned</div>
            </div>
            <div class="stat-item">
              <div style="font-size: 1.5rem; font-weight: bold;">0</div>
              <div style="font-size: 0.9rem; opacity: 0.8;">Segments Mastered</div>
            </div>
          </div>
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

  // Interactive Video Methods
  setLearningMode(mode) {
    const studyBtn = document.getElementById('study-mode-btn');
    const watchBtn = document.getElementById('watch-mode-btn');
    
    if (mode === 'study') {
      studyBtn.classList.add('active');
      watchBtn.classList.remove('active');
      studyBtn.style.background = 'rgba(255,255,255,0.3)';
      watchBtn.style.background = 'rgba(255,255,255,0.1)';
      this.enableStudyMode();
    } else {
      watchBtn.classList.add('active');
      studyBtn.classList.remove('active');
      watchBtn.style.background = 'rgba(255,255,255,0.3)';
      studyBtn.style.background = 'rgba(255,255,255,0.1)';
      this.enableWatchMode();
    }
  }

  enableStudyMode() {
    // Enable all interactive features for deep learning
    console.log('Study Mode: Interactive subtitles, vocabulary overlays, and pause-on-new-words enabled');
    document.getElementById('subtitle-overlay').style.display = 'block';
  }

  enableWatchMode() {
    // Minimal interruptions, focus on comprehension
    console.log('Watch Mode: Minimal interruptions, focus on natural viewing experience');
    document.getElementById('subtitle-overlay').style.display = 'none';
  }

  startInteractiveVideo() {
    const videoContent = document.getElementById('video-content');
    videoContent.innerHTML = `
      <div style="color: white; text-align: left;">
        <div style="background: rgba(102, 126, 234, 0.2); padding: 2rem; border-radius: 8px;">
          <h3><i class="fas fa-magic"></i> Interactive Learning Mode Active!</h3>
          <p><strong>Features enabled:</strong></p>
          <ul style="text-align: left; margin: 1rem 0;">
            <li><i class="fas fa-mouse-pointer"></i> Click on any word in subtitles for instant translation</li>
            <li><i class="fas fa-pause"></i> Video pauses automatically when new vocabulary appears</li>
            <li><i class="fas fa-redo"></i> Replay any segment as many times as needed</li>
            <li><i class="fas fa-chart-line"></i> Track your progress as you learn</li>
            <li><i class="fas fa-gamepad"></i> Mini-quizzes at natural break points</li>
          </ul>
          <p style="opacity: 0.9;"><em>In a real implementation, the original YouTube video would play here with all these interactive overlays!</em></p>
          <div class="demo-controls" style="margin-top: 2rem;">
            <button onclick="capisco.simulateVideoSegment(0)" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
              <i class="fas fa-play"></i> Demo Segment 1
            </button>
            <button onclick="capisco.simulateVideoSegment(1)" style="background: #f59e0b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
              <i class="fas fa-play"></i> Demo Segment 2
            </button>
            <button onclick="capisco.showComprehensionCheck()" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              <i class="fas fa-question"></i> Comprehension Check
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('subtitle-overlay').style.display = 'block';
  }

  simulateVideoSegment(segmentIndex) {
    const segments = [
      "Ciao a tutti! Mi chiamo Marco e oggi parleremo del tempo.",
      "In Italia, abbiamo quattro stagioni: primavera, estate, autunno e inverno."
    ];
    
    document.getElementById('current-subtitle').innerHTML = segments[segmentIndex];
    this.highlightVocabulary(segments[segmentIndex]);
  }

  highlightVocabulary(text) {
    const vocabulary = ['tempo', 'stagioni', 'primavera', 'estate', 'autunno', 'inverno'];
    let highlightedText = text;
    
    vocabulary.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span style="background: #667eea; color: white; padding: 2px 4px; border-radius: 3px; cursor: pointer;" onclick="capisco.showWordInfo('${word}')">${word}</span>`);
    });
    
    document.getElementById('current-subtitle').innerHTML = highlightedText;
  }

  translateCurrentSegment() {
    const currentText = document.getElementById('current-subtitle').textContent;
    const translations = {
      "Ciao a tutti! Mi chiamo Marco e oggi parleremo del tempo.": "Hello everyone! My name is Marco and today we'll talk about the weather.",
      "In Italia, abbiamo quattro stagioni: primavera, estate, autunno e inverno.": "In Italy, we have four seasons: spring, summer, autumn and winter."
    };
    
    const translation = translations[currentText] || "Translation would appear here";
    
    alert(`Translation:\n\n"${translation}"`);
  }

  showVocabularyHelp() {
    alert(`Vocabulary Help:\n\n• tempo = weather/time\n• stagioni = seasons\n• primavera = spring\n• estate = summer\n• autunno = autumn\n• inverno = winter\n\nClick on highlighted words in subtitles for more details!`);
  }

  replaySegment() {
    alert("🔄 Segment replayed! In the real app, this would replay the last 5-10 seconds of video.");
  }

  showComprehensionCheck() {
    const checkQuestions = [
      "What are the four seasons mentioned in Italian?",
      "What does 'tempo' mean in this context?",
      "How would you introduce yourself like Marco did?"
    ];
    
    const randomQuestion = checkQuestions[Math.floor(Math.random() * checkQuestions.length)];
    const answer = prompt(`Comprehension Check:\n\n${randomQuestion}`);
    
    if (answer) {
      alert("Great effort! In the full app, your answer would be evaluated and you'd get personalized feedback.");
    }
  }

  toggleSubtitles() {
    const overlay = document.getElementById('subtitle-overlay');
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
  }

  enableVocabularyMode() {
    alert("🎯 Vocabulary Mode: All vocabulary words will be highlighted and clickable in the video subtitles!");
  }

  setVideoSpeed(speed) {
    alert(`⚡ Video speed set to ${speed}x for better comprehension!`);
  }

  pauseOnNewWords() {
    alert("⏸️ Auto-pause enabled! Video will pause when new vocabulary appears so you can study it.");
  }
}

// Initialize Capisco when page loads
let capisco;
document.addEventListener('DOMContentLoaded', function() {
  capisco = new CapiscoEngine();
});
