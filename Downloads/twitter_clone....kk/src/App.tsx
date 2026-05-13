import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { Layout } from "@/components/Layout";
import { AuthGuard } from "@/components/AuthGuard";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Notifications from "@/pages/Notifications";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

/**
 * Configure Query Client for global state management and caching.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Root Application Component
 * Sets up routing, global providers, and the responsive layout shell.
 * 
 * Twitter Clone - Cloned by Phumeh
 * Built with React, TypeScript, and Supabase
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthGuard>
            <Layout>
              <Routes>
                {/* Main Timeline Feed */}
                <Route 
                  path={ROUTE_PATHS.HOME} 
                  element={<Home />} 
                />

                {/* Content Discovery & Trending */}
                <Route 
                  path={ROUTE_PATHS.EXPLORE} 
                  element={<Explore />} 
                />

                {/* User Notifications & Activity */}
                <Route 
                  path={ROUTE_PATHS.NOTIFICATIONS} 
                  element={<Notifications />} 
                />

                {/* Private Messaging Interface */}
                <Route 
                  path={ROUTE_PATHS.MESSAGES} 
                  element={<Messages />} 
                />

                {/* User Profiles with Dynamic Handle Segment */}
                <Route 
                  path={ROUTE_PATHS.PROFILE} 
                  element={<Profile />} 
                />

                {/* Account & Privacy Settings */}
                <Route 
                  path={ROUTE_PATHS.SETTINGS} 
                  element={<Settings />} 
                />

                {/* Catch-all: Redirect to Home for unknown routes */}
                <Route 
                  path="*" 
                  element={<Navigate to={ROUTE_PATHS.HOME} replace />} 
                />
              </Routes>
            </Layout>
          </AuthGuard>
        </BrowserRouter>
        
        {/* Global Feedback Components */}
        <Toaster />
        <Sonner 
          position="bottom-right" 
          closeButton 
          richColors 
          expand={false}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
