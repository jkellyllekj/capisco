
# Quick Refresh Guide & Project Reference

When the Assistant gets sluggish or unresponsive, just copy and paste ONE of these lines into the chat:

## Level 1 (Try this first):
Run refresh.sh to clear temporary files and processes

## Level 2 (If Level 1 doesn't help):
Run nuclear-reset.sh to restart the VM

That's it! The Assistant will execute the commands for you automatically.

---

## Project Summary (Paste this after a refresh)

This is an Italian language learning website built from class transcripts. The main page (index.html) shows course chapters with "Al Mercato" (Chapter 1) currently available. The al-mercato.html lesson page includes comprehensive vocabulary sections with audio pronunciation, info tooltips, and interactive quizzes.

**Current Status:**
- Main page working correctly with chapter navigation
- Al Mercato lesson page has complete vocabulary sections with:
  - Seasons vocabulary with interactive elements
  - Food vocabulary (fruits, vegetables, etc.) with gender/plural info
  - Market expressions and dialogue vocabulary
  - Grammar examples with pronoun usage
  - Practice scenarios for real conversations

**Quiz System Status:**
- Enhanced quiz system with 5 question types (multiple choice, matching, listening, typing, drag-drop)
- Keyboard navigation support (numbers 1-4, letters A-D, arrow keys, Enter, Space)
- Smooth question transitions with visual feedback
- Score tracking and persistent feedback
- Audio pronunciation integration
- Question variety to avoid repetition

**Key Features Working:**
- Info buttons with detailed explanations and grammar info
- Audio pronunciation using Web Speech API (Italian voices)
- Interactive quiz system with multiple question types
- Responsive design with FontAwesome icons
- Keyboard accessibility throughout

**Technical Implementation:**
- Static HTML/CSS/JS website served via static-web-server
- QuizSystem class handles all quiz logic and rendering
- Vocabulary data organized by topic (seasons, vocabulary, expressions, dialogue, etc.)
- Event-driven architecture with proper cleanup and initialization

**Files:**
- index.html: Main course page with chapter overview
- lessons/al-mercato.html: Chapter 1 lesson with complete vocabulary
- script.js: All interactive functionality including quiz system
- style.css: Complete styling for all components
- Various shell scripts for system maintenance

**Next Steps:**
Continue enhancing the quiz system, add more lesson chapters, implement user progress tracking, and create template system for easy content addition.

---

## What these do:
- **refresh.sh**: Kills hanging processes, clears temp files, frees up memory
- **nuclear-reset.sh**: Complete VM restart (more aggressive, always works)

## Pro tip:
After running nuclear-reset.sh, start a new chat session for best results. Then paste the Project Summary above to help the Assistant quickly get up to speed.
