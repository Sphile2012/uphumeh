import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreVertical,
  Music2,
  Volume2,
  VolumeX,
  Plus,
  Pause,
  Play
} from 'lucide-react';
import { Post } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ReelsPlayerProps {
  reels: Post[];
}

export function ReelsPlayer({ reels }: ReelsPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(reels[0]?.id || null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-reel-id'));
          }
        });
      },
      { threshold: 0.8 }
    );

    const elements = containerRef.current?.querySelectorAll('[data-reel-id]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [reels]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {reels.map((reel) => (
        <ReelItem
          key={reel.id}
          reel={reel}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          isActive={activeId === reel.id}
        />
      ))}
    </div>
  );
}

function ReelItem({
  reel,
  isMuted,
  setIsMuted,
  isActive
}: {
  reel: Post;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  isActive: boolean;
}) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1000);
  };

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div
      data-reel-id={reel.id}
      className="relative h-full w-full snap-start flex items-center justify-center overflow-hidden"
      onDoubleClick={handleDoubleTap}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {reel.type === 'video' ? (
          <video
            ref={videoRef}
            src={reel.mediaUrls[0]}
            loop
            muted={isMuted}
            playsInline
            className="h-full w-full object-cover"
            onClick={() => setIsPlaying(!isPlaying)}
          />
        ) : (
          <img
            src={reel.mediaUrls[0]}
            alt={reel.caption}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Interaction Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60">
        {/* Play/Pause Indicator */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-black/40 p-4 rounded-full backdrop-blur-md">
                <Pause className="w-12 h-12 text-white fill-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Double Tap Heart Anim */}
        <AnimatePresence>
          {showHeartAnim && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Sidebar Controls */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleLike}
              className="group active:scale-90 transition-transform"
            >
              <Heart
                className={cn(
                  "w-8 h-8 transition-colors",
                  isLiked ? "text-primary fill-primary" : "text-white"
                )}
              />
            </button>
            <span className="text-white text-xs font-semibold">{likesCount.toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="active:scale-90 transition-transform">
              <MessageCircle className="w-8 h-8 text-white" />
            </button>
            <span className="text-white text-xs font-semibold">
              {reel.commentsCount.toLocaleString()}
            </span>
          </div>

          <button className="active:scale-90 transition-transform">
            <Send className="w-8 h-8 text-white" />
          </button>

          <button className="active:scale-90 transition-transform">
            <Bookmark
              className={cn(
                "w-8 h-8",
                reel.isSaved ? "text-white fill-white" : "text-white"
              )}
            />
          </button>

          <button className="active:scale-90 transition-transform">
            <MoreVertical className="w-8 h-8 text-white" />
          </button>

          <div className="w-8 h-8 rounded-lg border-2 border-white overflow-hidden animate-spin-slow">
            <img src={reel.user.avatar} className="w-full h-full object-cover" alt="music" />
          </div>
        </div>

        {/* Bottom Content Info */}
        <div className="absolute left-4 bottom-6 right-16 z-20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-9 h-9 border border-white/20">
                <AvatarImage src={reel.user.avatar} />
                <AvatarFallback>{reel.user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 border-2 border-black">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-white font-semibold text-sm">
              {reel.user.username}
              {reel.user.isVerified && (
                <span className="ml-1 text-blue-400 text-[10px]">●</span>
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 bg-transparent border-white text-white hover:bg-white/10 text-xs font-bold"
            >
              Follow
            </Button>
          </div>

          <p className="text-white text-sm line-clamp-2 pr-4">
            {reel.caption}
          </p>

          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
            <Music2 className="w-3 h-3 text-white" />
            <span className="text-white text-xs truncate max-w-[150px]">
              {reel.musicTrack || `${reel.user.username} • Original Audio`}
            </span>
          </div>
        </div>

        {/* Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-20 bg-black/20 p-2 rounded-full backdrop-blur-sm text-white active:scale-95 transition-transform"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
