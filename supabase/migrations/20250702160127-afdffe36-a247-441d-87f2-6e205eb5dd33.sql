
-- Create the feedback table with the specified schema
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('takeaway', 'rating', 'question')),
  comment TEXT,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public access for reading (since this is a public feedback system)
CREATE POLICY "Anyone can view feedback" ON public.feedback
  FOR SELECT USING (true);

-- Create a policy that allows public access for inserting feedback
CREATE POLICY "Anyone can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Enable real-time functionality for live updates
ALTER TABLE public.feedback REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;
