import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Compass, 
  Film, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  Menu, 
  LogOut, 
  Instagram,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AuthModal } from '@/components/AuthModal';
import { ROUTE_PATHS } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, logout, isSupabaseConfigured } = useAuth();
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const navItems = [
    { label: 'Home', icon: Home, path: ROUTE_PATHS.HOME },
    { label: 'Search', icon: Search, path: ROUTE_PATHS.SEARCH },
    { label: 'Explore', icon: Compass, path: ROUTE_PATHS.EXPLORE },
    { label: 'Reels', icon: Film, path: ROUTE_PATHS.REELS },
    { label: 'Messages', icon: MessageCircle, path: ROUTE_PATHS.MESSAGES },
    { label: 'Notifications', icon: Heart, path: ROUTE_PATHS.ACTIVITY },
    { label: 'Create', icon: PlusSquare, path: ROUTE_PATHS.CREATE },
    {
      label: 'Profile',
      icon: () => (
        user ? (
          <Avatar className="w-6 h-6 border-2 border-transparent">
            <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-[10px]">
              {(profile?.username || user?.user_metadata?.username || 'U')?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className="w-6 h-6" />
        )
      ),
      path: user ? ROUTE_PATHS.PROFILE.replace(':username', profile?.username || user?.user_metadata?.username || 'me') : '#',
      onClick: user ? undefined : () => setShowAuthModal(true)
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-16 xl:w-64 border-r border-border px-3 py-8 z-50 transition-all">
        <Link to={ROUTE_PATHS.HOME} className="px-3 mb-10 flex items-center gap-3">
          <Instagram className="w-7 h-7 flex-shrink-0" />
          <span className="hidden xl:block font-bold text-xl tracking-tight font-heading">
            Phume
          </span>
        </Link>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon as React.ElementType;
            const isActive = location.pathname === item.path;
            
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-accent group text-left",
                    isActive ? "font-bold" : "font-medium"
                  )}
                >
                  <div className={cn("transition-transform group-active:scale-90", isActive && "scale-110")}>
                    <Icon className={cn("w-6 h-6", isActive && "fill-foreground")} />
                  </div>
                  <span className="hidden xl:block text-base">{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-accent group",
                    isActive ? "font-bold" : "font-medium"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn("transition-transform group-active:scale-90", isActive && "scale-110")}>
                      <Icon className={cn("w-6 h-6", isActive && "fill-foreground")} />
                    </div>
                    <span className="hidden xl:block text-base">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto">
          <DropdownMenu onOpenChange={setIsMoreMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 p-3 h-auto hover:bg-accent rounded-lg btn-touch focus-ring transition-all",
                  isMoreMenuOpen && "bg-accent font-bold"
                )}
              >
                <Menu className="w-6 h-6" />
                <span className="hidden xl:block">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 mb-4 rounded-xl p-2 shadow-lg border bg-card/95 backdrop-blur-sm"
              sideOffset={8}
            >
              <DropdownMenuLabel className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-widest">
                {user ? 'Account' : 'Get Started'}
              </DropdownMenuLabel>
              
              {!user && (
                <DropdownMenuItem 
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch focus-ring"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Sign In / Sign Up</span>
                </DropdownMenuItem>
              )}
              
              {user && (
                <>
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors btn-touch focus-ring">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Switch Accounts</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem 
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors btn-touch focus-ring"
                onClick={handleAuthAction}
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">{user ? 'Log out' : 'Continue as Guest'}</span>
              </DropdownMenuItem>
              
              {!isSupabaseConfigured && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-4 py-2 text-xs text-muted-foreground">
                    Demo Mode - Configure Supabase for full features
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <Link to={ROUTE_PATHS.HOME} className="flex items-center">
          <span className="font-bold text-xl tracking-tight font-heading">Phume</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to={ROUTE_PATHS.ACTIVITY}>
            <Heart className="w-6 h-6" />
          </Link>
          <Link to={ROUTE_PATHS.MESSAGES}>
            <MessageCircle className="w-6 h-6" />
          </Link>
          {!user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="text-primary font-semibold"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 border-t border-border bg-background/80 backdrop-blur-md flex items-center justify-around z-50">
        {navItems.filter(i => !['Search', 'Notifications', 'Messages'].includes(i.label)).map((item) => {
          const Icon = item.icon as React.ElementType;
          const isActive = location.pathname === item.path;
          
          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-transform",
                  isActive ? "scale-110" : "opacity-70"
                )}
              >
                <div className={cn("transition-all", isActive && "fill-foreground text-primary")}>
                  <Icon className="w-6 h-6" />
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-transform",
                  isActive ? "scale-110" : "opacity-70"
                )
              }
            >
              {({ isActive }) => (
                <div className={cn("transition-all", isActive && "fill-foreground text-primary")}>
                   <Icon className="w-6 h-6" />
                </div>
              )}
            </NavLink>
          );
        })}
        <Link to={ROUTE_PATHS.SEARCH} className="opacity-70">
          <Search className="w-6 h-6" />
        </Link>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 md:pl-16 xl:pl-64 pb-14 md:pb-0 pt-14 md:pt-0">
        <div className="flex-1 max-w-full">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>

        {/* 2026 Footer (Desktop Only) */}
        <footer className="hidden md:block py-10 px-6 border-t border-border mt-auto bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Blog</a>
              <a href="#" className="hover:underline">Jobs</a>
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">API</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Locations</a>
              <a href="#" className="hover:underline">Contact</a>
            </div>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              © 2026 Phume • Cloned by Phumeh
            </div>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
