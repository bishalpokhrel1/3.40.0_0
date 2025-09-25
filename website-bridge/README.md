# Website Bridge - Data Transfer Middleman

A simple website that acts as a bridge between the Chrome extension and mobile app for data synchronization.

## 🎯 Purpose

This website serves as a communication bridge that:
1. Receives data from the Chrome extension
2. Triggers deep links to open the mobile app
3. Transfers data to the mobile app via URL parameters
4. Provides fallbacks for app installation

## 🏗 Architecture

### Communication Flow
```
Chrome Extension → Website Bridge → Mobile App
```

1. **Extension to Website**: Uses `chrome.tabs.sendMessage` or `postMessage`
2. **Website to Mobile**: Uses custom scheme deep links and universal links
3. **Fallback**: Redirects to app stores if app not installed

### Files
- `index.html`: Main bridge page with transfer logic
- `manifest.json`: PWA configuration (optional)
- `service-worker.js`: Offline support (optional)

## 🔧 Setup

### Local Development
1. Serve the files with any static server:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8080
   ```

2. Update extension's bridge URL in `src/services/bridgeService.ts`:
   ```typescript
   private readonly BRIDGE_URL = 'http://localhost:8080';
   ```

### Production Deployment
1. Deploy to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - Firebase Hosting

2. Update the bridge URL in the extension to your production domain

3. Configure universal links:
   - Add domain verification files
   - Update mobile app configuration
   - Test deep link functionality

## 🔗 Deep Link Configuration

### Custom Scheme
- **Format**: `manageapp://transfer?data=<encoded_json>`
- **Encoding**: URL-encoded JSON string
- **Fallback**: Redirects to app store after 2 seconds

### Universal Links
- **iOS**: `https://your-domain.com/transfer?data=<encoded_json>`
- **Android**: Same URL with proper intent filters

### Data Format
```typescript
interface TransferData {
  tasks: Task[];
  notes: Note[];
  type: 'sync' | 'import';
  source: 'extension' | 'website';
  timestamp: string;
}
```

## 🛡 Security Considerations

### Origin Verification
```javascript
window.addEventListener('message', (event) => {
  // Verify origin for security
  if (event.origin !== window.location.origin) {
    return;
  }
  // Process message...
});
```

### Data Validation
- Validate JSON structure before processing
- Sanitize data before URL encoding
- Limit data size to prevent URL length issues

### HTTPS Requirements
- Universal links require HTTPS in production
- Use secure origins for postMessage communication
- Implement CSP headers for additional security

## 🧪 Testing

### Manual Testing
1. Open Chrome extension
2. Navigate to any webpage
3. Open side panel
4. Click "Sync to Mobile"
5. Verify bridge page opens with data
6. Test mobile app opening

### Automated Testing
```javascript
// Test data transfer
const testData = {
  tasks: [{ id: '1', title: 'Test Task', completed: false }],
  notes: [{ id: '1', title: 'Test Note', content: 'Test content' }],
  type: 'sync',
  source: 'extension',
  timestamp: new Date().toISOString()
};

// Simulate extension message
window.postMessage({
  type: 'EXTENSION_DATA_TRANSFER',
  payload: testData
}, window.location.origin);
```

## 🔮 Future Enhancements

### Phase 1: Basic Features
- [ ] QR code generation for desktop users
- [ ] Progress indicators for data transfer
- [ ] Error handling and retry logic

### Phase 2: Advanced Features
- [ ] PWA support for offline functionality
- [ ] Real-time sync status updates
- [ ] Multiple device management

### Phase 3: Enterprise Features
- [ ] Team data sharing
- [ ] Admin dashboard
- [ ] Analytics and usage tracking

## 🐛 Troubleshooting

### Common Issues

1. **Extension Can't Send Data**
   - Check content script injection
   - Verify postMessage origin
   - Look for CSP restrictions

2. **Mobile App Not Opening**
   - Verify custom scheme registration
   - Check universal link configuration
   - Test with different browsers

3. **Data Not Transferring**
   - Check JSON encoding/decoding
   - Verify URL parameter limits
   - Look for data corruption

### Debug Tools
- Browser Developer Tools for message inspection
- Mobile device logs for deep link debugging
- Network tab for request monitoring

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.