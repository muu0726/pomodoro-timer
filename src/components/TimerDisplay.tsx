'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimerDisplayProps {
    timeLeft: number;
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
    const [displayTime, setDisplayTime] = useState({ minutes: '00', seconds: '00' });

    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        setDisplayTime({
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
        });
    }, [timeLeft]);

    return (
        <div
            className="flex items-center justify-center font-mono text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight"
            style={{
                color: '#0a0a0a',
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.2)'
            }}
        >
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={displayTime.minutes}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="timer-digit inline-block min-w-[1.2em] text-center"
                >
                    {displayTime.minutes}
                </motion.span>
            </AnimatePresence>

            <motion.span
                className="mx-1 md:mx-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
                :
            </motion.span>

            <AnimatePresence mode="popLayout">
                <motion.span
                    key={displayTime.seconds}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="timer-digit inline-block min-w-[1.2em] text-center"
                >
                    {displayTime.seconds}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
