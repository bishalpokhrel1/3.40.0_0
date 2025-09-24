import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style
}) => {
  const getCardClasses = () => {
    const baseClasses = 'rounded-xl';
    
    const variantClasses = {
      default: 'bg-white',
      elevated: 'bg-white shadow-lg',
      outlined: 'bg-white border border-gray-200'
    };
    
    const paddingClasses = {
      none: '',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6'
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]}`;
  };

  return (
    <View className={getCardClasses()} style={style}>
      {children}
    </View>
  );
};

export default Card;