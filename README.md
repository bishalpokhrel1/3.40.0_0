# Manage – Chrome Extension & Cross-Platform Productivity Hub

A comprehensive productivity extension with task management, note-taking, and AI-powered features. Designed for seamless sync across Chrome extension, mobile app, and web dashboard.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd extension
npm install
```

### 2. Build the Extension
```bash
npm run build
```

### 3. Load in Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` folder

### 4. Test the Extension
- Open a new tab to see the dashboard
- Click the extension icon to open the side panel
- Right-click on any webpage to access quick tools

## 📁 Project Structure

```
.
├── extension/                 # Chrome extension (main workspace)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard/    # New tab dashboard components
│   │   │   ├── Tasks/        # Task management components
│   │   │   ├── Notes/        # Note management components
│   │   │   └── Popup/        # Popup panel components
│   │   ├── services/         # Business logic and API layers
│   │   ├── store/           # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   ├── background/      # Background script
│   │   ├── content/         # Content script
│   │   ├── newtab/          # New tab page entry
│   │   ├── sidepanel/       # Side panel entry
│   │   └── popup/           # Popup entry
│   ├── public/              # Static assets
│   └── dist/                # Built extension files
├── mobile-app/               # Expo mobile app
├── website-bridge/           # Bridge website for mobile sync
├── shared/                   # Shared utilities and types
└── packages/api/             # Backend API (Node.js/GraphQL)
```

## 🎯 Core Features

### **Dashboard (New Tab)**
- Time-based personalized greeting
- Live date and time display
- Task list with deadlines and priorities
- Recent notes with quick access
- AI suggestions placeholder

### **Task Management**
- Create, edit, delete tasks
- Hierarchical subtasks
- Priority levels (low, medium, high)
- Due dates and reminders
- Timeline view
- Progress tracking

### **Notes System**
- Page-linked notes (automatically captures URL)
- Tag system and search
- Rich text support preparation
- AI summarization placeholder
- Centralized notes management

### **Popup Panel**
- Quick access on any website
- Page-specific note taking
- AI tools (summarize, analyze)
- Mobile sync functionality

## 🔧 Development

### **Extension Development**
```bash
cd extension
npm run dev        # Development mode
npm run build      # Production build
npm run type-check # TypeScript validation
```

### **Mobile App Development**
```bash
cd mobile-app
npm install
npx expo start     # Start development server
```

### **Website Bridge**
```bash
cd website-bridge
# Serve with any static server
python -m http.server 8080
# or
npx serve .
```

## 🔌 API Integration Points

### **AI Integration (Ready for Your API)**
Update these methods in `src/services/apiService.ts`:

```typescript
// Replace these placeholder methods:
async summarizeContent(content: string): Promise<{ text: string; tokens: number }>
async generateTaskSuggestions(input: string): Promise<string[]>
async analyzeContent(content: string): Promise<{ summary: string; suggestions: string[] }>
```

### **Backend Integration (Ready for Firebase/Node.js)**
Update these methods in `src/services/apiService.ts`:

```typescript
// Replace these placeholder methods:
async syncTasks(localTasks: Task[]): Promise<Task[]>
async syncNotes(localNotes: Note[]): Promise<Note[]>
async createTask(task: TaskInput): Promise<Task>
async createNote(note: NoteInput): Promise<Note>
```

### **Authentication (Ready for Firebase)**
Add authentication in `src/services/authService.ts`:

```typescript
// Implement these methods:
async login(email: string, password: string)
async register(email: string, password: string, name: string)
```

## 📱 Mobile App Integration

### **Deep Linking Setup**
The mobile app is configured with:
- Custom scheme: `manageapp://`
- Universal links: `https://manage-dashboard.com/`

### **Data Sync Flow**
1. Extension → Website Bridge → Mobile App
2. Data encoded in URL parameters
3. Mobile app parses and syncs data
4. Fallback to app stores if not installed

## 🌐 Cross-Platform Sync

### **Data Format**
All data uses a standardized format for cross-platform compatibility:

```typescript
interface SyncData {
  tasks: Task[];
  notes: Note[];
  preferences: UserPreferences;
  lastSync: string;
  deviceId: string;
}
```

### **Sync Strategy**
- Local-first approach
- Timestamp-based conflict resolution
- Optimistic updates
- Offline queue for failed syncs

## 🔒 Security & Privacy

- All data stored locally by default
- Optional cloud sync with user consent
- Page URLs captured only with explicit user action
- No automatic data collection

## 🧪 Testing

### **Extension Testing**
1. Load extension in Chrome
2. Test new tab dashboard
3. Test popup on various websites
4. Test side panel functionality
5. Verify data persistence

### **Mobile Integration Testing**
1. Start website bridge server
2. Use extension sync feature
3. Test deep link opening
4. Verify data transfer

## 🚀 Deployment

### **Extension Deployment**
1. Build production version: `npm run build`
2. Zip the `dist` folder
3. Upload to Chrome Web Store

### **Mobile App Deployment**
1. Build with Expo: `npx expo build`
2. Submit to app stores
3. Configure universal links

### **Website Bridge Deployment**
1. Deploy to static hosting (Netlify, Vercel)
2. Update bridge URL in extension
3. Configure domain verification

## 🔮 Future Enhancements

- Real-time collaboration
- Advanced AI features
- Team workspaces
- Analytics dashboard
- Browser sync across devices

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure proper Chrome permissions
4. Test with sample data first

---

**Ready for AI and backend integration!** All placeholder methods are clearly marked and waiting for your API connections.