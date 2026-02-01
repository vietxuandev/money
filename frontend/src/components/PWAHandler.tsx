import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "./ui/button";
import { X, Download, RefreshCw } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAHandler = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useLocalStorage(
    "pwa-install-dismissed",
    false,
  );

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Don't show if user dismissed before
      if (!dismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismissUpdate = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      {/* Update Available Banner */}
      {needRefresh && (
        <div className="fixed top-0 left-0 right-0 p-4 bg-primary text-primary-foreground shadow-lg z-50 animate-in slide-in-from-top-5">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <RefreshCw className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Update Available</h3>
              <p className="text-xs opacity-90">
                A new version is available. Reload to update.
              </p>
            </div>
            <Button onClick={handleUpdate} size="sm" variant="secondary">
              Reload
            </Button>
            <Button
              onClick={handleDismissUpdate}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Install App Banner */}
      {showInstallPrompt && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-background to-background/95 border-t shadow-lg z-50 animate-in slide-in-from-bottom-5">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Download className="h-5 w-5 shrink-0" />
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
              onClick={handleDismissInstall}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
