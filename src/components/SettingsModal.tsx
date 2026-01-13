'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Repeat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TimerSettings } from '@/hooks/useTimer';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: TimerSettings;
    onSave: (settings: TimerSettings) => void;
    autoCycle: boolean;
    onAutoCycleChange: (value: boolean) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave, autoCycle, onAutoCycleChange }: SettingsModalProps) {
    const [localSettings, setLocalSettings] = useState({
        focus: Math.floor(settings.focus / 60),
        shortBreak: Math.floor(settings.shortBreak / 60),
        longBreak: Math.floor(settings.longBreak / 60),
    });
    const [localAutoCycle, setLocalAutoCycle] = useState(autoCycle);

    useEffect(() => {
        setLocalAutoCycle(autoCycle);
    }, [autoCycle]);

    const handleSave = () => {
        onSave({
            focus: localSettings.focus * 60,
            shortBreak: localSettings.shortBreak * 60,
            longBreak: localSettings.longBreak * 60,
        });
        onAutoCycleChange(localAutoCycle);
        onClose();
    };

    const handleChange = (key: keyof typeof localSettings, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0 && numValue <= 120) {
            setLocalSettings((prev) => ({ ...prev, [key]: numValue }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
                    >
                        <div className="glass-card p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Settings className="h-5 w-5 text-zinc-400" />
                                    <h2 className="text-lg font-medium text-foreground">設定</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-charcoal-light hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Settings Fields */}
                            <div className="space-y-4">
                                {/* Auto Cycle Toggle */}
                                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                                    <div className="flex items-center gap-2">
                                        <Repeat className="h-4 w-4 text-zinc-400" />
                                        <label className="text-sm text-zinc-400">自動サイクル</label>
                                    </div>
                                    <button
                                        onClick={() => setLocalAutoCycle(!localAutoCycle)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${localAutoCycle ? 'bg-zinc-500' : 'bg-charcoal'
                                            } border border-border-subtle`}
                                    >
                                        <motion.div
                                            className="absolute top-0.5 w-5 h-5 rounded-full bg-foreground"
                                            animate={{ left: localAutoCycle ? '24px' : '2px' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500 -mt-2 mb-4">
                                    集中と小休憩を自動で繰り返します
                                </p>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-zinc-400">集中時間（分）</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="120"
                                        value={localSettings.focus}
                                        onChange={(e) => handleChange('focus', e.target.value)}
                                        className="w-20 rounded-lg bg-charcoal border border-border-subtle px-3 py-2 text-center text-foreground focus:border-border-hover focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-zinc-400">小休憩（分）</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={localSettings.shortBreak}
                                        onChange={(e) => handleChange('shortBreak', e.target.value)}
                                        className="w-20 rounded-lg bg-charcoal border border-border-subtle px-3 py-2 text-center text-foreground focus:border-border-hover focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-zinc-400">長休憩（分）</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={localSettings.longBreak}
                                        onChange={(e) => handleChange('longBreak', e.target.value)}
                                        className="w-20 rounded-lg bg-charcoal border border-border-subtle px-3 py-2 text-center text-foreground focus:border-border-hover focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <motion.button
                                onClick={handleSave}
                                className="mt-6 w-full rounded-full bg-charcoal-light border border-border-subtle py-3 text-sm font-medium text-foreground hover:border-border-hover transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                保存する
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

