import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { InstallPrompt } from "@/components/InstallPrompt";

import Home from "@/pages/Home";
import Category from "@/pages/Category";
import Bookmarks from "@/pages/Bookmarks";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:category" component={Category} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          
          <footer className="border-t py-8 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
              <p className="mb-2 font-display font-bold text-lg text-foreground">OG MEDIA</p>
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </footer>
          
          <InstallPrompt />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
