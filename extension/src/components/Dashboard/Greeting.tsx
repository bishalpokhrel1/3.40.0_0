import React from 'react';
import { useAppStore } from '../../store/appStore';

/**
 * Displays a time-based greeting to the user
 */
const Greeting: React.FC = () => {
  const { preferences } = useAppStore();

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const userName = preferences.name || 'there';

  return (
    <h1 className="text-4xl font-bold text-gray-800 mb-2">
      {getTimeBasedGreeting()}, {userName}!
    </h1>
  );
};

export default Greeting;