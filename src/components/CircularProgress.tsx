'use client';

import { motion } from 'framer-motion';
import { TimerMode } from '@/hooks/useTimer';

interface CircularProgressProps {
    progress: number;
    isRunning: boolean;
    mode: TimerMode;
    size?: number;
    strokeWidth?: number;
    children?: React.ReactNode;
}

export function CircularProgress({
    progress,
    isRunning,
    mode,
    size = 320,
    strokeWidth = 4,
    children,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - progress * circumference;

    const getGlowColor = () => {
        switch (mode) {
            case 'focus':
                return 'var(--glow-primary)';
            case 'shortBreak':
                return 'var(--glow-secondary)';
            case 'longBreak':
                return 'var(--glow-tertiary)';
        }
    };

    const getGlowClass = () => {
        if (!isRunning) return '';
        switch (mode) {
            case 'focus':
                return 'glow-primary-ring';
            case 'shortBreak':
                return 'filter drop-shadow-[0_0_8px_rgba(160,160,160,0.2)]';
            case 'longBreak':
                return 'filter drop-shadow-[0_0_8px_rgba(96,96,96,0.25)]';
        }
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className={`transform -rotate-90 ${getGlowClass()}`}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getGlowColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeOut',
                    }}
                    style={{
                        filter: isRunning ? `drop-shadow(0 0 6px ${getGlowColor()})` : 'none',
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
