import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../shared/hooks/useAuth';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner overlay />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8fafc' }
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}