import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { ExternalLink, ThumbsUp, ThumbsDown, Clock, Tag, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const FeedGrid: React.FC = () => {
  const { 
    feedItems, 
    feedLoading, 
    userPreferences,
    rateFeedItem,
    setFeedLoading,
    setFeedItems
  } = useAppStore()

  useEffect(() => {
    // Load feed items on component mount
    loadFeedItems()
  }, [userPreferences.interests])

  const loadFeedItems = async () => {
    if (!userPreferences.feedEnabled) return
    
    setFeedLoading(true)
    
    try {
      // Send message to background script to fetch feeds
      const response = await chrome.runtime.sendMessage({
        action: 'fetchFeeds',
        interests: userPreferences.interests
      })
      
      if (response?.items) {
        setFeedItems(response.items)
      }
    } catch (error) {
      console.error('Failed to load feed items:', error)
      // Load mock data for demo
      loadMockFeedItems()
    } finally {
      setFeedLoading(false)
    }
  }

  const loadMockFeedItems = () => {
    const mockItems = [
      {
        id: '1',
        title: 'The Future of AI in Web Development',
        description: 'Exploring how artificial intelligence is revolutionizing the way we build and interact with websites.',
        url: 'https://example.com/ai-web-dev',
        source: 'TechCrunch',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'AI tools are transforming web development by automating code generation, improving user experience through personalization, and enabling more sophisticated interactions.',
        relevanceScore: 95,
        tags: ['AI', 'Web Development', 'Technology']
      },
      {
        id: '2',
        title: 'Chrome Extensions: Building for the Modern Web',
        description: 'A comprehensive guide to creating powerful Chrome extensions using Manifest V3.',
        url: 'https://example.com/chrome-extensions',
        source: 'Google Developers',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'Manifest V3 brings enhanced security and performance to Chrome extensions, with new APIs for better user privacy and improved extension capabilities.',
        relevanceScore: 88,
        tags: ['Chrome', 'Extensions', 'Development']
      },
      {
        id: '3',
        title: 'React 18: New Features and Performance Improvements',
        description: 'Deep dive into React 18\'s concurrent features and how they improve user experience.',
        url: 'https://example.com/react-18',
        source: 'React Blog',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'React 18 introduces concurrent rendering, automatic batching, and new hooks that make applications more responsive and efficient.',
        relevanceScore: 92,
        tags: ['React', 'JavaScript', 'Frontend']
      },
      {
        id: '4',
        title: 'The Rise of Edge Computing',
        description: 'How edge computing is changing the landscape of web applications and user experience.',
        url: 'https://example.com/edge-computing',
        source: 'Vercel',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'Edge computing brings computation closer to users, reducing latency and improving performance for web applications worldwide.',
        relevanceScore: 85,
        tags: ['Edge Computing', 'Performance', 'Infrastructure']
      },
      {
        id: '5',
        title: 'TypeScript Best Practices for Large Applications',
        description: 'Essential patterns and practices for maintaining TypeScript codebases at scale.',
        url: 'https://example.com/typescript-practices',
        source: 'Microsoft',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'Proper TypeScript architecture, strict type checking, and modular design patterns are key to building maintainable large-scale applications.',
        relevanceScore: 90,
        tags: ['TypeScript', 'Architecture', 'Best Practices']
      },
      {
        id: '6',
        title: 'Web Accessibility: Building Inclusive Experiences',
        description: 'Creating web applications that work for everyone, including users with disabilities.',
        url: 'https://example.com/web-accessibility',
        source: 'A11y Project',
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'Web accessibility ensures equal access to information and functionality for all users, improving usability and reaching wider audiences.',
        relevanceScore: 78,
        tags: ['Accessibility', 'UX', 'Inclusive Design']
      }
    ]
    
    setFeedItems(mockItems)
  }

  const handleRating = (itemId: string, rating: 'up' | 'down') => {
    rateFeedItem(itemId, rating)
  }

  const openArticle = (url: string) => {
    chrome.tabs.create({ url })
  }

  if (!userPreferences.feedEnabled) {
    return (
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Feed Disabled</h2>
        <p className="text-white/70">Enable the feed in settings to see curated articles.</p>
      </div>
    )
  }

  if (feedLoading) {
    return (
      <div className="glass-card p-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-white text-lg">Loading your personalized feed...</span>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="feed-card p-0">
              <div className="h-48 bg-gray-200 shimmer" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded shimmer" />
                <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
                <div className="h-3 bg-gray-200 rounded w-1/2 shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">
          <Sparkles className="w-6 h-6" />
          <span>Your Curated Feed</span>
        </h2>
        <button
          onClick={loadFeedItems}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {feedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-white mb-2">No articles yet</h3>
          <p className="text-white/70 mb-4">
            We're curating articles based on your interests: {userPreferences.interests.join(', ')}
          </p>
          <button
            onClick={loadFeedItems}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Load Articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feed-card group cursor-pointer"
              onClick={() => openArticle(item.url)}
            >
              {/* Article Image */}
              {item.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-4">
                {/* Relevance Score & Tags */}
                <div className="flex items-center justify-between mb-3">
                  {item.relevanceScore && (
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        {item.relevanceScore}% match
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {/* AI Summary */}
                {item.aiSummary && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-1 mb-1">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-medium text-blue-600">AI Summary</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.aiSummary}
                    </p>
                  </div>
                )}

                {/* Source & Tags */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.tags.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRating(item.id, 'up')
                      }}
                      className={`p-1 rounded transition-colors ${
                        item.userRating === 'up'
                          ? 'text-green-600 bg-green-100'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRating(item.id, 'down')
                      }}
                      className={`p-1 rounded transition-colors ${
                        item.userRating === 'down'
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  )
}

export default FeedGrid