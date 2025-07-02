
import React from 'react';
import { FeedbackEntry } from '../pages/Index';

interface LiveFeedbackProps {
  data: FeedbackEntry[];
}

const LiveFeedback: React.FC<LiveFeedbackProps> = ({ data }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'takeaway':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'rating':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'question':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
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
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
          Live Feedback
        </h2>
        <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
          {data.length} entries
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {data.map((entry, index) => (
          <div 
            key={entry.id}
            className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 animate-fadein"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(entry.type)}`}>
                {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
              </span>
              <span className="text-xs text-slate-400">
                {formatTime(entry.timestamp)}
              </span>
            </div>
            
            <div className="text-sm text-slate-300">
              {entry.type === 'rating' ? (
                <div className="flex items-center space-x-2">
                  <span>Rating:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 rounded-sm ${
                          star <= (entry.score || 0) 
                            ? 'bg-yellow-400' 
                            : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-medium">({entry.score}/5)</span>
                </div>
              ) : (
                <p className="leading-relaxed">{entry.comment}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgb(51 65 85);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgb(100 116 139);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgb(148 163 184);
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
