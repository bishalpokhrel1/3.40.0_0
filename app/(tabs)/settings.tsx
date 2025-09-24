import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../shared/hooks/useAuth';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

export default function SettingsScreen() {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [interests, setInterests] = useState(userProfile?.preferences?.interests?.join(', ') || '');
  const [notifications, setNotifications] = useState(userProfile?.preferences?.notifications ?? true);
  const [theme, setTheme] = useState(userProfile?.preferences?.theme || 'system');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const interestsArray = interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      await updateProfile({
        displayName,
        preferences: {
          interests: interestsArray,
          theme: theme as 'light' | 'dark' | 'system',
          notifications
        }
      });

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => signOut().catch((error: any) => 
            Alert.alert('Error', error.message)
          )
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-1">Settings</Text>
            <Text className="text-gray-600">Manage your account and preferences</Text>
          </View>

          {/* Profile Section */}
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <Text className="text-xl font-bold text-gray-800 mb-4">Profile</Text>
            
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
                <Text className="text-3xl">
                  {userProfile?.displayName?.charAt(0)?.toUpperCase() || '👤'}
                </Text>
              </View>
              <Text className="text-lg font-semibold text-gray-800">
                {userProfile?.displayName || 'User'}
              </Text>
              <Text className="text-gray-600">{user?.email}</Text>
            </View>

            <Input
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
            />

            <Input
              label="Interests (comma-separated)"
              value={interests}
              onChangeText={setInterests}
              placeholder="technology, science, business..."
              multiline
              numberOfLines={3}
            />

            <Button
              title="Save Profile"
              onPress={handleSaveProfile}
              loading={saving}
            />
          </Card>

          {/* Preferences Section */}
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <Text className="text-xl font-bold text-gray-800 mb-4">Preferences</Text>
            
            <View className="space-y-4">
              {/* Notifications */}
              <View className="flex-row items-center justify-between py-3">
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">Notifications</Text>
                  <Text className="text-gray-600 text-sm">
                    Receive updates about new content and tasks
                  </Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
                />
              </View>

              {/* Theme */}
              <View className="py-3">
                <Text className="text-gray-800 font-semibold mb-3">Theme</Text>
                <View className="flex-row space-x-2">
                  {(['light', 'dark', 'system'] as const).map((themeOption) => (
                    <Button
                      key={themeOption}
                      title={themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      onPress={() => setTheme(themeOption)}
                      variant={theme === themeOption ? 'primary' : 'outline'}
                      size="small"
                      style={{ flex: 1 }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </Card>

          {/* Account Section */}
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <Text className="text-xl font-bold text-gray-800 mb-4">Account</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600">Account created</Text>
                <Text className="text-gray-800 font-semibold">
                  {userProfile?.createdAt ? 
                    new Date(userProfile.createdAt).toLocaleDateString() : 
                    'Unknown'
                  }
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600">Last login</Text>
                <Text className="text-gray-800 font-semibold">
                  {userProfile?.lastLoginAt ? 
                    new Date(userProfile.lastLoginAt).toLocaleDateString() : 
                    'Unknown'
                  }
                </Text>
              </View>
            </View>
          </Card>

          {/* AI Features Section */}
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <Text className="text-xl font-bold text-gray-800 mb-4">AI Features</Text>
            
            <View className="bg-blue-50 p-4 rounded-lg mb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-blue-600 mr-2">✨</Text>
                <Text className="text-blue-800 font-semibold">Gemini Nano Integration</Text>
              </View>
              <Text className="text-blue-700 text-sm">
                AI-powered task suggestions and content analysis coming soon
              </Text>
            </View>
            
            <Button
              title="Test AI Assistant"
              onPress={() => Alert.alert('AI Assistant', 'AI features will be available soon!')}
              variant="outline"
            />
          </Card>

          {/* Sign Out */}
          <Card variant="outlined" padding="large">
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              variant="outline"
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}