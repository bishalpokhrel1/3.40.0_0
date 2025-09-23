import React, { useEffect } from 'react';
import { useSidePanelStore } from '../store/sidePanelStore';

export const AISummary: React.FC = () => {
  const { 
    currentSummary,
    error,
    isLoading,
    summarizePage
  } = useSidePanelStore();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'PAGE_CONTENT') {
        summarizePage();
      }
    });
  }, [summarizePage]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">AI Summary</h2>
      {isLoading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin h-5 w-5 border-2 border-current rounded-full border-t-transparent"></div>
          <span>Generating summary...</span>
        </div>
      )}
      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 text-blue-500 underline"
          >
            Retry
          </button>
        </div>
      )}
      {currentSummary && !isLoading && !error && (
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap">{currentSummary}</div>
        </div>
      )}
    </div>
  );
};