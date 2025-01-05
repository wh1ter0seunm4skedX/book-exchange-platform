/*
  # Initial Schema for Scaffold Book Exchange

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `description` (text)
      - `condition` (text)
      - `image_url` (text)
      - `user_id` (uuid, foreign key)
      - `is_available` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `books` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  condition text NOT NULL,
  image_url text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow users to read all available books
CREATE POLICY "Anyone can view available books"
  ON books
  FOR SELECT
  USING (true);

-- Allow authenticated users to create books
CREATE POLICY "Users can create books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own books
CREATE POLICY "Users can update own books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own books
CREATE POLICY "Users can delete own books"
  ON books
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);