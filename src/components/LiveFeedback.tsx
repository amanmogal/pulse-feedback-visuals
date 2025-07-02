
import React from 'react';
import { FeedbackEntry } from '../types/feedback';

interface LiveFeedbackProps {
  data: FeedbackEntry[];
}

const LiveFeedback: React.FC<LiveFeedbackProps> = ({ data }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'takeaway':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rating':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'question':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center font-brockmann">
          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
          Live Feedback
        </h2>
        <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-inter font-medium">
          {data.length} entries
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {data.length === 0 ? (
          <div className="flex items-center justify-center min-h-[200px] text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <p className="text-sm font-inter font-medium">No feedback entries yet...</p>
              <p className="text-xs text-gray-400 mt-1 font-inter">Real-time updates will appear here</p>
            </div>
          </div>
        ) : (
          data.map((entry, index) => (
            <div 
              key={entry.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-200 animate-fadein"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border font-inter ${getTypeColor(entry.type)}`}>
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500 font-inter">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 font-inter">
                {entry.type === 'rating' ? (
                  <div className="flex items-center space-x-2">
                    <span>Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-4 h-4 rounded-sm ${
                            star <= (entry.score || 0) 
                              ? 'bg-orange-400' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-orange-600 font-medium">({entry.score}/5)</span>
                  </div>
                ) : (
                  <p className="leading-relaxed">{entry.comment}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgb(243 244 246);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgb(251 146 60);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgb(249 115 22);
          }
          
          @keyframes fadein {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadein {
            animation: fadein 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default LiveFeedback;
