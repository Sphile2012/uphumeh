import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Smile, 
  MapPin, 
  Calendar, 
  X, 
  BarChart2, 
  Globe 
} from 'lucide-react';
import { Tweet, User } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { useTweets } from '@/hooks/useTweets';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TweetComposerProps {
  replyTo?: Tweet;
  onClose?: () => void;
}

export function TweetComposer({ replyTo, onClose }: TweetComposerProps) {
  const { user } = useAuth();
  const { postTweet } = useTweets();
  
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const CHAR_LIMIT = 280;
  const remainingChars = CHAR_LIMIT - content.length;
  const isOverLimit = remainingChars < 0;
  const canPost = (content.trim().length > 0 || mediaUrls.length > 0) && !isOverLimit && !isSubmitting;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handlePost = async () => {
    if (!canPost || !user) return;

    try {
      setIsSubmitting(true);
      // Artificial delay for physical feel
      await new Promise(resolve => setTimeout(resolve, 600));
      
      postTweet(content, user, mediaUrls, replyTo?.id);
      
      setContent('');
      setMediaUrls([]);
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to post tweet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMockMedia = () => {
    if (mediaUrls.length >= 4) return;
    const mockImages = [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    ];
    const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
    setMediaUrls([...mediaUrls, randomImg]);
  };

  const removeMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  if (!user) return null;

  return (
    <div className={cn(
      "flex flex-col w-full bg-card p-4",
      !replyTo && "border-b border-border"
    )}>
      {replyTo && (
        <div className="flex items-start gap-3 mb-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={replyTo.user?.avatarUrl} alt={replyTo.user?.displayName} />
              <AvatarFallback>{replyTo.user?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="w-0.5 h-full bg-border my-1" />
          </div>
          <div className="flex-1 py-1">
            <p className="text-muted-foreground text-sm">
              Replying to <span className="text-primary font-medium">@{replyTo.user?.username}</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarImage src={user.avatarUrl} alt={user.displayName} />
          <AvatarFallback>{user.displayName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={replyTo ? "Post your reply" : "What's happening?"}
              className="w-full bg-transparent border-none focus-visible:ring-0 resize-none text-xl min-h-[50px] p-0 mb-2"
            />
          </div>

          <AnimatePresence>
            {mediaUrls.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "grid gap-2 mb-4",
                  mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
                )}
              >
                {mediaUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-border group">
                    <img src={url} alt="Upload" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {(isFocused || content.length > 0) && (
            <div className="flex items-center gap-2 mb-3 text-primary text-sm font-semibold">
              <Globe size={16} />
              <span>Everyone can reply</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center -ml-2 overflow-x-auto scrollbar-none">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full" onClick={addMockMedia}>
                <ImageIcon size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full">
                <BarChart2 size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full">
                <Smile size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full">
                <Calendar size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full hidden sm:flex">
                <MapPin size={20} />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-mono",
                    remainingChars < 20 ? "text-destructive font-bold" : "text-muted-foreground"
                  )}>
                    {remainingChars}
                  </span>
                  <div className="w-px h-4 bg-border" />
                </div>
              )}
              <Button 
                disabled={!canPost}
                onClick={handlePost}
                className="rounded-full px-6 font-bold transition-all active:scale-95"
              >
                {isSubmitting ? "Posting..." : (replyTo ? "Reply" : "Post")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
