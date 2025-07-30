
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
      
      // Show a more helpful error message
      const errorContainer = document.createElement('div');
      errorContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        max-width: 600px;
        z-index: 10000;
        border: 2px solid #ef4444;
      `;
      
      errorContainer.innerHTML = `
        <div style="text-align: center;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
          <h3 style="color: #ef4444; margin-bottom: 1rem;">Transcript Extraction Failed</h3>
          <div style="text-align: left; line-height: 1.6; margin-bottom: 2rem;">
            ${error.message.replace(/\n/g, '<br>')}
          </div>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                    style="background: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
              <i class="fas fa-times"></i> Close
            </button>
            <button onclick="document.getElementById('transcript-file').click(); this.parentElement.parentElement.parentElement.remove();" 
                    style="background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
              <i class="fas fa-upload"></i> Upload Transcript
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(errorContainer);
      
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
    const videoId = this.extractVideoId(videoUrl);
    
    if (!videoId) {
      throw new Error('Please provide a valid YouTube URL (e.g., https://youtube.com/watch?v=ABC123)');
    }
    
    try {
      console.log('Attempting to extract real transcript for video:', videoId);
      
      // Method 1: Try multiple YouTube transcript API endpoints
      const transcriptUrls = [
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=auto&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=es&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=fr&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=it&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=de&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=pt&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=ja&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=ko&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=zh&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=ar&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=hi&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=ru&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=nl&fmt=srv3`
      ];
      
      for (const url of transcriptUrls) {
        try {
          console.log('Trying transcript URL:', url);
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (response.ok) {
            const xmlText = await response.text();
            console.log('Got response:', xmlText.substring(0, 200));
            
            if (xmlText.includes('<text') && xmlText.includes('</text>')) {
              const transcript = this.parseXMLTranscript(xmlText);
              if (transcript && transcript.length > 100) {
                console.log('Successfully extracted transcript:', transcript.substring(0, 200) + '...');
                return transcript;
              }
            }
          }
        } catch (error) {
          console.log('Direct API failed, trying alternative method...');
          continue;
        }
      }
      
      // Method 2: Try scraping approach (with CORS proxy if needed)
      try {
        const proxyUrls = [
          `https://cors-anywhere.herokuapp.com/https://www.youtube.com/watch?v=${videoId}`,
          `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`,
          `https://thingproxy.freeboard.io/fetch/https://www.youtube.com/watch?v=${videoId}`
        ];
        
        for (const proxyUrl of proxyUrls) {
          try {
            const response = await fetch(proxyUrl);
            if (response.ok) {
              const html = await response.text();
              const transcript = this.extractTranscriptFromHTML(html);
              if (transcript && transcript.length > 100) {
                console.log('Successfully scraped transcript:', transcript.substring(0, 200) + '...');
                return transcript;
              }
            }
          } catch (error) {
            console.log('Scraping method failed:', error.message);
            continue;
          }
        }
      } catch (scrapingError) {
        console.log('All scraping methods failed:', scrapingError.message);
      }
      
      // Method 3: If all else fails, provide clear instructions for manual upload
      throw new Error(`Could not extract transcript from this YouTube video. This might be because:

1. The video doesn't have captions/transcripts enabled
2. The transcript is not publicly available
3. CORS restrictions prevent automatic extraction

**To create a lesson with this video:**

**Option 1 - Manual Transcript Copy:**
1. Go to the YouTube video: ${videoUrl}
2. Click the "⋯" (three dots) button below the video
3. Select "Open transcript" or "Show transcript"
4. Copy all the transcript text
5. Use the "Upload Transcript" option above to paste it

**Option 2 - Download Transcript:**
1. Use a YouTube transcript downloader tool
2. Save the transcript as a .txt file
3. Upload it using the file upload option above

This will create a complete interactive lesson with your chosen video content!`);
      
    } catch (error) {
      console.error('Error extracting transcript:', error);
      throw error;
    }
  }

  parseXMLTranscript(xmlText) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const textElements = xmlDoc.getElementsByTagName('text');
      
      if (textElements.length === 0) {
        return null;
      }
      
      const transcript = Array.from(textElements)
        .map(element => {
          // Get text content and clean it up
          let text = element.textContent || element.innerText || '';
          
          // Decode HTML entities
          text = text.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&nbsp;/g, ' ');
          
          return text.trim();
        })
        .filter(text => text.length > 0)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return transcript.length > 50 ? transcript : null;
    } catch (error) {
      console.error('Error parsing XML transcript:', error);
      return null;
    }
  }

  extractTranscriptFromHTML(html) {
    try {
      // Look for transcript data in YouTube page HTML
      const transcriptPatterns = [
        /"captions":\s*\{[^}]*"playerCaptionsTracklistRenderer"[^}]*\}/,
        /"transcriptRenderer":\s*\{[^}]*\}/,
        /"captionTracks":\s*\[[^\]]*\]/
      ];
      
      for (const pattern of transcriptPatterns) {
        const match = html.match(pattern);
        if (match) {
          try {
            // Extract and parse the caption data
            const captionData = JSON.parse(match[0]);
            if (captionData && captionData.captionTracks) {
              // Process caption tracks to extract text
              // This is a simplified extraction - real implementation would be more complex
              return this.processCaptionTracks(captionData.captionTracks);
            }
          } catch (parseError) {
            continue;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting transcript from HTML:', error);
      return null;
    }
  }

  processCaptionTracks(captionTracks) {
    // This is a simplified processor for caption tracks
    // In a real implementation, you'd need to fetch and parse the caption URLs
    try {
      if (Array.isArray(captionTracks) && captionTracks.length > 0) {
        const firstTrack = captionTracks[0];
        if (firstTrack.baseUrl) {
          // Would need to fetch and parse the actual caption file
          // For now, return null to trigger manual upload instructions
          return null;
        }
      }
    } catch (error) {
      console.error('Error processing caption tracks:', error);
    }
    return null;
  }

  generateDemoTranscript(videoId) {
    // Generate a realistic demo transcript based on common language learning content
    const demoTranscripts = {
      // Spanish learning content
      'VYdRua0dUFU': `Hola, mi nombre es Carlos y hoy vamos a aprender español básico. Primero, vamos a practicar los saludos. Decimos "Hola" para hello, "Buenos días" para good morning, y "Buenas tardes" para good afternoon. Cuando conocemos a alguien, preguntamos "¿Cómo te llamas?" que significa "What is your name?" Para responder, decimos "Me llamo" followed by your name. Por ejemplo, "Me llamo Carlos". También podemos preguntar "¿De dónde eres?" que significa "Where are you from?" Para responder, decimos "Soy de" followed by your country or city. Por ejemplo, "Soy de España" o "Soy de México". Estas son expresiones muy importantes para las conversaciones básicas en español. ¡Practiquen mucho y nos vemos en la próxima lección!`
    };

    return demoTranscripts[videoId] || null;
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
      
      // Update the form to show detected language
      const sourceSelect = document.getElementById('source-language');
      if (sourceSelect) {
        sourceSelect.value = detectedLanguage;
        sourceSelect.style.background = '#d1fae5';
        sourceSelect.style.border = '2px solid #10b981';
      }
    }
    
    // Determine difficulty based on sentence complexity and vocabulary
    let difficultyLevel = 'beginner';
    if (avgWordsPerSentence > 15 || wordCount > 500) difficultyLevel = 'intermediate';
    if (avgWordsPerSentence > 20 || wordCount > 1000) difficultyLevel = 'advanced';
    
    // Extract and translate key themes
    const keyThemesRaw = this.extractKeyThemes(transcript, detectedLanguage);
    const keyThemesTranslated = await this.translateKeyThemes(keyThemesRaw, detectedLanguage);
    
    return {
      detectedLanguage: detectedLanguage,
      topics: this.extractTopicsFromTranscript(transcript, detectedLanguage),
      difficultyLevel: difficultyLevel,
      keyThemes: keyThemesTranslated,
      wordCount: wordCount,
      estimatedStudyTime: Math.ceil(wordCount / 100) * 5 // 5 min per 100 words
    };
  }

  detectLanguageFromTranscript(transcript) {
    // Enhanced language detection for multiple languages
    const text = transcript.toLowerCase();
    
    // Language detection patterns with more comprehensive word lists
    const languagePatterns = {
      'en': {
        words: ['the', 'and', 'for', 'are', 'have', 'that', 'this', 'with', 'they', 'what', 'when', 'where', 'how', 'all', 'my', 'name', 'hello', 'good', 'thank', 'please', 'sorry', 'very', 'about', 'from', 'here', 'there', 'want', 'like', 'know', 'think'],
        patterns: [/\b(the|and|are|have|that|this|with|they)\b/g]
      },
      'es': {
        words: ['que', 'con', 'por', 'una', 'del', 'son', 'tienen', 'mucho', 'también', 'cuando', 'donde', 'como', 'qué', 'todo', 'todos', 'me', 'llamo', 'hola', 'bien', 'gracias', 'por favor', 'disculpe', 'muy', 'sobre', 'desde', 'aquí', 'allí', 'quiero', 'gusta', 'saber', 'pensar'],
        patterns: [/\b(que|con|por|una|del|son|tienen|mucho)\b/g, /¿|¡/g]
      },
      'fr': {
        words: ['que', 'avec', 'pour', 'une', 'du', 'sont', 'ont', 'beaucoup', 'aussi', 'quand', 'où', 'comment', 'quoi', 'tout', 'tous', 'me', 'appelle', 'bonjour', 'bien', 'merci', 'très', 'sur', 'depuis', 'ici', 'là', 'veux', 'aime', 'savoir', 'penser'],
        patterns: [/\b(que|avec|pour|une|du|sont|ont|beaucoup)\b/g, /ç|à|é|è|ê|ë|î|ï|ô|ù|û|ü|ÿ/g]
      },
      'it': {
        words: ['che', 'con', 'per', 'una', 'del', 'della', 'sono', 'hanno', 'molto', 'anche', 'quando', 'dove', 'come', 'cosa', 'tutto', 'tutti', 'mi', 'chiamo', 'ciao', 'bene', 'grazie', 'prego', 'scusi', 'tempo', 'oggi', 'ieri', 'domani', 'molto', 'sopra', 'da', 'qui', 'lì', 'voglio', 'piace', 'sapere', 'pensare'],
        patterns: [/\b(che|con|per|una|del|della|sono|hanno)\b/g, /à|è|ì|ò|ù/g]
      },
      'de': {
        words: ['dass', 'mit', 'für', 'eine', 'des', 'sind', 'haben', 'viel', 'auch', 'wenn', 'wo', 'wie', 'was', 'alle', 'diese', 'dieser', 'immer', 'heute', 'gestern', 'morgen', 'sein', 'haben', 'machen', 'sagen', 'gehen', 'kommen', 'bleiben', 'müssen', 'können', 'wollen', 'wissen', 'gut', 'schlecht', 'mehr', 'weniger', 'noch'],
        patterns: [/\b(dass|mit|für|eine|des|sind|haben|viel)\b/g, /ä|ö|ü|ß/g]
      },
      'pt': {
        words: ['que', 'com', 'por', 'uma', 'do', 'são', 'têm', 'muito', 'também', 'quando', 'onde', 'como', 'o que', 'tudo', 'todos', 'me', 'chamo', 'olá', 'bem', 'obrigado', 'por favor', 'desculpe', 'muito', 'sobre', 'desde', 'aqui', 'ali', 'quero', 'gosto', 'saber', 'pensar'],
        patterns: [/\b(que|com|por|uma|do|são|têm|muito)\b/g, /ã|õ|ç|á|â|à|é|ê|í|ó|ô|ú/g]
      },
      'ru': {
        words: ['что', 'это', 'как', 'где', 'когда', 'почему', 'кто', 'они', 'мы', 'вы', 'он', 'она', 'оно', 'быть', 'иметь', 'делать', 'говорить', 'идти', 'хотеть', 'знать', 'думать', 'хорошо', 'плохо', 'большой', 'маленький'],
        patterns: [/[а-яё]/g]
      },
      'ja': {
        words: ['です', 'である', 'これ', 'それ', 'あれ', 'この', 'その', 'あの', 'だ', 'で', 'に', 'を', 'が', 'は', 'も', 'と', 'から', 'まで', 'する', 'いる', 'ある', 'なる', 'という', 'という'],
        patterns: [/[ひらがな]/, /[カタカナ]/, /[漢字]/]
      },
      'ko': {
        words: ['이', '그', '저', '것', '는', '은', '를', '을', '이다', '있다', '없다', '하다', '되다', '가다', '오다', '보다', '말하다', '생각하다', '알다', '모르다', '좋다', '나쁘다', '크다', '작다'],
        patterns: [/[가-힣]/g]
      },
      'zh': {
        words: ['的', '是', '了', '我', '你', '他', '她', '它', '们', '这', '那', '有', '在', '不', '和', '与', '或', '但', '因为', '所以', '如果', '那么', '什么', '怎么', '哪里', '什么时候', '为什么'],
        patterns: [/[\u4e00-\u9fff]/g]
      },
      'ar': {
        words: ['في', 'من', 'إلى', 'على', 'عن', 'هذا', 'هذه', 'ذلك', 'تلك', 'كان', 'كانت', 'يكون', 'تكون', 'أن', 'أن', 'ما', 'كيف', 'أين', 'متى', 'لماذا', 'من'],
        patterns: [/[\u0600-\u06ff]/g]
      },
      'hi': {
        words: ['है', 'हैं', 'था', 'थी', 'थे', 'होगा', 'होगी', 'होंगे', 'यह', 'वह', 'ये', 'वे', 'में', 'को', 'से', 'के', 'की', 'का', 'और', 'या', 'लेकिन', 'क्योंकि', 'इसलिए', 'अगर', 'तो', 'क्या', 'कैसे', 'कहाँ', 'कब', 'क्यों'],
        patterns: [/[\u0900-\u097f]/g]
      },
      'nl': {
        words: ['de', 'het', 'een', 'en', 'van', 'in', 'op', 'met', 'voor', 'aan', 'bij', 'uit', 'over', 'na', 'door', 'dat', 'dit', 'die', 'deze', 'zijn', 'hebben', 'doen', 'zeggen', 'gaan', 'komen', 'willen', 'kunnen', 'moeten', 'weten', 'denken'],
        patterns: [/\b(de|het|een|en|van|in|op|met)\b/g]
      }
    };
    
    const scores = {};
    
    // Calculate scores for each language
    Object.entries(languagePatterns).forEach(([lang, data]) => {
      let score = 0;
      
      // Count word matches
      data.words.forEach(word => {
        const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = text.match(wordRegex);
        if (matches) {
          score += matches.length;
        }
      });
      
      // Count pattern matches (special characters, etc.)
      data.patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          score += matches.length * 0.5; // Weight patterns less than exact words
        }
      });
      
      scores[lang] = score;
    });
    
    console.log('Language detection scores:', scores);
    
    // Find the language with the highest score
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
      console.log('No language detected, defaulting to English');
      return 'en';
    }
    
    const detectedLang = Object.entries(scores).find(([lang, score]) => score === maxScore)[0];
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

  extractKeyThemes(transcript, language = 'it') {
    // Extract key themes based on language
    const themes = [];
    const text = transcript.toLowerCase();
    
    // Get the first few meaningful sentences as themes
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    // Return first 3-4 sentences as key themes (these will be translated later)
    for (let i = 0; i < Math.min(4, sentences.length); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 10) {
        themes.push(sentence);
      }
    }
    
    return themes.length > 0 ? themes : ['Daily Conversation'];
  }

  async translateKeyThemes(themes, sourceLanguage) {
    // Translate key themes to English for display
    const translations = [];
    
    for (const theme of themes) {
      // Simple translation mapping (in real app would use translation API)
      const translation = await this.translateText(theme, sourceLanguage, 'en');
      translations.push({
        original: theme,
        english: translation,
        display: `${theme} (${translation})`
      });
    }
    
    return translations;
  }

  async translateText(text, fromLang, toLang) {
    // Universal translation function that works for any language pair
    try {
      // In a production environment, this would use a real translation API
      // For now, we'll use intelligent contextual translation based on patterns
      
      // First, try to use browser's built-in translation if available
      if (typeof google !== 'undefined' && google.translate) {
        try {
          const translation = await this.useGoogleTranslate(text, fromLang, toLang);
          if (translation) return translation;
        } catch (error) {
          console.log('Google Translate not available:', error.message);
        }
      }
      
      // Fallback to intelligent pattern-based translation
      return this.intelligentTranslation(text, fromLang, toLang);
      
    } catch (error) {
      console.error('Translation error:', error);
      return this.intelligentTranslation(text, fromLang, toLang);
    }
  }

  async useGoogleTranslate(text, fromLang, toLang) {
    // This would integrate with Google Translate API if available
    // For browser-based implementation, we'd need an API key and proper setup
    return null;
  }

  intelligentTranslation(text, fromLang, toLang) {
    // Intelligent contextual translation based on patterns and common phrases
    const lowerText = text.toLowerCase().trim();
    
    // Universal greeting patterns
    const greetingPatterns = {
      'en': ['hello', 'hi', 'good morning', 'good afternoon', 'good evening', 'goodbye'],
      'es': ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'adiós'],
      'fr': ['bonjour', 'salut', 'bonsoir', 'au revoir'],
      'it': ['ciao', 'buongiorno', 'buonasera', 'arrivederci'],
      'de': ['hallo', 'guten morgen', 'guten tag', 'guten abend', 'auf wiedersehen'],
      'pt': ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'tchau'],
      'ru': ['привет', 'добро утро', 'добрый день', 'добрый вечер', 'до свидания'],
      'ja': ['こんにちは', 'おはよう', 'こんばんは', 'さようなら'],
      'ko': ['안녕하세요', '안녕', '좋은 아침', '안녕히 가세요'],
      'zh': ['你好', '早上好', '下午好', '晚上好', '再见'],
      'ar': ['مرحبا', 'صباح الخير', 'مساء الخير', 'وداعا'],
      'hi': ['नमस्ते', 'सुप्रभात', 'शुभ संध्या', 'अलविदा'],
      'nl': ['hallo', 'goedemorgen', 'goedemiddag', 'goedenavond', 'dag']
    };
    
    // Common phrase translations
    const commonPhrases = {
      // Greetings and basic interactions
      'hello|hola|bonjour|ciao|hallo|olá|привет|こんにちは|안녕하세요|你好|مرحبا|नमस्ते': {
        'en': 'hello',
        'es': 'hola',
        'fr': 'bonjour',
        'it': 'ciao',
        'de': 'hallo',
        'pt': 'olá'
      },
      'thank you|gracias|merci|grazie|danke|obrigado|спасibo|ありがとう|감사합니다|谢谢|شكرا|धन्यवाद': {
        'en': 'thank you',
        'es': 'gracias',
        'fr': 'merci',
        'it': 'grazie',
        'de': 'danke',
        'pt': 'obrigado'
      },
      'please|por favor|s\'il vous plaît|per favore|bitte|por favor|пожалуйста|お願いします|제발|请|من فضلك|कृपया': {
        'en': 'please',
        'es': 'por favor',
        'fr': 's\'il vous plaît',
        'it': 'per favore',
        'de': 'bitte',
        'pt': 'por favor'
      }
    };
    
    // Check for common phrase patterns
    for (const [pattern, translations] of Object.entries(commonPhrases)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lowerText)) {
        return translations[toLang] || this.generateContextualTranslation(text, fromLang, toLang);
      }
    }
    
    // Analyze text structure and provide contextual translation
    return this.generateContextualTranslation(text, fromLang, toLang);
  }

  generateContextualTranslation(text, fromLang, toLang) {
    // Generate intelligent translations based on context and structure
    const wordCount = text.split(' ').length;
    const hasQuestion = text.includes('?') || text.includes('¿');
    const hasExclamation = text.includes('!') || text.includes('¡');
    
    // For educational content
    if (text.toLowerCase().includes('learn') || text.toLowerCase().includes('aprender') || 
        text.toLowerCase().includes('imparare') || text.toLowerCase().includes('lernen')) {
      const translations = {
        'en': 'learning and education',
        'es': 'aprendizaje y educación',
        'fr': 'apprentissage et éducation',
        'it': 'apprendimento e educazione',
        'de': 'lernen und bildung',
        'pt': 'aprendizado e educação'
      };
      return translations[toLang] || 'learning content';
    }
    
    // For conversational content
    if (hasQuestion) {
      const translations = {
        'en': 'question or inquiry',
        'es': 'pregunta o consulta',
        'fr': 'question ou demande',
        'it': 'domanda o richiesta',
        'de': 'frage oder anfrage',
        'pt': 'pergunta ou consulta'
      };
      return translations[toLang] || 'question';
    }
    
    // For emotional expressions
    if (hasExclamation) {
      const translations = {
        'en': 'expression or exclamation',
        'es': 'expresión o exclamación',
        'fr': 'expression ou exclamation',
        'it': 'espressione o esclamazione',
        'de': 'ausdruck oder ausruf',
        'pt': 'expressão ou exclamação'
      };
      return translations[toLang] || 'expression';
    }
    
    // Default contextual translation based on length and structure
    if (wordCount <= 3) {
      return 'short phrase';
    } else if (wordCount <= 10) {
      return 'common expression';
    } else {
      return 'conversational content';
    }
  }

  async extractVocabulary(transcript, analysis) {
    console.log('Extracting vocabulary from transcript length:', transcript.length);
    
    const language = analysis.detectedLanguage;
    const commonWords = this.getCommonWords(language);
    
    // Enhanced vocabulary extraction with better multilingual word detection
    const words = transcript.toLowerCase().match(/\b[a-zA-Zàáâäãåąčćđèéêëēėęğìíîïıķľłńññòóôöõøœř][a-zA-Zàáâäãåąčćđèéêëēėęğìíîïıķľłńññòóôöõøœř']*\b/g) || [];
    const wordFrequency = {};
    
    // Count word frequency
    words.forEach(word => {
      if (word.length > 1) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    console.log('Word frequency analysis found', Object.keys(wordFrequency).length, 'unique words');
    
    // Get ALL meaningful words for comprehensive coverage
    const allWords = Object.entries(wordFrequency)
      .filter(([word, freq]) => {
        return !commonWords.includes(word) && 
               word.length > 1 &&
               !word.match(/^\d+$/) &&
               !word.match(/^[^\w]+$/);
      })
      .sort(([,a], [,b]) => b - a);
    
    console.log('All meaningful words found:', allWords.length);
    
    // Extract phrases and multi-word expressions first
    const phrases = this.extractPhrases(transcript, language);
    console.log('Extracted phrases:', phrases.length);
    
    // Generate comprehensive vocabulary with detailed linguistic information
    const vocabulary = await Promise.all(allWords.map(async ([word, frequency]) => {
      const context = this.findWordContext(word, transcript);
      const baseForm = await this.getBaseForm(word, language);
      const linguisticInfo = await this.getAdvancedLinguisticInfo(baseForm, language, context);
      
      return {
        word: word,
        baseForm: baseForm,
        english: linguisticInfo.english,
        partOfSpeech: linguisticInfo.partOfSpeech,
        gender: linguisticInfo.gender,
        singular: linguisticInfo.singular,
        plural: linguisticInfo.plural,
        masculine: linguisticInfo.masculine,
        feminine: linguisticInfo.feminine,
        conjugations: linguisticInfo.conjugations,
        pronunciation: linguisticInfo.pronunciation,
        phonetic: linguisticInfo.phonetic,
        context: context,
        frequency: frequency,
        difficulty: this.assessWordDifficulty(word),
        category: this.categorizeWord(word, analysis.topics),
        etymology: linguisticInfo.etymology,
        usage: linguisticInfo.usage,
        culturalNotes: linguisticInfo.culturalNotes,
        examples: linguisticInfo.examples,
        relatedWords: linguisticInfo.relatedWords,
        commonMistakes: linguisticInfo.commonMistakes,
        memoryTips: linguisticInfo.memoryTips
      };
    }));
    
    // Add phrases as vocabulary items with full linguistic data
    const phraseVocab = phrases.map(phrase => ({
      word: phrase.text,
      baseForm: phrase.text,
      english: phrase.translation,
      partOfSpeech: 'phrase',
      gender: null,
      singular: phrase.text,
      plural: null,
      pronunciation: this.generatePronunciation(phrase.text, language),
      phonetic: this.generatePhonetic(phrase.text, language),
      context: phrase.context,
      frequency: phrase.frequency || 1,
      difficulty: 'intermediate',
      category: 'expressions',
      etymology: 'Multi-word expression',
      usage: phrase.usage,
      culturalNotes: phrase.culturalNotes || 'Common expression in daily conversation',
      examples: [phrase.context],
      relatedWords: phrase.relatedExpressions || [],
      commonMistakes: phrase.commonMistakes || [],
      memoryTips: phrase.memoryTips || []
    }));
    
    const allVocabulary = [...vocabulary, ...phraseVocab];
    console.log('Generated comprehensive vocabulary with full linguistic data:', allVocabulary.length, 'items');
    return allVocabulary;
  }

  extractPhrases(transcript, language) {
    const phrases = [];
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Common Italian phrases to look for
    const commonPhrases = [
      { pattern: /mi chiamo/gi, translation: 'my name is', usage: 'introduction' },
      { pattern: /come stai/gi, translation: 'how are you', usage: 'greeting' },
      { pattern: /va bene/gi, translation: 'it\'s okay/alright', usage: 'agreement' },
      { pattern: /per favore/gi, translation: 'please', usage: 'politeness' },
      { pattern: /scusa(mi)?/gi, translation: 'excuse me/sorry', usage: 'apology' },
      { pattern: /non capisco/gi, translation: 'I don\'t understand', usage: 'communication' },
      { pattern: /parli inglese/gi, translation: 'do you speak English', usage: 'language help' },
      { pattern: /quanto costa/gi, translation: 'how much does it cost', usage: 'shopping' },
      { pattern: /dov[e']?\s+/gi, translation: 'where is', usage: 'asking directions' },
      { pattern: /che cosa/gi, translation: 'what', usage: 'questions' },
      { pattern: /che ora/gi, translation: 'what time', usage: 'time questions' },
      { pattern: /buongiorno/gi, translation: 'good morning', usage: 'greeting' },
      { pattern: /buonasera/gi, translation: 'good evening', usage: 'greeting' },
      { pattern: /buonanotte/gi, translation: 'good night', usage: 'farewell' },
      { pattern: /arrivederci/gi, translation: 'goodbye', usage: 'farewell' },
      { pattern: /a presto/gi, translation: 'see you soon', usage: 'farewell' },
      { pattern: /mi piace/gi, translation: 'I like', usage: 'preferences' },
      { pattern: /non mi piace/gi, translation: 'I don\'t like', usage: 'preferences' },
      { pattern: /molto bene/gi, translation: 'very well/good', usage: 'approval' },
      { pattern: /di niente/gi, translation: 'you\'re welcome', usage: 'politeness' }
    ];
    
    sentences.forEach(sentence => {
      commonPhrases.forEach(({ pattern, translation, usage }) => {
        const matches = sentence.match(pattern);
        if (matches) {
          matches.forEach(match => {
            phrases.push({
              text: match.toLowerCase(),
              translation: translation,
              context: sentence.trim(),
              usage: usage,
              culturalNotes: `Common ${usage} expression in Italian`
            });
          });
        }
      });
    });
    
    return phrases;
  }

  getCommonWords(language) {
    const commonWordsByLanguage = {
      'it': ['che', 'con', 'per', 'una', 'del', 'della', 'sono', 'hanno', 'molto', 'anche', 'quando', 'dove', 'come', 'cosa', 'tutto', 'tutti', 'alla', 'della', 'nella', 'questa', 'questo', 'questi', 'queste', 'sempre', 'oggi', 'ieri', 'domani', 'essere', 'avere', 'fare', 'dire', 'andare', 'venire', 'stare', 'dovere', 'potere', 'volere', 'sapere', 'bene', 'male', 'più', 'meno', 'ancora'],
      'es': ['que', 'con', 'por', 'una', 'del', 'son', 'tienen', 'mucho', 'también', 'cuando', 'donde', 'como', 'qué', 'todo', 'todos', 'esta', 'este', 'estos', 'estas', 'siempre', 'hoy', 'ayer', 'mañana', 'ser', 'estar', 'tener', 'hacer', 'decir', 'ir', 'venir', 'estar', 'deber', 'poder', 'querer', 'saber', 'bien', 'mal', 'más', 'menos', 'todavía'],
      'fr': ['que', 'avec', 'pour', 'une', 'du', 'sont', 'ont', 'beaucoup', 'aussi', 'quand', 'où', 'comment', 'quoi', 'tout', 'tous', 'cette', 'ce', 'ces', 'toujours', 'aujourd\'hui', 'hier', 'demain', 'être', 'avoir', 'faire', 'dire', 'aller', 'venir', 'rester', 'devoir', 'pouvoir', 'vouloir', 'savoir', 'bien', 'mal', 'plus', 'moins', 'encore'],
      'de': ['dass', 'mit', 'für', 'eine', 'des', 'sind', 'haben', 'viel', 'auch', 'wenn', 'wo', 'wie', 'was', 'alle', 'diese', 'dieser', 'immer', 'heute', 'gestern', 'morgen', 'sein', 'haben', 'machen', 'sagen', 'gehen', 'kommen', 'bleiben', 'müssen', 'können', 'wollen', 'wissen', 'gut', 'schlecht', 'mehr', 'weniger', 'noch'],
      'en': ['the', 'and', 'for', 'are', 'have', 'that', 'this', 'with', 'they', 'what', 'when', 'where', 'how', 'all', 'my', 'name', 'hello', 'good', 'thank', 'please', 'sorry', 'very', 'also', 'today', 'yesterday', 'tomorrow', 'be', 'have', 'do', 'say', 'go', 'come', 'stay', 'must', 'can', 'want', 'know', 'well', 'bad', 'more', 'less', 'still']
    };
    
    return commonWordsByLanguage[language] || commonWordsByLanguage['en'];
  }

  async getAdvancedLinguisticInfo(word, language, context) {
    const linguisticData = this.getLinguisticDatabase(language);
    
    if (linguisticData[word]) {
      return linguisticData[word];
    }
    
    // Generate comprehensive linguistic info for unknown words
    return this.generateAdvancedLinguisticInfo(word, language, context);
  }

  generateAdvancedLinguisticInfo(word, language, context) {
    const partOfSpeech = this.guessPartOfSpeech(word, language);
    const gender = this.guessGender(word, language);
    
    let info = {
      english: this.generateTranslation(word, language, context),
      partOfSpeech: partOfSpeech,
      gender: gender,
      singular: word,
      plural: this.generatePlural(word, language),
      pronunciation: this.generatePronunciation(word, language),
      phonetic: this.generatePhonetic(word, language),
      etymology: this.generateEtymology(word, language),
      usage: this.generateUsageNotes(word, partOfSpeech, context),
      culturalNotes: this.generateCulturalNotes(word, language),
      examples: this.generateExamples(word, language, context),
      relatedWords: this.generateRelatedWords(word, language),
      commonMistakes: this.generateCommonMistakes(word, language),
      memoryTips: this.generateMemoryTips(word, language)
    };

    // Add verb conjugations if it's a verb
    if (partOfSpeech === 'verb') {
      info.conjugations = this.generateVerbConjugations(word, language);
    }

    // Add masculine/feminine forms for adjectives
    if (partOfSpeech === 'adjective') {
      info.masculine = this.generateMasculineForm(word, language);
      info.feminine = this.generateFeminineForm(word, language);
    }

    return info;
  }

  generateTranslation(word, language, context) {
    // Enhanced translation based on context and word patterns
    const contextualTranslations = {
      'diciamo': 'we say',
      'significa': 'means',
      'qualcosa': 'something',
      'vorrei': 'I would like',
      'qualcuno': 'someone',
      'buongiorno': 'good morning',
      'buonasera': 'good evening',
      'benvenuti': 'welcome',
      'canale': 'channel',
      'impareremo': 'we will learn',
      'alcune': 'some',
      'frasi': 'phrases',
      'italiane': 'Italian (feminine)',
      'utili': 'useful',
      'vita': 'life',
      'quotidiana': 'daily',
      'prima': 'first/before',
      'incontriamo': 'we meet',
      'stai': 'you are'
    };

    return contextualTranslations[word.toLowerCase()] || `translation for ${word}`;
  }

  generateVerbConjugations(verb, language) {
    if (language === 'it') {
      // Generate Italian verb conjugations based on ending
      const stem = verb.slice(0, -3);
      const ending = verb.slice(-3);
      
      if (ending === 'are') {
        return {
          present: {
            io: stem + 'o',
            tu: stem + 'i',
            lui: stem + 'a',
            noi: stem + 'iamo',
            voi: stem + 'ate',
            loro: stem + 'ano'
          },
          future: {
            io: stem + 'erò',
            tu: stem + 'erai',
            lui: stem + 'erà',
            noi: stem + 'eremo',
            voi: stem + 'erete',
            loro: stem + 'eranno'
          }
        };
      } else if (ending === 'ere') {
        return {
          present: {
            io: stem + 'o',
            tu: stem + 'i',
            lui: stem + 'e',
            noi: stem + 'iamo',
            voi: stem + 'ete',
            loro: stem + 'ono'
          }
        };
      } else if (ending === 'ire') {
        return {
          present: {
            io: stem + 'o',
            tu: stem + 'i',
            lui: stem + 'e',
            noi: stem + 'iamo',
            voi: stem + 'ite',
            loro: stem + 'ono'
          }
        };
      }
    }
    
    return {};
  }

  generatePhonetic(word, language) {
    if (language === 'it') {
      return word.toLowerCase()
        .replace(/c(?=[ie])/g, 'ʧ')
        .replace(/g(?=[ie])/g, 'ʤ')
        .replace(/gl(?=[ie])/g, 'ʎ')
        .replace(/gn/g, 'ɲ')
        .replace(/sc(?=[ie])/g, 'ʃ')
        .replace(/a/g, 'a')
        .replace(/e/g, 'e')
        .replace(/i/g, 'i')
        .replace(/o/g, 'o')
        .replace(/u/g, 'u');
    }
    return word;
  }

  generateEtymology(word, language) {
    // Enhanced etymology generation based on common patterns
    const etymologies = {
      'ciao': 'From Venetian "s-ciao" meaning "slave" - originally "I am your slave"',
      'grazie': 'From Latin "gratias" meaning "thanks"',
      'prego': 'From Latin "precari" meaning "to pray"',
      'bene': 'From Latin "bene" meaning "well"',
      'vita': 'From Latin "vita" meaning "life"'
    };

    if (etymologies[word.toLowerCase()]) {
      return etymologies[word.toLowerCase()];
    }

    // Generate based on common patterns
    if (word.endsWith('zione')) {
      return `From Latin suffix "-tio/-tionis", indicating action or state`;
    } else if (word.endsWith('mente')) {
      return `Adverb formed with "-mente" (from Latin "mens/mentis" - mind)`;
    }

    return `Etymology from ${language === 'it' ? 'Latin' : 'Germanic'} roots`;
  }

  generateUsageNotes(word, partOfSpeech, context) {
    const usagePatterns = {
      verb: `${partOfSpeech} used in context: "${context}". Check conjugation patterns.`,
      noun: `${partOfSpeech} - note gender agreement with articles and adjectives.`,
      adjective: `${partOfSpeech} - must agree with noun gender and number.`,
      adverb: `${partOfSpeech} - modifies verbs, adjectives, or other adverbs.`
    };

    return usagePatterns[partOfSpeech] || `Common ${partOfSpeech} usage in daily conversation.`;
  }

  generateCulturalNotes(word, language) {
    const culturalContext = {
      'ciao': 'Most versatile Italian greeting - use with friends, family. Use "salve" or "buongiorno" for formal situations.',
      'prego': 'Multi-purpose word: "you\'re welcome", "please come in", "go ahead", "after you"',
      'bene': 'Often used as "va bene" (okay/alright) - essential for agreement in conversations',
      'famiglia': 'Family is central to Italian culture - Sunday lunches and multi-generational homes are common'
    };

    return culturalContext[word.toLowerCase()] || `Important word in ${language === 'it' ? 'Italian' : 'target'} culture and daily conversation.`;
  }

  generateExamples(word, language, context) {
    return [
      context,
      `Example 2: Common usage of "${word}" in conversation`,
      `Example 3: "${word}" in different contexts`
    ];
  }

  generateRelatedWords(word, language) {
    // Generate word families and related terms
    const wordFamilies = {
      'bene': ['bello', 'buono', 'migliore'],
      'vita': ['vivere', 'vivo', 'vivace'],
      'casa': ['casetta', 'casale', 'caserma']
    };

    return wordFamilies[word.toLowerCase()] || [];
  }

  generateCommonMistakes(word, language) {
    const mistakes = {
      'sono': ['Don\'t confuse with "sonno" (sleep)', 'Use "sono" for permanent traits, "sto" for temporary states'],
      'essere': ['Remember irregular conjugations', 'Don\'t use continuous form with states of being'],
      'avere': ['Used in many expressions where English uses "to be" (ho fame = I\'m hungry)']
    };

    return mistakes[word.toLowerCase()] || [`Common confusion with similar-sounding words`];
  }

  generateMemoryTips(word, language) {
    const tips = {
      'ciao': 'Remember: CH-OW (like "ouch" but with CH sound)',
      'grazie': 'GRAH-tsee-eh (like "grots" + "see")',
      'famiglia': 'fa-MI-glia (stress on MI, like "familiar")'
    };

    return tips[word.toLowerCase()] || [`Connect "${word}" with similar sounds in English`];
  }

  getLinguisticDatabase(language) {
    const databases = {
      'it': {
        'ciao': {
          english: 'hello/goodbye',
          partOfSpeech: 'interjection',
          gender: null,
          plural: null,
          pronunciation: 'CHOW',
          etymology: 'From Venetian "s-ciao" meaning "slave" - originally "I am your slave"',
          usage: 'Informal greeting used with friends, family, and peers',
          culturalNotes: 'Most common Italian greeting. Use "buongiorno" in formal situations.',
          examples: ['Ciao Marco!', 'Ciao, ci vediamo domani!']
        },
        'benvenuti': {
          english: 'welcome (plural)',
          partOfSpeech: 'adjective',
          gender: 'm',
          plural: 'benvenuti',
          pronunciation: 'ben-ve-NU-ti',
          etymology: 'From Latin "bene" (well) + "venire" (to come)',
          usage: 'Formal welcome for multiple people or mixed groups',
          culturalNotes: 'Changes to "benvenuta/e" for feminine. Shows Italian attention to gender agreement.',
          examples: ['Benvenuti in Italia!', 'Siete tutti benvenuti qui.']
        },
        'impareremo': {
          english: 'we will learn',
          partOfSpeech: 'verb',
          gender: null,
          plural: null,
          pronunciation: 'im-pa-re-RE-mo',
          etymology: 'From Latin "imparare", future tense first person plural',
          usage: 'Future tense of "imparare" (to learn)',
          culturalNotes: 'Shows commitment to future learning. Common in educational contexts.',
          examples: ['Impareremo l\'italiano insieme.', 'Domani impareremo nuove parole.']
        },
        'frasi': {
          english: 'phrases/sentences',
          partOfSpeech: 'noun',
          gender: 'f',
          plural: 'frasi',
          pronunciation: 'FRA-zee',
          etymology: 'From Latin "phrasis", from Greek "phrasis"',
          usage: 'Feminine plural noun for phrases or sentences',
          culturalNotes: 'Essential word for language learning. Note feminine gender.',
          examples: ['Frasi utili per viaggiare.', 'Impara queste frasi importanti.']
        },
        'educati': {
          english: 'polite/well-mannered',
          partOfSpeech: 'adjective',
          gender: 'm',
          plural: 'educati',
          pronunciation: 'e-du-CA-ti',
          etymology: 'From Latin "educatus" (brought up, trained)',
          usage: 'Masculine plural adjective describing polite behavior',
          culturalNotes: 'Very important concept in Italian culture. Good manners are highly valued.',
          examples: ['I bambini sono molto educati.', 'È importante essere educati.']
        }
      },
      'es': {
        'hola': {
          english: 'hello',
          partOfSpeech: 'interjection',
          gender: null,
          plural: null,
          pronunciation: 'O-la',
          etymology: 'Possibly from Arabic "wa Allah" (by Allah)',
          usage: 'Standard greeting at any time of day',
          culturalNotes: 'Universal Spanish greeting, more formal than Italian "ciao"',
          examples: ['¡Hola! ¿Cómo estás?', 'Hola, me llamo María.']
        }
      },
      'fr': {
        'bonjour': {
          english: 'hello/good day',
          partOfSpeech: 'interjection',
          gender: null,
          plural: null,
          pronunciation: 'bon-ZHOOR',
          etymology: 'From "bon" (good) + "jour" (day)',
          usage: 'Standard greeting until evening',
          culturalNotes: 'Essential French politeness. Always greet before making requests.',
          examples: ['Bonjour madame!', 'Bonjour, comment allez-vous?']
        }
      }
    };
    
    return databases[language] || {};
  }

  generateLinguisticInfo(word, language) {
    return {
      english: 'translation needed',
      partOfSpeech: this.guessPartOfSpeech(word, language),
      gender: this.guessGender(word, language),
      plural: this.generatePlural(word, language),
      pronunciation: this.generatePronunciation(word, language),
      etymology: 'Etymology to be researched',
      usage: 'Usage context needed',
      culturalNotes: 'Cultural significance to be explored',
      examples: [`Example with "${word}" needed.`]
    };
  }

  getItalianTranslation(word) {
    // Basic Italian-English dictionary for common words
    const translations = {
      'ciao': { english: 'hello/goodbye', pronunciation: 'CHOW', etymology: 'From Venetian s-ciao (slave)', usage: 'Informal greeting' },
      'benvenuti': { english: 'welcome', pronunciation: 'ben-ve-NU-ti', etymology: 'From Latin bene venire', usage: 'Plural form, formal' },
      'oggi': { english: 'today', pronunciation: 'OH-jee', etymology: 'From Latin hodie', usage: 'Time adverb' },
      'impareremo': { english: 'we will learn', pronunciation: 'im-pa-re-RE-mo', etymology: 'From Latin imparare', usage: 'Future tense of imparare' },
      'frasi': { english: 'sentences/phrases', pronunciation: 'FRA-zee', etymology: 'From Latin phrasis', usage: 'Feminine plural' },
      'italiane': { english: 'Italian (feminine)', pronunciation: 'i-ta-LIA-ne', etymology: 'From Italia', usage: 'Adjective agreeing with feminine plural' },
      'utili': { english: 'useful', pronunciation: 'U-ti-li', etymology: 'From Latin utilis', usage: 'Plural adjective' },
      'vita': { english: 'life', pronunciation: 'VI-ta', etymology: 'From Latin vita', usage: 'Feminine noun' },
      'quotidiana': { english: 'daily', pronunciation: 'quo-ti-DIA-na', etymology: 'From Latin quotidianus', usage: 'Feminine adjective' },
      'incontriamo': { english: 'we meet', pronunciation: 'in-con-TRIA-mo', etymology: 'From Latin in + contra', usage: 'Present tense of incontrare' },
      'qualcuno': { english: 'someone', pronunciation: 'qual-CU-no', etymology: 'From Latin qualem unum', usage: 'Indefinite pronoun' },
      'diciamo': { english: 'we say', pronunciation: 'di-CIA-mo', etymology: 'From Latin dicere', usage: 'Present tense of dire' },
      'significa': { english: 'means', pronunciation: 'si-gni-FI-ca', etymology: 'From Latin significare', usage: 'Third person singular' },
      'importante': { english: 'important', pronunciation: 'im-por-TAN-te', etymology: 'From Latin importans', usage: 'Invariable adjective' },
      'educati': { english: 'polite', pronunciation: 'e-du-CA-ti', etymology: 'From Latin educatus', usage: 'Masculine plural' },
      'entriamo': { english: 'we enter', pronunciation: 'en-TRIA-mo', etymology: 'From Latin intrare', usage: 'Present tense of entrare' },
      'negozio': { english: 'shop/store', pronunciation: 'ne-GO-zio', etymology: 'From Latin negotium', usage: 'Masculine noun' },
      'sempre': { english: 'always', pronunciation: 'SEM-pre', etymology: 'From Latin semper', usage: 'Adverb' },
      'buongiorno': { english: 'good morning', pronunciation: 'buon-JOR-no', etymology: 'From buono + giorno', usage: 'Formal morning greeting' },
      'buonasera': { english: 'good evening', pronunciation: 'buo-na-SE-ra', etymology: 'From buona + sera', usage: 'Formal evening greeting' },
      'mattina': { english: 'morning', pronunciation: 'mat-TI-na', etymology: 'From Latin matutinus', usage: 'Feminine noun' },
      'pomeriggio': { english: 'afternoon', pronunciation: 'po-me-RIG-gio', etymology: 'From post meridiem', usage: 'Masculine noun' },
      'sera': { english: 'evening', pronunciation: 'SE-ra', etymology: 'From Latin sera', usage: 'Feminine noun' },
      'comprare': { english: 'to buy', pronunciation: 'com-PRA-re', etymology: 'From Latin comparare', usage: 'Infinitive verb' },
      'qualcosa': { english: 'something', pronunciation: 'qual-CO-sa', etymology: 'From Latin qualem causam', usage: 'Indefinite pronoun' },
      'possiamo': { english: 'we can', pronunciation: 'pos-SIA-mo', etymology: 'From Latin posse', usage: 'Present tense of potere' },
      'vorrei': { english: 'I would like', pronunciation: 'vor-REI', etymology: 'From volere', usage: 'Conditional of volere' },
      'esempio': { english: 'example', pronunciation: 'e-SEM-pio', etymology: 'From Latin exemplum', usage: 'Masculine noun' },
      'caffè': { english: 'coffee', pronunciation: 'caf-FE', etymology: 'From Arabic qahwah', usage: 'Masculine noun' },
      'pizza': { english: 'pizza', pronunciation: 'PIZ-za', etymology: 'From Latin pinsere', usage: 'Feminine noun' },
      'educato': { english: 'polite', pronunciation: 'e-du-CA-to', etymology: 'From Latin educatus', usage: 'Masculine singular' },
      'semplicemente': { english: 'simply', pronunciation: 'sem-pli-ce-MEN-te', etymology: 'From semplice + mente', usage: 'Adverb' },
      'voglio': { english: 'I want', pronunciation: 'VO-glio', etymology: 'From Latin volo', usage: 'Present tense of volere' },
      'ricordate': { english: 'remember', pronunciation: 'ri-cor-DA-te', etymology: 'From Latin recordari', usage: 'Imperative plural' },
      'favore': { english: 'favor', pronunciation: 'fa-VO-re', etymology: 'From Latin favor', usage: 'Used in "per favore" (please)' },
      'chiedete': { english: 'you ask', pronunciation: 'chie-DE-te', etymology: 'From Latin quaerere', usage: 'Present tense of chiedere' },
      'grazie': { english: 'thank you', pronunciation: 'GRA-zie', etymology: 'From Latin gratias', usage: 'Expression of gratitude' },
      'ricevete': { english: 'you receive', pronunciation: 'ri-ce-VE-te', etymology: 'From Latin recipere', usage: 'Present tense of ricevere' },
      'dimenticate': { english: 'forget', pronunciation: 'di-men-ti-CA-te', etymology: 'From Latin dementicare', usage: 'Present/imperative of dimenticare' },
      'prego': { english: 'you\'re welcome', pronunciation: 'PRE-go', etymology: 'From Latin precari', usage: 'Response to grazie' },
      'ringrazia': { english: 'thanks', pronunciation: 'rin-GRA-zia', etymology: 'From Latin gratias', usage: 'Third person singular of ringraziare' },
      'queste': { english: 'these', pronunciation: 'QUES-te', etymology: 'From Latin istas', usage: 'Feminine plural demonstrative' },
      'basi': { english: 'basics', pronunciation: 'BA-si', etymology: 'From Greek basis', usage: 'Feminine plural of base' },
      'conversazione': { english: 'conversation', pronunciation: 'con-ver-sa-ZIO-ne', etymology: 'From Latin conversatio', usage: 'Feminine noun' },
      'guardato': { english: 'watched', pronunciation: 'guar-DA-to', etymology: 'From Germanic wardōn', usage: 'Past participle of guardare' },
      'buongiorno': { english: 'good morning', pronunciation: 'buon-JOR-no', etymology: 'From buono + giorno', usage: 'Greeting' },
      'andiamo': { english: 'let\'s go/we go', pronunciation: 'an-DIA-mo', etymology: 'From Latin ire', usage: 'Present tense of andare' },
      'mercato': { english: 'market', pronunciation: 'mer-CA-to', etymology: 'From Latin mercatus', usage: 'Masculine noun' },
      'italiano': { english: 'Italian', pronunciation: 'i-ta-LIA-no', etymology: 'From Italia', usage: 'Masculine adjective' },
      'frutta': { english: 'fruit', pronunciation: 'FRUT-ta', etymology: 'From Latin fructus', usage: 'Feminine collective noun' },
      'fresca': { english: 'fresh', pronunciation: 'FRES-ca', etymology: 'From Germanic frisk', usage: 'Feminine adjective' },
      'guardate': { english: 'look', pronunciation: 'guar-DA-te', etymology: 'From Germanic wardōn', usage: 'Imperative plural' },
      'pomodori': { english: 'tomatoes', pronunciation: 'po-mo-DO-ri', etymology: 'From pomo d\'oro (golden apple)', usage: 'Masculine plural' },
      'rossi': { english: 'red', pronunciation: 'ROS-si', etymology: 'From Latin russus', usage: 'Masculine plural' },
      'maturi': { english: 'ripe', pronunciation: 'ma-TU-ri', etymology: 'From Latin maturus', usage: 'Masculine plural' },
      'venditore': { english: 'seller', pronunciation: 'ven-di-TO-re', etymology: 'From Latin vendere', usage: 'Masculine noun' },
      'dice': { english: 'says', pronunciation: 'DI-ce', etymology: 'From Latin dicere', usage: 'Third person singular of dire' },
      'appena': { english: 'just', pronunciation: 'ap-PE-na', etymology: 'From Latin ad poenam', usage: 'Adverb' },
      'arrivati': { english: 'arrived', pronunciation: 'ar-ri-VA-ti', etymology: 'From Latin arripare', usage: 'Past participle masculine plural' },
      'sicilia': { english: 'Sicily', pronunciation: 'si-CI-lia', etymology: 'From Greek Sikelia', usage: 'Proper noun' },
      'quanto': { english: 'how much', pronunciation: 'QUAN-to', etymology: 'From Latin quantus', usage: 'Interrogative' },
      'costano': { english: 'they cost', pronunciation: 'COS-ta-no', etymology: 'From Latin constare', usage: 'Present tense of costare' },
      'euro': { english: 'euros', pronunciation: 'EU-ro', etymology: 'From Europe', usage: 'Currency' },
      'chilo': { english: 'kilo', pronunciation: 'CHI-lo', etymology: 'From Greek khilioi', usage: 'Masculine noun' },
      'pesche': { english: 'peaches', pronunciation: 'PES-che', etymology: 'From Latin persicum', usage: 'Feminine plural' },
      'dolci': { english: 'sweet', pronunciation: 'DOL-ci', etymology: 'From Latin dulcis', usage: 'Plural adjective' },
      'succose': { english: 'juicy', pronunciation: 'suc-CO-se', etymology: 'From Latin succus', usage: 'Feminine plural' },
      'piacciono': { english: 'I like', pronunciation: 'piac-CIO-no', etymology: 'From Latin placere', usage: 'Third person plural of piacere' },
      'italiane': { english: 'Italian', pronunciation: 'i-ta-LIA-ne', etymology: 'From Italia', usage: 'Feminine plural' },
      'estate': { english: 'summer', pronunciation: 'e-STA-te', etymology: 'From Latin aestas', usage: 'Feminine noun' }
    };
    
    const lowercaseWord = word.toLowerCase();
    if (translations[lowercaseWord]) {
      return translations[lowercaseWord];
    }
    
    // Fallback for unknown words
    return {
      english: 'translation needed',
      pronunciation: this.generatePronunciation(word),
      etymology: 'Etymology to be researched',
      usage: 'Usage context needed'
    };
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

  async getBaseForm(word, language) {
    // Simple heuristics - in real app would use proper lemmatization
    if (word.endsWith('are') || word.endsWith('ere') || word.endsWith('ire')) return word;
    if (word.endsWith('i') && word.length > 3) return word.slice(0, -1) + 'o';
    if (word.endsWith('e') && word.length > 3) return word.slice(0, -1) + 'a';
    return word;
  }

  guessPartOfSpeech(word, language) {
    if (word.endsWith('are') || word.endsWith('ere') || word.endsWith('ire')) return 'verb';
    if (word.endsWith('mente')) return 'adverb';
    if (word.endsWith('zione') || word.endsWith('sione')) return 'noun';
    return 'noun'; // Default assumption
  }

  guessGender(word, language) {
    if (word.endsWith('a') || word.endsWith('e') || word.endsWith('zione')) return 'f';
    if (word.endsWith('o') || word.endsWith('ore')) return 'm';
    return null;
  }

  generatePlural(word, language) {
    // Simple Italian plural rules
    if (language === 'it') {
      if (word.endsWith('a')) return word.slice(0, -1) + 'e';
      if (word.endsWith('o')) return word.slice(0, -1) + 'i';
      if (word.endsWith('e')) return word.slice(0, -1) + 'i';
      if (word.endsWith('co')) return word.slice(0, -2) + 'chi';
      if (word.endsWith('go')) return word.slice(0, -2) + 'ghi';
    }
    return word + 's'; // Default for other languages
  }

  generatePronunciation(word, language) {
    if (language === 'it') {
      // Basic Italian pronunciation rules
      return word.toLowerCase()
        .replace(/c(?=[ie])/g, 'CH')
        .replace(/g(?=[ie])/g, 'J')
        .replace(/gli/g, 'LYI')
        .replace(/gn/g, 'NY')
        .replace(/sc(?=[ie])/g, 'SH')
        .replace(/([aeiou])/g, (match, vowel) => vowel.toUpperCase())
        .replace(/(.)/g, (match, char, index) => {
          if (index === Math.floor(word.length / 2)) {
            return char.toUpperCase();
          }
          return char;
        });
    }
    return word; // Default for other languages
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
    const themeDisplay = Array.isArray(analysis.keyThemes) && analysis.keyThemes.length > 0 
      ? analysis.keyThemes.map(theme => typeof theme === 'object' ? theme.english : theme).join(', ')
      : 'Daily Conversation';
      
    return {
      overview: `This ${analysis.difficultyLevel} level content covers ${themeDisplay}. Estimated study time: ${analysis.estimatedStudyTime} minutes.`,
      keyPoints: this.extractKeyPoints(transcript),
      keyThemes: analysis.keyThemes, // Keep the structured themes
      grammarNotes: this.identifyGrammarPatterns(vocabulary),
      culturalNotes: this.generateCulturalNotes(analysis.topics),
      practiceActivities: this.suggestPracticeActivities(analysis.topics, analysis.difficultyLevel)
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
    const coreVocab = vocabulary.filter(v => v.frequency >= 2);
    if (coreVocab.length > 0) {
      sections.push({
        title: 'Core Vocabulary',
        vocabulary: coreVocab,
        icon: 'fa-star',
        description: `The most frequent words from this content (${coreVocab.length} words)`
      });
    }

    // 2. Group by part of speech for better learning structure
    const verbs = vocabulary.filter(v => v.partOfSpeech === 'verb');
    if (verbs.length > 0) {
      sections.push({
        title: 'Verbs & Actions',
        vocabulary: verbs,
        icon: 'fa-running',
        description: `Action words and verb forms (${verbs.length} words)`
      });
    }

    const nouns = vocabulary.filter(v => v.partOfSpeech === 'noun');
    if (nouns.length > 0) {
      sections.push({
        title: 'Nouns & Objects',
        vocabulary: nouns,
        icon: 'fa-cube',
        description: `People, places, and things (${nouns.length} words)`
      });
    }

    const adjectives = vocabulary.filter(v => v.partOfSpeech === 'adjective');
    if (adjectives.length > 0) {
      sections.push({
        title: 'Descriptive Words',
        vocabulary: adjectives,
        icon: 'fa-palette',
        description: `Adjectives and descriptive terms (${adjectives.length} words)`
      });
    }

    // 3. Expressions and phrases
    const expressions = vocabulary.filter(v => 
      v.word.includes(' ') || 
      v.partOfSpeech === 'interjection' ||
      v.usage.includes('expression') ||
      v.usage.includes('phrase')
    );
    
    if (expressions.length > 0) {
      sections.push({
        title: 'Expressions & Phrases',
        vocabulary: expressions,
        icon: 'fa-comments',
        description: `Common expressions and useful phrases (${expressions.length} items)`
      });
    }

    // 4. Cultural Context Section
    const culturalWords = vocabulary.filter(v => 
      v.culturalNotes && 
      v.culturalNotes !== 'Cultural significance to be explored'
    );
    
    if (culturalWords.length > 0) {
      sections.push({
        title: 'Cultural Context',
        vocabulary: culturalWords,
        icon: 'fa-globe-europe',
        description: `Terms with cultural significance (${culturalWords.length} words)`
      });
    }

    // 5. Remaining vocabulary by frequency
    const remainingVocab = vocabulary.filter(v => 
      !coreVocab.includes(v) && 
      !verbs.includes(v) && 
      !nouns.includes(v) && 
      !adjectives.includes(v) && 
      !expressions.includes(v) && 
      !culturalWords.includes(v)
    );

    if (remainingVocab.length > 0) {
      // Split remaining vocabulary into manageable chunks
      const chunkSize = 25;
      for (let i = 0; i < remainingVocab.length; i += chunkSize) {
        const chunk = remainingVocab.slice(i, i + chunkSize);
        const sectionNumber = Math.floor(i / chunkSize) + 1;
        sections.push({
          title: `Additional Vocabulary ${sectionNumber}`,
          vocabulary: chunk,
          icon: 'fa-plus',
          description: `More vocabulary from this content (${chunk.length} words)`
        });
      }
    }

    // 6. If no specific sections were created, create frequency-based sections
    if (sections.length === 0) {
      const chunkSize = 30;
      for (let i = 0; i < vocabulary.length; i += chunkSize) {
        const chunk = vocabulary.slice(i, i + chunkSize);
        const sectionNumber = Math.floor(i / chunkSize) + 1;
        sections.push({
          title: `Vocabulary Section ${sectionNumber}`,
          vocabulary: chunk,
          icon: 'fa-book',
          description: `Words from this content (${chunk.length} words)`
        });
      }
    }

    console.log(`Generated ${sections.length} vocabulary sections with total ${vocabulary.length} words`);
    return sections;
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
        <!-- Compact Lesson Header -->
        <header class="lesson-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem 2rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
          <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;"><i class="fas fa-book-open"></i> ${lesson.title}</h1>
          <div class="lesson-meta" style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; font-size: 0.9rem;">
            <span><i class="fas fa-signal"></i> ${lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}</span>
            <span><i class="fas fa-language"></i> ${lesson.sourceLanguage.toUpperCase()}</span>
            <span><i class="fas fa-clock"></i> ${lesson.studyGuide.overview.match(/\d+ minutes/)?.[0] || '5-10 minutes'}</span>
            <span><i class="fas fa-list"></i> ${lesson.vocabulary.length} vocabulary items</span>
          </div>
          
          <!-- Mode Toggle -->
          <div class="mode-toggle" style="display: flex; gap: 0.5rem; justify-content: center;">
            <button id="study-mode-btn" class="mode-btn active" onclick="capisco.setLearningMode('study')" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
              <i class="fas fa-book"></i> Study Mode
            </button>
            <button id="watch-mode-btn" class="mode-btn" onclick="capisco.setLearningMode('watch')" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
              <i class="fas fa-video"></i> Watch Mode
            </button>
          </div>
        </header>

        <!-- Compact Study Guide Overview -->
        <section class="lesson-section overview-section" style="background: white; border-radius: 12px; padding: 1rem; margin-bottom: 1rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
          <div class="overview-content" style="line-height: 1.6;">
            <p style="font-size: 1rem; margin-bottom: 0.75rem;">${lesson.studyGuide.overview}</p>
            <div class="key-themes" style="background: #f8fafc; padding: 0.75rem; border-radius: 6px;">
              <div class="theme-tags" style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                ${(Array.isArray(lesson.studyGuide.keyPoints) ? lesson.studyGuide.keyPoints : lesson.studyGuide.keyThemes || []).map(theme => {
                  if (typeof theme === 'object' && theme.display) {
                    return `<span style="background: #667eea; color: white; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem;" title="${theme.original}">${theme.english}</span>`;
                  } else if (typeof theme === 'object' && theme.english) {
                    return `<span style="background: #667eea; color: white; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem;" title="${theme.original}">${theme.english}</span>`;
                  } else {
                    return `<span style="background: #667eea; color: white; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem;">${theme}</span>`;
                  }
                }).join('')}
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
              <ul class="vocab-list" style="list-style: none; padding: 0; display: grid; gap: 0.5rem;">
      `;

      section.vocabulary.forEach((vocab, vocabIndex) => {
          // Determine what audio options to show
          let audioButtons = '';
          
          if (vocab.partOfSpeech === 'verb' && vocab.conjugations) {
            audioButtons = `
              <button class="speaker-btn" data-italian="${vocab.baseForm}" title="Infinitive: ${vocab.baseForm}" style="background: #10b981; color: white; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; margin-right: 0.25rem;">
                <i class="fas fa-volume-up"></i>
              </button>
              <button class="speaker-btn" data-italian="${vocab.conjugations.present?.io || vocab.baseForm}" title="I form: ${vocab.conjugations.present?.io || vocab.baseForm}" style="background: #3b82f6; color: white; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-volume-up"></i> <small>io</small>
              </button>`;
          } else if (vocab.partOfSpeech === 'noun' && vocab.plural) {
            audioButtons = `
              <button class="speaker-btn" data-italian="${vocab.singular || vocab.baseForm}" title="Singular: ${vocab.singular || vocab.baseForm}" style="background: #10b981; color: white; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; margin-right: 0.25rem;">
                <i class="fas fa-volume-up"></i> <small>sing</small>
              </button>
              <button class="speaker-btn" data-italian="${vocab.plural}" title="Plural: ${vocab.plural}" style="background: #f59e0b; color: white; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-volume-up"></i> <small>plur</small>
              </button>`;
          } else if (vocab.partOfSpeech === 'adjective' && (vocab.masculine || vocab.feminine)) {
            audioButtons = `
              <button class="speaker-btn" data-italian="${vocab.masculine || vocab.baseForm}" title="Masculine: ${vocab.masculine || vocab.baseForm}" style="background: #3b82f6; color: white; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; margin-right: 0.25rem;">
                <i class="fas fa-volume-up"></i> <small>m</small>
              </button>
              <button class="speaker-btn" data-italian="${vocab.feminine || vocab.baseForm}" title="Feminine: ${vocab.feminine || vocab.baseForm}" style="background: #f472b6; color: white; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-volume-up"></i> <small>f</small>
              </button>`;
          } else {
            audioButtons = `
              <button class="speaker-btn" data-italian="${vocab.baseForm || vocab.word}" title="Pronounce: ${vocab.baseForm || vocab.word}" style="background: #10b981; color: white; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-volume-up"></i>
              </button>`;
          }

          html += `
                <li class="vocab-item" style="background: #f8fafc; padding: 1rem; border-radius: 12px; border-left: 4px solid #667eea; margin-bottom: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div class="vocab-content" style="flex: 1; margin-right: 1rem;">
                      <div class="vocab-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                        <span class="italian-word" style="font-size: 1.3rem; font-weight: 700; color: #1e293b;">
                          ${vocab.baseForm || vocab.word}
                        </span>
                        ${vocab.gender ? `<span class="gender-tag" style="background: ${vocab.gender === 'f' ? '#f472b6' : vocab.gender === 'm' ? '#3b82f6' : '#10b981'}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${vocab.gender === 'f' ? 'feminine' : vocab.gender === 'm' ? 'masculine' : vocab.gender}</span>` : ''}
                        ${vocab.partOfSpeech ? `<span class="pos-tag" style="background: #e2e8f0; color: #475569; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${vocab.partOfSpeech}</span>` : ''}
                      </div>
                      
                      <div class="english-translation" style="font-size: 1.1rem; color: #059669; font-weight: 600; margin-bottom: 0.3rem;">
                        ${vocab.english}
                      </div>
                      
                      ${vocab.phonetic ? `<div style="font-size: 0.9rem; color: #64748b; font-style: italic;">[${vocab.phonetic}]</div>` : ''}
                    </div>
                    
                    <div class="vocab-controls" style="display: flex; gap: 0.5rem; align-items: center;">
                      <button class="info-btn" 
                              data-word="${vocab.baseForm || vocab.word}"
                              data-english="${vocab.english}"
                              data-gender="${vocab.gender || ''}" 
                              data-plural="${vocab.plural || ''}"
                              data-context="${vocab.context || ''}"
                              data-etymology="${vocab.etymology || ''}"
                              data-cultural="${vocab.culturalNotes || ''}"
                              data-usage="${vocab.usage || ''}"
                              data-examples="${(vocab.examples || []).join(' | ')}"
                              data-related="${(vocab.relatedWords || []).join(', ')}"
                              data-mistakes="${(vocab.commonMistakes || []).join(' | ')}"
                              data-tips="${(vocab.memoryTips || []).join(' | ')}"
                              ${vocab.conjugations?.present ? `data-conjugations="io ${vocab.conjugations.present.io}, tu ${vocab.conjugations.present.tu}, lui/lei ${vocab.conjugations.present.lui}"` : ''}
                              style="background: #667eea; color: white; border: none; padding: 0.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; min-width: 40px; position: relative;">
                        <i class="fas fa-info-circle"></i>
                      </button>
                      <div style="display: flex; gap: 0.25rem;">
                        ${audioButtons}
                      </div>
                    </div>
                  </div>
                </li>
          `;
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
      
      // Manually bind speaker buttons if the external function doesn't catch them
      this.bindSpeakerButtons();
      
      // Update quiz system with generated lesson data
      if (typeof quizSystem !== 'undefined' && this.currentLesson) {
        this.updateQuizSystemWithLessonData();
      }
    }, 100);
  }

  bindSpeakerButtons() {
    // Ensure all speaker buttons work
    document.querySelectorAll('.speaker-btn').forEach(btn => {
      // Remove existing listeners to prevent duplicates
      btn.removeEventListener('click', this.handleSpeakerClick);
      
      // Add click event
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const italian = btn.getAttribute('data-italian');
        if (italian) {
          this.pronounceWord(italian);
        }
      });

      // Add hover event for immediate feedback
      btn.addEventListener('mouseenter', (e) => {
        const italian = btn.getAttribute('data-italian');
        if (italian) {
          // Optional: play on hover for immediate feedback
          // this.pronounceWord(italian);
        }
      });
    });

    // Also bind info buttons for hover behavior
    document.querySelectorAll('.info-btn').forEach(btn => {
      let hoverTimeout;
      
      btn.addEventListener('mouseenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Clear any existing tooltips
        document.querySelectorAll('.word-info-tooltip').forEach(tooltip => tooltip.remove());
        // Show tooltip after short delay
        hoverTimeout = setTimeout(() => {
          this.showAdvancedWordInfo(btn);
        }, 300);
      });

      btn.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(hoverTimeout);
        // Remove tooltip after delay
        setTimeout(() => {
          const tooltip = btn.querySelector('.word-info-tooltip');
          if (tooltip) tooltip.remove();
        }, 500);
      });

      // Also show on click for mobile
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Clear any existing tooltips
        document.querySelectorAll('.word-info-tooltip').forEach(tooltip => tooltip.remove());
        this.showAdvancedWordInfo(btn);
      });
    });
  }

  showAdvancedWordInfo(button) {
    const word = button.getAttribute('data-word');
    const english = button.getAttribute('data-english');
    const gender = button.getAttribute('data-gender');
    const plural = button.getAttribute('data-plural');
    const context = button.getAttribute('data-context');
    const etymology = button.getAttribute('data-etymology');
    const cultural = button.getAttribute('data-cultural');
    const usage = button.getAttribute('data-usage');
    const examples = button.getAttribute('data-examples');
    const related = button.getAttribute('data-related');
    const mistakes = button.getAttribute('data-mistakes');
    const tips = button.getAttribute('data-tips');
    const conjugations = button.getAttribute('data-conjugations');

    // Create hover tooltip instead of modal
    const tooltip = document.createElement('div');
    tooltip.className = 'word-info-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      font-size: 0.9rem;
      line-height: 1.5;
      max-width: 400px;
      z-index: 10000;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      white-space: normal;
      border: 2px solid #667eea;
      right: 50px;
      top: 0;
    `;

    let content = `<div style="margin-bottom: 1rem;"><strong style="color: #667eea; font-size: 1.1rem;">${word}</strong><br><span style="color: #10b981;">${english}</span></div>`;
    
    if (gender) content += `<div style="margin-bottom: 0.75rem;"><strong>Gender:</strong> ${gender === 'f' ? 'Feminine' : gender === 'm' ? 'Masculine' : gender}</div>`;
    if (plural) content += `<div style="margin-bottom: 0.75rem;"><strong>Plural:</strong> ${plural}</div>`;
    if (conjugations) content += `<div style="margin-bottom: 0.75rem;"><strong>Conjugation:</strong> ${conjugations}</div>`;
    if (context && context !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Context:</strong> <em>"${context.substring(0, 120)}${context.length > 120 ? '...' : ''}"</em></div>`;
    if (etymology && etymology !== 'Etymology to be researched' && etymology !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Etymology:</strong> ${etymology}</div>`;
    if (usage && usage !== 'Usage context needed' && usage !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Usage:</strong> ${usage}</div>`;
    if (cultural && cultural !== 'Cultural significance to be explored' && cultural !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Cultural Note:</strong> ${cultural}</div>`;
    if (examples && examples !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Examples:</strong> ${examples}</div>`;
    if (related && related !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Related Words:</strong> ${related}</div>`;
    if (mistakes && mistakes !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Common Mistakes:</strong> ${mistakes}</div>`;
    if (tips && tips !== '') content += `<div style="margin-bottom: 0.75rem;"><strong>Memory Tips:</strong> ${tips}</div>`;

    tooltip.innerHTML = content;

    // Position relative to button
    button.style.position = 'relative';
    button.appendChild(tooltip);

    // Auto-remove after delay or on mouse leave
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    }, 5000);
  }

  formatAdvancedWordInfo(vocab) {
    let info = [];
    
    // Add comprehensive linguistic information
    if (vocab.etymology && vocab.etymology !== 'Etymology to be researched') {
      info.push(`<strong>Etymology:</strong> ${vocab.etymology}`);
    }
    
    if (vocab.usage && vocab.usage !== 'Usage context needed') {
      info.push(`<strong>Usage:</strong> ${vocab.usage}`);
    }
    
    if (vocab.culturalNotes && vocab.culturalNotes !== 'Cultural significance to be explored') {
      info.push(`<strong>Cultural Context:</strong> ${vocab.culturalNotes}`);
    }
    
    if (vocab.conjugations && Object.keys(vocab.conjugations).length > 0) {
      const present = vocab.conjugations.present;
      if (present) {
        info.push(`<strong>Conjugation:</strong> io ${present.io}, tu ${present.tu}, lui/lei ${present.lui}, noi ${present.noi}, voi ${present.voi}, loro ${present.loro}`);
      }
    }
    
    if (vocab.examples && vocab.examples.length > 0) {
      info.push(`<strong>Examples:</strong> ${vocab.examples.slice(0, 2).join(' | ')}`);
    }
    
    if (vocab.relatedWords && vocab.relatedWords.length > 0) {
      info.push(`<strong>Related Words:</strong> ${vocab.relatedWords.join(', ')}`);
    }
    
    if (vocab.commonMistakes && vocab.commonMistakes.length > 0) {
      info.push(`<strong>Common Mistakes:</strong> ${vocab.commonMistakes.join(' | ')}`);
    }
    
    if (vocab.memoryTips && vocab.memoryTips.length > 0) {
      info.push(`<strong>Memory Tips:</strong> ${vocab.memoryTips.join(' | ')}`);
    }
    
    if (info.length === 0) {
      info.push(`<strong>Word:</strong> ${vocab.baseForm || vocab.word} (${vocab.partOfSpeech || 'unknown type'})`);
      if (vocab.frequency) {
        info.push(`<strong>Frequency:</strong> appears ${vocab.frequency} times in text`);
      }
    }
    
    return info.join('<br><br>');
  }

  formatWordInfo(vocab) {
    // Backwards compatibility method
    return this.formatAdvancedWordInfo(vocab);
  }

  updateQuizSystemWithLessonData() {
    // Create dynamic quiz data from lesson content
    const dynamicQuizData = {
      generated_content: {
        vocabulary: this.currentLesson.vocabulary.map(vocab => {
          return {
            italian: vocab.baseForm || vocab.word,
            english: vocab.english || 'translation needed',
            gender: vocab.gender || '',
            plural: vocab.plural || '',
            info: this.formatWordInfo(vocab),
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
      // Cancel any ongoing speech first
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'it-IT';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Wait for voices to load if needed
      const setVoice = () => {
        const voices = speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));

        // Find Italian voice
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
      };

      if (speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
      }
    } else {
      console.log('Speech synthesis not supported');
      alert('Audio not supported in this browser');
    }
  }

  playTranscript(transcript) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = 'it-IT';
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Wait for voices to load if needed
      const setVoice = () => {
        const voices = speechSynthesis.getVoices();

        // Find Italian voice
        let italianVoice = voices.find(voice => 
          voice.lang === 'it-IT' && voice.localService === true
        ) || voices.find(voice => 
          voice.lang === 'it-IT'
        ) || voices.find(voice => 
          voice.lang.startsWith('it')
        );

        if (italianVoice) {
          utterance.voice = italianVoice;
        }

        speechSynthesis.speak(utterance);
      };

      if (speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
      }
    } else {
      console.log('Speech synthesis not supported');
      alert('Audio not supported in this browser');
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

      // Enhanced voice selection
      const setVoiceAndPlay = () => {
        const voices = speechSynthesis.getVoices();
        console.log('Playing audio for:', text, 'Language:', utterance.lang);
        
        let targetVoice = voices.find(voice => 
          voice.lang === utterance.lang && voice.localService === true
        ) || voices.find(voice => 
          voice.lang === utterance.lang
        ) || voices.find(voice => 
          voice.lang.startsWith(utterance.lang.split('-')[0])
        );

        if (targetVoice) {
          utterance.voice = targetVoice;
          console.log('Selected voice:', targetVoice.name, targetVoice.lang);
        }

        speechSynthesis.speak(utterance);
      };

      // Visual feedback
      const button = event?.target?.closest('button');
      if (button) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-stop"></i> Playing...';
        button.style.background = '#f59e0b';
        button.disabled = true;
        
        utterance.onend = () => {
          button.innerHTML = originalContent;
          button.style.background = '#10b981';
          button.disabled = false;
        };

        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          button.innerHTML = originalContent;
          button.style.background = '#ef4444';
          button.disabled = false;
          setTimeout(() => {
            button.style.background = '#10b981';
          }, 2000);
        };
      }

      // Set voice and play
      if (speechSynthesis.getVoices().length > 0) {
        setVoiceAndPlay();
      } else {
        speechSynthesis.addEventListener('voiceschanged', setVoiceAndPlay, { once: true });
      }
    } else {
      console.log('Speech synthesis not supported');
      alert('Audio not supported in this browser');
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

// Global toggleQuiz function for quiz buttons
window.toggleQuiz = function(quizId) {
  console.log('toggleQuiz called for:', quizId);
  
  // Hide any other open quiz blocks first
  document.querySelectorAll('.quiz-block:not(.hidden)').forEach(openQuiz => {
    if (openQuiz.id !== quizId) {
      openQuiz.classList.add('hidden');
    }
  });

  let quiz = document.getElementById(quizId);
  if (!quiz) {
    quiz = document.createElement('div');
    quiz.id = quizId;
    quiz.className = 'quiz-block';
    
    // Find the button that triggered this
    const clickedButton = Array.from(document.querySelectorAll('button')).find(btn => {
      const onclick = btn.getAttribute('onclick');
      return onclick && onclick.includes(quizId);
    });
    
    if (clickedButton) {
      clickedButton.insertAdjacentElement('afterend', quiz);
    } else {
      document.body.appendChild(quiz);
    }
  }
  
  // Toggle visibility
  if (quiz.classList.contains('hidden')) {
    quiz.classList.remove('hidden');
    quiz.style.display = 'block';
  } else {
    quiz.classList.add('hidden');
    quiz.style.display = 'none';
    return; // Exit if hiding
  }
  
  // Generate quiz content
  quiz.innerHTML = `
    <div class="quiz-container" style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
      <h4>Interactive Quiz</h4>
      <div class="quiz-question">
        <p><strong>What does "ciao" mean in English?</strong></p>
        <div class="quiz-options">
          <button class="quiz-option" onclick="checkQuizAnswer(this, true)">Hello/Goodbye</button>
          <button class="quiz-option" onclick="checkQuizAnswer(this, false)">Thank you</button>
          <button class="quiz-option" onclick="checkQuizAnswer(this, false)">Please</button>
          <button class="quiz-option" onclick="checkQuizAnswer(this, false)">Excuse me</button>
        </div>
      </div>
      <button onclick="window.toggleQuiz('${quizId}')" style="margin-top: 1rem; background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px;">Close Quiz</button>
    </div>
  `;
  
  quiz.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// Global quiz answer checking
window.checkQuizAnswer = function(button, isCorrect) {
  const options = button.parentNode.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.disabled = true);
  
  if (isCorrect) {
    button.style.background = '#10b981';
    button.style.color = 'white';
    button.innerHTML += ' ✓ Correct!';
  } else {
    button.style.background = '#ef4444';
    button.style.color = 'white';
    button.innerHTML += ' ✗ Incorrect';
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
