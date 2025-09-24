import { Redirect } from 'expo-router';
import { useAuth } from '../shared/hooks/useAuth';
import LoadingSpinner from '../shared/components/LoadingSpinner';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner overlay />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}