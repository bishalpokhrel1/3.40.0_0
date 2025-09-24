import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../shared/hooks/useAuth';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Card from '../../shared/components/Card';

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-6xl mb-4">✨</Text>
            <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
            <Text className="text-white/80 text-lg text-center">
              Sign in to continue to your personalized dashboard
            </Text>
          </View>

          {/* Login Form */}
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Sign In
            </Text>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoComplete="password"
            />

            <Button
              title="Sign In"
              onPress={handleEmailSignIn}
              loading={loading}
              disabled={googleLoading}
              style={{ marginBottom: 16 }}
            />

            <View className="flex-row items-center mb-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 font-medium">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="outline"
              loading={googleLoading}
              disabled={loading}
            />
          </Card>

          {/* Sign Up Link */}
          <View className="items-center">
            <Text className="text-white/80">
              Don't have an account?{' '}
              <Link href="/(auth)/signup" className="text-white font-semibold underline">
                Sign Up
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}