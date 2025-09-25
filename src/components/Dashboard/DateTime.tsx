import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

/**
 * Displays current date and time with live updates
 */
const DateTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center space-x-6 text-gray-600">
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <span className="text-lg font-medium">{formatDate(currentTime)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5" />
        <span className="text-lg font-mono">{formatTime(currentTime)}</span>
      </div>
    </div>
  );
};

export default DateTime;