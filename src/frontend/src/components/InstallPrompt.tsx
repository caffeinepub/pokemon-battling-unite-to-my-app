import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPrompt: React.FC = () => {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Android / Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(null);
      setIsInstalled(true);
    }
  };

  if (isInstalled || dismissed) return null;
  if (!installEvent && !isIOS) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
      style={{
        background:
          "linear-gradient(135deg, rgba(10,10,15,0.97) 0%, rgba(30,10,5,0.97) 100%)",
        border: "1.5px solid rgba(255,68,0,0.5)",
        borderRadius: 16,
        boxShadow: "0 0 32px rgba(255,68,0,0.3), 0 8px 32px rgba(0,0,0,0.8)",
        padding: "16px 20px",
      }}
    >
      {showIOSGuide ? (
        <div>
          <p className="text-white font-bold text-sm mb-3">
            Install on iPhone / iPad:
          </p>
          <ol className="text-white/80 text-sm space-y-1.5 list-decimal list-inside">
            <li>
              Tap the <span className="font-bold text-orange-400">Share</span>{" "}
              button at the bottom of Safari
            </li>
            <li>
              Scroll down and tap{" "}
              <span className="font-bold text-orange-400">
                "Add to Home Screen"
              </span>
            </li>
            <li>
              Tap <span className="font-bold text-orange-400">Add</span> — done!
            </li>
          </ol>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="mt-3 w-full py-2 rounded-lg text-white/60 text-sm hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-3xl">🥷</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">
              Install Elemental Ninja
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Play offline, full screen on your phone
            </p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            {isIOS ? (
              <button
                type="button"
                onClick={() => setShowIOSGuide(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #ff4400, #ff8800)",
                }}
              >
                How to Install
              </button>
            ) : (
              <button
                type="button"
                onClick={handleInstall}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #ff4400, #ff8800)",
                }}
              >
                Install
              </button>
            )}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallPrompt;
