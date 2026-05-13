import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export interface UploadedImage {
  file: File
  preview: string
  id: string
}

export const useImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true)
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        throw new Error('Please select an image or video file')
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }

      // Create preview URL using FileReader for better compatibility
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (event) => {
          const result = event.target?.result as string
          if (result) {
            resolve(result)
          } else {
            reject(new Error('Failed to read file'))
          }
        }
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'))
        }
        
        // Read file as data URL
        reader.readAsDataURL(file)
      })
      
      // In a real app, you would upload to Supabase Storage:
      // const { data, error } = await supabase.storage
      //   .from('posts')
      //   .upload(`${userId}/${Date.now()}-${file.name}`, file)
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [])

  const uploadMultipleImages = useCallback(async (files: FileList): Promise<UploadedImage[]> => {
    const images: UploadedImage[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        try {
          const preview = await uploadImage(file)
          images.push({
            file,
            preview,
            id: `img-${Date.now()}-${i}`
          })
        } catch (error) {
          console.error('Failed to upload image:', error)
        }
      }
    }
    
    setUploadedImages(prev => [...prev, ...images])
    return images
  }, [uploadImage])

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      // Clean up preview URLs that were created with URL.createObjectURL
      const removed = prev.find(img => img.id === id)
      if (removed && removed.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }, [])

  const clearImages = useCallback(() => {
    // Clean up all preview URLs that were created with URL.createObjectURL
    uploadedImages.forEach(img => {
      if (img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview)
      }
    })
    setUploadedImages([])
  }, [uploadedImages])

  return {
    uploadedImages,
    isUploading,
    uploadImage,
    uploadMultipleImages,
    removeImage,
    clearImages
  }
}