
import React, { useState, useEffect } from 'react';
import LiveFeedback from '../components/LiveFeedback';
import SessionRatings from '../components/SessionRatings';
import KeyTakeaways from '../components/KeyTakeaways';

// Mock data types
export interface FeedbackEntry {
  id: number;
  type: 'takeaway' | 'rating' | 'question';
  comment: string | null;
  score: number | null;
  timestamp: string;
}

const Index = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackEntry[]>([
    {
      id: 1,
      type: 'takeaway',
      comment: 'Great insights on user experience design patterns and modern accessibility standards',
      score: null,
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 2,
      type: 'rating',
      comment: null,
      score: 5,
      timestamp: new Date(Date.now() - 240000).toISOString()
    },
    {
      id: 3,
      type: 'question',
      comment: 'How do you handle state management in large React applications?',
      score: null,
      timestamp: new Date(Date.now() - 180000).toISOString()
    },
    {
      id: 4,
      type: 'rating',
      comment: null,
      score: 4,
      timestamp: new Date(Date.now() - 120000).toISOString()
    },
    {
      id: 5,
      type: 'takeaway',
      comment: 'Performance optimization techniques using React Query and caching strategies',
      score: null,
      timestamp: new Date(Date.now() - 60000).toISOString()
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const mockEntries = [
        {
          type: 'takeaway' as const,
          comment: 'Excellent presentation on modern web development best practices',
          score: null
        },
        {
          type: 'rating' as const,
          comment: null,
          score: Math.floor(Math.random() * 5) + 1
        },
        {
          type: 'question' as const,
          comment: 'What are your thoughts on the future of AI in web development?',
          score: null
        },
        {
          type: 'takeaway' as const,
          comment: 'Valuable insights about component architecture and scalability',
          score: null
        },
        {
          type: 'rating' as const,
          comment: null,
          score: Math.floor(Math.random() * 5) + 1
        }
      ];

      const randomEntry = mockEntries[Math.floor(Math.random() * mockEntries.length)];
      const newEntry: FeedbackEntry = {
        id: Date.now(),
        type: randomEntry.type,
        comment: randomEntry.comment,
        score: randomEntry.score,
        timestamp: new Date().toISOString()
      };

      setFeedbackData(prev => [newEntry, ...prev].slice(0, 20)); // Keep only latest 20 entries
    }, 3000); // Add new entry every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Event Pulse
            </h1>
            <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              Live Dashboard
            </span>
          </div>
          <p className="text-slate-400 mt-2">Real-time feedback analytics and session insights</p>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Live Feedback - Takes up more space on large screens */}
          <div className="xl:col-span-5">
            <LiveFeedback data={feedbackData} />
          </div>
          
          {/* Session Ratings */}
          <div className="xl:col-span-4">
            <SessionRatings data={feedbackData} />
          </div>
          
          {/* Key Takeaways */}
          <div className="xl:col-span-3">
            <KeyTakeaways data={feedbackData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
