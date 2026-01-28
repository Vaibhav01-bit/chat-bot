-- Migration: Saved Messages (Memories)
-- Description: Private message saving feature
-- Date: 2024-01-28

-- Create saved_messages table
CREATE TABLE IF NOT EXISTS saved_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  
  -- Cached message data (preserved even if original is deleted)
  message_content TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name TEXT,
  chat_name TEXT,
  original_timestamp TIMESTAMPTZ,
  
  -- Metadata
  is_available BOOLEAN DEFAULT true, -- false if original message was deleted
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one save per user per message
  UNIQUE(user_id, message_id)
);

-- Create indexes for faster queries
CREATE INDEX idx_saved_messages_user ON saved_messages(user_id, saved_at DESC);
CREATE INDEX idx_saved_messages_chat ON saved_messages(user_id, chat_id, saved_at DESC);
CREATE INDEX idx_saved_messages_message ON saved_messages(message_id);

-- Enable RLS
ALTER TABLE saved_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Completely private - users can only see their own saved messages
CREATE POLICY "Users can view own saved messages"
  ON saved_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved messages"
  ON saved_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved messages"
  ON saved_messages FOR DELETE
  USING (auth.uid() = user_id);

-- Function to mark saved message as unavailable when original is deleted
CREATE OR REPLACE FUNCTION mark_saved_message_unavailable()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE saved_messages
  SET is_available = false
  WHERE message_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to mark saved messages as unavailable when original message is deleted
CREATE TRIGGER message_deleted_mark_unavailable
  BEFORE DELETE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION mark_saved_message_unavailable();
