import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-lg flex-row items-center justify-center';
    
    const variantClasses = {
      primary: 'bg-blue-600 active:bg-blue-700',
      secondary: 'bg-gray-600 active:bg-gray-700',
      outline: 'border-2 border-blue-600 bg-transparent active:bg-blue-50'
    };
    
    const sizeClasses = {
      small: 'px-3 py-2',
      medium: 'px-4 py-3',
      large: 'px-6 py-4'
    };
    
    const disabledClasses = disabled || loading ? 'opacity-50' : '';
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-semibold text-center';
    
    const variantClasses = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-blue-600'
    };
    
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#2563eb' : '#ffffff'} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text className={getTextClasses()} style={textStyle}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;