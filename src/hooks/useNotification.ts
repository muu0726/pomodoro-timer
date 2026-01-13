'use client';

import { useCallback, useEffect, useState } from 'react';

export function useNotification() {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        } catch (error) {
            console.warn('Error requesting notification permission:', error);
            return false;
        }
    }, []);

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return null;
        }

        if (Notification.permission !== 'granted') {
            return null;
        }

        try {
            return new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options,
            });
        } catch (error) {
            console.warn('Error sending notification:', error);
            return null;
        }
    }, []);

    return {
        permission,
        requestPermission,
        sendNotification,
    };
}
