// Content script for Manage Chrome Extension
// Handles page content extraction and communication with the side panel

// Listen for messages from the side panel
interface ContentScriptRequest {
  action: 'getPageContent';
}

chrome.runtime.onMessage.addListener((
  request: ContentScriptRequest,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: { content: string }) => void
) => {
  if (request.action === 'getPageContent') {
    const content = extractPageContent()
    sendResponse({ content })
  }
  
  return true // Keep message channel open
})

// Extract meaningful content from the current page
function extractPageContent(): string {
  try {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, header, footer, aside')
    scripts.forEach(el => el.remove())
    
    // Try to find the main content area
    let content = ''
    
    // Look for common content selectors
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '#main-content'
    ]
    
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector)
      if (element) {
        content = element.textContent || (element as HTMLElement).innerText || ''
        break
      }
    }
    
    // Fallback to body content if no specific content area found
    if (!content) {
      content = document.body.textContent || document.body.innerText || ''
    }
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
    
    // Limit content length for processing
    if (content.length > 5000) {
      content = content.substring(0, 5000) + '...'
    }
    
    return content || 'No readable content found on this page.'
    
  } catch (error) {
    console.error('Failed to extract page content:', error)
    return 'Failed to extract content from this page.'
  }
}

// Extract page metadata
function extractPageMetadata() {
  const title = document.title || ''
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  const url = window.location.href
  const domain = window.location.hostname
  
  return {
    title,
    description,
    url,
    domain
  }
}

// Highlight text on page (for future features)
function highlightText(text: string, className: string = 'manage-highlight') {
  try {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    )
    
    const textNodes: Text[] = []
    let node: Node | null
    
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.includes(text)) {
        textNodes.push(node as Text)
      }
    }
    
    textNodes.forEach(textNode => {
      const parent = textNode.parentNode
      if (!parent) return
      
      const content = textNode.textContent || ''
      const index = content.indexOf(text)
      
      if (index !== -1) {
        const beforeText = content.substring(0, index)
        const highlightText = content.substring(index, index + text.length)
        const afterText = content.substring(index + text.length)
        
        const beforeNode = document.createTextNode(beforeText)
        const highlightNode = document.createElement('mark')
        highlightNode.className = className
        highlightNode.textContent = highlightText
        const afterNode = document.createTextNode(afterText)
        
        parent.insertBefore(beforeNode, textNode)
        parent.insertBefore(highlightNode, textNode)
        parent.insertBefore(afterNode, textNode)
        parent.removeChild(textNode)
      }
    })
  } catch (error) {
    console.error('Failed to highlight text:', error)
  }
}

// Add CSS for highlighting
const style = document.createElement('style')
style.textContent = `
  .manage-highlight {
    background-color: #ffeb3b;
    color: #000;
    padding: 2px 4px;
    border-radius: 2px;
    font-weight: bold;
  }
`
document.head.appendChild(style)

// Initialize content script
console.log('Manage content script loaded on:', window.location.href)

// Export functions for testing
export {
  extractPageContent,
  extractPageMetadata,
  highlightText
}