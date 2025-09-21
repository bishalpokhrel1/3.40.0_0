import { create } from 'zustand'
import { AIWindow } from '@/types/feedItem'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface SidePanelState {
  currentSummary: string | null
  chatMessages: ChatMessage[]
  isLoading: boolean
  
  summarizePage: () => Promise<void>
  sendChatMessage: (message: string) => Promise<void>
  clearChat: () => void
}

export const useSidePanelStore = create<SidePanelState>((set, get) => ({
  currentSummary: null,
  chatMessages: [],
  isLoading: false,

  summarizePage: async () => {
    set({ isLoading: true })
    
    try {
      // Request page content from content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab.id) return
      
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'getPageContent' 
      })
      
      if (response?.content) {
        // Try to use Chrome's built-in Summarizer API
        let summary = ''
        
        try {
          const win = window as unknown as AIWindow
          if (win.ai?.summarizer) {
            const summarizer = await win.ai.summarizer.create()
            summary = await summarizer.summarize(response.content)
          } else {
            // Fallback to simple extraction
            summary = response.content.slice(0, 500) + '...'
          }
        } catch (error) {
          console.warn('AI Summarizer not available, using fallback')
          // Simple extractive summary
          const sentences = response.content.split('. ').slice(0, 3)
          summary = sentences.join('. ') + (sentences.length === 3 ? '.' : '')
        }
        
        set({ currentSummary: summary })
      } else {
        set({ currentSummary: 'No content available to summarize on this page.' })
      }
    } catch (error) {
      console.error('Failed to summarize page:', error)
      set({ currentSummary: 'Failed to analyze page content.' })
    } finally {
      set({ isLoading: false })
    }
  },

  sendChatMessage: async (message: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    }
    
    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isLoading: true
    }))

    try {
      let response = ''
      
      try {
        // Try to use Chrome's built-in Prompt API
        const win = window as unknown as AIWindow
        if (win.ai?.languageModel) {
          const session = await win.ai.languageModel.create({
            systemPrompt: `You are a helpful assistant that can answer questions about web pages. 
            The current page summary is: ${get().currentSummary || 'No summary available'}`
          })
          response = await session.prompt(message)
        } else {
          throw new Error('AI not available')
        }
      } catch (error) {
        console.warn('Chrome AI not available, using fallback response')
        // Fallback responses
        const fallbackResponses = [
          "I'd be happy to help! However, Chrome's built-in AI is not available right now. Please try again later.",
          "That's an interesting question! The AI features are currently being loaded. Please check back in a moment.",
          "I'm processing your request, but the AI service is temporarily unavailable. You can try refreshing the page."
        ]
        response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }

      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMessage],
        isLoading: false
      }))
    } catch (error) {
      console.error('Failed to send chat message:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: Date.now()
      }
      
      set((state) => ({
        chatMessages: [...state.chatMessages, errorMessage],
        isLoading: false
      }))
    }
  },

  clearChat: () => {
    set({ chatMessages: [] })
  }
}))