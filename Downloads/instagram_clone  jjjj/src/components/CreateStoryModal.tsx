import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  Image as ImageIcon, 
  Video, 
  Type, 
  Smile, 
  Music,
  Palette,
  Send,
  Upload,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useStories } from '@/hooks/useStories';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StoryStep = 'upload' | 'edit' | 'share';

const STORY_BACKGROUNDS = [
  { name: 'None', color: 'transparent' },
  { name: 'Gradient 1', color: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' },
  { name: 'Gradient 2', color: 'linear-gradient(45deg, #667eea, #764ba2)' },
  { name: 'Gradient 3', color: 'linear-gradient(45deg, #f093fb, #f5576c)' },
  { name: 'Gradient 4', color: 'linear-gradient(45deg, #4facfe, #00f2fe)' },
  { name: 'Gradient 5', color: 'linear-gradient(45deg, #43e97b, #38f9d7)' },
  { name: 'Solid Pink', color: '#ff6b6b' },
  { name: 'Solid Blue', color: '#4ecdc4' },
  { name: 'Solid Purple', color: '#667eea' },
  { name: 'Black', color: '#000000' },
];

export function CreateStoryModal({ isOpen, onClose }: CreateStoryModalProps) {
  const { user, profile } = useAuth();
  const { createStory, isCreating } = useStories();
  const { uploadImage } = useImageUpload();
  
  const [step, setStep] = useState<StoryStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [textOverlay, setTextOverlay] = useState('');
  const [selectedBackground, setSelectedBackground] = useState(STORY_BACKGROUNDS[0]);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file');
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit for stories
      toast.error('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setStep('edit');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleShare = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      await createStory(selectedFile, caption || textOverlay);
      handleClose();
    } catch (error) {
      console.error('Failed to create story:', error);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    setTextOverlay('');
    setSelectedBackground(STORY_BACKGROUNDS[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md h-[90vh] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              {step !== 'upload' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep(step === 'edit' ? 'upload' : 'edit')}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {step === 'upload' ? 'Create Story' : step === 'edit' ? 'Edit Story' : 'Share Story'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {step === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 gap-6"
                >
                  {/* Upload Area */}
                  <div
                    className={`w-full aspect-[9/16] max-h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {isDragging ? 'Drop your media here!' : 'Add to your story'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Drag photos and videos here
                      </p>
                    </div>
                  </div>

                  {/* Upload Options */}
                  <div className="flex gap-4 w-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 gap-2"
                      variant="outline"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Photo
                    </Button>
                    
                    <Button
                      onClick={() => videoInputRef.current?.click()}
                      className="flex-1 gap-2"
                      variant="outline"
                    >
                      <Video className="w-4 h-4" />
                      Video
                    </Button>
                  </div>

                  {/* Text Story Option */}
                  <Button
                    onClick={() => setStep('edit')}
                    className="w-full gap-2"
                    variant="secondary"
                  >
                    <Type className="w-4 h-4" />
                    Create Text Story
                  </Button>
                </motion.div>
              )}

              {step === 'edit' && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Preview Area */}
                  <div className="flex-1 relative bg-black">
                    <div 
                      className="w-full h-full flex items-center justify-center relative"
                      style={{ background: selectedBackground.color }}
                    >
                      {previewUrl ? (
                        selectedFile?.type.startsWith('video/') ? (
                          <video
                            src={previewUrl}
                            className="max-w-full max-h-full object-contain"
                            controls
                            muted
                            autoPlay
                            loop
                          />
                        ) : (
                          <img
                            src={previewUrl}
                            alt="Story preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        )
                      ) : (
                        <div className="text-center text-white">
                          <Type className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Text Story</p>
                        </div>
                      )}
                      
                      {/* Text Overlay */}
                      {textOverlay && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-center max-w-xs">
                            <p className="text-lg font-medium">{textOverlay}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Controls */}
                  <div className="p-4 space-y-4 bg-card border-t border-border">
                    {/* Text Input */}
                    <div>
                      <Input
                        placeholder="Add text to your story..."
                        value={textOverlay}
                        onChange={(e) => setTextOverlay(e.target.value)}
                        className="text-center"
                      />
                    </div>

                    {/* Background Colors */}
                    {!previewUrl && (
                      <div>
                        <p className="text-sm font-medium mb-2">Background</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {STORY_BACKGROUNDS.map((bg, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedBackground(bg)}
                              className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                                selectedBackground.name === bg.name
                                  ? 'border-primary'
                                  : 'border-border'
                              }`}
                              style={{ background: bg.color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Button */}
                    <Button
                      onClick={() => setStep('share')}
                      className="w-full"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'share' && (
                <motion.div
                  key="share"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Preview */}
                  <div className="flex-1 bg-black flex items-center justify-center p-4">
                    <div className="w-48 aspect-[9/16] relative rounded-2xl overflow-hidden bg-muted">
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: selectedBackground.color }}
                      >
                        {previewUrl ? (
                          selectedFile?.type.startsWith('video/') ? (
                            <video
                              src={previewUrl}
                              className="w-full h-full object-cover"
                              muted
                              autoPlay
                              loop
                            />
                          ) : (
                            <img
                              src={previewUrl}
                              alt="Story preview"
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="text-center text-white">
                            <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Text Story</p>
                          </div>
                        )}
                        
                        {textOverlay && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 text-white px-3 py-2 rounded-lg text-center max-w-[80%]">
                              <p className="text-sm font-medium">{textOverlay}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div className="p-4 space-y-4 bg-card border-t border-border">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage 
                          src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                          alt="User" 
                        />
                        <AvatarFallback>
                          {profile?.username?.[0]?.toUpperCase() || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">
                          {profile?.username || 'phumeh_mjoli'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your story • 24h
                        </p>
                      </div>
                    </div>

                    {/* Caption */}
                    <Textarea
                      placeholder="Write a caption... (optional)"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="min-h-[80px] resize-none"
                      maxLength={500}
                    />

                    {/* Share Button */}
                    <Button
                      onClick={handleShare}
                      disabled={isCreating}
                      className="w-full gap-2"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Share to Story
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}