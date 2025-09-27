import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

declare global {
  interface Window {
    firebase: any;
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyDPCB-djaDfmWUCz76balbwYhWJD4QAKOo",
  authDomain: "api-sample-20c3a.firebaseapp.com",
  projectId: "api-sample-20c3a",
  storageBucket: "api-sample-20c3a.firebasestorage.app",
  messagingSenderId: "772194196847",
  appId: "1:772194196847:web:6bc4074b37c297dd389c9a",
  measurementId: "G-BGF0R1MEND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Listen for installation
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed');
  try {
    await setupSidePanel();
  } catch (error) {
    console.error('Error setting up side panel:', error);
  }
});

// Handle side panel
async function setupSidePanel() {
  if ('sidePanel' in chrome) {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if ('sidePanel' in chrome) {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.type === 'AUTH_STATE_CHANGED') {
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'GET_AUTH_TOKEN') {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError });
      } else {
        sendResponse({ token });
      }
    });
    return true;
  }
});