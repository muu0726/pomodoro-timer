'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Repeat, BarChart3 } from 'lucide-react';
import { useTimer, TimerSettings } from '@/hooks/useTimer';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNotification } from '@/hooks/useNotification';
import { useSound } from '@/hooks/useSound';
import { useStudyRecords } from '@/hooks/useStudyRecords';
import { CircularProgress } from '@/components/CircularProgress';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';
import { ModeSelector } from '@/components/ModeSelector';
import { SettingsModal } from '@/components/SettingsModal';
import { StatsModal } from '@/components/StatsModal';

const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function Home() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('pomodoroSettings', DEFAULT_SETTINGS);
  const [autoCycle, setAutoCycle] = useLocalStorage<boolean>('pomodoroAutoCycle', false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const timer = useTimer(settings);
  const { requestPermission, sendNotification } = useNotification();
  const { playClick, playAlarm } = useSound();
  const { addSession, getStats, getTodaySessions, clearSessions } = useStudyRecords();

  useDynamicTitle(timer.timeLeft, timer.mode, timer.isRunning);

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Handle timer completion
  useEffect(() => {
    if (timer.isCompleted) {
      playAlarm();

      // Record the completed session
      addSession(timer.mode, settings[timer.mode]);

      const modeLabels = {
        focus: '集中セッションが終了しました！',
        shortBreak: '小休憩が終わりました！',
        longBreak: '長休憩が終わりました！',
      };

      sendNotification('ポモドーロタイマー', {
        body: modeLabels[timer.mode],
        tag: 'pomodoro-timer',
      });

      timer.setIsCompleted(false);

      // Auto-cycle: automatically start next timer
      if (autoCycle && timer.mode !== 'longBreak') {
        setTimeout(() => {
          timer.startNextCycle();
        }, 1000);
      }
    }
  }, [timer.isCompleted, timer.mode, playAlarm, sendNotification, timer, autoCycle, addSession, settings]);

  const getGlowClass = () => {
    if (!timer.isRunning) return '';
    switch (timer.mode) {
      case 'focus':
        return 'glow-primary';
      case 'shortBreak':
        return 'glow-secondary';
      case 'longBreak':
        return 'glow-tertiary';
    }
  };

  const stats = getStats();
  const todaySessions = getTodaySessions();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-matte-black p-4">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-matte-black via-charcoal/20 to-matte-black" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`relative z-10 glass-card p-8 md:p-12 transition-shadow duration-500 ${getGlowClass()}`}
      >
        {/* Stats Button (Left) */}
        <motion.button
          onClick={() => {
            playClick();
            setIsStatsOpen(true);
          }}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:bg-charcoal-light hover:text-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <BarChart3 className="h-5 w-5" />
        </motion.button>

        {/* Auto Cycle Indicator & Settings Button */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {autoCycle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-charcoal border border-border-subtle text-xs text-zinc-400"
            >
              <Repeat className="h-3 w-3" />
              <span>自動</span>
            </motion.div>
          )}
          <motion.button
            onClick={() => {
              playClick();
              setIsSettingsOpen(true);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:bg-charcoal-light hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Mode Selector */}
          <ModeSelector
            mode={timer.mode}
            onModeChange={timer.changeMode}
            onPlayClick={playClick}
          />

          {/* Cycle Counter */}
          {timer.cycleCount > 0 && (
            <div className="text-xs text-zinc-500">
              サイクル {timer.cycleCount}
            </div>
          )}

          {/* Timer Display with Circular Progress */}
          <CircularProgress
            progress={timer.progress}
            isRunning={timer.isRunning}
            mode={timer.mode}
          >
            <TimerDisplay timeLeft={timer.timeLeft} />
          </CircularProgress>

          {/* Controls */}
          <TimerControls
            isRunning={timer.isRunning}
            onStart={timer.start}
            onPause={timer.pause}
            onReset={timer.reset}
            onPlayClick={playClick}
          />

          {/* Today's Stats Summary */}
          {stats.todaySessions > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-zinc-500"
            >
              今日: {Math.floor(stats.todayFocusTime / 60)}分 ({stats.todaySessions}セッション)
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
        autoCycle={autoCycle}
        onAutoCycleChange={setAutoCycle}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        todaySessions={todaySessions}
        onClearHistory={clearSessions}
      />
    </div>
  );
}



