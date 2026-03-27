import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WifiOff } from 'lucide-react';

const NoInternetBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
      toast.success('Connection restored!', {
        duration: 3000,
        icon: '🌐',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
      <div className="text-center px-8 max-w-sm">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3">No Internet Connection</h2>
        <p className="text-slate-400 font-medium leading-relaxed">
          Please check your connection and try again.
          <br />
          The page will reload automatically once you're back online.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-slate-500 text-sm font-medium">Waiting for connection...</span>
        </div>
      </div>
    </div>
  );
};

export default NoInternetBanner;
