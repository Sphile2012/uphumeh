import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Send, 
  MoreHorizontal,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Story as HookStory } from '@/hooks/useStories';
import { Story as LibStory } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Union type to support both story formats
type StoryInput = HookStory | LibStory;

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: StoryInput[];
  initialStoryIndex?: number;
  userAvatar?: string;
  username?: string;
}

// Helper function to get media type from story
const getMediaType = (story: StoryInput): 'image' | 'video' => {
  if ('mediaType' in story) {
    return story.mediaType;
  }
  return story.type;
};

export function StoryViewer({ 
  isOpen, 
  onClose, 
  stories, 
  initialStoryIndex = 0,
  userAvatar,
  username 
}: StoryViewerProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();
  const storyDuration = 5000; // 5 seconds per story

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    setProgress(0);
    setIsLiked(false);
    
    const mediaType = getMediaType(currentStory);
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      if (!isPaused) {
        videoRef.current.play();
      }
    }

    if (!isPaused) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (storyDuration / 100));
          if (newProgress >= 100) {
            handleNext();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused, isOpen, currentStory, isMuted]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed like' : 'Liked story');
  };

  const handleReply = () => {
    if (replyText.trim()) {
      toast.success('Reply sent!');
      setReplyText('');
    }
  };

  const handleStoryClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    
    if (clickX < centerX) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  if (!isOpen || !currentStory) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md h-full bg-black relative overflow-hidden"
        >
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ 
                    width: index < currentIndex ? '100%' : 
                           index === currentIndex ? `${progress}%` : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src={userAvatar} alt={username} />
                <AvatarFallback className="text-xs">
                  {username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-semibold">{username}</p>
                <p className="text-white/70 text-xs">
                  {new Date(currentStory.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getMediaType(currentStory) === 'video' && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePause}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMute}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Story Content */}
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={handleStoryClick}
          >
            {getMediaType(currentStory) === 'video' ? (
              <video
                ref={videoRef}
                src={currentStory.mediaUrl}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
              />
            ) : (
              <img
                src={currentStory.mediaUrl}
                alt="Story"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Caption Overlay */}
            {currentStory.caption && (
              <div className="absolute bottom-20 left-4 right-4">
                <div className="bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="text-sm">{currentStory.caption}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          
          {currentIndex < stories.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className="h-10 w-10 text-white hover:bg-white/20"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white hover:bg-white/20"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white hover:bg-white/20"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white hover:bg-white/20"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Reply Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Reply to story..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              {replyText.trim() && (
                <Button
                  onClick={handleReply}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Send
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}