import { s as summarizeContent, g as generateResponse } from './assets/geminiService-DHV3BpHO.js';
import { s as storageService } from './assets/storageService-BlI6jaZy.js';

console.log("Background script loaded");
async function ensureSidePanel() {
  if ("sidePanel" in chrome) {
    try {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
      chrome.contextMenus.create({
        id: "openSidePanel",
        title: "Open Manage Side Panel",
        contexts: ["all"]
      });
      return true;
    } catch (error) {
      console.error("Error setting up side panel:", error);
      return false;
    }
  }
  return false;
}
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    if ("sidePanel" in chrome) {
      try {
        if (tab?.windowId) {
          await chrome.sidePanel.open({ windowId: tab.windowId });
        }
      } catch (error) {
        console.error("Error opening side panel:", error);
      }
    } else {
      chrome.windows.create({
        url: chrome.runtime.getURL("sidepanel.html"),
        type: "popup",
        width: 400,
        height: 600
      });
    }
  }
});
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed");
  await ensureSidePanel();
});
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "saveNote") {
    const noteData = request.note;
    if (noteData) {
      storageService.addNote({
        title: noteData.title,
        content: noteData.content,
        url: noteData.url,
        domain: noteData.domain,
        tags: []
      }).then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        console.error("Failed to save note:", error);
        sendResponse({ success: false, error: "Failed to save note" });
      });
      return true;
    }
  }
  if (request.action === "pageLoaded") {
    const context = request.context;
    console.log("Page loaded:", context);
    sendResponse({ success: true });
    return true;
  }
  if (request.action === "summarizePage") {
    if (!request.content) {
      sendResponse({ success: false, error: "No content provided" });
      return true;
    }
    summarizeContent(request.content).then((summary) => {
      sendResponse({ success: true, summary: summary.text });
    }).catch((err) => {
      console.error("Summarization failed:", err);
      sendResponse({ success: false, error: "Failed to summarize content" });
    });
    return true;
  }
  if (request.action === "chatWithAI") {
    if (!request.message) {
      sendResponse({ success: false, error: "No message provided" });
      return true;
    }
    generateResponse(request.message, request.context).then((response) => {
      sendResponse({ success: true, response: response.text });
    }).catch((err) => {
      console.error("Chat failed:", err);
      sendResponse({ success: false, error: "Failed to generate response" });
    });
    return true;
  }
  sendResponse({ success: false, error: "Unknown action" });
  return true;
});
