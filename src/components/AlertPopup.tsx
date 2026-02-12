import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

interface AlertPopupProps {
    isOpen: boolean;
    message: string;
    type?: 'warning' | 'error' | 'success' | 'info';
    onClose: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ isOpen, message, type = 'warning', onClose }) => {
    // Auto-close after 5 seconds
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    const getColor = () => {
        switch (type) {
            case 'error': return 'text-red-500 border-red-500 bg-red-950/90';
            case 'success': return 'text-green-500 border-green-500 bg-green-950/90';
            case 'info': return 'text-blue-500 border-blue-500 bg-blue-950/90';
            default: return 'text-yellow-500 border-yellow-500 bg-yellow-950/90';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={48} />;
            default: return <AlertTriangle size={48} />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-24 pointer-events-none"
                    style={{ background: 'rgba(0,0,0,0.2)' }} // Slight dimming
                >
                    <motion.div
                        initial={{ y: -50, scale: 0.8, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: -50, scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`pointer-events-auto relative min-w-[400px] max-w-2xl px-8 py-6 rounded-xl border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-6 ${getColor()}`}
                    >
                        <div className="shrink-0 animate-pulse">
                            {getIcon()}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-display font-bold uppercase tracking-widest mb-1">
                                {type === 'error' ? 'CRITICAL WARNING' : 'SYSTEM ALERT'}
                            </h3>
                            <p className="font-mono text-lg font-bold opacity-90 leading-tight">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 p-1 hover:bg-black/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertPopup;
