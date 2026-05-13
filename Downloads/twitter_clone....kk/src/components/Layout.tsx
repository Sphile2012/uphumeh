import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  House,
  Search,
  Bell,
  Mail,
  User as UserIcon,
  Settings,
  LogOut,
  MoreHorizontal,
  Feather,
  MessageSquare,
  Hash,
  Twitter
} from 'lucide-react';
import { ROUTE_PATHS, NavItem } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: NavItem[] = [
    { label: 'Home', path: ROUTE_PATHS.HOME, icon: House },
    { label: 'Explore', path: ROUTE_PATHS.EXPLORE, icon: Hash },
    { label: 'Notifications', path: ROUTE_PATHS.NOTIFICATIONS, icon: Bell },
    { label: 'Messages', path: ROUTE_PATHS.MESSAGES, icon: Mail },
    { 
      label: 'Profile', 
      path: ROUTE_PATHS.PROFILE.replace(':username', profile?.username || 'me'), 
      icon: UserIcon 
    },
    { label: 'Settings', path: ROUTE_PATHS.SETTINGS, icon: Settings },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTE_PATHS.EXPLORE}?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto flex max-w-[1300px] justify-center px-0 sm:px-4">
        {/* DESKTOP SIDEBAR */}
        <aside className="sticky top-0 hidden h-screen flex-col items-center py-4 sm:flex sm:w-20 xl:w-64 xl:items-start">
          <div className="mb-4 flex w-full justify-center xl:justify-start xl:px-3">
            <NavLink to={ROUTE_PATHS.HOME} className="p-3 hover:bg-accent rounded-full transition-colors">
              <Twitter className="h-8 w-8 text-primary fill-primary" />
            </NavLink>
          </div>

          <nav className="flex w-full flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex w-fit items-center gap-4 rounded-full p-3 transition-colors hover:bg-accent xl:w-full",
                    isActive ? "font-bold" : "font-normal"
                  )
                }
              >
                {({ isActive }) => {
                  const Icon = item.icon as any;
                  return (
                    <>
                      <Icon
                        className={cn(
                          "h-7 w-7 transition-transform group-hover:scale-110",
                          isActive && "text-primary"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="hidden text-xl xl:inline">{item.label}</span>
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>

          <Button className="mt-6 hidden w-full rounded-full py-6 text-lg font-bold shadow-lg xl:flex">
            Post
          </Button>
          <Button size="icon" className="mt-6 flex h-14 w-14 rounded-full shadow-lg xl:hidden">
            <Feather className="h-6 w-6" />
          </Button>

          <div className="mt-auto w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-full p-3 transition-colors hover:bg-accent xl:px-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
                    <AvatarFallback>{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left xl:block">
                    <p className="text-sm font-bold leading-tight">{profile?.display_name}</p>
                    <p className="text-sm text-muted-foreground">@{profile?.username}</p>
                  </div>
                  <MoreHorizontal className="ml-auto hidden h-5 w-5 xl:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-xl">
                <DropdownMenuLabel className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.SETTINGS)} className="cursor-pointer rounded-lg px-3 py-3">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings and privacy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-lg px-3 py-3 text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out @{profile?.username}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1 border-x border-border max-w-[600px] min-h-screen">
          {/* MOBILE HEADER */}
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:hidden">
            <NavLink to={ROUTE_PATHS.PROFILE.replace(':username', profile?.username || '')}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.username?.[0]}</AvatarFallback>
              </Avatar>
            </NavLink>
            
            <div className="flex flex-1 items-center px-4">
               <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search..."
                    className="h-9 w-full rounded-full border-none bg-accent pl-10 focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </form>
            </div>

            <NavLink to={ROUTE_PATHS.SETTINGS}>
              <Settings className="h-6 w-6 text-muted-foreground" />
            </NavLink>
          </header>

          {/* CONTENT */}
          <div className="pb-20 sm:pb-0">
            {children}
          </div>
        </main>

        {/* DESKTOP RIGHT SIDEBAR (SLOT) */}
        <aside className="hidden lg:block w-[350px] ml-8 py-4">
          <div className="sticky top-4 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Twitter Clone"
                className="h-12 w-full rounded-full border-none bg-muted pl-12 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <div id="trending-sidebar-container">
               {/* TrendingSidebar component will be injected here in page level or via children */}
            </div>

            <footer className="px-4 py-2 text-[13px] text-muted-foreground">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Cookie Policy</a>
                <a href="#" className="hover:underline">Accessibility</a>
                <a href="#" className="hover:underline">Ads info</a>
                <span className="cursor-default">More...</span>
              </div>
              <p className="mt-2">© 2026 Twitter Clone - Cloned by Phumeh</p>
            </footer>
          </div>
        </aside>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-background px-4 sm:hidden">
          <NavLink to={ROUTE_PATHS.HOME} className={({ isActive }) => cn("p-2", isActive ? "text-primary" : "text-foreground")}>
            <House className="h-7 w-7" strokeWidth={location.pathname === ROUTE_PATHS.HOME ? 2.5 : 2} />
          </NavLink>
          <NavLink to={ROUTE_PATHS.EXPLORE} className={({ isActive }) => cn("p-2", isActive ? "text-primary" : "text-foreground")}>
            <Search className="h-7 w-7" strokeWidth={location.pathname === ROUTE_PATHS.EXPLORE ? 2.5 : 2} />
          </NavLink>
          <NavLink to={ROUTE_PATHS.NOTIFICATIONS} className={({ isActive }) => cn("p-2", isActive ? "text-primary" : "text-foreground")}>
            <Bell className="h-7 w-7" strokeWidth={location.pathname === ROUTE_PATHS.NOTIFICATIONS ? 2.5 : 2} />
          </NavLink>
          <NavLink to={ROUTE_PATHS.MESSAGES} className={({ isActive }) => cn("p-2", isActive ? "text-primary" : "text-foreground")}>
            <Mail className="h-7 w-7" strokeWidth={location.pathname === ROUTE_PATHS.MESSAGES ? 2.5 : 2} />
          </NavLink>
        </nav>

        {/* MOBILE FLOATING ACTION BUTTON */}
        <div className="fixed bottom-20 right-4 z-40 sm:hidden">
           <Button size="icon" className="h-14 w-14 rounded-full shadow-2xl">
             <Feather className="h-6 w-6" />
           </Button>
        </div>
      </div>
    </div>
  );
}
