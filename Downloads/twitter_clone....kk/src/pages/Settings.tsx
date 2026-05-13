import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  Globe,
  ChevronRight,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Settings page for the Twitter clone.
 * Features account management, privacy controls, and notification preferences.
 * © 2026 Twitter Clone Project.
 */
export default function Settings() {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    email: 'alex.rivers@example.com', // Mock email
  });

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      displayName: formData.displayName,
      username: formData.username,
      bio: formData.bio,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences for 2026.
        </p>
      </header>

      <Tabs defaultValue="account" className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 flex-shrink-0">
            <TabsList className="flex md:flex-col h-auto w-full justify-start overflow-x-auto bg-transparent gap-1 p-0">
              <TabsTrigger
                value="account"
                className="justify-start w-full px-4 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="justify-start w-full px-4 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="justify-start w-full px-4 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="justify-start w-full px-4 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6 pt-6 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {/* Account Settings */}
            <TabsContent value="account" className="mt-0">
              <Card className="border-none shadow-none bg-transparent md:bg-card md:border md:shadow-sm">
                <CardHeader className="px-0 md:px-6">
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your public profile and login details.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 md:px-6 space-y-6">
                  <form onSubmit={handleSaveAccount} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                        <Input
                          id="username"
                          className="pl-7"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        className="resize-none h-24"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} disabled />
                      <p className="text-[10px] text-muted-foreground">Email cannot be changed currently.</p>
                    </div>
                    
                    <div className="pt-4 flex items-center justify-between">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      {isSaved && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-primary flex items-center text-sm font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Saved successfully
                        </motion.span>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="mt-0">
              <Card className="border-none shadow-none bg-transparent md:bg-card md:border md:shadow-sm">
                <CardHeader className="px-0 md:px-6">
                  <CardTitle>Privacy & Safety</CardTitle>
                  <CardDescription>Control how you interact with others and how your data is used.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 md:px-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Protect your Tweets</Label>
                        <p className="text-sm text-muted-foreground">Only current followers will be able to see your tweets.</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Photo tagging</Label>
                        <p className="text-sm text-muted-foreground">Allow people to tag you in photos.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Direct Messages</Label>
                        <p className="text-sm text-muted-foreground">Allow message requests from everyone.</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="mt-0">
              <Card className="border-none shadow-none bg-transparent md:bg-card md:border md:shadow-sm">
                <CardHeader className="px-0 md:px-6">
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose which activities you want to be notified about.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 md:px-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts on your device.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mentions and replies</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Retweets</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Likes</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New followers</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="mt-0">
              <Card className="border-none shadow-none bg-transparent md:bg-card md:border md:shadow-sm">
                <CardHeader className="px-0 md:px-6">
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and account security settings.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 md:px-6 space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" placeholder="••••••••" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button className="w-full md:w-auto">Update Password</Button>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Two-factor authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account by requiring more than just a password to log in.
                      </p>
                      <Button variant="outline" className="w-full flex justify-between">
                        Enable 2FA
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </main>
        </div>
      </Tabs>

      <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          <a href="#" className="hover:text-primary transition-colors">Ads info</a>
        </div>
        <p>© 2026 Twitter Clone. Built for the modern web.</p>
      </footer>
    </div>
  );
}
