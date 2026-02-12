import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Save } from 'lucide-react';

const NetworkStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Listen for localStorage changes to flash "Saved"
    useEffect(() => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function (key, value) {
            originalSetItem.apply(this, [key, value]);
            if (key.startsWith('autosave_')) {
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 2000);
            }
        };
        return () => {
            localStorage.setItem = originalSetItem;
        };
    }, []);

    return (
        <div className="flex flex-col items-end gap-0.5">
            <div className={`flex items-center gap-1.5 transition-colors ${isOnline ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                <span className="text-[10px] tracking-widest uppercase font-mono">
                    {isOnline ? 'NET_LINK: STABLE' : 'NET_LINK: OFFLINE'}
                </span>
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_4px_currentColor]`}></span>
            </div>

            <div className={`flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-mono transition-all duration-300 ${showSaved ? 'text-cyan-300' : 'text-cyan-500/50'}`}>
                <span>LOCAL_SAVE: {showSaved ? 'SYNCED' : 'ACTIVE'}</span>
                <Save size={10} className={showSaved ? 'animate-pulse' : ''} />
            </div>
        </div>
    );
};

export default NetworkStatus;
