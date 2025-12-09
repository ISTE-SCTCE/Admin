-- Supabase Database Schema for Admin Panel
-- Run this in Supabase SQL Editor

-- 1. Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create files table
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create members table
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL,
  joined_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  "from" INTEGER NOT NULL,
  "to" INTEGER NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Insert default admin user
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@admin.com', 'admin', 'Admin');

-- Optional: Insert sample data for testing
-- Uncomment if you want sample data

-- INSERT INTO members (name, email, phone, status, joined_date) VALUES
--   ('John Doe', 'john@example.com', '123-456-7890', 'active', '2024-01-15'),
--   ('Jane Smith', 'jane@example.com', '098-765-4321', 'active', '2024-02-20');

-- INSERT INTO events (title, description, date, type) VALUES
--   ('Team Meeting', 'Monthly team sync', '2025-01-15', 'meeting'),
--   ('Project Launch', 'New product launch event', '2025-02-01', 'launch');
