
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
    const form = document.getElementById('lesson-generator');
    if (!form) {
      console.error('Lesson generator form not found');
      return;
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Form submitted, generating lesson...');
      this.generateLesson();
    });
  }

  async generateLesson() {
    const videoUrlElement = document.getElementById('video-url');
    const transcriptFileElement = document.getElementById('transcript-file');
    const sourceLanguageElement = document.getElementById('source-language');
    const targetLanguageElement = document.getElementById('target-language');

    if (!videoUrlElement || !transcriptFileElement || !sourceLanguageElement || !targetLanguageElement) {
      console.error('Form elements not found');
      alert('Error: Form elements not found. Please refresh the page and try again.');
      return;
    }

    const videoUrl = videoUrlElement.value.trim();
    const transcriptFile = transcriptFileElement.files[0];
    const sourceLanguage = sourceLanguageElement.value;
    const targetLanguage = targetLanguageElement.value;

    if (!videoUrl && !transcriptFile) {
      alert('Please provide either a YouTube URL or upload a transcript file.');
      return;
    }

    if (!targetLanguage) {
      alert('Please select your native language for explanations.');
      return;
    }

    console.log('Starting lesson generation...', { videoUrl, hasFile: !!transcriptFile, sourceLanguage, targetLanguage });

    this.showProcessingStatus();
    
    try {
      // Step 1: Extract transcript
      await this.updateProcessingStep(0);
      const transcript = await this.extractTranscript(videoUrl, transcriptFile);
      
      // Check 5-minute limit
      const estimatedDuration = this.estimateTranscriptDuration(transcript);
      if (estimatedDuration > 300) { // 5 minutes = 300 seconds
        alert(`This video appears to be ~${Math.ceil(estimatedDuration/60)} minutes long. Please use a video that's 5 minutes or shorter for optimal learning. You can always process multiple shorter segments!`);
        this.hideProcessingStatus();
        return;
      }
      console.log(`Processing transcript: ~${Math.ceil(estimatedDuration/60)} minutes of content`);

      // Step 2: Analyze language and content
      await this.updateProcessingStep(1);
      const analysis = await this.analyzeContent(transcript, sourceLanguage);
      
      // Show language detection result
      if (!sourceLanguage || sourceLanguage === '') {
        console.log(`Language auto-detected as: ${analysis.detectedLanguage}`);
        // Update the form to show detected language
        const sourceSelect = document.getElementById('source-language');
        if (sourceSelect) {
          sourceSelect.value = analysis.detectedLanguage;
          // Highlight that language was detected
          sourceSelect.style.background = '#d1fae5';
          sourceSelect.style.border = '2px solid #10b981';
        }
      }

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
    const statusElement = document.getElementById('processing-status');
    const btnElement = document.getElementById('generate-btn');
    
    if (statusElement) {
      statusElement.classList.add('active');
    } else {
      console.error('Processing status element not found');
    }
    
    if (btnElement) {
      btnElement.disabled = true;
    } else {
      console.error('Generate button element not found');
    }
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
    // For demo purposes, we'll use mock transcripts that simulate 5-minute content
    const videoId = this.extractVideoId(videoUrl);
    
    if (!videoId) {
      throw new Error('Please provide a valid YouTube URL (e.g., https://youtube.com/watch?v=ABC123)');
    }
    
    // Mock transcripts for demonstration - simulating real 5-minute content
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
    // Enhanced content analysis with actual language detection
    const wordCount = transcript.split(/\s+/).length;
    const avgWordsPerSentence = transcript.split(/[.!?]+/).length > 0 ? 
      wordCount / transcript.split(/[.!?]+/).length : 10;
    
    // Auto-detect language if not provided
    let detectedLanguage = sourceLanguage;
    if (!sourceLanguage || sourceLanguage === '') {
      detectedLanguage = this.detectLanguageFromTranscript(transcript);
      console.log('Auto-detected language:', detectedLanguage);
    }
    
    // Determine difficulty based on sentence complexity and vocabulary
    let difficultyLevel = 'beginner';
    if (avgWordsPerSentence > 15 || wordCount > 500) difficultyLevel = 'intermediate';
    if (avgWordsPerSentence > 20 || wordCount > 1000) difficultyLevel = 'advanced';
    
    return {
      detectedLanguage: detectedLanguage,
      topics: this.extractTopicsFromTranscript(transcript),
      difficultyLevel: difficultyLevel,
      keyThemes: this.extractKeyThemes(transcript),
      wordCount: wordCount,
      estimatedStudyTime: Math.ceil(wordCount / 100) * 5 // 5 min per 100 words
    };
  }

  detectLanguageFromTranscript(transcript) {
    // Simple language detection based on common words and patterns
    const text = transcript.toLowerCase();
    
    // Italian indicators
    const italianWords = ['che', 'con', 'per', 'una', 'del', 'della', 'sono', 'hanno', 'molto', 'anche', 'quando', 'dove', 'come', 'cosa', 'tutto', 'tutti', 'mi', 'chiamo', 'ciao', 'bene', 'grazie', 'prego', 'scusi', 'tempo', 'oggi', 'ieri', 'domani'];
    const italianCount = italianWords.filter(word => text.includes(' ' + word + ' ') || text.startsWith(word + ' ') || text.endsWith(' ' + word)).length;
    
    // Spanish indicators  
    const spanishWords = ['que', 'con', 'por', 'una', 'del', 'son', 'tienen', 'mucho', 'también', 'cuando', 'donde', 'como', 'qué', 'todo', 'todos', 'me', 'llamo', 'hola', 'bien', 'gracias', 'por favor', 'disculpe'];
    const spanishCount = spanishWords.filter(word => text.includes(' ' + word + ' ') || text.startsWith(word + ' ') || text.endsWith(' ' + word)).length;
    
    // French indicators
    const frenchWords = ['que', 'avec', 'pour', 'une', 'du', 'sont', 'ont', 'beaucoup', 'aussi', 'quand', 'où', 'comment', 'quoi', 'tout', 'tous', 'me', 'appelle', 'bonjour', 'bien', 'merci', 's\'il vous plaît'];
    const frenchCount = frenchWords.filter(word => text.includes(' ' + word + ' ') || text.startsWith(word + ' ') || text.endsWith(' ' + word)).length;
    
    // English indicators
    const englishWords = ['the', 'and', 'for', 'are', 'have', 'that', 'this', 'with', 'they', 'what', 'when', 'where', 'how', 'all', 'my', 'name', 'hello', 'good', 'thank', 'please', 'sorry'];
    const englishCount = englishWords.filter(word => text.includes(' ' + word + ' ') || text.startsWith(word + ' ') || text.endsWith(' ' + word)).length;
    
    console.log('Language detection scores:', {
      italian: italianCount,
      spanish: spanishCount, 
      french: frenchCount,
      english: englishCount
    });
    
    // Determine the most likely language
    const scores = [
      { lang: 'it', score: italianCount },
      { lang: 'es', score: spanishCount },
      { lang: 'fr', score: frenchCount },
      { lang: 'en', score: englishCount }
    ];
    
    const maxScore = Math.max(...scores.map(s => s.score));
    if (maxScore === 0) {
      console.log('No language detected, defaulting to Italian');
      return 'it'; // Default to Italian if no clear match
    }
    
    const detectedLang = scores.find(s => s.score === maxScore).lang;
    console.log('Detected language:', detectedLang, 'with score:', maxScore);
    return detectedLang;
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
    const html = this.generateStructuredLessonHTML(lesson);
    lessonContainer.innerHTML = html;
    lessonContainer.classList.add('active');
    
    // Smooth scroll to lesson with a small delay for better UX
    setTimeout(() => {
      lessonContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 500);
    
    // Store current lesson for future reference/saving
    this.currentLesson = lesson;
    
    // Initialize interactive elements like Al Mercato
    this.initializeStructuredLessonInteractivity();
  }

  generateStructuredLessonHTML(lesson) {
    // Create lesson page structure similar to Al Mercato
    let html = `
      <div class="lesson-container" style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <!-- Lesson Header -->
        <header class="lesson-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 2rem; border-radius: 20px; margin-bottom: 2rem; text-align: center;">
          <h1><i class="fas fa-book-open"></i> ${lesson.title}</h1>
          <p class="lesson-subtitle">Generated from your video content</p>
          <div class="lesson-meta" style="display: flex; justify-content: center; gap: 2rem; margin-top: 1rem; flex-wrap: wrap;">
            <span><i class="fas fa-signal"></i> ${lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}</span>
            <span><i class="fas fa-language"></i> ${lesson.sourceLanguage.toUpperCase()}</span>
            <span><i class="fas fa-clock"></i> ${lesson.studyGuide.overview.match(/\d+ minutes/)?.[0] || '5-10 minutes'}</span>
            <span><i class="fas fa-list"></i> ${lesson.vocabulary.length} vocabulary items</span>
          </div>
          
          <!-- Mode Toggle -->
          <div class="mode-toggle" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
            <button id="study-mode-btn" class="mode-btn active" onclick="capisco.setLearningMode('study')" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
              <i class="fas fa-book"></i> Study Mode
            </button>
            <button id="watch-mode-btn" class="mode-btn" onclick="capisco.setLearningMode('watch')" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
              <i class="fas fa-video"></i> Watch Mode
            </button>
          </div>
        </header>

        <!-- Study Guide Overview -->
        <section class="lesson-section overview-section" style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div class="section-header">
            <h2><i class="fas fa-compass"></i> Lesson Overview</h2>
          </div>
          <div class="overview-content" style="line-height: 1.8;">
            <p style="font-size: 1.1rem; margin-bottom: 1rem;">${lesson.studyGuide.overview}</p>
            <div class="key-themes" style="background: #f8fafc; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
              <h4><i class="fas fa-tags"></i> Key Themes:</h4>
              <div class="theme-tags" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                ${lesson.studyGuide.keyPoints.map(theme => 
                  `<span style="background: #667eea; color: white; padding: 0.3rem 0.8rem; border-radius: 12px; font-size: 0.9rem;">${theme}</span>`
                ).join('')}
              </div>
            </div>
          </div>
        </section>
    `;

    // Generate vocabulary sections like Al Mercato
    lesson.sections.forEach((section, sectionIndex) => {
      const sectionId = `section-${sectionIndex}`;
      html += `
        <section class="lesson-section" style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div class="section-header">
            <h2><i class="fas ${section.icon}"></i> ${section.title}</h2>
            <div class="section-translation">
              <span class="translation-text">${section.description}</span>
            </div>
          </div>
          <div class="content-card">
            <div class="lesson-visual" style="text-align: center; margin-bottom: 2rem; padding: 2rem; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px;">
              <i class="fas ${section.icon}" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
              <p style="font-style: italic; color: #64748b;">${section.description}</p>
            </div>
            
            <div class="vocabulary-section">
              <ul class="vocab-list" style="list-style: none; padding: 0; display: grid; gap: 1rem;">
      `;

      section.vocabulary.forEach((vocab, vocabIndex) => {
        const translation = lesson.translations[vocab.baseForm] || lesson.translations[vocab.word];
        if (translation) {
          html += `
                <li class="vocab-item" style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #667eea;">
                  <div class="vocab-content" style="display: flex; justify-content: space-between; align-items: start;">
                    <div class="vocab-text">
                      <div class="italian-word" style="font-size: 1.3rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">
                        ${vocab.baseForm || vocab.word}
                        ${vocab.gender ? `<span class="gender-tag" style="background: ${vocab.gender === 'f' ? '#f472b6' : '#60a5fa'}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-left: 0.5rem;">${vocab.gender}</span>` : ''}
                      </div>
                      <div class="english-translation" style="font-size: 1.1rem; color: #64748b; margin-bottom: 0.5rem;">${translation.english}</div>
                      <div class="pronunciation" style="font-style: italic; color: #94a3b8; font-size: 0.9rem;">/${translation.pronunciation}/</div>
                      ${vocab.context ? `<div class="context" style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 6px; font-size: 0.9rem; font-style: italic;">"${vocab.context}"</div>` : ''}
                    </div>
                    <div class="vocab-controls">
                      <button class="info-btn" data-info="${translation.etymology || translation.usage || 'Click for more information about this word'}" data-gender="${vocab.gender || ''}" data-plural="${vocab.plural || ''}" style="background: none; border: none; color: #667eea; cursor: pointer; margin-right: 0.5rem; font-size: 1.1rem;">
                        <i class="fas fa-info-circle"></i>
                      </button>
                      <button class="speaker-btn" data-italian="${vocab.baseForm || vocab.word}" style="background: none; border: none; color: #10b981; cursor: pointer; font-size: 1.1rem;">
                        <i class="fas fa-volume-up"></i>
                      </button>
                    </div>
                  </div>
                </li>
          `;
        }
      });

      html += `
              </ul>
            </div>
            <button class="quiz-btn" onclick="toggleQuiz('quiz-${sectionIndex}')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 1.5rem; transition: all 0.3s ease;">
              <i class="fas fa-gamepad"></i> Practice ${section.title}
            </button>
            <div id="quiz-${sectionIndex}" class="quiz-block hidden">
              <!-- Quiz content will be dynamically generated -->
            </div>
          </div>
        </section>
      `;
    });

    // Cultural Context Section if available
    if (lesson.studyGuide.culturalNotes && lesson.studyGuide.culturalNotes.length > 0) {
      html += `
        <section class="lesson-section cultural-section" style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div class="section-header">
            <h2><i class="fas fa-globe-europe"></i> Cultural Context</h2>
          </div>
          <div class="cultural-content">
            ${lesson.studyGuide.culturalNotes.map(note => 
              `<div class="cultural-note" style="background: #f0f4f8; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #38b2ac;">
                <i class="fas fa-lightbulb" style="color: #38b2ac; margin-right: 0.5rem;"></i>
                ${note}
              </div>`
            ).join('')}
          </div>
        </section>
      `;
    }

    // Practice Activities Section
    html += `
        <section class="lesson-section practice-section" style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div class="section-header">
            <h2><i class="fas fa-dumbbell"></i> Practice Activities</h2>
          </div>
          <div class="activities-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
            ${lesson.studyGuide.practiceActivities.map((activity, index) => 
              `<div class="activity-card" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <i class="fas fa-check-circle" style="color: #10b981; margin-right: 0.5rem;"></i>
                ${activity}
              </div>`
            ).join('')}
          </div>
        </section>

        <!-- Watch Mode Section (Hidden by default) -->
        <div id="watch-mode-content" style="display: none;">
          <section class="lesson-section watch-section" style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <div class="section-header">
              <h2><i class="fas fa-video"></i> Watch & Practice</h2>
            </div>
            <div class="watch-content">
              <p style="margin-bottom: 1rem; font-size: 1.1rem;">Now that you've studied the vocabulary, practice with audio segments from the original content:</p>
              <div class="audio-segments" style="display: grid; gap: 1rem;">
                ${this.generateAudioSegments(lesson)}
              </div>
            </div>
          </section>
        </div>
      </div>
    `;

    return html;
  }

  generateAudioSegments(lesson) {
    if (!lesson.videoData || !lesson.videoData.segments) return '';
    
    return lesson.videoData.segments
      .filter(segment => segment.hasInteraction)
      .slice(0, 6) // Limit to first 6 interactive segments
      .map((segment, index) => `
        <div class="audio-segment" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="segment-text" style="flex: 1;">
              <p style="font-weight: 600; margin-bottom: 0.5rem;">"${segment.text}"</p>
              <div class="segment-vocab" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${segment.vocabulary.map(vocab => 
                  `<span style="background: #667eea; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">${vocab.word}</span>`
                ).join('')}
              </div>
            </div>
            <button onclick="capisco.playSegmentAudio('${segment.text}', ${index})" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
              <i class="fas fa-play"></i> Listen
            </button>
          </div>
        </div>
      `).join('');
  }

  initializeStructuredLessonInteractivity() {
    // Initialize vocab interactions like in Al Mercato
    setTimeout(() => {
      if (typeof initializeVocabInteractions === 'function') {
        initializeVocabInteractions();
      }
      
      // Update quiz system with generated lesson data
      if (typeof quizSystem !== 'undefined' && this.currentLesson) {
        this.updateQuizSystemWithLessonData();
      }
    }, 100);
  }

  updateQuizSystemWithLessonData() {
    // Create dynamic quiz data from lesson content
    const dynamicQuizData = {
      generated_content: {
        vocabulary: this.currentLesson.vocabulary.map(vocab => {
          const translation = this.currentLesson.translations[vocab.baseForm] || this.currentLesson.translations[vocab.word];
          return {
            italian: vocab.baseForm || vocab.word,
            english: translation ? translation.english : vocab.english || 'translation',
            gender: vocab.gender || '',
            plural: vocab.plural || '',
            info: translation ? (translation.etymology + ' ' + translation.usage) : vocab.context || 'Additional information about this word.',
            audio: vocab.baseForm || vocab.word
          };
        })
      }
    };

    // Add to quiz system
    if (quizSystem && quizSystem.quizData) {
      Object.assign(quizSystem.quizData, dynamicQuizData);
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

  // Learning Mode Methods
  setLearningMode(mode) {
    const studyBtn = document.getElementById('study-mode-btn');
    const watchBtn = document.getElementById('watch-mode-btn');
    const watchContent = document.getElementById('watch-mode-content');
    
    if (mode === 'study') {
      studyBtn.classList.add('active');
      watchBtn.classList.remove('active');
      studyBtn.style.background = 'rgba(255,255,255,0.3)';
      watchBtn.style.background = 'rgba(255,255,255,0.1)';
      this.enableStudyMode();
      if (watchContent) watchContent.style.display = 'none';
    } else {
      watchBtn.classList.add('active');
      studyBtn.classList.remove('active');
      watchBtn.style.background = 'rgba(255,255,255,0.3)';
      studyBtn.style.background = 'rgba(255,255,255,0.1)';
      this.enableWatchMode();
      if (watchContent) watchContent.style.display = 'block';
    }
  }

  enableStudyMode() {
    console.log('Study Mode: Focus on vocabulary, grammar, and detailed learning');
    // Scroll to vocabulary sections
    const firstSection = document.querySelector('.lesson-section:not(.overview-section)');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  enableWatchMode() {
    console.log('Watch Mode: Practice with audio segments and reinforcement');
    // Scroll to watch mode content
    const watchContent = document.getElementById('watch-mode-content');
    if (watchContent) {
      watchContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  playSegmentAudio(text, segmentIndex) {
    // Play the audio segment
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.currentLesson.sourceLanguage === 'it' ? 'it-IT' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Find Italian voice
      const voices = speechSynthesis.getVoices();
      let targetVoice = voices.find(voice => 
        voice.lang === utterance.lang && voice.localService === true
      ) || voices.find(voice => 
        voice.lang === utterance.lang
      );

      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      speechSynthesis.speak(utterance);
      
      // Visual feedback
      const button = event.target.closest('button');
      if (button) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-stop"></i> Playing...';
        button.style.background = '#f59e0b';
        
        utterance.onend = () => {
          button.innerHTML = originalContent;
          button.style.background = '#10b981';
        };
      }
    }
  }

  startInteractiveVideo() {
    const videoContent = document.getElementById('video-content');
    
    // Initialize video simulation state
    this.videoState = {
      isPlaying: false,
      currentTime: 0,
      duration: 180, // 3 minutes for demo
      currentSegment: 0,
      segments: [
        "Ciao a tutti! Mi chiamo Marco e oggi parleremo del tempo.",
        "In Italia, abbiamo quattro stagioni: primavera, estate, autunno e inverno.",
        "Mi piace molto l'estate perché fa caldo e posso andare al mare.",
        "E voi, quale stagione preferite? La primavera è bella perché i fiori sbocciano.",
        "L'autunno ha colori meravigliosi, e l'inverno... beh, fa freddo ma è romantico.",
        "Oggi il tempo è nuvoloso, ma domani dovrebbe fare bel tempo.",
        "Preferisco quando c'è il sole. Il sole mi rende felice!"
      ]
    };
    
    videoContent.innerHTML = `
      <div style="color: white; text-align: center;">
        <div class="video-player-simulation" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 2rem; border-radius: 8px; position: relative;">
          <div class="video-display" style="background: #000; padding: 3rem 2rem; border-radius: 8px; margin-bottom: 1rem; min-height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div id="video-status" style="font-size: 1.5rem; margin-bottom: 1rem;">
              <i class="fas fa-play-circle" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
              <div>Press Play to Start Interactive Video</div>
            </div>
            <div id="video-timeline" style="width: 80%; background: #333; height: 6px; border-radius: 3px; margin: 1rem 0; position: relative;">
              <div id="progress-bar" style="width: 0%; background: #667eea; height: 100%; border-radius: 3px; transition: width 0.3s ease;"></div>
            </div>
            <div id="time-display" style="color: #ccc; font-size: 0.9rem;">0:00 / 3:00</div>
          </div>
          
          <div class="video-controls" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
            <button id="play-pause-btn" onclick="capisco.togglePlayPause()" style="background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
              <i class="fas fa-play"></i> Play Video
            </button>
            <button onclick="capisco.restartVideo()" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer;">
              <i class="fas fa-undo"></i> Restart
            </button>
            <button onclick="capisco.skipSegment()" style="background: #f59e0b; color: white; border: none; padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer;">
              <i class="fas fa-forward"></i> Skip 10s
            </button>
          </div>
          
          <div class="interactive-features" style="background: rgba(102, 126, 234, 0.1); padding: 1rem; border-radius: 8px; text-align: left;">
            <h4><i class="fas fa-magic"></i> Interactive Features Active:</h4>
            <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
              <li><i class="fas fa-closed-captioning"></i> Click subtitle words for instant translation</li>
              <li><i class="fas fa-pause"></i> Auto-pause on new vocabulary</li>
              <li><i class="fas fa-redo"></i> Replay any segment easily</li>
              <li><i class="fas fa-gamepad"></i> Comprehension checkpoints</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // Show subtitle overlay
    document.getElementById('subtitle-overlay').style.display = 'block';
    this.updateSubtitle("Ready to start - Press Play!");
  }

  togglePlayPause() {
    if (!this.videoState) return;
    
    const playBtn = document.getElementById('play-pause-btn');
    const videoStatus = document.getElementById('video-status');
    
    if (this.videoState.isPlaying) {
      // Pause video
      this.videoState.isPlaying = false;
      clearInterval(this.videoTimer);
      playBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
      videoStatus.innerHTML = '<i class="fas fa-pause-circle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i><div>Video Paused</div>';
    } else {
      // Play video
      this.videoState.isPlaying = true;
      playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      videoStatus.innerHTML = '<i class="fas fa-play-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i><div>Video Playing</div>';
      
      this.startVideoSimulation();
    }
  }

  startVideoSimulation() {
    if (this.videoTimer) clearInterval(this.videoTimer);
    
    this.videoTimer = setInterval(() => {
      if (!this.videoState.isPlaying) return;
      
      this.videoState.currentTime += 1;
      this.updateVideoDisplay();
      
      // Check if we should show a new subtitle
      const segmentTime = Math.floor(this.videoState.currentTime / 25); // ~25 seconds per segment
      if (segmentTime < this.videoState.segments.length && segmentTime !== this.videoState.currentSegment) {
        this.videoState.currentSegment = segmentTime;
        this.updateSubtitle(this.videoState.segments[segmentTime]);
      }
      
      // End video if duration reached
      if (this.videoState.currentTime >= this.videoState.duration) {
        this.endVideo();
      }
    }, 1000);
  }

  updateVideoDisplay() {
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    
    if (progressBar) {
      const progressPercent = (this.videoState.currentTime / this.videoState.duration) * 100;
      progressBar.style.width = progressPercent + '%';
    }
    
    if (timeDisplay) {
      const currentMin = Math.floor(this.videoState.currentTime / 60);
      const currentSec = this.videoState.currentTime % 60;
      const totalMin = Math.floor(this.videoState.duration / 60);
      const totalSec = this.videoState.duration % 60;
      timeDisplay.textContent = `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`;
    }
  }

  updateSubtitle(text) {
    const subtitleElement = document.getElementById('current-subtitle');
    if (subtitleElement) {
      this.highlightVocabulary(text);
    }
  }

  restartVideo() {
    if (this.videoTimer) clearInterval(this.videoTimer);
    this.videoState.currentTime = 0;
    this.videoState.currentSegment = 0;
    this.videoState.isPlaying = false;
    
    const playBtn = document.getElementById('play-pause-btn');
    const videoStatus = document.getElementById('video-status');
    
    playBtn.innerHTML = '<i class="fas fa-play"></i> Play Video';
    videoStatus.innerHTML = '<i class="fas fa-play-circle" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i><div>Video Ready to Start</div>';
    
    this.updateVideoDisplay();
    this.updateSubtitle("Ready to start - Press Play!");
  }

  skipSegment() {
    if (!this.videoState) return;
    this.videoState.currentTime = Math.min(this.videoState.currentTime + 10, this.videoState.duration);
    this.updateVideoDisplay();
  }

  endVideo() {
    if (this.videoTimer) clearInterval(this.videoTimer);
    this.videoState.isPlaying = false;
    
    const playBtn = document.getElementById('play-pause-btn');
    const videoStatus = document.getElementById('video-status');
    
    playBtn.innerHTML = '<i class="fas fa-redo"></i> Restart';
    videoStatus.innerHTML = '<i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i><div>Video Complete!</div>';
    
    this.updateSubtitle("Video completed! Great job learning!");
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

  // Debug function to test if everything is working
  testCapisco() {
    console.log('Capisco test function called');
    alert('Capisco is working! Try submitting the form with a YouTube URL.');
    return true;
  }
}

// Add global test function
window.testCapisco = function() {
  if (window.capisco) {
    return window.capisco.testCapisco();
  } else {
    console.error('Capisco not initialized');
    alert('Capisco not initialized. Please refresh the page.');
    return false;
  }
};

// Initialize Capisco when page loads
let capisco;
document.addEventListener('DOMContentLoaded', function() {
  try {
    capisco = new CapiscoEngine();
    console.log('Capisco initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Capisco:', error);
  }
});
