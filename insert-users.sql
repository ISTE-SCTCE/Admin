-- Insert all admin panel users
-- Run this in Supabase SQL Editor after running the main schema

INSERT INTO users (name, email, password, role) VALUES
  ('Chair', 'aadithyanrs9e@gmail.com', 'chair123', 'Chair'),
  ('Vice Chair', 'archasunil777@gmail.com', 'vchair123', 'Vice Chair'),
  ('Secretary', 'amantejas05@gmail.com', 'sec123', 'Secretary'),
  ('Joint Secretary', 'nehasanjeevkrishna@gmail.com', 'jsec123', 'Joint Secretary'),
  ('Treasurer', 'abhirammanoj13@gmail.com', 'treas123', 'Treasurer'),
  ('Sub Treasurer', 'aryashibu73@gmail.com', 'streas123', 'Sub Treasurer'),
  ('Technical Head', 'anjanapradeep512@gmail.com', 'thead123', 'Technical Head'),
  ('Design Head', 'designhead@example.com', 'dhead123', 'Design Head'),
  ('Media Head', 'aabhinavbr@gmail.com', 'mhead123', 'Media Head'),
  ('Marketing Head', 'hareeshms6665@gmail.com', 'marhead123', 'Marketing Head'),
  ('Activity Coordinator', 'activitycoord@example.com', 'acthead123', 'Activity Coordinator'),
  ('Membership Drive Head', 'mdrivehead@example.com', 'mdhead123', 'Membership Drive Head'),
  ('Chairman SwaS', 'unnikrishnan44013au@gmail.com', 'schair123', 'Chairman SwaS');

-- Note: I used placeholder emails for the 3 positions with missing emails (marked with #)
-- You can update them later in Supabase Table Editor or by running:
-- UPDATE users SET email = 'actual@email.com' WHERE role = 'Design Head';
