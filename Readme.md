# Manage

## Overview
Pocket Muse replaces your browser's new tab with a personalized AI-powered dashboard. It features a dynamic weather animation system, AI-curated feeds, a task management system, and a side panel summarizer/chat — all designed to boost productivity while respecting user privacy.

---

## Key Features Implemented

### 1. Weather Animation System
- Real-time sun/moon positioning using **suncalc.js**
- Dynamic sky gradients (dawn, day, dusk, night)
- Animated clouds with parallax effects
- Rain particle system for weather conditions
- Smooth transitions between time phases

### 2. AI-Powered Feed
- Curated article recommendations based on user interests
- **Chrome Built-in AI** integration for relevance scoring and summaries
- Fallback mock data system for demo purposes
- User rating system (thumbs up/down) for personalization
- Beautiful card-based layout with hover effects

### 3. Task Management
- Local task storage with Chrome storage API
- AI-powered task breakdown suggestions
- Priority levels and due dates
- Google Tasks sync capability (opt-in)
- Drag-and-drop friendly interface

### 4. Side Panel Summarizer & Chat
- Page content extraction and summarization
- AI chat interface using Chrome's Prompt API
- Non-blocking side panel implementation
- Context-aware conversations

### 5. Privacy-First Design
- All data stored locally by default
- Explicit opt-in for location and cloud sync
- No tracking or analytics
- Data export/import functionality
- Clear privacy controls

---

## 🛠 Technical Implementation

### Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Chrome APIs**: Manifest V3 + background service worker

### AI Integration
- Chrome Built-in AI (Gemini Nano) via Prompt API
- Summarizer API for content processing
- Fallback systems when AI isn't available
- Smart relevance scoring for feed items

### File Structure
