import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Image as ImageIcon,
  Mic,
  Smile,
  Info,
  Phone,
  Video,
  Heart,
  MoreHorizontal,
  Camera,
  Check,
  CheckCheck
} from 'lucide-react';
import { Message } from '@/lib/index';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MessageThreadProps {
  messages: Message[];
  recipientId: string;
}

export function MessageThread({ messages, recipientId }: MessageThreadProps) {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    // In a real app, this would trigger a mutation/socket emit
    setInputValue('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Thread Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientId}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold leading-none">User_{recipientId.slice(0, 5)}</h3>
            <span className="text-[10px] text-muted-foreground">Active 12m ago</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="flex flex-col gap-2 min-h-full justify-end">
          <div className="flex flex-col items-center py-8 gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientId}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold">User_{recipientId.slice(0, 5)}</h2>
            <p className="text-sm text-muted-foreground text-center max-w-[200px]">
              You've been friends on Instagram since 2024
            </p>
            <Button variant="secondary" size="sm" className="mt-2">
              View Profile
            </Button>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isMe = message.senderId !== recipientId;
              const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== message.senderId);

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex w-full mb-1",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn("flex max-w-[75%] gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
                    {!isMe && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && (
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientId}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm relative transition-all",
                          isMe
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-secondary text-secondary-foreground rounded-tl-none"
                        )}
                      >
                        {message.type === 'text' && <p>{message.text}</p>}
                        {message.type === 'image' && message.mediaUrl && (
                          <img
                            src={message.mediaUrl}
                            alt="Shared media"
                            className="rounded-lg max-h-60 w-auto object-cover"
                          />
                        )}
                        {message.type === 'voice' && (
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                              <Mic className="h-4 w-4" />
                            </div>
                            <div className="flex-1 h-1 bg-primary-foreground/30 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-foreground w-1/2" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {index === messages.length - 1 && isMe && (
                        <div className="flex justify-end items-center mt-1 gap-1">
                          <span className="text-[10px] text-muted-foreground">
                            {message.isRead ? 'Seen' : 'Sent'}
                          </span>
                          {message.isRead ? (
                            <CheckCheck className="h-3 w-3 text-primary" />
                          ) : (
                            <Check className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Message Input */}
      <footer className="p-4 border-t border-border bg-background">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-1.5 border border-border focus-within:border-muted-foreground/30 transition-colors"
        >
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
            <Camera className="h-5 w-5" />
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm h-9"
          />

          <div className="flex items-center gap-1">
            {inputValue.trim() ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-primary font-semibold hover:bg-transparent"
                >
                  Send
                </Button>
              </motion.div>
            ) : (
              <>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                  <Heart className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </form>
      </footer>
    </div>
  );
}
