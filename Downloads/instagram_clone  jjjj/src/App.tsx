import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { useAuth } from "@/hooks/useAuth";
import { PageLoading } from "@/components/Loading";

import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Reels from "@/pages/Reels";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Create from "@/pages/Create";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoading />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTE_PATHS.HOME} element={<Home />} />
        <Route path={ROUTE_PATHS.EXPLORE} element={<Explore />} />
        <Route path={ROUTE_PATHS.REELS} element={<Reels />} />
        <Route path={ROUTE_PATHS.MESSAGES} element={<Messages />} />
        <Route path={ROUTE_PATHS.CREATE} element={<Create />} />
        <Route path={ROUTE_PATHS.PROFILE} element={<Profile />} />
        
        <Route 
          path={ROUTE_PATHS.SEARCH} 
          element={<Explore />} 
        />
        <Route 
          path={ROUTE_PATHS.ACTIVITY} 
          element={<Home />} 
        />

        <Route 
          path="/direct" 
          element={<Navigate to={ROUTE_PATHS.MESSAGES} replace />} 
        />
        
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center bg-background">
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                Sorry, this page isn't available.
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                The link you followed may be broken, or the page may have been removed. 
                Go back to <a href="/" className="text-primary font-semibold hover:underline">Phume</a>.
              </p>
              <footer className="mt-auto pt-12 text-xs text-muted-foreground uppercase tracking-widest">
                © 2026 Phume • Cloned by Phumeh
              </footer>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" expand={false} richColors />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
