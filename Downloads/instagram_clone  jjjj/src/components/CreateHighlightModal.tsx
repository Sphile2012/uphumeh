import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Camera, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStories } from '@/hooks/useStories'
import { useImageUpload } from '@/hooks/useImageUpload'
import { toast } from 'sonner'

interface CreateHighlightModalProps {
  isOpen: boolean
  onClose: () => void