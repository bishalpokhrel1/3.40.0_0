# Meraki - Personal Dashboard & Productivity Extension

A comprehensive Chrome extension that transforms your new tab into a personalized productivity dashboard with task management, notes, and AI-powered features.

## 🌟 Features

### Dashboard (New Tab)
- **Personalized Greeting**: Time-based greetings with user name
- **Live Date & Time**: Real-time clock and calendar display
- **Task Overview**: Quick view of pending and completed tasks with deadlines
- **Notes Section**: Recent notes with quick access to full notes management
- **AI Suggestions**: Placeholder for intelligent productivity recommendations

### Task Management
- **Hierarchical Tasks**: Main tasks with subtasks and notes
- **Priority System**: High, medium, and low priority levels
- **Deadline Tracking**: Due dates with overdue, today, and upcoming views
- **Progress Tracking**: Visual progress bars for subtask completion
- **Timeline View**: Alternative view for task planning (basic implementation)

### Notes System
- **Page-Linked Notes**: Notes automatically linked to websites/videos
- **Rich Organization**: Tags, search, and filtering capabilities
- **Quick Capture**: Popup panel for rapid note-taking on any website
- **Content Linking**: Notes can reference specific URLs and domains

### AI Integration (Placeholder)
- **Content Summarization**: Ready for AI-powered page summarization
- **Task Generation**: Prepared for intelligent task breakdown
- **Smart Suggestions**: Framework for AI-driven productivity insights
- **Content Analysis**: Placeholder for intelligent content insights

### Popup Panel
- **Universal Access**: Available on any website via extension icon or context menu
- **Quick Notes**: Rapid note-taking for the current page
- **AI Tools**: Ready-to-connect AI features for content analysis
- **Page Context**: Automatically captures page title, URL, and domain

## 🏗 Architecture

### Frontend Structure
```
src/
├── components/           # React components
│   ├── Dashboard/       # New tab dashboard components
│   ├── Popup/          # Popup panel components
│   ├── Tasks/          # Task management components
│   └── Notes/          # Notes management components
├── services/           # Business logic and API layers
│   ├── storageService.ts    # Local storage management
│   └── apiService.ts        # Backend API placeholders
├── store/              # State management
│   └── appStore.ts     # Zustand store with persistence
├── types/              # TypeScript definitions
├── background/         # Extension background script
├── content/           # Content script for page interaction
└── pages/             # Full-page components
```

### Data Flow
1. **Local Storage**: Chrome storage API for immediate data persistence
2. **State Management**: Zustand store with automatic persistence
3. **Backend Sync**: Placeholder API layer ready for backend integration
4. **Cross-Platform Prep**: Data structure designed for mobile/web sync

## 🚀 Installation & Development

### Prerequisites
- Node.js 16+ and npm
- Chrome browser for testing

### Setup
1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd manage-extension
   npm install
   ```

2. **Development Build**
   ```bash
   npm run dev
   ```

3. **Production Build**
   ```bash
   npm run build
   ```

4. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked" and select the `dist` folder
   - The extension will appear in your extensions list

### Development Workflow
- **Hot Reload**: Changes to React components update automatically
- **Background Script**: Requires extension reload for changes
- **Content Script**: Requires page refresh for changes

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
# AI API Configuration (when ready to connect)
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here

# Backend Configuration (when ready to connect)
VITE_API_URL=http://localhost:3001/api
VITE_BACKEND_URL=http://localhost:3001
```

### Extension Permissions
The extension requires these permissions:
- `storage`: For local data persistence
- `activeTab`: For current page access
- `sidePanel`: For side panel functionality
- `contextMenus`: For right-click menu integration
- `alarms`: For periodic sync and reminders
- `scripting`: For content script injection
- `tabs`: For tab management and page context

## 🔌 Backend Integration (Ready for Implementation)

### API Endpoints (Placeholder)
The extension is prepared for these backend endpoints:

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh

// Tasks
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

// Notes
GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id

