
# Capisco Project Updates & Development Log

## Project Overview
Capisco is a YouTube-to-language-lesson generator that transforms video transcripts into interactive learning experiences. Users can learn any language from any language with comprehensive vocabulary analysis, audio pronunciation, and interactive quizzes.

## Current System Architecture

### Core Files & Their Functions:
- **index.html**: Landing page with video URL input and language selection
- **capisco-engine.js**: Main processing engine that handles transcript extraction and lesson generation
- **capisco-app.html**: Alternative app interface
- **style.css**: Styling for all components
- **script.js**: Quiz system and interactive functionality

### How the System Works (Transcript → Lesson Generation):

#### Phase 1: Input Processing
1. User enters YouTube URL and selects source/target languages
2. System extracts video ID from URL
3. Attempts to fetch transcript using YouTube's API endpoints
4. Falls back to manual transcript upload if auto-extraction fails

#### Phase 2: Content Analysis
1. **Language Detection**: Analyzes transcript text to confirm/detect source language
2. **Vocabulary Extraction**: Identifies key vocabulary using frequency analysis and language patterns
3. **Topic Classification**: Categorizes content (food, travel, family, work, etc.) based on keyword detection
4. **Difficulty Assessment**: Estimates complexity based on vocabulary diversity and sentence structure

#### Phase 3: Lesson Generation
1. **Vocabulary Organization**: Groups words by:
   - Part of speech (nouns, verbs, adjectives, expressions)
   - Frequency and importance
   - Grammatical features (gender, plural forms)
2. **Translation Generation**: Creates translations to target language
3. **Cultural Context**: Adds cultural notes and usage examples
4. **Grammar Pattern Recognition**: Identifies key grammar structures for explanations

#### Phase 4: Interactive Elements Creation
1. **Audio Integration**: Uses Web Speech API for pronunciation
2. **Quiz Generation**: Creates 5 types of questions:
   - Multiple choice vocabulary
   - Listening comprehension
   - Translation exercises
   - Drag-and-drop matching
   - Fill-in-the-blank
3. **Video Simulation**: Creates interactive video player with synchronized subtitles
4. **Progress Tracking**: Implements user progress and vocabulary mastery tracking

## Current Status & Features

### ✅ Working Features:
- YouTube URL processing and video ID extraction
- Comprehensive vocabulary extraction and organization
- Multi-directional language support (any language → any language)
- Interactive quiz system with 5 question types
- Audio pronunciation using Web Speech API
- Responsive design with FontAwesome icons
- Keyboard navigation support
- Cultural context and grammar explanations

### ⚠️ Known Issues:
- Audio playback not functional in simulated video player
- Limited vocabulary extraction (currently ~50 words, should extract all available)
- Transcript extraction from YouTube needs API integration
- Video simulation is mockup-only, no real video integration
- Auto-language detection not fully implemented

### 🔄 Recent Updates:
- Enhanced quiz system with multiple question types
- Improved vocabulary organization by categories
- Added cultural context tooltips
- Implemented keyboard navigation
- Created comprehensive lesson structure templates

## Technical Implementation Details

### Vocabulary Data Structure:
```javascript
{
  italian: "parola",
  english: "word", 
  type: "noun|verb|adjective|expression",
  gender: "m|f|n",
  plural: "plural_form",
  pronunciation: "IPA_notation",
  cultural_context: "usage notes",
  examples: ["example sentences"]
}
```

### Quiz System:
- **QuizSystem class** handles all quiz logic
- Prevents question repetition with tracking system
- Supports keyboard navigation (1-4, A-D, arrows, Enter, Space)
- Visual feedback and score persistence
- Audio integration for listening exercises

### Lesson Structure:
1. **Video Section**: Simulated interactive video with controls
2. **Vocabulary Sections**: Organized by topic (seasons, food, expressions, etc.)
3. **Grammar Explanations**: Contextual grammar with examples
4. **Cultural Notes**: Background information and usage context
5. **Interactive Quizzes**: Multiple question types for reinforcement
6. **Progress Tracking**: User advancement through lesson content

## Next Development Priorities

### Immediate (High Priority):
1. Fix audio playback in video simulation
2. Implement full vocabulary extraction (all words from transcript)
3. Add real YouTube transcript API integration
4. Enhance auto-language detection
5. Create more comprehensive verb conjugation coverage

### Medium Priority:
1. Add user progress persistence
2. Implement spaced repetition algorithm
3. Create lesson template system for easy content addition
4. Add image/visual learning components
5. Enhance cultural context with more detailed explanations

### Long-term:
1. Real video integration (not just simulation)
2. Advanced NLP for better vocabulary categorization
3. Personalized learning paths based on user performance
4. Community features and lesson sharing
5. Mobile app development

## Technical Notes
- Built with vanilla HTML/CSS/JavaScript
- Uses Web Speech API for pronunciation
- FontAwesome for icons
- Responsive design principles
- Event-driven architecture
- Static file serving via static-web-server

---
*Last Updated: [Current Date]*
*Version: 1.0 - Beta Phase*
