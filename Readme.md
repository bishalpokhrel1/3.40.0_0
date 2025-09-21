# Manage

## 🎯 Overview
A Chrome extension that enhances browsing experience with AI-powered features, weather animations, and productivity tools. Built with React, TypeScript, and Chrome's Manifest V3.


## 🏗 Architecture

### Core Components
1. **Frontend Layer**
   - React 18 for UI components
   - TypeScript for type safety
   - Vite for build optimization
   - Tailwind CSS for styling

2. **State Management**
   - Zustand for global state
   - Chrome Storage API for persistence
   - Real-time state sync across components

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