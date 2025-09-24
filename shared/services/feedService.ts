import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface FeedItem {
  id?: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  aiSummary?: string;
  relevanceScore?: number;
  tags?: string[];
  userId: string;
  userRating?: 'up' | 'down';
  bookmarked?: boolean;
  readAt?: string;
}

export interface FeedPreferences {
  interests: string[];
  sources: string[];
  excludedSources: string[];
  minRelevanceScore: number;
}

class FeedService {
  private readonly COLLECTION_NAME = 'feedItems';
  private readonly USER_FEED_COLLECTION = 'userFeeds';

  // Fetch personalized feed for user
  async getPersonalizedFeed(userId: string, preferences: FeedPreferences): Promise<FeedItem[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('relevanceScore', '>=', preferences.minRelevanceScore),
        orderBy('relevanceScore', 'desc'),
        orderBy('publishedAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const feedItems: FeedItem[] = [];
      
      querySnapshot.forEach((doc) => {
        feedItems.push({
          id: doc.id,
          ...doc.data()
        } as FeedItem);
      });
      
      return feedItems;
    } catch (error) {
      console.error('Error getting personalized feed:', error);
      throw error;
    }
  }

  // Add feed item to user's feed
  async addFeedItem(userId: string, feedItem: Omit<FeedItem, 'id' | 'userId'>): Promise<string> {
    try {
      const item: Omit<FeedItem, 'id'> = {
        ...feedItem,
        userId
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), item);
      return docRef.id;
    } catch (error) {
      console.error('Error adding feed item:', error);
      throw error;
    }
  }

  // Rate a feed item
  async rateFeedItem(itemId: string, rating: 'up' | 'down'): Promise<void> {
    try {
      const itemRef = doc(db, this.COLLECTION_NAME, itemId);
      await updateDoc(itemRef, {
        userRating: rating,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error rating feed item:', error);
      throw error;
    }
  }

  // Bookmark a feed item
  async bookmarkFeedItem(itemId: string, bookmarked: boolean): Promise<void> {
    try {
      const itemRef = doc(db, this.COLLECTION_NAME, itemId);
      await updateDoc(itemRef, {
        bookmarked,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error bookmarking feed item:', error);
      throw error;
    }
  }

  // Mark item as read
  async markAsRead(itemId: string): Promise<void> {
    try {
      const itemRef = doc(db, this.COLLECTION_NAME, itemId);
      await updateDoc(itemRef, {
        readAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking item as read:', error);
      throw error;
    }
  }

  // Get bookmarked items
  async getBookmarkedItems(userId: string): Promise<FeedItem[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('bookmarked', '==', true),
        orderBy('publishedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const feedItems: FeedItem[] = [];
      
      querySnapshot.forEach((doc) => {
        feedItems.push({
          id: doc.id,
          ...doc.data()
        } as FeedItem);
      });
      
      return feedItems;
    } catch (error) {
      console.error('Error getting bookmarked items:', error);
      throw error;
    }
  }

  // Subscribe to real-time feed updates
  subscribeToFeed(userId: string, callback: (items: FeedItem[]) => void): () => void {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('publishedAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (querySnapshot) => {
      const feedItems: FeedItem[] = [];
      querySnapshot.forEach((doc) => {
        feedItems.push({
          id: doc.id,
          ...doc.data()
        } as FeedItem);
      });
      callback(feedItems);
    });
  }

  // Generate mock feed items for demo
  async generateMockFeedItems(userId: string, interests: string[]): Promise<FeedItem[]> {
    const mockItems: Omit<FeedItem, 'id' | 'userId'>[] = [
      {
        title: 'The Future of AI in Mobile Development',
        description: 'Exploring how artificial intelligence is revolutionizing mobile app development with React Native and Expo.',
        url: 'https://example.com/ai-mobile-dev',
        source: 'React Native Blog',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'AI integration in mobile development is becoming more accessible with tools like Expo and React Native, enabling developers to create intelligent apps with minimal setup.',
        relevanceScore: 95,
        tags: ['AI', 'Mobile Development', 'React Native']
      },
      {
        title: 'Firebase vs Supabase: Choosing the Right Backend',
        description: 'A comprehensive comparison of Firebase and Supabase for modern app development.',
        url: 'https://example.com/firebase-vs-supabase',
        source: 'Dev.to',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'Both Firebase and Supabase offer powerful backend solutions, with Firebase providing mature ecosystem and Supabase offering open-source flexibility.',
        relevanceScore: 88,
        tags: ['Firebase', 'Backend', 'Development']
      },
      {
        title: 'Cross-Platform Development with Expo Router',
        description: 'Building navigation that works seamlessly across mobile and web platforms.',
        url: 'https://example.com/expo-router',
        source: 'Expo Blog',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
        aiSummary: 'Expo Router simplifies navigation in cross-platform apps, providing file-based routing similar to Next.js but for React Native.',
        relevanceScore: 92,
        tags: ['Expo', 'Navigation', 'Cross-Platform']
      }
    ];

    // Filter items based on interests
    const relevantItems = mockItems.filter(item => 
      item.tags?.some(tag => 
        interests.some(interest => 
          tag.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );

    return relevantItems.length > 0 ? relevantItems : mockItems;
  }
}

export const feedService = new FeedService();
export default feedService;