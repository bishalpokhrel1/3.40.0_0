# How to Load the Extension in Chrome

## Steps to Load the Extension:

1. **Open Chrome Browser**
2. **Go to Extensions Page**:
   - Type `chrome://extensions/` in the address bar
   - OR go to Menu (three dots) → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**:
   - Click "Load unpacked" button
   - Navigate to: `C:\Users\LENOVO\OneDrive\Documents\3.40.0_0\extension\dist`
   - Select the `dist` folder and click "Select Folder"

5. **Verify Installation**:
   - The extension should appear in your extensions list
   - You should see "Meraki - Personalized Dashboard" in the list
   - The extension icon should appear in your browser toolbar

## Testing the Extension:

1. **New Tab**: Open a new tab to see the personalized dashboard
2. **Side Panel**: Click the extension icon to open the side panel
3. **Features**: Test the various features like tasks, notes, AI suggestions

## Troubleshooting:

- If you see errors, check the browser console (F12)
- Make sure all files are present in the dist folder
- Try reloading the extension if changes were made

## Files Created:
- ✅ `dist/manifest.json` - Extension configuration
- ✅ `dist/background.js` - Background service worker
- ✅ `dist/contentScript.js` - Content script
- ✅ `dist/newtab.html` - New tab page
- ✅ `dist/sidepanel.html` - Side panel page
- ✅ `dist/assets/` - CSS and JS assets
- ✅ `dist/icons/` - Extension icons

