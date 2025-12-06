# CAPISCO PROJECT - COMPLETE SUMMARY & CHATGPT INSTRUCTIONS

---

## INSTRUCTIONS FOR CHATGPT

**Context**: This is a language learning app called "Capisco" that generates interactive lessons from YouTube video transcripts. The user has been developing this with Replit Agent and needs your help to continue development or troubleshoot issues.

**What to do with these files**:
1. The main frontend is `capisco-app.html` - this is the user interface
2. The core logic is in `capisco-engine.js` - this handles lesson generation and interactivity
3. The backend is `server.py` and `lesson_processor.py` - Python server using OpenAI API
4. Styling is in `style.css` and interactive features in `script.js`

**User's Goal**: Create a YouTube-to-language-lesson generator that replaces the manual Language Reactor + Anki workflow. Lessons should follow the "Al Mercato" format with thematic vocabulary sections, audio pronunciation, cultural context, etymology, and interactive quizzes.

**Current State**: The system is functional but has YouTube API rate limiting issues. Users can paste transcripts manually. Core interactive features (audio, translations, info buttons) are working.

**What Still Needs Work** (Roadmap):
- Video playback integration with YouTube embed
- Expression replay buttons ("watch this idiom again")
- Interactive subtitles synced with video
- Advanced quiz types
- Speed controls for audio
- Loop sections for difficult expressions

---

## 1. PROJECT OVERVIEW

**Capisco** is a YouTube-to-language-lesson generator that transforms video content into interactive Al Mercato-style learning experiences. It extracts vocabulary from video transcripts and creates comprehensive lessons with:
- Pronunciations & audio playback
- Etymology & cultural context  
- Gender indicators
- Interactive quizzes
- Thematic organization

**Goal**: Replace the manual Language Reactor + Anki workflow with a single, streamlined tool.

---

## 2. CURRENT STATUS

| Feature | Status |
|---------|--------|
| Lesson Generator UI | Working |
| Transcript text box (paste directly) | Working |
| Vocabulary extraction | Working |
| English translations | Fixed |
| Audio pronunciation | Fixed |
| Gender indicators (male/female/neuter) | Fixed |
| Compact card layout | Fixed |
| Info buttons (etymology, context) | Fixed |
| YouTube auto-extraction | Rate-limited (use text box instead) |
| Advanced quizzes | Basic structure exists |

---

## 3. ACCOMPLISHMENTS (Recent Fixes)

1. **Removed fake demo content** - System no longer lies with gelato vocabulary when extraction fails
2. **Fixed JavaScript function mismatch** - Info buttons now work
3. **Fixed layout issues** - Vocabulary cards in compact grid, not full-page width
4. **Added readable gender symbols** - Male/Female/Neuter symbols instead of unreadable highlighting
5. **Fixed English translations** - Now visible under each Italian word
6. **Fixed audio pronunciation** - Speaker buttons work with fallbacks
7. **Added transcript text box** - Paste transcripts directly without file upload
8. **Updated limitation notices** - Honest messaging about YouTube API issues
9. **Improved interactive features** - Hover effects, animations, info modals

---

## 4. PROJECT FILES

| File | Purpose |
|------|---------|
| `capisco-app.html` | Main frontend interface |
| `capisco-engine.js` | Core JavaScript engine (lesson generation, interactivity) |
| `script.js` | Additional interactive features |
| `style.css` | Styling for the app |
| `server.py` | Python backend server |
| `lesson_processor.py` | AI-powered lesson processing |
| `replit.md` | Project documentation |
| `manifest.json` | PWA configuration |
| `lessons/` | Pre-built lesson examples (Al Mercato, etc.) |
| `images/` | Image assets |

---

## 5. KNOWN LIMITATIONS

- **YouTube API Rate Limiting**: Automatic transcript extraction currently fails due to YouTube restrictions. Use the text box to paste transcripts manually.
- **Browser Extensions Work Differently**: Plugins like Language Reactor have elevated browser permissions this web app doesn't have.
- **Requires OpenAI API**: Needs OPENAI_API_KEY environment variable for lesson processing.

---

## 6. ROADMAP (Discussed but Not Yet Built)

- **Video Playback Integration**: Embed YouTube videos, sync with transcript timestamps
- **Expression Replays**: "Watch this idiom again" buttons
- **Interactive Subtitles**: Click words in video for definitions
- **Advanced Quiz Types**: More quiz formats beyond current system
- **Speed Controls**: Slow down audio for pronunciation practice
- **Loop Sections**: Auto-repeat difficult expressions

---

## 7. HOW TO USE CAPISCO

1. **Go to the app** (runs on port 5000)
2. **Get a transcript** from YouTube (CC button, then three dots, then "Show transcript")
3. **Paste the transcript** into the text box
4. **Select languages** (source = video language, target = your language)
5. **Click Generate** 
6. **Explore your lesson** - click speaker icons for audio, info button for details

---

## TECHNICAL NOTES FOR CHATGPT

**Frontend Stack**: HTML, CSS, JavaScript (vanilla, no frameworks)
**Backend Stack**: Python with http.server, OpenAI GPT-4o-mini
**Key Dependencies**: 
- Python: openai, requests, youtube-transcript-api, nltk
- No npm/node dependencies for frontend

**Data Flow**:
1. User pastes transcript or provides YouTube URL
2. Frontend sends to backend `/generate-lesson` endpoint
3. Backend extracts vocabulary, calls OpenAI for translations/context
4. Returns structured JSON lesson data
5. Frontend renders interactive lesson HTML

**Main Issues to Watch**:
- YouTube transcript APIs are unreliable due to rate limiting
- Browser CORS restrictions prevent direct YouTube API calls from frontend
- Audio uses Web Speech API (browser-native TTS)

---

## USER'S VISION

The user wants lessons that look like the example "Al Mercato" template - thematic sections, cultural context throughout, multiple quiz types interspersed, audio for every word, and eventually video integration where you can click on expressions to replay that moment in the video.

The goal is to make language learning from authentic content (YouTube videos) as seamless as possible, with all the vocabulary extraction, translation, and spaced repetition built into one beautiful interface.
