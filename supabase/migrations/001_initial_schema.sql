-- ============================================
-- Announcements Board Schema
-- ============================================

-- Announcements table
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  is_pinned boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  email_sent boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Subscribers table
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_announcements_published ON announcements (is_published, is_pinned DESC, published_at DESC);
CREATE INDEX idx_announcements_category ON announcements (category) WHERE is_published = true;
CREATE INDEX idx_subscribers_active ON subscribers (is_active) WHERE is_active = true;
CREATE INDEX idx_subscribers_token ON subscribers (unsubscribe_token);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Announcements: anyone can read published
CREATE POLICY "Public can read published announcements"
  ON announcements FOR SELECT
  TO anon
  USING (is_published = true);

-- Announcements: authenticated can read all
CREATE POLICY "Admins can read all announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

-- Announcements: authenticated can insert
CREATE POLICY "Admins can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Announcements: authenticated can update
CREATE POLICY "Admins can update announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Announcements: authenticated can delete
CREATE POLICY "Admins can delete announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (true);

-- Subscribers: anyone can insert (subscribe)
CREATE POLICY "Public can subscribe"
  ON subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Subscribers: authenticated can read all
CREATE POLICY "Admins can read subscribers"
  ON subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Subscribers: authenticated can update
CREATE POLICY "Admins can update subscribers"
  ON subscribers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Subscribers: authenticated can delete
CREATE POLICY "Admins can delete subscribers"
  ON subscribers FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Unsubscribe RPC (SECURITY DEFINER bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION unsubscribe(token uuid)
RETURNS void AS $$
  UPDATE subscribers SET is_active = false WHERE unsubscribe_token = token;
$$ LANGUAGE sql SECURITY DEFINER;
