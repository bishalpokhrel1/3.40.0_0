chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log("Content script received message:", request.action);
  switch (request.action) {
    case "getPageContent":
      try {
        const content = extractPageContent();
        sendResponse({ content });
      } catch (error) {
        console.error("Failed to extract content:", error);
        sendResponse({ content: "Failed to extract content from this page." });
      }
      break;
    case "showPopup":
      try {
        showManagePopup();
        sendResponse({ success: true });
      } catch (error) {
        console.error("Failed to show popup:", error);
        sendResponse({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
      }
      break;
    case "getPageContext":
      try {
        const context = getPageContext();
        sendResponse({ context });
      } catch (error) {
        console.error("Failed to get page context:", error);
        sendResponse({ context: null, error: error instanceof Error ? error.message : "Unknown error" });
      }
      break;
    default:
      console.warn("Unknown action:", request.action);
      sendResponse({ error: "Unknown action" });
  }
  return true;
});
function extractPageContent() {
  try {
    const unwantedSelectors = [
      "script",
      "style",
      "nav",
      "header",
      "footer",
      "aside",
      ".advertisement",
      ".ads",
      ".sidebar",
      ".menu"
    ];
    unwantedSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    });
    let content = "";
    const contentSelectors = [
      "main",
      "article",
      '[role="main"]',
      ".content",
      ".post-content",
      ".entry-content",
      ".article-content",
      "#content",
      "#main-content"
    ];
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        content = element.textContent || element.innerText || "";
        break;
      }
    }
    if (!content) {
      content = document.body.textContent || document.body.innerText || "";
    }
    content = content.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();
    if (content.length > 5e3) {
      content = content.substring(0, 5e3) + "...";
    }
    return content || "No readable content found on this page.";
  } catch (error) {
    console.error("Failed to extract page content:", error);
    return "Failed to extract content from this page.";
  }
}
function getPageContext() {
  return {
    url: window.location.href,
    title: document.title,
    domain: window.location.hostname,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function showManagePopup() {
  if (document.getElementById("manage-popup-overlay")) {
    return;
  }
  const overlay = document.createElement("div");
  overlay.id = "manage-popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  `;
  const popup = document.createElement("div");
  popup.style.cssText = `
    background: white;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
  `;
  popup.innerHTML = `
    <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 24px; font-weight: bold; margin: 0;">Manage Tools</h2>
        <button id="close-popup" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px; border-radius: 8px; cursor: pointer;">
          ✕
        </button>
      </div>
      <div style="opacity: 0.9;">
        <p style="font-weight: 500; margin: 0 0 4px 0;">${document.title}</p>
        <p style="font-size: 14px; opacity: 0.8; margin: 0;">${window.location.hostname}</p>
      </div>
    </div>
    
    <div style="padding: 24px;">
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #374151;">Quick Note</h3>
        <textarea id="quick-note" placeholder="Write a note about this page..." style="
          width: 100%; 
          padding: 12px; 
          border: 2px solid #e5e7eb; 
          border-radius: 8px; 
          resize: vertical; 
          font-family: inherit;
          min-height: 100px;
          outline: none;
        "></textarea>
        <button id="save-note" style="
          margin-top: 12px;
          background: #3b82f6; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-weight: 600; 
          cursor: pointer;
          width: 100%;
        ">Save Note</button>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #374151;">AI Tools</h3>
        <div style="display: grid; gap: 12px;">
          <button id="ai-summarize" style="
            background: linear-gradient(135deg, #eff6ff, #dbeafe); 
            border: 2px solid #bfdbfe; 
            color: #1e40af; 
            padding: 16px; 
            border-radius: 12px; 
            font-weight: 600; 
            cursor: pointer;
            text-align: left;
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 24px;">📄</span>
              <div>
                <div style="font-weight: 600;">Summarize Page</div>
                <div style="font-size: 14px; opacity: 0.8;">Get key insights from this content</div>
              </div>
            </div>
          </button>
          
          <button id="ai-analyze" style="
            background: linear-gradient(135deg, #faf5ff, #f3e8ff); 
            border: 2px solid #d8b4fe; 
            color: #7c3aed; 
            padding: 16px; 
            border-radius: 12px; 
            font-weight: 600; 
            cursor: pointer;
            text-align: left;
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 24px;">✨</span>
              <div>
                <div style="font-weight: 600;">AI Analysis</div>
                <div style="font-size: 14px; opacity: 0.8;">Get smart suggestions and insights</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  popup.querySelector("#close-popup")?.addEventListener("click", () => {
    overlay.remove();
  });
  popup.querySelector("#save-note")?.addEventListener("click", async () => {
    const noteContent = popup.querySelector("#quick-note")?.value;
    if (noteContent?.trim()) {
      try {
        await chrome.runtime.sendMessage({
          action: "saveNote",
          note: {
            title: document.title,
            content: noteContent,
            url: window.location.href,
            domain: window.location.hostname
          }
        });
        const saveButton = popup.querySelector("#save-note");
        saveButton.textContent = "Saved! ✓";
        saveButton.style.background = "#10b981";
        setTimeout(() => {
          overlay.remove();
        }, 1e3);
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    }
  });
  popup.querySelector("#ai-summarize")?.addEventListener("click", () => {
    console.log("AI Summarize clicked - placeholder");
  });
  popup.querySelector("#ai-analyze")?.addEventListener("click", () => {
    console.log("AI Analyze clicked - placeholder");
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}
console.log("Manage content script loaded on:", window.location.href);
setTimeout(() => {
  chrome.runtime.sendMessage({
    action: "pageLoaded",
    context: getPageContext()
  });
}, 1e3);
