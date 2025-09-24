import React from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'outlined',
  size = 'medium',
  style,
  ...props
}) => {
  const getInputClasses = () => {
    const baseClasses = 'rounded-lg';
    
    const variantClasses = {
      default: 'border border-gray-300 bg-white',
      outlined: 'border-2 border-gray-300 bg-white focus:border-blue-500',
      filled: 'bg-gray-100 border-0'
    };
    
    const sizeClasses = {
      small: 'px-3 py-2 text-sm',
      medium: 'px-4 py-3 text-base',
      large: 'px-5 py-4 text-lg'
    };
    
    const errorClasses = error ? 'border-red-500' : '';
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses}`;
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-semibold mb-2 text-sm">
          {label}
        </Text>
      )}
      <TextInput
        className={getInputClasses()}
        style={style}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;