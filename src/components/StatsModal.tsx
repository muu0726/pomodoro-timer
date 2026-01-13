'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Clock, Calendar, Trash2 } from 'lucide-react';
import { StudyStats, StudySession } from '@/hooks/useStudyRecords';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: StudyStats;
    todaySessions: StudySession[];
    onClearHistory: () => void;
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
}

export function StatsModal({ isOpen, onClose, stats, todaySessions, onClearHistory }: StatsModalProps) {
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
                        <div className="glass-card p-6 max-h-[80vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="h-5 w-5 text-zinc-400" />
                                    <h2 className="text-lg font-medium text-foreground">学習記録</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-charcoal-light hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {/* Today */}
                                <div className="rounded-xl bg-charcoal border border-border-subtle p-4">
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                                        <Clock className="h-3 w-3" />
                                        今日
                                    </div>
                                    <div className="text-2xl font-medium text-foreground">
                                        {formatTime(stats.todayFocusTime)}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                        {stats.todaySessions} セッション
                                    </div>
                                </div>

                                {/* This Week */}
                                <div className="rounded-xl bg-charcoal border border-border-subtle p-4">
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                                        <Calendar className="h-3 w-3" />
                                        今週
                                    </div>
                                    <div className="text-2xl font-medium text-foreground">
                                        {formatTime(stats.weekFocusTime)}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                        {stats.weekSessions} セッション
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="col-span-2 rounded-xl bg-charcoal border border-border-subtle p-4">
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                                        <BarChart3 className="h-3 w-3" />
                                        累計
                                    </div>
                                    <div className="text-2xl font-medium text-foreground">
                                        {formatTime(stats.totalFocusTime)}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                        {stats.totalSessions} セッション完了
                                    </div>
                                </div>
                            </div>

                            {/* Today's Sessions */}
                            {todaySessions.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm text-zinc-400 mb-3">今日のセッション</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {todaySessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className="flex items-center justify-between rounded-lg bg-charcoal/50 border border-border-subtle px-3 py-2"
                                            >
                                                <span className="text-sm text-zinc-400">
                                                    {session.mode === 'focus' ? '集中' : session.mode === 'shortBreak' ? '小休憩' : '長休憩'}
                                                </span>
                                                <span className="text-sm text-foreground">
                                                    {formatTime(session.duration)}
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                    {new Date(session.completedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Clear History Button */}
                            <button
                                onClick={() => {
                                    if (confirm('すべての学習記録を削除しますか？')) {
                                        onClearHistory();
                                    }
                                }}
                                className="flex items-center justify-center gap-2 w-full rounded-full bg-charcoal border border-border-subtle py-2.5 text-sm text-zinc-400 hover:text-red-400 hover:border-red-400/30 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                履歴をクリア
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
