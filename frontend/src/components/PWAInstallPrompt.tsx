import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Don't show if user dismissed before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-background/95 border-t shadow-lg z-50 animate-in slide-in-from-bottom-5">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Install My Wallet</h3>
          <p className="text-xs text-muted-foreground">
            Add to home screen for quick access and offline use
          </p>
        </div>
        <Button onClick={handleInstall} size="sm">
          Install
        </Button>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
