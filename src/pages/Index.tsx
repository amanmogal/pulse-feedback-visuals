
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-inter">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-2 font-semibold">Error Loading Data</p>
          <p className="text-gray-600 text-sm font-inter">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="border-b border-orange-100 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent font-brockmann">
              Event Pulse
            </h1>
            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-inter">
              Live Dashboard
            </span>
          </div>
          <p className="text-gray-600 mt-2 font-inter">Real-time feedback analytics and session insights</p>
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
