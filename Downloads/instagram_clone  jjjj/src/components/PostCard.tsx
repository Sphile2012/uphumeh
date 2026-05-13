import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Music,
  ChevronLeft,
  ChevronRight,
  Flag,
  UserMinus,
  Copy,
  ExternalLink,
  Share,
  Edit3,
  Trash2
} from 'lucide-react';
import { Post, ROUTE_PATHS } from '@/lib/index';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { PostEditModal } from '@/components/PostEditModal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { likePost, savePost, addComment, deletePost } = usePosts();
  const { user } = useAuth();
  const [commentText, setCommentText] = React.useState('');
  const [showHeartAnimation, setShowHeartAnimation] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const lastTap = React.useRef<number>(0);

  const isOwnPost = user?.id === post.userId || user?.user_metadata?.username === post.user.username;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!post.isLiked) {
        likePost(post.id);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 800);
    }
    lastTap.current = now;
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/#/p/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success('Link copied to clipboard');
    setIsMenuOpen(false);
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/#/p/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.user.username} on Phume`,
          text: post.caption,
          url: postUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
    setIsMenuOpen(false);
  };

  const handleReport = () => {
    toast.success('Post reported. Thank you for helping keep Phume safe.');
    setIsMenuOpen(false);
  };

  const handleUnfollow = () => {
    toast.success(`Unfollowed ${post.user.username}`);
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
    setIsMenuOpen(false);
  };

  const handlePostUpdate = (postId: string, caption: string, location?: string) => {
    // In a real app, you would update the post in the database
    // For now, just show success message
    console.log('Updating post:', postId, caption, location);
  };

  const profileUrl = ROUTE_PATHS.PROFILE.replace(':username', post.user.username);

  return (
    <div className="bg-card border-border border-b sm:border sm:rounded-xl overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Link to={profileUrl} className="relative">
            <Avatar className={cn("h-9 w-9 border-2", post.user.hasStory ? "border-primary p-[1.5px]" : "border-transparent")}>
              <AvatarImage src={post.user.avatar} alt={post.user.username} />
              <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Link to={profileUrl} className="text-sm font-semibold hover:text-primary transition-colors">
                {post.user.username}
              </Link>
              {post.user.isVerified && (
                <span className="text-blue-500 text-[10px] bg-blue-500/10 px-1 rounded-full">✓</span>
              )}
            </div>
            {post.location && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5" /> {post.location}
              </span>
            )}
          </div>
        </div>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-colors btn-touch focus-ring"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 rounded-xl p-2 shadow-lg border bg-card/95 backdrop-blur-sm"
            sideOffset={8}
          >
            {isOwnPost ? (
              <>
                <DropdownMenuItem 
                  onClick={handleEdit}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="font-medium">Edit Post</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors btn-touch"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">Delete Post</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
              </>
            ) : null}
            
            <DropdownMenuItem 
              onClick={handleShare}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
            >
              <Share className="h-4 w-4" />
              <span className="font-medium">Share</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleCopyLink}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
            >
              <Copy className="h-4 w-4" />
              <span className="font-medium">Copy link</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              asChild
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
            >
              <Link to={profileUrl}>
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">Go to profile</span>
              </Link>
            </DropdownMenuItem>
            
            {!isOwnPost && (
              <>
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuItem 
                  onClick={handleUnfollow}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
                >
                  <UserMinus className="h-4 w-4" />
                  <span className="font-medium">Unfollow</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleReport}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors btn-touch"
                >
                  <Flag className="h-4 w-4" />
                  <span className="font-medium">Report</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media Content */}
      <div 
        className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        {post.type === 'carousel' ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {post.mediaUrls.map((url, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <img 
                    src={url} 
                    alt={`Post content ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-background/20 backdrop-blur-md border-none text-white hover:bg-background/40" />
            <CarouselNext className="right-2 bg-background/20 backdrop-blur-md border-none text-white hover:bg-background/40" />
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">
              {post.mediaUrls.length} images
            </div>
          </Carousel>
        ) : post.type === 'video' ? (
          <video 
            src={post.mediaUrls[0]} 
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            autoPlay
          />
        ) : (
          <img 
            src={post.mediaUrls[0]} 
            alt="Post content" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        <AnimatePresence>
          {showHeartAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute z-10 pointer-events-none"
            >
              <Heart className="h-24 w-24 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => likePost(post.id)}
              className="focus:outline-none btn-touch focus-ring rounded-full p-1 -m-1 hover:bg-accent/50 transition-colors"
              aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart 
                className={cn(
                  "h-6 w-6 transition-colors", 
                  post.isLiked ? "text-primary fill-primary animate-tw-bounce" : "text-foreground hover:text-muted-foreground"
                )} 
              />
            </motion.button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 hover:bg-accent/50 btn-touch focus-ring rounded-full"
              aria-label="Comment on post"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 hover:bg-accent/50 btn-touch focus-ring rounded-full"
              aria-label="Share post"
              onClick={handleShare}
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => savePost(post.id)}
            className="focus:outline-none btn-touch focus-ring rounded-full p-1 -m-1 hover:bg-accent/50 transition-colors"
            aria-label={post.isSaved ? 'Remove from saved' : 'Save post'}
          >
            <Bookmark 
              className={cn(
                "h-6 w-6 transition-colors", 
                post.isSaved ? "fill-foreground text-foreground" : "text-foreground hover:text-muted-foreground"
              )} 
            />
          </motion.button>
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <p className="text-sm font-bold">
            {post.likesCount.toLocaleString()} likes
          </p>
          <div className="text-sm leading-relaxed">
            <Link to={profileUrl} className="font-bold mr-2">{post.user.username}</Link>
            <span className="text-foreground/90">{post.caption}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {post.hashtags.map((tag) => (
                <span key={tag} className="text-primary cursor-pointer hover:underline">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {post.commentsCount > 0 && (
            <button className="text-muted-foreground text-sm hover:text-foreground transition-colors block mt-1">
              View all {post.commentsCount} comments
            </button>
          )}

          {post.isMusic && post.musicTrack && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/80 py-1">
              <Music className="h-3 w-3" />
              <span>{post.musicTrack}</span>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Add Comment */}
      <form 
        onSubmit={handleAddComment} 
        className="border-t border-border/50 px-3 py-3 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/60 py-2 px-1 rounded focus:ring-2 focus:ring-primary/20 transition-all"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        {commentText.trim() && (
          <button 
            type="submit"
            className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors px-2 py-2 rounded btn-touch focus-ring"
          >
            Post
          </button>
        )}
      </form>

      {/* Post Edit Modal */}
      <PostEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onSave={handlePostUpdate}
      />
    </div>
  );
}
