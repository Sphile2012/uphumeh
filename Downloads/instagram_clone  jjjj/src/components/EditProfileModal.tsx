import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Save, User, Globe, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, profile } = useAuth();
  const { uploadImage } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: profile?.username || user?.user_metadata?.username || 'phumeh_mjoli',
    fullName: profile?.full_name || user?.user_metadata?.full_name || 'Phumeh Mjoli',
    bio: profile?.bio || 'Creator of Phume 📸 Building the future of social media',
    website: profile?.website || 'https://phume.app',
    email: user?.email || 'phumeh@phume.com',
    isPrivate: profile?.is_private || false
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPrivate: checked
    }));
  };

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

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the profile in Supabase:
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({
      //     username: formData.username,
      //     full_name: formData.fullName,
      //     bio: formData.bio,
      //     website: formData.website,
      //     is_private: formData.isPrivate,
      //     avatar_url: profileImage || profile?.avatar_url
      //   })
      //   .eq('id', user?.id);
      
      toast.success('Profile updated successfully! 🎉');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Edit Profile</h2>
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
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage 
                    src={profileImage || profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'} 
                    alt="Profile" 
                  />
                  <AvatarFallback className="text-2xl">
                    {formData.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 border-2 border-background shadow-lg hover:scale-110 transition-transform btn-touch focus-ring"
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
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Click the camera icon to change your profile picture
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="focus-ring"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="focus-ring"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell people about yourself..."
                  className="min-h-[100px] resize-none focus-ring"
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.bio.length}/150
                </p>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://your-website.com"
                  className="focus-ring"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="focus-ring"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here
                </p>
              </div>

              {/* Privacy Setting */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Private Account</Label>
                  <p className="text-xs text-muted-foreground">
                    Only followers can see your posts
                  </p>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={handlePrivacyToggle}
                />
              </div>
            </div>
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