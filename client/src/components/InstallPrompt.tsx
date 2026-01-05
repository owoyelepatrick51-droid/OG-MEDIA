import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 md:w-96"
        >
          <div className="bg-foreground text-background p-4 rounded-xl shadow-2xl border border-white/10 flex items-center gap-4">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Install App</h4>
              <p className="text-xs text-muted-foreground">Get the best experience on mobile</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={handleInstall}>
                Install
              </Button>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
