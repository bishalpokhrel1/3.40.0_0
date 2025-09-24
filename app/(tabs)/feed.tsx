import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../shared/hooks/useAuth';
import { feedService, FeedItem } from '../../shared/services/feedService';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

export default function FeedScreen() {
  const { user, userProfile } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeedItems();
  }, [user, userProfile]);

  const loadFeedItems = async () => {
    if (!user || !userProfile?.preferences?.interests) {
      setLoading(false);
      return;
    }

    try {
      // For demo, use mock data
      const mockItems = await feedService.generateMockFeedItems(
        user.uid, 
        userProfile.preferences.interests
      );
      
      const itemsWithUserId = mockItems.map(item => ({
        ...item,
        id: `mock_${Date.now()}_${Math.random()}`,
        userId: user.uid
      }));
      
      setFeedItems(itemsWithUserId);
    } catch (error) {
      console.error('Failed to load feed items:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedItems();
    setRefreshing(false);
  };

  const handleRateItem = async (itemId: string, rating: 'up' | 'down') => {
    try {
      await feedService.rateFeedItem(itemId, rating);
      setFeedItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, userRating: rating } : item
        )
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleOpenArticle = (url: string) => {
    Linking.openURL(url).catch(error => 
      console.error('Failed to open URL:', error)
    );
  };

  if (loading) {
    return <LoadingSpinner overlay />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-3xl font-bold text-gray-800 mb-1">Your Feed</Text>
              <Text className="text-gray-600">
                Personalized content based on your interests
              </Text>
            </View>
            <Button
              title="Refresh"
              onPress={onRefresh}
              size="small"
              variant="outline"
            />
          </View>

          {/* Feed Items */}
          {feedItems.length > 0 ? (
            <View className="space-y-6">
              {feedItems.map((item) => (
                <Card key={item.id} variant="elevated" padding="none">
                  <TouchableOpacity
                    onPress={() => handleOpenArticle(item.url)}
                    activeOpacity={0.8}
                  >
                    {/* Article Image */}
                    {item.imageUrl && (
                      <View className="h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                        {/* In a real app, you'd use Image component here */}
                        <View className="flex-1 items-center justify-center">
                          <Text className="text-gray-500">📷 Image</Text>
                        </View>
                      </View>
                    )}
                    
                    <View className="p-6">
                      {/* Header */}
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-sm font-semibold text-blue-600">
                          {item.source}
                        </Text>
                        {item.relevanceScore && (
                          <View className="bg-blue-100 px-2 py-1 rounded-full">
                            <Text className="text-blue-800 text-xs font-bold">
                              {item.relevanceScore}% match
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      {/* Title */}
                      <Text className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                        {item.title}
                      </Text>
                      
                      {/* AI Summary */}
                      {item.aiSummary && (
                        <View className="bg-blue-50 p-3 rounded-lg mb-3">
                          <View className="flex-row items-center mb-2">
                            <Text className="text-blue-600 mr-1">✨</Text>
                            <Text className="text-blue-800 font-semibold text-xs uppercase tracking-wide">
                              AI Summary
                            </Text>
                          </View>
                          <Text className="text-blue-700 text-sm leading-relaxed">
                            {item.aiSummary}
                          </Text>
                        </View>
                      )}
                      
                      {/* Description */}
                      <Text className="text-gray-600 mb-4 leading-relaxed">
                        {item.description}
                      </Text>
                      
                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <View className="flex-row flex-wrap mb-4">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-2">
                              <Text className="text-gray-700 text-xs font-medium">
                                {tag}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                      
                      {/* Actions */}
                      <View className="flex-row items-center justify-between pt-4 border-t border-gray-200">
                        <View className="flex-row space-x-3">
                          <Button
                            title={item.userRating === 'up' ? '👍' : '👍🏻'}
                            onPress={() => handleRateItem(item.id!, 'up')}
                            variant={item.userRating === 'up' ? 'primary' : 'outline'}
                            size="small"
                          />
                          <Button
                            title={item.userRating === 'down' ? '👎' : '👎🏻'}
                            onPress={() => handleRateItem(item.id!, 'down')}
                            variant={item.userRating === 'down' ? 'secondary' : 'outline'}
                            size="small"
                          />
                        </View>
                        
                        <Text className="text-gray-500 text-xs">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          ) : (
            <Card variant="elevated" padding="large">
              <View className="items-center py-8">
                <Text className="text-6xl mb-4">📰</Text>
                <Text className="text-xl font-bold text-gray-800 mb-2">No articles yet</Text>
                <Text className="text-gray-600 text-center mb-6">
                  We're curating content based on your interests. Check back soon!
                </Text>
                <Button
                  title="Refresh Feed"
                  onPress={onRefresh}
                />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}