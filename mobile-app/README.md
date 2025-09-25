# Manage Mobile App

React Native/Expo mobile app for the Manage productivity extension.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device (for development)

### Installation
```bash
cd mobile-app
npm install
```

### Development
```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Building for Production
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## 📱 Deep Linking Setup

### Custom Scheme
- **Scheme**: `manageapp://`
- **Example**: `manageapp://transfer?data=...`

### Universal Links
- **iOS**: `https://manage-dashboard.com/transfer`
- **Android**: `https://manage-dashboard.com/transfer`

### Testing Deep Links
1. **Development**: Use Expo CLI to test deep links
   ```bash
   npx expo start --dev-client
   npx uri-scheme open manageapp://transfer --ios
   ```

2. **Production**: Test with actual URLs
   ```bash
   # Test custom scheme
   adb shell am start -W -a android.intent.action.VIEW -d "manageapp://transfer?data=..." com.manage.dashboard
   
   # Test universal link
   adb shell am start -W -a android.intent.action.VIEW -d "https://manage-dashboard.com/transfer?data=..." com.manage.dashboard
   ```

## 🔄 Data Sync Flow

### From Extension to Mobile
1. User clicks "Sync to Mobile" in extension side panel
2. Extension opens bridge website with data
3. Bridge website triggers deep link to mobile app
4. Mobile app receives data and syncs locally

### Data Structure
```typescript
interface TransferData {
  tasks: Task[];
  notes: Note[];
  type: 'sync' | 'import';
  source: 'extension' | 'website';
  timestamp: string;
}
```

## 🏗 Architecture

### Screens
- **DashboardScreen**: Main overview with stats and quick actions
- **TasksScreen**: Full task management interface
- **NotesScreen**: Notes viewing and editing
- **DataTransferScreen**: Handles incoming data from extension

### Services
- **storageService**: Local data persistence with AsyncStorage
- **syncService**: Data synchronization and merging logic
- **apiService**: Backend API integration (placeholder)

## 🔧 Configuration

### App Configuration (`app.json`)
- **Bundle ID**: `com.manage.dashboard`
- **Scheme**: `manageapp`
- **Universal Links**: Configured for `manage-dashboard.com`

### Platform-Specific Setup

#### iOS
- Universal Links configured in `ios/YourApp/YourApp.entitlements`
- Associated domains: `applinks:manage-dashboard.com`

#### Android
- Intent filters for custom scheme and universal links
- App Links verification for `manage-dashboard.com`

## 🧪 Testing

### Manual Testing
1. Install app on device
2. Open Chrome extension
3. Navigate to any webpage
4. Open side panel and click "Sync to Mobile"
5. Verify app opens and data is transferred

### Deep Link Testing
```bash
# Test custom scheme
manageapp://transfer?data=%7B%22tasks%22%3A%5B%5D%2C%22notes%22%3A%5B%5D%7D

# Test universal link
https://manage-dashboard.com/transfer?data=%7B%22tasks%22%3A%5B%5D%2C%22notes%22%3A%5B%5D%7D
```

## 🔮 Future Enhancements

### Phase 1: Core Features
- [ ] Real-time sync with backend
- [ ] Push notifications for reminders
- [ ] Offline support with sync queue

### Phase 2: Advanced Features
- [ ] Widget support (iOS/Android)
- [ ] Apple Watch / Wear OS companion
- [ ] Siri Shortcuts / Google Assistant integration

### Phase 3: Collaboration
- [ ] Team workspaces
- [ ] Shared tasks and notes
- [ ] Real-time collaboration

## 🐛 Troubleshooting

### Common Issues

1. **Deep Links Not Working**
   - Verify app is installed and scheme is correct
   - Check universal link configuration
   - Test with `npx uri-scheme` in development

2. **Data Not Syncing**
   - Check AsyncStorage permissions
   - Verify JSON parsing in transfer data
   - Look for errors in Metro logs

3. **App Not Opening from Browser**
   - Ensure custom scheme is registered
   - Check if universal links are properly configured
   - Verify intent filters on Android

### Debug Tools
- **Metro Logs**: `npx expo start` shows real-time logs
- **React Native Debugger**: For advanced debugging
- **Flipper**: For network and storage inspection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.