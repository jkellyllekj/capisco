# Overview

Capisco is a YouTube-to-language-lesson generator that transforms video content into interactive language learning experiences. The application allows users to input YouTube URLs or upload transcripts, select source and target languages, and automatically generates comprehensive vocabulary lessons with interactive elements including quizzes, audio pronunciation, and detailed linguistic information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application follows a multi-page architecture with a static HTML/CSS/JavaScript foundation:

- **Landing Page (index.html)**: Hero section with YouTube URL input and language selection
- **Lesson Generator Engine (capisco-engine.js)**: 2000+ line JavaScript processor that handles video URL extraction, transcript processing, and lesson generation
- **Interactive Quiz System (script.js)**: 1500+ line system managing five quiz types (multiple choice, matching, listening, typing, drag-drop) with keyboard navigation and audio integration
- **Lesson Pages**: Pre-built lesson templates (al-mercato.html, presentazioni-personali.html) with structured vocabulary sections

The frontend uses a progressive enhancement approach with responsive design, FontAwesome icons, and Web Speech API for audio pronunciation across 100+ languages.

## Backend Architecture
**Python Static Server (server.py)**: Custom HTTP server extending SimpleHTTPRequestHandler with:
- CORS header management for cross-origin requests
- Proper MIME type handling for JavaScript/CSS assets
- Cache-busting headers for development
- Integration with lesson processor for dynamic content generation

**Lesson Processor (lesson_processor.py)**: Core Python engine using OpenAI GPT-4o-mini for:
- Multi-method transcript extraction (YouTube API, CORS proxies, file uploads)
- Universal language processing with smart detection for 15+ languages
- Vocabulary extraction using NLTK for frequency analysis and linguistic patterns
- Comprehensive linguistic analysis including pronunciation, etymology, and cultural context

## Data Processing Pipeline
The system implements a six-step processing workflow:
1. **Input Validation**: YouTube URL parsing with regex pattern matching
2. **Transcript Extraction**: Fallback system with multiple extraction methods
3. **Language Detection**: Pattern analysis for automatic source language identification
4. **Vocabulary Analysis**: Frequency-based extraction with grammatical categorization
5. **Translation & Enhancement**: Multi-language translation with linguistic metadata
6. **Lesson Generation**: Interactive HTML generation with embedded quiz systems

## Interactive Learning Components
**Quiz System Architecture**: Event-driven quiz engine supporting:
- Five question types with adaptive difficulty
- Keyboard accessibility (arrow keys, numbers, letters)
- Audio integration with Web Speech API
- Score tracking with persistent feedback
- Anti-repetition algorithms for question variety

**Vocabulary Display System**: Structured presentation with:
- Interactive info buttons revealing grammatical details
- Audio pronunciation triggers on hover/click
- Gender and plural form indicators
- Cultural context tooltips
- Visual categorization with FontAwesome icons

## Progressive Web App Features
The application includes PWA capabilities through:
- Web App Manifest (manifest.json) with offline support indicators
- Service worker architecture for caching strategies
- Responsive design with mobile-first approach
- Apple Touch Icon and favicon support for cross-platform compatibility

# External Dependencies

## APIs and Services
- **OpenAI GPT-4o-mini**: Primary language processing engine for transcript analysis, translation, and lesson generation
- **YouTube Data API**: Primary transcript extraction method with video metadata retrieval
- **Web Speech API**: Browser-native text-to-speech for pronunciation features across 100+ languages
- **CORS Proxy Services**: Fallback transcript extraction when direct API access fails

## JavaScript Libraries
- **NLTK (via Python)**: Natural Language Toolkit for tokenization, stopword filtering, and linguistic analysis
- **FontAwesome 6.0.0**: Icon library for UI elements and vocabulary categorization
- **Concurrent.futures (Python)**: Threading support for timeout management and parallel processing

## Development Dependencies
- **Python http.server**: Static file serving with custom MIME type handling
- **Requests library**: HTTP client for external API communications
- **JSON handling**: Configuration and data exchange format for lesson content
- **Regular Expressions**: URL parsing and text processing for multi-language support

## File Format Support
- **Transcript Uploads**: .txt, .srt, .vtt file format support for manual transcript input
- **Audio Formats**: Browser-native audio synthesis without external audio file dependencies
- **Image Assets**: SVG and PNG support for progressive web app icons and visual elements