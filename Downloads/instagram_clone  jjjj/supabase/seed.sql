-- Insert sample data for development and testing

-- Insert sample profiles (these will be created when users sign up)
-- Note: In production, profiles are created automatically via the trigger

-- Sample posts
INSERT INTO posts (id, user_id, type, media_urls, caption, hashtags, location, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'image', 
 ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'], 
 'Welcome to Phume by Phumeh Mjoli! 🌅', 
 ARRAY['#phume', '#phumehmjoli', '#socialmedia', '#photography'], 
 'Digital World', 245, 12),

('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'carousel', 
 ARRAY[
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
 ], 
 'Weekend adventure compilation! Which one is your favorite? 🏔️🌲', 
 ARRAY['#adventure', '#weekend', '#nature', '#hiking'], 
 'Rocky Mountains', 189, 8),

('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'video', 
 ARRAY['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'], 
 'Morning workout routine! Stay consistent 💪', 
 ARRAY['#fitness', '#workout', '#morning', '#motivation'], 
 'Home Gym', 156, 23);

-- Sample comments
INSERT INTO comments (post_id, user_id, text, likes_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Amazing shot! 📸', 5),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'The colors are incredible!', 3),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Love the adventure spirit! 🎒', 7),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Great motivation! 💪', 12);

-- Sample stories (will expire in 24 hours from creation)
INSERT INTO stories (user_id, media_url, type) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 'image'),
('550e8400-e29b-41d4-a716-446655440000', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', 'image');

-- Note: Likes, follows, and messages will be created through user interactions
-- The triggers will automatically update the counts