import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockNotifications } from '@/data/index';
import { NotificationCard } from '@/components/NotificationCard';
import { springPresets } from '@/lib/motion';

/**
 * Notifications Page
 * Displays user interactions including likes, retweets, follows, and mentions.
 * Features a responsive tabbed interface for filtering content types.
 * © 2026 Twitter Clone Project.
 */
export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions'>('all');

  const mentions = mockNotifications.filter((n) => n.type === 'mention' || n.type === 'reply');

  return (
    <div className="flex flex-col min-h-screen bg-background border-x border-border max-w-[600px] mx-auto">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as 'all' | 'mentions')}
        >
          <TabsList className="w-full bg-transparent h-12 p-0 rounded-none border-none">
            <TabsTrigger
              value="all"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium transition-all hover:bg-muted/50"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="mentions"
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium transition-all hover:bg-muted/50"
            >
              Mentions
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Notification List Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'all' ? (
            <motion.div
              key="all-notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springPresets.gentle}
              className="divide-y divide-border"
            >
              {mockNotifications.length > 0 ? (
                mockNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                  <h2 className="text-2xl font-bold mb-2">Nothing to see here yet</h2>
                  <p className="text-muted-foreground">
                    From likes to retweets and a whole lot more, this is where all the action happens.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="mentions-notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springPresets.gentle}
              className="divide-y divide-border"
            >
              {mentions.length > 0 ? (
                mentions.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                  <h2 className="text-2xl font-bold mb-2">No mentions yet</h2>
                  <p className="text-muted-foreground">
                    When people mention you in a tweet or reply to your tweets, you'll find them here.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom spacing for mobile navigation height if needed */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
