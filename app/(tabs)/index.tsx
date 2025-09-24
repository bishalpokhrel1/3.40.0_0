import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../shared/hooks/useAuth';
import { useTasks } from '../../shared/hooks/useTasks';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

export default function DashboardScreen() {
  const { user, userProfile } = useAuth();
  const { tasks } = useTasks(user?.uid || null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');

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
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              {getGreeting()}, {userProfile?.displayName || user?.displayName || 'there'}!
            </Text>
            <Text className="text-gray-600 text-lg">
              Here's what's happening today
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="grid grid-cols-2 gap-4 mb-8">
            <Card variant="elevated" padding="medium">
              <View className="items-center">
                <Text className="text-3xl font-bold text-blue-600 mb-1">
                  {pendingTasks.length}
                </Text>
                <Text className="text-gray-600 font-semibold">Pending Tasks</Text>
              </View>
            </Card>

            <Card variant="elevated" padding="medium">
              <View className="items-center">
                <Text className="text-3xl font-bold text-green-600 mb-1">
                  {completedTasks.length}
                </Text>
                <Text className="text-gray-600 font-semibold">Completed</Text>
              </View>
            </Card>
          </View>

          {/* High Priority Tasks */}
          {highPriorityTasks.length > 0 && (
            <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">🔥</Text>
                <Text className="text-xl font-bold text-gray-800">High Priority</Text>
              </View>
              
              <View className="space-y-3">
                {highPriorityTasks.slice(0, 3).map((task) => (
                  <View key={task.id} className="flex-row items-center p-3 bg-red-50 rounded-lg">
                    <View className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                    <Text className="flex-1 font-semibold text-gray-800">
                      {task.title}
                    </Text>
                  </View>
                ))}
              </View>
              
              {highPriorityTasks.length > 3 && (
                <Text className="text-gray-500 text-sm mt-3 text-center">
                  +{highPriorityTasks.length - 3} more high priority tasks
                </Text>
              )}
            </Card>
          )}

          {/* Recent Activity */}
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">📊</Text>
              <Text className="text-xl font-bold text-gray-800">Today's Progress</Text>
            </View>
            
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-semibold">Tasks Completed</Text>
                <Text className="text-2xl font-bold text-green-600">
                  {completedTasks.filter(task => 
                    new Date(task.updatedAt).toDateString() === new Date().toDateString()
                  ).length}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-semibold">Productivity Score</Text>
                <Text className="text-2xl font-bold text-blue-600">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </Text>
              </View>
            </View>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated" padding="large">
            <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
            
            <View className="space-y-3">
              <Button
                title="Add New Task"
                onPress={() => {/* Navigate to add task */}}
                variant="primary"
              />
              
              <Button
                title="View All Tasks"
                onPress={() => {/* Navigate to tasks */}}
                variant="outline"
              />
              
              <Button
                title="AI Assistant"
                onPress={() => {/* Open AI assistant */}}
                variant="secondary"
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}