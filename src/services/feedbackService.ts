
import { supabase } from '@/integrations/supabase/client';
import { FeedbackEntry } from '../types/feedback';

export const feedbackService = {
  // Fetch all feedback entries
  async getFeedback(): Promise<FeedbackEntry[]> {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }

    return data || [];
  },

  // Insert new feedback entry
  async addFeedback(feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>): Promise<FeedbackEntry> {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }

    return data;
  },

  // Subscribe to real-time changes
  subscribeToFeedback(callback: (payload: any) => void) {
    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback'
        },
        callback
      )
      .subscribe();

    return channel;
  }
};
