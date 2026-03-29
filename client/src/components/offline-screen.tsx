import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function OfflineScreen() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await fetch("/api/health", { cache: "no-store" });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    } finally {
      setRetrying(false);
    }
  };

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-8">
      {/* Illustration */}
      <div className="relative mb-10">
        {/* Outer ring */}
        <div className="w-44 h-44 rounded-full bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center shadow-inner">
          {/* Middle ring */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
            {/* Icon — wifi with a cross overlay */}
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center relative">
              <i className="fas fa-wifi text-3xl text-gray-300" style={{ fontSize: "1.8rem" }}></i>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-0.5 bg-gray-400 rotate-45 rounded-full translate-y-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <span className="absolute top-2 -right-2 w-5 h-5 rounded-full bg-blue-100 opacity-80"></span>
        <span className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-gray-200 opacity-70"></span>
        <span className="absolute top-8 -left-1 w-2 h-2 rounded-full bg-blue-200 opacity-60"></span>

        {/* Signal bars decoration */}
        <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-end justify-center gap-0.5 pb-2.5">
          <span className="w-1 h-1.5 rounded-sm bg-gray-300"></span>
          <span className="w-1 h-2.5 rounded-sm bg-gray-300"></span>
          <span className="w-1 h-3.5 rounded-sm bg-gray-200"></span>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No Internet</h2>
      <p className="text-gray-400 text-sm text-center leading-relaxed mb-2 max-w-xs">
        Looks like you're offline. Check your Wi-Fi or mobile data and try again.
      </p>

      {/* Divider line */}
      <div className="w-12 h-0.5 rounded-full bg-gray-100 my-5"></div>

      {/* Retry button */}
      <Button
        onClick={handleRetry}
        disabled={retrying}
        className="px-10 py-2.5 rounded-xl font-semibold text-sm shadow-md bg-gray-900 hover:bg-gray-800 text-white"
        data-testid="button-retry-connection"
      >
        {retrying ? (
          <>
            <i className="fas fa-circle-notch fa-spin mr-2 text-xs"></i>
            Checking...
          </>
        ) : (
          <>
            <i className="fas fa-redo mr-2 text-xs"></i>
            Try Again
          </>
        )}
      </Button>

      {/* Footer hint */}
      <p className="text-gray-300 text-xs mt-6">CartCircle will reconnect automatically</p>
    </div>
  );
}
