import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const callGeminiAPI = async (prompt, content = '') => {
  const apiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: content ? `${prompt}\n\n${content}` : prompt }] }]
    })
  });

  const data = await apiRes.json();
  if (!data.candidates || !data.candidates[0]?.content?.parts?.length) {
    throw new Error('Invalid response from Gemini API');
  }
  return data.candidates[0].content.parts[0].text;
};

app.post("/api/summarize", async (req, res) => {
  const { content, prompt } = req.body;

  try {
    const summary = await callGeminiAPI(prompt, content);
    res.json({ summary });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message, context } = req.body;

  try {
    const systemPrompt = `You are a helpful AI assistant. ${context ? `Context about the current page: ${context}` : ''}`;
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    
    const response = await callGeminiAPI(prompt);
    res.json({ response });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Chat request failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));