// Sync
POST /api/sync/tasks
POST /api/sync/notes
GET /api/sync/status
```

### Data Sync Strategy
1. **Local First**: All operations work offline
2. **Background Sync**: Automatic sync every 30 minutes
3. **Conflict Resolution**: Last-write-wins with timestamp comparison
4. **Offline Queue**: Failed syncs are queued for retry

## 🤖 AI Integration (Ready for Implementation)

### AI Service Integration Points

1. **Content Summarization** (`src/services/apiService.ts`)
   ```typescript
   async summarizeContent(content: string): Promise<string>
   ```

2. **Task Generation** (`src/services/apiService.ts`)
   ```typescript
   async generateTaskSuggestions(input: string): Promise<string[]>
   ```

3. **Content Analysis** (`src/services/apiService.ts`)
   ```typescript
   async analyzeContent(content: string): Promise<{summary: string, suggestions: string[]}>
   ```

### Recommended AI Providers
- **OpenAI GPT-4**: For general text processing and task generation
- **Google Gemini**: For content analysis and summarization
- **Local Models**: For privacy-focused processing

### Implementation Steps
1. Add your API keys to `.env` file
2. Update the placeholder methods in `src/services/apiService.ts`
3. Configure rate limiting and error handling
4. Test with the existing UI components

## 📱 Cross-Platform Sync Preparation

### Data Structure
All data is structured for easy cross-platform synchronization:

```typescript
interface SyncableData {
  tasks: Task[];
  notes: Note[];
  preferences: UserPreferences;
  lastSync: string;
  deviceId: string;
}
```

### Mobile App Integration
- **Expo/React Native**: Shared TypeScript interfaces
- **Firebase**: Real-time sync capabilities
- **Offline Support**: Local storage with sync queue

### Web Dashboard Integration
- **Next.js/React**: Shared component library
- **GraphQL API**: Efficient data fetching
- **Real-time Updates**: WebSocket or Server-Sent Events

## 🧪 Testing

### Manual Testing
1. **New Tab**: Open new tab to see dashboard
2. **Task Management**: Create, edit, and complete tasks
3. **Notes**: Create notes and test popup on various websites
4. **Popup Panel**: Right-click on any page → "Open Manage Tools"
5. **Side Panel**: Click extension icon to open side panel

### Test Scenarios
- Create tasks with different priorities and due dates
- Add subtasks and track progress
- Create notes linked to specific websites
- Test popup functionality on YouTube, articles, etc.
- Verify data persistence across browser sessions

## 🔮 Future Enhancements

### Phase 1: AI Integration
- [ ] Connect OpenAI/Gemini APIs
- [ ] Implement content summarization
- [ ] Add intelligent task suggestions
- [ ] Smart content analysis

### Phase 2: Backend & Sync
- [ ] Node.js/Express backend
- [ ] User authentication
- [ ] Real-time data synchronization
- [ ] Conflict resolution

### Phase 3: Cross-Platform
- [ ] Mobile app (Expo/React Native)
- [ ] Web dashboard
- [ ] Real-time collaboration
- [ ] Advanced analytics

### Phase 4: Advanced Features
- [ ] Calendar integration
- [ ] Email integration
- [ ] Team collaboration
- [ ] Advanced AI workflows

## 🐛 Troubleshooting

### Common Issues

1. **Extension Not Loading**
   - Check Chrome developer mode is enabled
   - Verify all files are in `dist` folder after build
   - Check browser console for errors

2. **Data Not Persisting**
   - Verify storage permissions in manifest
   - Check Chrome storage quota
   - Look for storage errors in background script console

3. **Popup Not Appearing**
   - Ensure content script is injected
   - Check for CSP restrictions on target websites
   - Verify popup overlay z-index is sufficient

### Debug Tools
- **Extension Console**: `chrome://extensions` → Details → Inspect views
- **Background Script**: Inspect background page
- **Content Script**: Use browser dev tools on target page
- **Storage Inspector**: Chrome DevTools → Application → Storage

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

For major changes, please open an issue first to discuss the proposed changes.
