import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Film, 
  X, 
  ChevronLeft, 
  Smile, 
  MapPin, 
  ChevronRight, 
  Check,
  Type,
  SlidersHorizontal,
  Music,
  Upload,
  Plus
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useImageUpload } from '@/hooks/useImageUpload';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { springPresets } from '@/lib/motion';
import { toast } from 'sonner';

type CreateStep = 'upload' | 'edit' | 'details';

const FILTERS = [
  { name: 'Normal', class: '' },
  { name: 'Clarendon', class: 'sepia-[0.2] contrast-[1.2] brightness-[1.1]' },
  { name: 'Gingham', class: 'hue-rotate-[-10deg] brightness-[1.05]' },
  { name: 'Moon', class: 'grayscale brightness-[1.1] contrast-[1.1]' },
  { name: 'Lark', class: 'brightness-[1.1] saturate-[1.2]' },
  { name: 'Reyes', class: 'sepia-[0.3] brightness-[1.1] contrast-[0.85]' },
  { name: 'Juno', class: 'saturate-[1.3] contrast-[1.1] sepia-[0.1]' },
];

const SUGGESTED_HASHTAGS = ['#photography', '#lifestyle', '#travel', '#2026vibe', '#creative', '#reels', '#aesthetic'];

export default function Create() {
  const [step, setStep] = useState<CreateStep>('upload');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [brightness, setBrightness] = useState([100]);
  const [isPosting, setIsPosting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage } = useImageUpload();
  const { createNewPost } = usePosts();
  const { user, profile } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);
    
    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file');
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      toast.info('Uploading image...');
      const imageUrl = await uploadImage(file);
      console.log('Image uploaded:', imageUrl);
      setSelectedFile(imageUrl);
      setStep('edit');
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      console.log('File dropped:', file.name, file.type, file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error('Please select an image or video file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      try {
        toast.info('Uploading image...');
        const imageUrl = await uploadImage(file);
        console.log('Image uploaded:', imageUrl);
        setSelectedFile(imageUrl);
        setStep('edit');
        toast.success('Image uploaded successfully!');
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(error.message || 'Failed to upload image');
      }
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
      toast.error('Please select an image first');
      return;
    }

    setIsPosting(true);
    
    try {
      // Extract hashtags from caption
      const hashtags = caption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
      
      await createNewPost({
        type: 'image',
        media_urls: [selectedFile],
        caption: caption || 'New post from Phume! 📸',
        hashtags: hashtags,
        location: location || null
      });
      
      toast.success('Post shared successfully! 🎉');
      reset();
    } catch (error: any) {
      console.error('Share error:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setStep('upload');
    setCaption('');
    setLocation('');
    setActiveFilter(FILTERS[0]);
    setBrightness([100]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={springPresets.gentle}
              className={`w-full max-w-md bg-card border-2 ${isDragging ? 'border-primary border-dashed bg-primary/5' : 'border-border'} rounded-3xl p-12 flex flex-col items-center text-center gap-6 shadow-xl transition-all duration-200`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`w-24 h-24 ${isDragging ? 'bg-primary/20' : 'bg-primary/10'} rounded-full flex items-center justify-center text-primary transition-all duration-200`}>
                <ImageIcon size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Create New Post</h2>
                <p className="text-muted-foreground">
                  {isDragging ? 'Drop your image here!' : 'Drag photos and videos here or click to browse'}
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button 
                size="lg" 
                className="rounded-full px-8 btn-touch focus-ring"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Select from computer
              </Button>
              <div className="flex gap-4 mt-4">
                <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer btn-touch focus-ring rounded-lg p-2">
                  <Film size={20} />
                  <span className="text-xs">Reels</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer btn-touch focus-ring rounded-lg p-2">
                  <Music size={20} />
                  <span className="text-xs">Audio</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col md:flex-row bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex-[1.5] bg-black flex items-center justify-center relative min-h-[400px]">
                <img
                  src={selectedFile || ''}
                  alt="Preview"
                  className={`max-w-full max-h-full object-contain transition-all duration-300 ${activeFilter.class}`}
                  style={{ filter: `brightness(${brightness}%)` }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 text-white hover:bg-white/20"
                  onClick={() => setStep('upload')}
                >
                  <ChevronLeft />
                </Button>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-6 bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Edit Post</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setStep('details')} 
                    className="text-primary btn-touch focus-ring"
                  >
                    Next
                  </Button>
                </div>
                
                <div className="w-full">
                  <div className="w-full grid grid-cols-2 bg-muted rounded-md p-1 mb-4">
                    <button
                      onClick={() => setActiveFilter(activeFilter)}
                      className="px-3 py-1.5 text-sm font-medium rounded-sm bg-background shadow-sm"
                    >
                      Filters
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm font-medium rounded-sm text-muted-foreground"
                    >
                      Adjust
                    </button>
                  </div>
                  
                  <div className="py-6 overflow-hidden">
                    <div className="grid grid-cols-3 gap-3">
                      {FILTERS.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => setActiveFilter(f)}
                          className={`flex flex-col items-center gap-2 group ${activeFilter.name === f.name ? 'text-primary' : ''}`}
                        >
                          <div className={`w-full aspect-square rounded-md overflow-hidden border-2 transition-all ${activeFilter.name === f.name ? 'border-primary' : 'border-transparent'}`}>
                            <img 
                              src={selectedFile || ''} 
                              className={`w-full h-full object-cover ${f.class}`} 
                              alt={f.name}
                            />
                          </div>
                          <span className="text-xs font-medium">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><SlidersHorizontal size={14} /> Brightness</span>
                        <span>{brightness}%</span>
                      </div>
                      <Slider 
                        value={brightness} 
                        onValueChange={setBrightness} 
                        max={200} 
                        step={1} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col md:flex-row bg-card border border-border rounded-3xl overflow-hidden shadow-2xl max-h-[80vh]"
            >
              <div className="flex-1 bg-black flex items-center justify-center">
                <img
                  src={selectedFile || ''}
                  alt="Final Preview"
                  className={`max-w-full max-h-full object-contain ${activeFilter.class}`}
                  style={{ filter: `brightness(${brightness}%)` }}
                />
              </div>
              <div className="flex-1 p-6 flex flex-col gap-6 bg-card overflow-y-auto">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setStep('edit')}
                    className="btn-touch focus-ring"
                  >
                    <ChevronLeft />
                  </Button>
                  <h3 className="font-bold">New Post</h3>
                  <Button 
                    onClick={handleShare}
                    disabled={isPosting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full btn-touch focus-ring disabled:opacity-50"
                  >
                    {isPosting ? 'Sharing...' : 'Share'}
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                    <img 
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-sm">
                    {profile?.username || user?.user_metadata?.username || 'phumeh_mjoli'}
                  </span>
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Write a caption..."
                    className="min-h-[150px] resize-none border-none focus-visible:ring-0 p-0 text-base"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  
                  <div className="flex items-center justify-between text-muted-foreground">
                    <Smile size={20} className="cursor-pointer hover:text-foreground" />
                    <span className="text-xs">{caption.length}/2200</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Suggested Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_HASHTAGS.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setCaption(prev => prev + ' ' + tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={18} />
                    <Input 
                      placeholder="Add location"
                      className="border-none focus-visible:ring-0 h-8 p-0"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Advanced Settings</span>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedFile && (
           <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={reset}
            className="mt-8 flex items-center gap-2 text-destructive hover:underline font-medium"
          >
            <X size={18} /> Discard changes
          </motion.button>
        )}
      </div>
    </Layout>
  );
}
