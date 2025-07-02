
export interface FeedbackEntry {
  id: string; // Changed from number to string (UUID)
  type: 'takeaway' | 'rating' | 'question';
  comment: string | null;
  score: number | null;
  timestamp: string;
}
