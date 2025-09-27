import React from 'react';

const FeedGrid = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-white font-semibold mb-4">Activity Feed</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-white/80 text-sm">Welcome to your dashboard!</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          <span className="text-white/80 text-sm">Ready to get organized?</span>
        </div>
      </div>
    </div>
  );
};

export default FeedGrid;
