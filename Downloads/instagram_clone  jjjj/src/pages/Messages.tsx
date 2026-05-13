import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Edit, 
  Info, 
  Phone, 
  Video, 
  ChevronLeft, 
  Image as ImageIcon, 
  Heart,
  MoreHorizontal
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { MessageThread } from "@/components/MessageThread";
import { mockUsers, mockMessages } from "@/data/index";
import { User, Message } from "@/lib/index";
import { cn } from "@/lib/utils";

const CURRENT_USER_ID = "u1";

export default function Messages() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users who have conversations with the current user
  const conversationUsers = useMemo(() => {
    const usersWithMessages = mockUsers.filter(user => user.id !== CURRENT_USER_ID);
    if (!searchQuery) return usersWithMessages;
    return usersWithMessages.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get active user object
  const activeUser = useMemo(() => 
    mockUsers.find(u => u.id === selectedUserId), 
    [selectedUserId]
  );

  // Get messages for the active conversation
  const activeMessages = useMemo(() => {
    if (!selectedUserId) return [];
    return mockMessages.filter(m => 
      (m.senderId === CURRENT_USER_ID && m.receiverId === selectedUserId) ||
      (m.senderId === selectedUserId && m.receiverId === CURRENT_USER_ID)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [selectedUserId]);

  // Helper to get last message for a user
  const getLastMessage = (userId: string) => {
    const userMessages = mockMessages.filter(m => 
      (m.senderId === CURRENT_USER_ID && m.receiverId === userId) ||
      (m.senderId === userId && m.receiverId === CURRENT_USER_ID)
    );
    return userMessages[userMessages.length - 1];
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-0px)] bg-background overflow-hidden border-x border-border max-w-6xl mx-auto">
        {/* Sidebar / Conversation List */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 flex-col border-r border-border bg-card transition-all",
          selectedUserId ? "hidden md:flex" : "flex"
        )}>
          {/* Sidebar Header */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer">
              <h1 className="text-xl font-bold tracking-tight">alex_codes</h1>
              <ChevronLeft className="w-4 h-4 rotate-270" />
            </div>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Edit className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-secondary py-2 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {conversationUsers.map((user) => {
              const lastMsg = getLastMessage(user.id);
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 transition-colors",
                    selectedUserId === user.id && "bg-secondary"
                  )}
                >
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="w-14 h-14 rounded-full object-cover border border-border"
                    />
                    {user.hasStory && (
                      <div className="absolute -inset-0.5 rounded-full border-2 border-primary animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-semibold text-sm truncate">{user.username}</span>
                      {lastMsg && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <p className={cn(
                        "text-xs truncate",
                        lastMsg?.isRead ? "text-muted-foreground" : "text-foreground font-bold"
                      )}>
                        {lastMsg?.text || (lastMsg?.type === 'image' ? 'Sent a photo' : 'No messages yet')}
                      </p>
                      {!lastMsg?.isRead && lastMsg?.receiverId === CURRENT_USER_ID && (
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Message Thread */}
        <div className={cn(
          "flex-1 flex flex-col bg-background transition-all",
          !selectedUserId ? "hidden md:flex" : "flex"
        )}>
          {selectedUserId && activeUser ? (
            <>
              {/* Thread Header */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedUserId(null)}
                    className="md:hidden p-1 -ml-1"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <img 
                      src={activeUser.avatar} 
                      alt={activeUser.username} 
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                    <div>
                      <p className="text-sm font-bold flex items-center gap-1">
                        {activeUser.username}
                        {activeUser.isVerified && <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center text-[8px] text-white">✓</div>}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-none">Active 5m ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <Video className="w-6 h-6" />
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-hidden relative">
                <MessageThread 
                  messages={activeMessages} 
                  recipientId={selectedUserId} 
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-2 border-foreground flex items-center justify-center">
                <MoreHorizontal className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Messages</h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Send private photos and messages to a friend or group.
                </p>
              </div>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
