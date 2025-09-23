# Manage

## 🎯 Overview
A Chrome extension that enhances browsing experience with AI-powered features using Gemini API, weather animations, and productivity tools. Built with React, TypeScript, and Chrome's Manifest V3.

## 🌟 Features
- AI-powered chat and content analysis using Gemini API
- Real-time weather animations
- Task management and productivity tools
- Personalized dashboard
- Side panel for quick access

## 🏗 Architecture

### Core Components
1. **Frontend Layer**
   - React 18 for UI components
   - TypeScript for type safety
   - Vite for build optimization
   - Tailwind CSS for styling
   - Framer Motion for animations

2. **State Management**
   - Zustand for global state
   - Chrome Storage API for persistence
   - Real-time state sync across components

3. **AI Integration**
   - Google's Gemini API integration
   - Real-time content analysis
   - Smart task suggestions
   - Content summarization
   - Secure API key management

4. **Browser Integration**
   - Chrome Manifest V3 compliance
   - Service Workers for background tasks
   - Content script for page analysis
   - Side panel for quick access

## 🚀 Getting Started

### Prerequisites
1. Node.js 16+ and npm
2. Chrome browser
3. Gemini API key

### Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_API_KEY=your_gemini_api_key
   VITE_API_URL=https://generativelanguage.googleapis.com/v1beta
   VITE_MODEL_NAME=gemini-pro
   ```

### Development
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Build the extension:
   ```bash
   npm run build:extension
   ```
   - Download the Gemini Nano model files
   - Place them in `public/models/` directory

2. Start the development server:
   ```bash
   npm run dev
   ```

## 🤖 AI Features

### On-Device AI Processing
The extension uses Gemini Nano for local AI processing without needing a backend server or API keys:

1. **Content Summarization**
   - Automatically extracts main content from web pages
   - Generates concise summaries using on-device AI
   - No data sent to external servers

2. **Chat Interface**
   - Real-time AI responses powered by Gemini Nano
   - Context-aware conversations using page content
   - Completely private - all processing happens locally

3. **Technical Implementation**
   - Uses TensorFlow.js for model execution
   - MediaPipe Tasks for efficient text processing
   - Optimized for browser performance

### Performance Benefits
- No network latency for AI features
- Works offline after initial setup
- Enhanced privacy with local processing
- Reduced resource usage

## 🔒 Privacy & Security
- All AI processing happens on your device
- No data sent to external servers
- No API keys or authentication required
- Complete privacy for your browsing data

2. Start the extension development server:
   ```bash
   npm run dev
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## 🧠 AI Features

### Local AI Processing
The extension uses local AI models for efficient content processing:

1. **Content Summarization**
   - Automatically extracts main content from web pages
   - Generates concise, bullet-point summaries
   - No external API calls needed

2. **Task Suggestions**
   - AI-powered task breakdown
   - Resource suggestions
   - Time estimates
   - All computed locally

3. **Chat Interface**
   - Context-aware responses
   - Local model inference
   - Privacy-preserving design
   - Available in the extension's sidepanel

2. **How It Works**
   - Content script extracts page content
   - Backend processes content through Gemini API
   - Results displayed in React sidepanel UI
   - State managed via Zustand store

3. **Configuration**
   The summarization feature can be configured in `src/store/sidePanelStore.ts`:
   - Customize prompt templates
   - Adjust content length limits
   - Modify summarization style

### Security Notes
- API keys must be stored securely in backend `.env`
- Never expose API keys in frontend code
- Use appropriate CORS and request validation

## 🔒 Permissions
The extension requires these permissions:
- `sidePanel`: For AI summary display
- `scripting`: For content extraction
- `activeTab`: For current page access
- Network access to backend API

3. **Extension Components**
   - Background Service Worker
   - Content Scripts
   - Popup Interface
   - Side Panel Integration

4. **AI Integration Layer**
   - Chrome Built-in AI (Gemini Nano)
   - Custom AI Processing Pipeline
   - Fallback Systems

## ⭐ Features

### 1. Weather Animation System
- **Core Technology**: suncalc.js
- **Features**:
  - Real-time sun/moon positioning
  - Dynamic sky gradients (dawn, day, dusk, night)
  - Parallax cloud animations
  - Weather condition particles
  - Smooth state transitions
