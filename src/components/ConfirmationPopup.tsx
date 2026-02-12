import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';

interface ConfirmationPopupProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md bg-gray-950 border border-neon-pink/50 rounded-2xl shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden"
                    >
                        {/* Header Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent" />

                        <div className="p-8 flex flex-col items-center text-center gap-6">

                            <div className="w-16 h-16 rounded-full bg-neon-pink/10 flex items-center justify-center mb-2">
                                <HelpCircle size={40} className="text-neon-pink" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2 font-display">
                                    {title}
                                </h3>
                                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full mt-2">
                                <button
                                    onClick={onCancel}
                                    className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-300 font-mono font-bold tracking-wider transition-colors"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-6 py-3 rounded-xl bg-neon-pink hover:bg-neon-pink/80 text-white font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all"
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </div>

                        {/* Close button top right */}
                        <button
                            onClick={onCancel}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationPopup;
