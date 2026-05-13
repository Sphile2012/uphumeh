import React, { useState, useMemo } from 'react';
import { Search, Settings, Mail, Send, ArrowLeft, Info, MoreHorizontal, Smile, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { User, Message } from '@/lib/index';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { IMAGES } from '@/assets/images';
import { cn } from '@/lib/utils';

/**
 * Mock conversations data for the Messages page.
 * © 2026 Twitter Clone Project.
 */
const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    user: {
      id: 'user-002',
      username: 'sarah_codes',
      displayName: 'Sarah Jenkins',
      avatarUrl: IMAGES.USER_AVATAR_2,
      isVerified: true,
    },
    lastMessage: 'The new API looks promising! Shall we discuss?',
    timestamp: '2026-02-05T04:30:00Z',
    unread: true,
  },
  {
    id: 'conv-2',
    user: {
      id: 'user-003',
      username: 'design_guru',
      displayName: 'Marcus Wright',
      avatarUrl: IMAGES.USER_AVATAR_3,
      isVerified: false,
    },
    lastMessage: 'Sent you the Figma links for the redesign.',
    timestamp: '2026-02-04T18:15:00Z',
    unread: false,
  },
  {
    id: 'conv-3',
    user: {
      id: 'user-004',
      username: 'tech_insider',
      displayName: 'Tech Insider',
      avatarUrl: IMAGES.USER_AVATAR_4,
      isVerified: true,
    },
    lastMessage: 'Did you see the latest leak about the new processor?',
    timestamp: '2026-02-03T10:45:00Z',
    unread: false,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm1', senderId: 'user-002', receiverId: 'user-001', content: 'Hey Alex! Just checking in on the project.', createdAt: '2026-02-05T04:20:00Z', isRead: true },
    { id: 'm2', senderId: 'user-001', receiverId: 'user-002', content: 'Hey Sarah! Going well, just finished the auth flow.', createdAt: '2026-02-05T04:25:00Z', isRead: true },
    { id: 'm3', senderId: 'user-002', receiverId: 'user-001', content: 'The new API looks promising! Shall we discuss?', createdAt: '2026-02-05T04:30:00Z', isRead: false },
  ],
};

export default function Messages() {
  const { user: currentUser } = useAuth();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConv = useMemo(() => 
    MOCK_CONVERSATIONS.find(c => c.id === selectedConvId), 
    [selectedConvId]
  );

  const messages = useMemo(() => 
    selectedConvId ? (MOCK_MESSAGES[selectedConvId] || []) : [], 
    [selectedConvId]
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // In a real app, this would trigger an API call via useMessages hook
    setMessageInput('');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen overflow-hidden bg-background">
      {/* Conversation List Pane */}
      <div 
        className={cn(
          "w-full md:w-[380px] border-r border-border flex flex-col transition-all",
          selectedConvId ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mail className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search Direct Messages"
              className="pl-10 bg-secondary/50 border-none rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {MOCK_CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={cn(
                  "flex items-start gap-3 p-4 text-left transition-colors hover:bg-accent/50",
                  selectedConvId === conv.id && "bg-accent/30 border-r-4 border-primary"
                )}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conv.user.avatarUrl} alt={conv.user.displayName} />
                  <AvatarFallback>{conv.user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-bold truncate">{conv.user.displayName}</span>
                      {conv.user.isVerified && (
                        <span className="text-primary">●</span>
                      )}
                      <span className="text-muted-foreground text-sm truncate">@{conv.user.username}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(conv.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm truncate",
                    conv.unread ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-6" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Pane */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all",
          !selectedConvId ? "hidden md:flex bg-accent/5 items-center justify-center" : "flex"
        )}
      >
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="h-14 px-4 border-b border-border flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden rounded-full"
                  onClick={() => setSelectedConvId(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedConv.user.avatarUrl} />
                  <AvatarFallback>{selectedConv.user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold leading-none">{selectedConv.user.displayName}</h2>
                  <p className="text-xs text-muted-foreground">@{selectedConv.user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Info className="w-5 h-5 text-primary" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center py-8 text-center">
                  <Avatar className="w-16 h-16 mb-2">
                    <AvatarImage src={selectedConv.user.avatarUrl} />
                    <AvatarFallback>{selectedConv.user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{selectedConv.user.displayName}</h3>
                  <p className="text-sm text-muted-foreground mb-4">@{selectedConv.user.username}</p>
                  <p className="text-xs text-muted-foreground max-w-[240px]">
                    Joined January 2026 · 12.4K Followers
                  </p>
                  <Separator className="my-6 w-full max-w-[400px]" />
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      msg.senderId === currentUser?.id ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-4 py-2 rounded-2xl text-sm",
                        msg.senderId === currentUser?.id 
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-secondary text-foreground rounded-tl-none"
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-background">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-secondary/50 rounded-2xl px-4 py-2"
              >
                <Button type="button" variant="ghost" size="icon" className="rounded-full text-primary shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full text-primary shrink-0 hidden sm:flex">
                  <Smile className="w-5 h-5" />
                </Button>
                <Input 
                  placeholder="Start a new message"
                  className="border-none bg-transparent focus-visible:ring-0 px-0 h-9"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button 
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={!messageInput.trim()}
                  className="rounded-full text-primary shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="max-w-md text-center p-8">
            <h2 className="text-3xl font-extrabold mb-2">Select a message</h2>
            <p className="text-muted-foreground mb-6">
              Choose from your existing conversations, start a new one, or just keep swimming.
            </p>
            <Button className="rounded-full font-bold px-6">
              New Message
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