### 2. AI-Powered Feed
- **Core Technology**: Chrome Built-in AI
- **Features**:
  - Interest-based article curation
  - AI-powered content summarization
  - User feedback system
  - Personalization algorithm
  - Responsive card layout

### 3. Task Management
- **Storage**: Chrome Storage API
- **Features**:
  - AI task breakdown
  - Priority management
  - Due date tracking
  - Google Tasks integration
  - Drag-and-drop interface

### 4. Side Panel Tools
- **Core Technology**: Chrome Side Panel API
- **Features**:
  - Page content extraction
  - AI-powered summarization
  - Context-aware chat
  - Non-blocking UI

### 5. Privacy Features
- Local-first data storage
- Opt-in cloud sync
- Zero tracking policy
- Data portability
- Granular privacy controls
## � Project Structure

```
root/
├── src/
│   ├── background/           # Extension background scripts
│   │   └── background.ts    # Main service worker
│   ├── components/          # React components
│   │   ├── FeedGrid.tsx    # Article feed layout
│   │   ├── Greeting.tsx    # User welcome component
│   │   ├── Onboarding.tsx  # First-time setup
│   │   ├── SettingsPanel.tsx # User preferences
│   │   ├── TaskPanel.tsx   # Task management
│   │   └── WeatherAnimation.tsx # Weather display
│   ├── content/            # Content scripts
│   │   └── contentScript.ts # Page integration
│   ├── newtab/            # New tab page
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── sidepanel/         # Side panel feature
│   │   ├── main.tsx       # Panel entry
│   │   └── SidePanelApp.tsx # Panel component
│   ├── store/             # State management
│   │   ├── appStore.ts    # Main state store
│   │   └── sidePanelStore.ts # Panel state
│   ├── styles/            # Global styles
│   │   └── globals.css    # Tailwind imports
│   └── types/             # TypeScript definitions
├── public/               # Static assets
│   └── icons/           # Extension icons
├── scripts/             # Build scripts
├── manifest.json        # Extension manifest
├── vite.config.ts       # Build configuration
├── tailwind.config.js   # Style configuration
└── tsconfig.json       # TypeScript configuration
## 🚀 Installation

1. **Clone Repository**
```bash
git clone https://github.com/Abhidroid87/3.40.0_0.git
cd 3.40.0_0
```

2. **Install Dependencies**
```bash
npm install
```

3. **Development Build**
```bash
npm run dev
```

4. **Production Build**
```bash
npm run build
```

5. **Load in Chrome**
- Navigate to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` folder

## 🌿 Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch
- **feature/**: Feature branches
- **bugfix/**: Bug fix branches
- **release/**: Release preparation

## 🔧 Technical Stack

- **Frontend**: React 18, TypeScript 5
- **Build**: Vite 4
- **Styling**: Tailwind CSS 3
- **State**: Zustand 4
- **Animation**: Framer Motion
- **Testing**: Jest, React Testing Library
- **API**: Chrome Extension APIs (V3)

## 🔌 API Integration

### Chrome APIs Used
- Storage API
- Tabs API
- Scripting API
- Side Panel API
- Built-in AI API

### External APIs
- Weather API (planned)
- News Feed API (planned)
- Task Sync API (planned)

## ⚠️ Known Limitations

1. **Weather System**
   - Currently using placeholder animations
   - Weather API integration pending

2. **Feed System**
   - Mock data implementation
   - Limited personalization

3. **AI Features**
   - Basic implementation
   - Limited to Chrome's AI capabilities

4. **Task System**
   - Basic CRUD operations
   - Limited sync capabilities

## 🗺 Roadmap

### Phase 1 (Current)
- [x] Basic extension structure
- [x] Core UI components
- [x] State management
- [ ] Weather API integration

### Phase 2 (Upcoming)
- [ ] Real feed data integration
- [ ] Enhanced AI capabilities
- [ ] Full task management
- [ ] Cloud sync features

### Phase 3 (Future)
- [ ] Advanced personalization
- [ ] Machine learning models
- [ ] Social features
- [ ] Analytics dashboard

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

For detailed contribution guidelines, see CONTRIBUTING.md (upcoming).