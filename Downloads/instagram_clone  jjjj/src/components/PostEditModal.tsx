import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, MapPin, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSave: (postId: string, caption: string, location?: string) => void;
}

const SUGGESTED_HASHTAGS = ['#photography', '#lifestyle', '#travel', '#2026vibe', '#creative', '#reels', '#aesthetic'];

export function PostEditModal({ isOpen, onClose, post, onSave }: PostEditModalProps) {
  const { profile } = useAuth();
  const [caption, setCaption] = useState(post?.caption || '');
  const [location, setLocation] = useState(post?.location || '');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (post) {
      setCaption(post.caption);
      setLocation(post.location || '');
    }
  }, [post]);

  const handleSave = async () => {
    if (!post) return;
    
    setIsLoading(true);
    
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSave(post.id, caption, location);
      toast.success('Post updated successfully! 🎉');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Edit Post</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Post Preview */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                  alt="User" 
                />
                <AvatarFallback>
                  {profile?.username?.[0]?.toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {profile?.username || 'phumeh_mjoli'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={post.mediaUrls[0]} 
                  alt="Post" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Caption</label>
              <Textarea
                placeholder="Write a caption..."
                className="min-h-[120px] resize-none focus-ring"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={2200}
              />
              <div className="flex items-center justify-between text-muted-foreground">
                <Smile size={16} className="cursor-pointer hover:text-foreground" />
                <span className="text-xs">{caption.length}/2200</span>
              </div>
            </div>

            {/* Suggested Hashtags */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Suggested Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_HASHTAGS.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setCaption(prev => prev + ' ' + tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                Location
              </label>
              <Input 
                placeholder="Add location"
                className="focus-ring"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Current Hashtags */}
            {post.hashtags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-primary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 btn-touch focus-ring"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 btn-touch focus-ring"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}