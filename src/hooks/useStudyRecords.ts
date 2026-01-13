'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TimerMode } from './useTimer';

export interface StudySession {
    id: string;
    date: string;        // ISO date string
    mode: TimerMode;
    duration: number;    // in seconds
    completedAt: string; // ISO datetime string
}

export interface StudyStats {
    todayFocusTime: number;
    todaySessions: number;
    weekFocusTime: number;
    weekSessions: number;
    totalFocusTime: number;
    totalSessions: number;
}

export function useStudyRecords() {
    const [sessions, setSessions] = useLocalStorage<StudySession[]>('pomodoroSessions', []);

    const addSession = useCallback((mode: TimerMode, duration: number) => {
        const now = new Date();
        const newSession: StudySession = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: now.toISOString().split('T')[0],
            mode,
            duration,
            completedAt: now.toISOString(),
        };

        setSessions((prev) => [...prev, newSession]);
    }, [setSessions]);

    const getStats = useCallback((): StudyStats => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // Get start of week (Monday)
        const weekStart = new Date(now);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);

        let todayFocusTime = 0;
        let todaySessions = 0;
        let weekFocusTime = 0;
        let weekSessions = 0;
        let totalFocusTime = 0;
        let totalSessions = 0;

        sessions.forEach((session) => {
            if (session.mode === 'focus') {
                totalFocusTime += session.duration;
                totalSessions += 1;

                if (session.date === todayStr) {
                    todayFocusTime += session.duration;
                    todaySessions += 1;
                }

                const sessionDate = new Date(session.completedAt);
                if (sessionDate >= weekStart) {
                    weekFocusTime += session.duration;
                    weekSessions += 1;
                }
            }
        });

        return {
            todayFocusTime,
            todaySessions,
            weekFocusTime,
            weekSessions,
            totalFocusTime,
            totalSessions,
        };
    }, [sessions]);

    const clearSessions = useCallback(() => {
        setSessions([]);
    }, [setSessions]);

    const getTodaySessions = useCallback((): StudySession[] => {
        const todayStr = new Date().toISOString().split('T')[0];
        return sessions.filter((s) => s.date === todayStr);
    }, [sessions]);

    return {
        sessions,
        addSession,
        getStats,
        clearSessions,
        getTodaySessions,
    };
}
