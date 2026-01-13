'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onPlayClick?: () => void;
}

export function TimerControls({
    isRunning,
    onStart,
    onPause,
    onReset,
    onPlayClick,
}: TimerControlsProps) {
    const handlePlayPause = () => {
        onPlayClick?.();
        if (isRunning) {
            onPause();
        } else {
            onStart();
        }
    };

    const handleReset = () => {
        onPlayClick?.();
        onReset();
    };

    return (
        <div className="flex items-center gap-4">
            {/* Reset Button */}
            <motion.button
                onClick={handleReset}
                className="btn-matte flex h-14 w-14 items-center justify-center rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
                <RotateCcw className="h-5 w-5 text-zinc-400" />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
                onClick={handlePlayPause}
                className="btn-matte flex h-20 w-20 items-center justify-center rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
                {isRunning ? (
                    <Pause className="h-7 w-7 text-foreground" />
                ) : (
                    <Play className="h-7 w-7 text-foreground ml-1" />
                )}
            </motion.button>

            {/* Spacer for symmetry */}
            <div className="h-14 w-14" />
        </div>
    );
}
