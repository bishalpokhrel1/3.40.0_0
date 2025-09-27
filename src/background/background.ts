console.log('Background script loaded');

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Initialize storage with default values
  const defaultSettings = {
    tasksEnabled: true,
    weatherEnabled: true,
    newsEnabled: true,
    theme: 'light',
    notifications: true
  };
  
  chrome.storage.sync.get(defaultSettings, (settings) => {
    console.log('Settings initialized:', settings);
  });
});

// Listen for side panel toggle action
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked');
    try {
      chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  });
} else {
  console.warn('chrome.action is not available');
}

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  if (message.type === 'GET_AUTH_TOKEN') {
    if (chrome.identity && chrome.identity.getAuthToken) {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        sendResponse({ token: token });
      });
      return true; // Will respond asynchronously
    } else {
      sendResponse({ error: 'Identity API not available' });
    }
  }
  
  if (message.type === 'GET_SETTINGS') {
    const defaultSettings = {
      tasksEnabled: true,
      weatherEnabled: true,
      newsEnabled: true,
      theme: 'light',
      notifications: true
    };
    
    chrome.storage.sync.get(defaultSettings, (settings) => {
      sendResponse(settings);
    });
    return true;
  }
  
  if (message.type === 'SAVE_SETTINGS') {
    chrome.storage.sync.set(message.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});