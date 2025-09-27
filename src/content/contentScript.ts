// Content script
console.log('Content script loaded');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'INJECT_SCRIPT') {
    console.log('Injecting script');
    sendResponse({ success: true });
  }
  return true;
});