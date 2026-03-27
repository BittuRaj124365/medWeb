import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WifiOff, Globe, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="glass p-12 rounded-[40px] border border-white/20 shadow-2xl max-w-sm w-full mx-4 text-center transform animate-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto border border-red-100 shadow-xl">
            <WifiOff className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Offline Mode</h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          We've lost connection to our servers. Please check your network settings to continue shopping.
        </p>
        
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-center gap-3 py-3 px-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Retrying connection...
              </span>
           </div>
           
           <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">MedShop Cloud Sync</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NoInternetBanner;
