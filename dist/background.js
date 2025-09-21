console.log("Background script loaded");
chrome.runtime.onInstalled.addListener(() => {
  console.log("Manage extension installed");
  if ("sidePanel" in chrome) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log("Received message:", request);
  try {
    switch (request.action) {
      case "fetchFeeds":
        if (!request.interests) {
          throw new Error("No interests provided for feed fetch");
        }
        handleFetchFeeds(request.interests).then((response) => sendResponse({ success: true, ...response })).catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case "getTaskSuggestions":
        if (!request.task) {
          throw new Error("No task provided for suggestions");
        }
        handleGetTaskSuggestions(request.task).then((response) => sendResponse({ success: true, ...response })).catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case "summarizePage":
        if (!request.content) {
          throw new Error("No content provided for summarization");
        }
        handleSummarizePage(request.content).then((response) => sendResponse({ success: true, ...response })).catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case "chatWithAI":
        if (!request.message) {
          throw new Error("No message provided for AI chat");
        }
        handleChatWithAI(request.message, request.context).then((response) => sendResponse({ success: true, ...response })).catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }
  } catch (error) {
    console.error("Error handling message:", error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
    return true;
  }
});
async function handleFetchFeeds(interests) {
  try {
    const items = await fetchFeedItems(interests);
    return { items };
  } catch (error) {
    console.error("Failed to fetch feeds:", error);
    return { items: [] };
  }
}
async function fetchFeedItems(interests) {
  if (!interests || interests.length === 0) {
    throw new Error("No interests provided for feed fetch");
  }
  const items = [];
  try {
    const mockArticles = await getMockArticles(interests);
    if (!mockArticles || mockArticles.length === 0) {
      throw new Error("No articles found for the given interests");
    }
    const articleProcessingPromises = mockArticles.map(async (article) => {
      try {
        return await processArticleWithAI(article, interests);
      } catch (error) {
        console.error("Failed to process article:", error);
        return {
          id: crypto.randomUUID(),
          title: article.title,
          description: article.description,
          url: article.url,
          source: article.source,
          publishedAt: article.publishedAt,
          imageUrl: article.imageUrl,
          relevanceScore: 50,
          // Default score
          tags: interests
          // Use interests as basic tags
        };
      }
    });
    const processedItems = await Promise.allSettled(articleProcessingPromises);
    processedItems.forEach((result) => {
      if (result.status === "fulfilled") {
        items.push(result.value);
      }
    });
    if (items.length === 0) {
      throw new Error("Failed to process any articles");
    }
  } catch (error) {
    console.error("Failed to fetch feed items:", error);
    throw new Error("Failed to fetch feed items: " + (error instanceof Error ? error.message : "Unknown error"));
  }
  return items.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}
async function processArticleWithAI(article, interests) {
  let aiSummary = "";
  let relevanceScore = 50;
  let tags = [];
  try {
    const win = window;
    if (typeof window !== "undefined" && win.ai?.languageModel) {
      const session = await win.ai.languageModel.create({
        systemPrompt: `You are a content analyzer. Rate relevance (0-100) and provide a 1-2 sentence summary.
        User interests: ${interests.join(", ")}`
      });
      const prompt = `Article: "${article.title}" - ${article.description}
      
      Respond with JSON: {"score": number, "summary": "string", "tags": ["string"]}`;
      const response = await session.prompt(prompt);
      const parsed = JSON.parse(response);
      aiSummary = parsed.summary;
      relevanceScore = parsed.score;
      tags = parsed.tags || [];
    } else {
      const content = `${article.title} ${article.description}`.toLowerCase();
      const matchedInterests = interests.filter(
        (interest) => content.includes(interest.toLowerCase())
      );
      relevanceScore = Math.min(100, matchedInterests.length * 25 + 50);
      tags = matchedInterests;
      aiSummary = article.description.slice(0, 150) + "...";
    }
  } catch (error) {
    console.error("AI processing failed:", error);
    const content = `${article.title} ${article.description}`.toLowerCase();
    const matchedInterests = interests.filter(
      (interest) => content.includes(interest.toLowerCase())
    );
    relevanceScore = Math.min(100, matchedInterests.length * 25 + 50);
    tags = matchedInterests;
    aiSummary = article.description.slice(0, 150) + "...";
  }
  return {
    id: crypto.randomUUID(),
    title: article.title,
    description: article.description,
    url: article.url,
    source: article.source,
    publishedAt: article.publishedAt,
    imageUrl: article.imageUrl,
    aiSummary,
    relevanceScore,
    tags
  };
}
async function getMockArticles(interests) {
  const baseArticles = [
    {
      title: "The Future of AI in Web Development",
      description: "Exploring how artificial intelligence is revolutionizing the way we build and interact with websites, from automated code generation to intelligent user interfaces.",
      url: "https://example.com/ai-web-dev",
      source: "TechCrunch",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Chrome Extensions: Building for the Modern Web",
      description: "A comprehensive guide to creating powerful Chrome extensions using Manifest V3, including best practices for security and performance.",
      url: "https://example.com/chrome-extensions",
      source: "Google Developers",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "React 18: New Features and Performance Improvements",
      description: "Deep dive into React 18's concurrent features, automatic batching, and new hooks that make applications more responsive and efficient.",
      url: "https://example.com/react-18",
      source: "React Blog",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "The Rise of Edge Computing",
      description: "How edge computing is changing the landscape of web applications by bringing computation closer to users and reducing latency.",
      url: "https://example.com/edge-computing",
      source: "Vercel",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "TypeScript Best Practices for Large Applications",
      description: "Essential patterns and practices for maintaining TypeScript codebases at scale, including architecture decisions and tooling.",
      url: "https://example.com/typescript-practices",
      source: "Microsoft",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Web Accessibility: Building Inclusive Experiences",
      description: "Creating web applications that work for everyone, including users with disabilities, through proper semantic HTML and ARIA.",
      url: "https://example.com/web-accessibility",
      source: "A11y Project",
      publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Sustainable Web Development Practices",
      description: "How to build environmentally conscious websites that minimize energy consumption and carbon footprint.",
      url: "https://example.com/sustainable-web",
      source: "Green Web Foundation",
      publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "The Evolution of CSS: From Flexbox to Container Queries",
      description: "A journey through modern CSS features that have transformed how we approach responsive design and layout.",
      url: "https://example.com/css-evolution",
      source: "CSS-Tricks",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString(),
      imageUrl: "https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];
  const relevantArticles = baseArticles.filter((article) => {
    const content = `${article.title} ${article.description}`.toLowerCase();
    return interests.some((interest) => content.includes(interest.toLowerCase()));
  });
  return relevantArticles.length > 0 ? relevantArticles : baseArticles.slice(0, 6);
}
async function handleGetTaskSuggestions(task) {
  try {
    const win = window;
    if (typeof window !== "undefined" && win.ai?.languageModel) {
      const session = await win.ai.languageModel.create({
        systemPrompt: "You are a productivity assistant. Break down tasks into actionable steps."
      });
      const prompt = `Break down this task into 3-5 specific, actionable steps: "${task}"
      
      Respond with JSON: {"suggestions": ["step1", "step2", "step3"]}`;
      const response = await session.prompt(prompt);
      const parsed = JSON.parse(response);
      return { suggestions: parsed.suggestions };
    } else {
      return {
        suggestions: [
          "Research and gather necessary information",
          "Create a detailed plan or outline",
          "Break down into smaller subtasks",
          "Set deadlines for each component",
          "Review and refine the approach"
        ]
      };
    }
  } catch (error) {
    console.error("Failed to get task suggestions:", error);
    return {
      suggestions: [
        "Start with research and planning",
        "Identify key requirements",
        "Create a timeline",
        "Begin with the first step"
      ]
    };
  }
}
async function handleSummarizePage(content) {
  try {
    const win = window;
    if (typeof window !== "undefined" && win.ai?.summarizer) {
      const summarizer = await win.ai.summarizer.create();
      const summary = await summarizer.summarize(content);
      return { summary };
    } else {
      const sentences = content.split(". ").slice(0, 3);
      const summary = sentences.join(". ") + (sentences.length === 3 ? "." : "");
      return { summary: summary || "No content available to summarize." };
    }
  } catch (error) {
    console.error("Failed to summarize page:", error);
    return { summary: "Failed to summarize the page content." };
  }
}
async function handleChatWithAI(message, context) {
  try {
    const win = window;
    if (typeof window !== "undefined" && win.ai?.languageModel) {
      const session = await win.ai.languageModel.create({
        systemPrompt: `You are a helpful assistant. ${context ? `Context: ${context}` : ""}`
      });
      const response = await session.prompt(message);
      return { response };
    } else {
      const fallbackResponses = [
        "I'd be happy to help! However, Chrome's built-in AI is not available right now.",
        "That's an interesting question! The AI features are currently being loaded.",
        "I'm processing your request, but the AI service is temporarily unavailable."
      ];
      const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return { response };
    }
  } catch (error) {
    console.error("Failed to chat with AI:", error);
    return { response: "Sorry, I encountered an error processing your message." };
  }
}
