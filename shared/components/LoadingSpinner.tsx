import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#3B82F6',
  overlay = false
}) => {
  if (overlay) {
    return (
      <View className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
        <View className="bg-white rounded-lg p-6">
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex items-center justify-center p-8">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingSpinner;