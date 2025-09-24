import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../shared/hooks/useAuth';
import { useTasks } from '../../shared/hooks/useTasks';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

export default function TasksScreen() {
  const { user } = useAuth();
  const { tasks, loading, createTask, toggleTask, deleteTask } = useTasks(user?.uid || null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Tasks are automatically updated via real-time subscription
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await createTask({
        title: newTaskTitle,
        description: newTaskDescription || undefined,
        completed: false,
        priority: newTaskPriority
      });

      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setShowAddTask(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTask(taskId).catch((error: any) => 
            Alert.alert('Error', error.message)
          )
        }
      ]
    );
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Text className="text-3xl font-bold text-gray-800 mb-1">Tasks</Text>
              <Text className="text-gray-600">
                {pendingTasks.length} pending, {completedTasks.length} completed
              </Text>
            </View>
            <Button
              title="Add Task"
              onPress={() => setShowAddTask(!showAddTask)}
              size="small"
            />
          </View>

          {/* Add Task Form */}
          {showAddTask && (
            <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
              <Text className="text-xl font-bold text-gray-800 mb-4">Add New Task</Text>
              
              <Input
                label="Task Title"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="What needs to be done?"
              />
              
              <Input
                label="Description (Optional)"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholder="Add more details..."
                multiline
                numberOfLines={3}
              />
              
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-sm">Priority</Text>
                <View className="flex-row space-x-2">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <Button
                      key={priority}
                      title={priority.charAt(0).toUpperCase() + priority.slice(1)}
                      onPress={() => setNewTaskPriority(priority)}
                      variant={newTaskPriority === priority ? 'primary' : 'outline'}
                      size="small"
                      style={{ flex: 1 }}
                    />
                  ))}
                </View>
              </View>
              
              <View className="flex-row space-x-3">
                <Button
                  title="Add Task"
                  onPress={handleAddTask}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowAddTask(false)}
                  variant="outline"
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          )}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Pending Tasks ({pendingTasks.length})
              </Text>
              
              <View className="space-y-3">
                {pendingTasks.map((task) => (
                  <Card key={task.id} variant="elevated" padding="medium">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 mr-4">
                        <View className="flex-row items-center mb-2">
                          <Text className="text-lg font-semibold text-gray-800 flex-1">
                            {task.title}
                          </Text>
                          <Text className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </Text>
                        </View>
                        
                        {task.description && (
                          <Text className="text-gray-600 mb-2">
                            {task.description}
                          </Text>
                        )}
                        
                        {task.aiSuggestions && task.aiSuggestions.length > 0 && (
                          <View className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <Text className="text-blue-800 font-semibold text-sm mb-2">
                              ✨ AI Suggestions:
                            </Text>
                            {task.aiSuggestions.slice(0, 2).map((suggestion, index) => (
                              <Text key={index} className="text-blue-700 text-sm mb-1">
                                • {suggestion}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                      
                      <View className="space-y-2">
                        <Button
                          title="✓"
                          onPress={() => handleToggleTask(task.id!)}
                          variant="outline"
                          size="small"
                        />
                        <Button
                          title="🗑"
                          onPress={() => handleDeleteTask(task.id!)}
                          variant="outline"
                          size="small"
                        />
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Completed Tasks ({completedTasks.length})
              </Text>
              
              <View className="space-y-3">
                {completedTasks.slice(0, 5).map((task) => (
                  <Card key={task.id} variant="outlined" padding="medium">
                    <View className="flex-row items-center justify-between opacity-60">
                      <View className="flex-1 mr-4">
                        <Text className="text-lg font-semibold text-gray-800 line-through">
                          {task.title}
                        </Text>
                        {task.description && (
                          <Text className="text-gray-600 text-sm line-through">
                            {task.description}
                          </Text>
                        )}
                      </View>
                      
                      <View className="space-y-2">
                        <Button
                          title="↶"
                          onPress={() => handleToggleTask(task.id!)}
                          variant="outline"
                          size="small"
                        />
                        <Button
                          title="🗑"
                          onPress={() => handleDeleteTask(task.id!)}
                          variant="outline"
                          size="small"
                        />
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
              
              {completedTasks.length > 5 && (
                <Text className="text-gray-500 text-center mt-3">
                  +{completedTasks.length - 5} more completed tasks
                </Text>
              )}
            </View>
          )}

          {/* Empty State */}
          {tasks.length === 0 && !loading && (
            <Card variant="elevated" padding="large">
              <View className="items-center py-8">
                <Text className="text-6xl mb-4">📝</Text>
                <Text className="text-xl font-bold text-gray-800 mb-2">No tasks yet</Text>
                <Text className="text-gray-600 text-center mb-6">
                  Create your first task to get started with productivity tracking
                </Text>
                <Button
                  title="Add Your First Task"
                  onPress={() => setShowAddTask(true)}
                />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}