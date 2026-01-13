'use client';

import { useEffect, useRef } from 'react';

export function useDynamicTitle(timeLeft: number, mode: string, isRunning: boolean) {
    const originalTitleRef = useRef<string>('');

    useEffect(() => {
        if (!originalTitleRef.current) {
            originalTitleRef.current = document.title;
        }
    }, []);

    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const modeLabel = mode === 'focus' ? '集中' : mode === 'shortBreak' ? '小休憩' : '長休憩';

        if (isRunning) {
            document.title = `(${timeString}) ${modeLabel} | ポモドーロ`;
        } else {
            document.title = `${modeLabel} | ポモドーロタイマー`;
        }

        return () => {
            if (originalTitleRef.current) {
                document.title = originalTitleRef.current;
            }
        };
    }, [timeLeft, mode, isRunning]);
}
