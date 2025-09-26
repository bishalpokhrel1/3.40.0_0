"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeminiClient = createGeminiClient;
const generative_ai_1 = require("@google/generative-ai");
/**
 * Creates a Gemini client wrapper that can be shared between the
 * Chrome extension and the mobile workspace. Each platform is responsible for
 * injecting its own API key via environment variables.
 */
function createGeminiClient(config) {
    if (!config.apiKey) {
        throw new Error('Missing Gemini API key. Ensure the .env file is configured.');
    }
    const modelId = config.model ?? 'gemini-pro';
    const client = new generative_ai_1.GoogleGenerativeAI(config.apiKey);
    const withModel = () => client.getGenerativeModel({ model: modelId });
    return {
        async generate(prompt, options = {}) {
            const model = withModel();
            const promptWithContext = options.context
                ? `Context: ${options.context}\n\nQuestion: ${prompt}`
                : prompt;
            const result = await model.generateContent(promptWithContext);
            const response = await result.response;
            return {
                text: response.text(),
                tokens: response.text().length
            };
        },
        async summarize(content) {
            const model = withModel();
            const result = await model.generateContent(`Please provide a concise summary of the following content:\n\n${content}`);
            const response = await result.response;
            return {
                text: response.text(),
                tokens: response.text().length
            };
        }
    };
}
