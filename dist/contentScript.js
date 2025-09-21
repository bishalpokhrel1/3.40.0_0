chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getPageContent") {
    const content = extractPageContent();
    sendResponse({ content });
  }
  return true;
});
function extractPageContent() {
  try {
    const scripts = document.querySelectorAll("script, style, nav, header, footer, aside");
    scripts.forEach((el) => el.remove());
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
const style = document.createElement("style");
style.textContent = `
  .manage-highlight {
    background-color: #ffeb3b;
    color: #000;
    padding: 2px 4px;
    border-radius: 2px;
    font-weight: bold;
  }
`;
document.head.appendChild(style);
console.log("Manage content script loaded on:", window.location.href);
