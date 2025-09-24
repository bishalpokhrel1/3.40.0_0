import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../shared/hooks/useAuth';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Card from '../../shared/components/Card';

export default function SignUpScreen() {
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSignUp = async () => {
    if (!email.trim() || !password.trim() || !displayName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, displayName);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Google Sign Up Failed', error.message);
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
        className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-6xl mb-4">🚀</Text>
            <Text className="text-4xl font-bold text-white mb-2">Get Started</Text>
            <Text className="text-white/80 text-lg text-center">
              Create your account and start managing your digital life
            </Text>
          </View>

          {/* Sign Up Form */}
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create Account
            </Text>

            <Input
              label="Full Name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your full name"
              autoComplete="name"
            />

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
              placeholder="Create a password"
              secureTextEntry
              autoComplete="password-new"
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              autoComplete="password-new"
            />

            <Button
              title="Create Account"
              onPress={handleEmailSignUp}
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
              onPress={handleGoogleSignUp}
              variant="outline"
              loading={googleLoading}
              disabled={loading}
            />
          </Card>

          {/* Sign In Link */}
          <View className="items-center">
            <Text className="text-white/80">
              Already have an account?{' '}
              <Link href="/(auth)/login" className="text-white font-semibold underline">
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}