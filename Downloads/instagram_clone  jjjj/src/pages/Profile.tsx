import React, { useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Grid,
  Play,
  Bookmark,
  UserSquare2,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Link as LinkIcon,
  Lock,
  Camera,
  Share,
  Copy,
  Flag,
  UserMinus,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { EditProfileModal } from '@/components/EditProfileModal';
import { useAuth } from '@/hooks/useAuth';
import { useFollow } from '@/hooks/useFollow';
import { useImageUpload } from '@/hooks/useImageUpload';
import { mockUsers, mockPosts } from '@/data/index';
import { ROUTE_PATHS, User, Post } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, profile } = useAuth();
  const { followUser, unfollowUser, isFollowing, isLoading: followLoading } = useFollow();
  const { uploadImage } = useImageUpload();
  const [activeTab, setActiveTab] = useState('posts');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine the profile user
  const profileUser = useMemo(() => {
    if (username === currentUser?.user_metadata?.username || username === profile?.username) {
      return {
        id: currentUser?.id || 'mock-user-id',
        username: profile?.username || 'phumeh_mjoli',
        fullName: profile?.full_name || 'Phumeh Mjoli',
        avatar: profileImage || profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        bio: profile?.bio || 'Creator of Phume 📸 Building the future of social media',
        website: profile?.website || 'https://phume.app',
        followerCount: profile?.follower_count || 2840,
        followingCount: profile?.following_count || 450,
        postCount: profile?.post_count || 124,
        isVerified: profile?.is_verified || true,
        isPrivate: profile?.is_private || false,
        hasStory: true,
        isFollowing: false
      };
    }
    return mockUsers.find((u) => u.username === username) || mockUsers[0];
  }, [username, currentUser, profile, profileImage]);

  const isOwnProfile = currentUser?.id === profileUser.id || 
                      currentUser?.user_metadata?.username === profileUser.username;
  const userIsFollowing = isFollowing(profileUser.id);

  // Filter posts for this specific user
  const userPosts = useMemo(() => {
    return mockPosts.filter((post) => 
      post.userId === profileUser.id || 
      post.user.username === profileUser.username
    );
  }, [profileUser.id, profileUser.username]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        setProfileImage(imageUrl);
        toast.success('Profile picture updated!');
      } catch (error) {
        toast.error('Failed to update profile picture');
      }
    }
  };

  const handleFollowToggle = async () => {
    if (userIsFollowing) {
      await unfollowUser(profileUser.id, profileUser.username);
    } else {
      await followUser(profileUser.id, profileUser.username);
    }
  };

  const handleCopyProfile = () => {
    const profileUrl = `${window.location.origin}/#/profile/${profileUser.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied to clipboard');
    setIsMenuOpen(false);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/#/profile/${profileUser.username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileUser.fullName} (@${profileUser.username}) on Phume`,
          text: profileUser.bio,
          url: profileUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      handleCopyProfile();
    }
    setIsMenuOpen(false);
  };

  const handleReport = () => {
    toast.success('Profile reported. Thank you for helping keep Phume safe.');
    setIsMenuOpen(false);
  };

  const handleBlock = () => {
    toast.success(`Blocked ${profileUser.username}`);
    setIsMenuOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Profile Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 mb-10"
        >
          {/* Avatar Area */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <div className={`p-1 rounded-full ${profileUser.hasStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-border'}`}>
              <Avatar className="w-24 h-24 md:w-40 md:h-40 border-4 border-background">
                <AvatarImage src={profileUser.avatar} alt={profileUser.username} />
                <AvatarFallback className="text-2xl">{profileUser.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            {isOwnProfile && (
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-primary text-primary-foreground rounded-full p-1.5 border-2 border-background shadow-lg hover:scale-110 transition-transform btn-touch focus-ring"
                  aria-label="Change profile picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Info Area */}
          <div className="flex-grow w-full">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                {profileUser.username}
                {profileUser.isVerified && (
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-none px-1 py-0 h-5">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
                    </svg>
                  </Badge>
                )}
              </h1>

              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="font-semibold h-8 btn-touch focus-ring"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Profile
                    </Button>
                    <Button variant="secondary" size="sm" className="font-semibold h-8 btn-touch focus-ring">
                      View Archive
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 btn-touch focus-ring">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`font-semibold h-8 btn-touch focus-ring ${
                        userIsFollowing 
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                    >
                      {followLoading ? '...' : userIsFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="secondary" size="sm" className="font-semibold h-8 btn-touch focus-ring">
                      Message
                    </Button>
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="h-8 w-8 btn-touch focus-ring"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-56 rounded-xl p-2 shadow-lg border bg-card/95 backdrop-blur-sm"
                        sideOffset={8}
                      >
                        <DropdownMenuItem 
                          onClick={handleShareProfile}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
                        >
                          <Share className="h-4 w-4" />
                          <span className="font-medium">Share Profile</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={handleCopyProfile}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="font-medium">Copy Profile URL</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          asChild
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
                        >
                          <a href={`mailto:?subject=Check out ${profileUser.fullName} on Phume&body=${window.location.origin}/#/profile/${profileUser.username}`}>
                            <ExternalLink className="h-4 w-4" />
                            <span className="font-medium">Send via Email</span>
                          </a>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="my-2" />
                        
                        {userIsFollowing && (
                          <DropdownMenuItem 
                            onClick={handleFollowToggle}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch"
                          >
                            <UserMinus className="h-4 w-4" />
                            <span className="font-medium">Unfollow</span>
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem 
                          onClick={handleBlock}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors btn-touch"
                        >
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">Block</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={handleReport}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors btn-touch"
                        >
                          <Flag className="h-4 w-4" />
                          <span className="font-medium">Report</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>

            {/* Stats (Desktop) */}
            <div className="hidden md:flex items-center gap-10 mb-6">
              <div className="flex items-center gap-1">
                <span className="font-bold">{profileUser.postCount}</span>
                <span className="text-muted-foreground">posts</span>
              </div>
              <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                <span className="font-bold">{profileUser.followerCount.toLocaleString()}</span>
                <span className="text-muted-foreground">followers</span>
              </button>
              <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                <span className="font-bold">{profileUser.followingCount.toLocaleString()}</span>
                <span className="text-muted-foreground">following</span>
              </button>
            </div>

            {/* Bio Section */}
            <div className="space-y-1">
              <p className="font-semibold">{profileUser.fullName}</p>
              {profileUser.bio && <p className="text-sm whitespace-pre-wrap">{profileUser.bio}</p>}
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  <LinkIcon className="w-3 h-3" />
                  {profileUser.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats (Mobile) */}
        <div className="md:hidden flex items-center justify-around border-t py-3 mb-4">
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm">{profileUser.postCount}</span>
            <span className="text-muted-foreground text-xs">posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm">{profileUser.followerCount.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs">followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm">{profileUser.followingCount.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs">following</span>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="flex items-center gap-6 overflow-x-auto pb-8 no-scrollbar">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary border border-border flex items-center justify-center p-1 cursor-pointer hover:bg-accent transition-colors">
                <div className="w-full h-full rounded-full bg-muted overflow-hidden border border-border">
                  {/* Mock highlight image */}
                  <img 
                    src={userPosts[i % userPosts.length]?.mediaUrls[0] || profileUser.avatar} 
                    alt="Highlight"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium">Highlight {i}</span>
            </div>
          ))}
          {isOwnProfile && (
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <button className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-border flex items-center justify-center bg-background hover:bg-accent transition-colors">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </button>
              <span className="text-[11px] font-medium">New</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full mt-2" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-center bg-transparent h-12 gap-10 border-b-0">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-foreground rounded-none h-full px-0 flex gap-2 uppercase text-[12px] tracking-widest font-bold"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden md:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reels" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-foreground rounded-none h-full px-0 flex gap-2 uppercase text-[12px] tracking-widest font-bold"
            >
              <Play className="w-4 h-4" />
              <span className="hidden md:inline">Reels</span>
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-foreground rounded-none h-full px-0 flex gap-2 uppercase text-[12px] tracking-widest font-bold"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden md:inline">Saved</span>
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="tagged" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-foreground rounded-none h-full px-0 flex gap-2 uppercase text-[12px] tracking-widest font-bold"
            >
              <UserSquare2 className="w-4 h-4" />
              <span className="hidden md:inline">Tagged</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="posts" className="mt-4">
              {profileUser.isPrivate && !isOwnProfile ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-24 h-24 rounded-full border-2 border-foreground flex items-center justify-center">
                    <Lock className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold">This account is private</h3>
                    <p className="text-muted-foreground text-sm">Follow to see their photos and videos.</p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-3 gap-1 md:gap-4"
                >
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        variants={itemVariants}
                        className="aspect-square relative group cursor-pointer overflow-hidden"
                      >
                        <img
                          src={post.mediaUrls[0]}
                          alt={post.caption}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                          <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{post.likesCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.5 5.5z" />
                            </svg>
                            <span>{post.commentsCount}</span>
                          </div>
                        </div>
                        {post.type === 'carousel' && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 19H5V5h10V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-10h-2v10zM21 3H11v2h10V3z" />
                            </svg>
                          </div>
                        )}
                        {post.type === 'video' && (
                          <div className="absolute top-2 right-2">
                            <Play className="w-5 h-5 text-white fill-white drop-shadow-md" />
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-3 py-20 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center">
                        <Grid className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">No posts yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="reels">
              <div className="py-20 text-center space-y-4">
                <Play className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                <h3 className="text-xl font-bold">Capture the moment with Reels</h3>
                <p className="text-muted-foreground">Reels are a new way to create and discover short, entertaining videos.</p>
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {/* Mock saved posts - in real app, fetch from user's saved collection */}
                {mockPosts.filter(p => p.isSaved).map((post) => (
                   <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden">
                     <img src={post.mediaUrls[0]} alt="Saved" className="w-full h-full object-cover" />
                   </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tagged">
               <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center">
                    <UserSquare2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Photos of you</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    When people tag you in photos, they'll appear here.
                  </p>
                </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Footer info */}
        <footer className="mt-20 py-10 border-t text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Press</a>
            <a href="#" className="hover:underline">API</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Locations</a>
            <a href="#" className="hover:underline">Language</a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 INSTAGRAM FROM META CLONE
          </p>
        </footer>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </Layout>
  );
}
