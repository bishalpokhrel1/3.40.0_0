import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storageService } from '../services/storageService';
import type { Task, Note } from '../types';

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedTasks, loadedNotes] = await Promise.all([
        storageService.getTasks(),
        storageService.getNotes()
      ]);
      
      setTasks(loadedTasks);
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const recentNotes = notes.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getTimeBasedGreeting()}!</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingTasks.length}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Total Notes</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.tasksButton]}
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={styles.actionButtonText}>📋 Manage Tasks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.notesButton]}
            onPress={() => navigation.navigate('Notes')}
          >
            <Text style={styles.actionButtonText}>📝 View Notes</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Tasks Preview */}
        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            {pendingTasks.slice(0, 3).map(task => (
              <View key={task.id} style={styles.taskPreview}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                {task.dueDate && (
                  <Text style={styles.taskDue}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Recent Notes Preview */}
        {recentNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Notes</Text>
            {recentNotes.map(note => (
              <View key={note.id} style={styles.notePreview}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteContent} numberOfLines={2}>
                  {note.content}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#3b82f6',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  tasksButton: {
    backgroundColor: '#3b82f6',
  },
  notesButton: {
    backgroundColor: '#f59e0b',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  taskPreview: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  taskDue: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  notePreview: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default DashboardScreen;