import React, { useState, useEffect } from 'react';
import LiveFeedback from '../components/LiveFeedback';
import SessionRatings from '../components/SessionRatings';
import KeyTakeaways from '../components/KeyTakeaways';
import { FeedbackEntry } from '../types/feedback';
import { feedbackService } from '../services/feedbackService';
import { supabase } from '../integrations/supabase/client';

const Index = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data
    const loadFeedback = async () => {
      try {
        const data = await feedbackService.getFeedback();
        setFeedbackData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load feedback:', err);
        setError('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();

    // Set up real-time subscription
    const channel = feedbackService.subscribeToFeedback((payload) => {
      console.log('Real-time update:', payload);
      
      if (payload.eventType === 'INSERT') {
        setFeedbackData(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setFeedbackData(prev => 
          prev.map(item => 
            item.id === payload.new.id ? payload.new : item
          )
        );
      } else if (payload.eventType === 'DELETE') {
        setFeedbackData(prev => 
          prev.filter(item => item.id !== payload.old.id)
        );
      }
    });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-400 mb-2">Error Loading Data</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
