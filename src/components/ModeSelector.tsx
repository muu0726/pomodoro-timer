'use client';

import { motion } from 'framer-motion';
import { TimerMode } from '@/hooks/useTimer';

interface ModeSelectorProps {
    mode: TimerMode;
    onModeChange: (mode: TimerMode) => void;
    onPlayClick?: () => void;
}

const modes: { key: TimerMode; label: string }[] = [
    { key: 'focus', label: '集中' },
    { key: 'shortBreak', label: '小休憩' },
    { key: 'longBreak', label: '長休憩' },
];

export function ModeSelector({ mode, onModeChange, onPlayClick }: ModeSelectorProps) {
    const handleModeChange = (newMode: TimerMode) => {
        onPlayClick?.();
        onModeChange(newMode);
    };

    return (
        <div className="relative flex rounded-full bg-charcoal p-1 border border-border-subtle">
            {modes.map((m) => (
                <button
                    key={m.key}
                    onClick={() => handleModeChange(m.key)}
                    className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${mode === m.key ? 'text-foreground' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    {m.label}

                    {mode === m.key && (
                        <motion.div
                            layoutId="activeMode"
                            className="absolute inset-0 rounded-full bg-charcoal-light border border-border-hover"
                            style={{ zIndex: -1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
