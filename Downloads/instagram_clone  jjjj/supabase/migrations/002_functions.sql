-- Function to get user conversations with last message and unread count
CREATE OR REPLACE FUNCTION get_user_conversations(user_id UUID)
RETURNS TABLE (
    user_data JSON,
    last_message JSON,
    unread_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH conversation_users AS (
        SELECT DISTINCT
            CASE 
                WHEN sender_id = user_id THEN receiver_id
                ELSE sender_id
            END as other_user_id
        FROM messages
        WHERE sender_id = user_id OR receiver_id = user_id
    ),
    last_messages AS (
        SELECT DISTINCT ON (
            CASE 
                WHEN sender_id < receiver_id THEN sender_id || receiver_id
                ELSE receiver_id || sender_id
            END
        )
        *
        FROM messages
        WHERE sender_id = user_id OR receiver_id = user_id
        ORDER BY 
            CASE 
                WHEN sender_id < receiver_id THEN sender_id || receiver_id
                ELSE receiver_id || sender_id
            END,
            created_at DESC
    ),
    unread_counts AS (
        SELECT 
            sender_id as other_user_id,
            COUNT(*) as unread_count
        FROM messages
        WHERE receiver_id = user_id AND is_read = false
        GROUP BY sender_id
    )
    SELECT 
        row_to_json(p.*) as user_data,
        row_to_json(lm.*) as last_message,
        COALESCE(uc.unread_count, 0) as unread_count
    FROM conversation_users cu
    JOIN profiles p ON p.id = cu.other_user_id
    LEFT JOIN last_messages lm ON (
        (lm.sender_id = cu.other_user_id AND lm.receiver_id = user_id) OR
        (lm.sender_id = user_id AND lm.receiver_id = cu.other_user_id)
    )
    LEFT JOIN unread_counts uc ON uc.other_user_id = cu.other_user_id
    ORDER BY lm.created_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get mutual followers between two users
CREATE OR REPLACE FUNCTION get_mutual_followers(user1_id UUID, user2_id UUID)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.is_verified
    FROM profiles p
    WHERE p.id IN (
        SELECT f1.following_id
        FROM follows f1
        WHERE f1.follower_id = user1_id
        INTERSECT
        SELECT f2.following_id
        FROM follows f2
        WHERE f2.follower_id = user2_id
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get recommended users (users with most followers that current user doesn't follow)
CREATE OR REPLACE FUNCTION get_recommended_users(current_user_id UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    follower_count INTEGER,
    is_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.bio,
        p.follower_count,
        p.is_verified
    FROM profiles p
    WHERE p.id != current_user_id
    AND p.id NOT IN (
        SELECT following_id 
        FROM follows 
        WHERE follower_id = current_user_id
    )
    ORDER BY p.follower_count DESC, p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search users by username or full name
CREATE OR REPLACE FUNCTION search_users(search_term TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    follower_count INTEGER,
    is_verified BOOLEAN,
    relevance_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.bio,
        p.follower_count,
        p.is_verified,
        CASE 
            WHEN p.username ILIKE search_term || '%' THEN 3
            WHEN p.full_name ILIKE search_term || '%' THEN 2
            WHEN p.username ILIKE '%' || search_term || '%' THEN 1
            WHEN p.full_name ILIKE '%' || search_term || '%' THEN 1
            ELSE 0
        END as relevance_score
    FROM profiles p
    WHERE 
        p.username ILIKE '%' || search_term || '%' OR
        p.full_name ILIKE '%' || search_term || '%'
    ORDER BY relevance_score DESC, p.follower_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending hashtags
CREATE OR REPLACE FUNCTION get_trending_hashtags(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    hashtag TEXT,
    post_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        unnest(hashtags) as hashtag,
        COUNT(*) as post_count
    FROM posts
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY unnest(hashtags)
    ORDER BY post_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get posts by hashtag
CREATE OR REPLACE FUNCTION get_posts_by_hashtag(hashtag_name TEXT, limit_count INTEGER DEFAULT 20)
RETURNS SETOF posts AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM posts
    WHERE hashtag_name = ANY(hashtags)
    ORDER BY created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired stories
CREATE OR REPLACE FUNCTION cleanup_expired_stories()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM stories 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired stories (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-stories', '0 * * * *', 'SELECT cleanup_expired_stories();');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables that need them
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();