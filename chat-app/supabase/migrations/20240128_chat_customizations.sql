-- Migration: Chat Customizations
-- Description: Per-chat personalization (wallpaper, bubble style, accent color)
-- Date: 2024-01-28

-- Create chat_customizations table
CREATE TABLE IF NOT EXISTS chat_customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  
  -- Wallpaper settings
  wallpaper_type TEXT DEFAULT 'none' CHECK (wallpaper_type IN ('none', 'gradient', 'texture', 'custom')),
  wallpaper_value TEXT, -- gradient name, texture name, or storage URL
  wallpaper_dim INTEGER DEFAULT 0 CHECK (wallpaper_dim BETWEEN 0 AND 40),
  wallpaper_blur INTEGER DEFAULT 0 CHECK (wallpaper_blur BETWEEN 0 AND 10),
  
  -- Bubble style
  bubble_style TEXT DEFAULT 'elevated' CHECK (bubble_style IN ('soft', 'flat', 'elevated')),
  
  -- Accent color (very subtle)
  accent_color TEXT, -- hex color (e.g., #007AFF)
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one customization per user per chat
  UNIQUE(user_id, chat_id)
);

-- Create index for faster lookups
CREATE INDEX idx_chat_customizations_user_chat ON chat_customizations(user_id, chat_id);

-- Enable RLS
ALTER TABLE chat_customizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only manage their own customizations
CREATE POLICY "Users can view own customizations"
  ON chat_customizations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customizations"
  ON chat_customizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customizations"
  ON chat_customizations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customizations"
  ON chat_customizations FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_customizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER chat_customizations_updated_at
  BEFORE UPDATE ON chat_customizations
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_customizations_updated_at();
