-- Insert members data into Supabase
-- Run this in Supabase SQL Editor

INSERT INTO members (name, email, phone, status, joined_date) VALUES
  ('Aadithyan RS', 'aadithyanrs9e@gmail.com', '+91-1234567890', 'active', '2024-01-15'),
  ('Archa Sunil', 'archasunil777@gmail.com', '+91-2345678901', 'active', '2024-01-20'),
  ('Aman Tejas', 'amantejas05@gmail.com', '+91-3456789012', 'active', '2024-02-01'),
  ('Neha Sanjeev Krishna', 'nehasanjeevkrishna@gmail.com', '+91-4567890123', 'active', '2024-02-10'),
  ('Abhiram Manoj', 'abhirammanoj13@gmail.com', '+91-5678901234', 'active', '2024-02-15'),
  ('Arya Shibu', 'aryashibu73@gmail.com', '+91-6789012345', 'active', '2024-03-01'),
  ('Anjana Pradeep', 'anjanapradeep512@gmail.com', '+91-7890123456', 'active', '2024-03-05'),
  ('Abhinav BR', 'aabhinavbr@gmail.com', '+91-8901234567', 'active', '2024-03-10'),
  ('Hareesh MS', 'hareeshms6665@gmail.com', '+91-9012345678', 'active', '2024-03-15'),
  ('Unnikrishnan', 'unnikrishnan44013au@gmail.com', '+91-0123456789', 'active', '2024-04-01');

-- Note: The members table is for displaying team members in the Members tab
-- The users table is for authentication/login
-- They can have the same emails but serve different purposes
