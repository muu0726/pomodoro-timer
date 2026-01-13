'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
    focus: number;
    shortBreak: number;
    longBreak: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export function useTimer(settings: TimerSettings = DEFAULT_SETTINGS) {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(settings.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);

    const startTimeRef = useRef<number | null>(null);
    const pausedTimeRef = useRef<number>(settings.focus);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const totalTime = settings[mode];
    const progress = timeLeft / totalTime;

    // Clear interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Update timeLeft when settings change
    useEffect(() => {
        if (!isRunning) {
            setTimeLeft(settings[mode]);
            pausedTimeRef.current = settings[mode];
        }
    }, [settings, mode, isRunning]);

    const tick = useCallback(() => {
        if (startTimeRef.current === null) return;

        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newTime = Math.max(0, pausedTimeRef.current - elapsed);

        setTimeLeft(newTime);

        if (newTime === 0) {
            setIsRunning(false);
            setIsCompleted(true);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, []);

    const start = useCallback(() => {
        if (isRunning) return;

        setIsCompleted(false);
        startTimeRef.current = Date.now();
        pausedTimeRef.current = timeLeft;
        setIsRunning(true);

        intervalRef.current = setInterval(tick, 100);
    }, [isRunning, timeLeft, tick]);

    const pause = useCallback(() => {
        if (!isRunning) return;

        setIsRunning(false);
        pausedTimeRef.current = timeLeft;
        startTimeRef.current = null;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [isRunning, timeLeft]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setIsCompleted(false);
        setTimeLeft(settings[mode]);
        pausedTimeRef.current = settings[mode];
        startTimeRef.current = null;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [settings, mode]);

    const changeMode = useCallback((newMode: TimerMode) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setMode(newMode);
        setIsRunning(false);
        setIsCompleted(false);
        setTimeLeft(settings[newMode]);
        pausedTimeRef.current = settings[newMode];
        startTimeRef.current = null;
    }, [settings]);

    // Start next cycle (for auto-cycle mode)
    const startNextCycle = useCallback(() => {
        const nextMode: TimerMode = mode === 'focus' ? 'shortBreak' : 'focus';

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setMode(nextMode);
        setIsCompleted(false);
        setTimeLeft(settings[nextMode]);
        pausedTimeRef.current = settings[nextMode];

        if (nextMode === 'focus') {
            setCycleCount(prev => prev + 1);
        }

        // Auto-start next timer
        startTimeRef.current = Date.now();
        setIsRunning(true);
        intervalRef.current = setInterval(tick, 100);
    }, [mode, settings, tick]);

    return {
        mode,
        timeLeft,
        isRunning,
        isCompleted,
        progress,
        totalTime,
        cycleCount,
        start,
        pause,
        reset,
        changeMode,
        setIsCompleted,
        startNextCycle,
    };
}

