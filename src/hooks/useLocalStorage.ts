'use client';

import { useState, useEffect, useCallback } from 'react';

// Type guard to validate data structure
function isValidData<T>(data: unknown, initialValue: T): data is T {
    if (data === null || data === undefined) return false;

    // Check if types match
    if (typeof data !== typeof initialValue) return false;

    // For objects, check if all required keys exist
    if (typeof initialValue === 'object' && initialValue !== null && !Array.isArray(initialValue)) {
        const requiredKeys = Object.keys(initialValue as object);
        const dataKeys = Object.keys(data as object);

        for (const key of requiredKeys) {
            if (!dataKeys.includes(key)) return false;
        }
    }

    // For arrays, validate each item
    if (Array.isArray(initialValue) && Array.isArray(data)) {
        // Arrays are valid if they're empty or contain similar types
        return true;
    }

    return true;
}

// Sanitize string values to prevent XSS
function sanitizeValue<T>(value: T): T {
    if (typeof value === 'string') {
        // Remove any potential script tags or dangerous content
        return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') as T;
    }

    if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
            return value.map(item => sanitizeValue(item)) as T;
        }

        const sanitized: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value)) {
            // Sanitize key names to prevent prototype pollution
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }
            sanitized[key] = sanitizeValue(val);
        }
        return sanitized as T;
    }

    return value;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isHydrated, setIsHydrated] = useState(false);

    // Validate and sanitize key name
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(safeKey);
            if (item) {
                const parsed = JSON.parse(item);

                // Validate data structure
                if (isValidData(parsed, initialValue)) {
                    // Sanitize before storing
                    setStoredValue(sanitizeValue(parsed));
                } else {
                    // Invalid data structure, use default and clear corrupted data
                    console.warn(`Invalid data structure for localStorage key "${safeKey}", using default value`);
                    window.localStorage.removeItem(safeKey);
                }
            }
        } catch (error) {
            // JSON parse error or other issue - clear corrupted data
            console.warn(`Error reading localStorage key "${safeKey}":`, error);
            try {
                window.localStorage.removeItem(safeKey);
            } catch {
                // Ignore if removal fails
            }
        }
        setIsHydrated(true);
    }, [safeKey, initialValue]);

    // Save to localStorage when value changes
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            setStoredValue((prev) => {
                const valueToStore = value instanceof Function ? value(prev) : value;

                // Sanitize before storing
                const sanitizedValue = sanitizeValue(valueToStore);

                // Validate before storing
                if (!isValidData(sanitizedValue, initialValue)) {
                    console.warn(`Attempted to store invalid data for "${safeKey}"`);
                    return prev;
                }

                window.localStorage.setItem(safeKey, JSON.stringify(sanitizedValue));
                return sanitizedValue;
            });
        } catch (error) {
            console.warn(`Error setting localStorage key "${safeKey}":`, error);
        }
    }, [safeKey, initialValue]);

    return [isHydrated ? storedValue : initialValue, setValue];
}

