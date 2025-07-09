import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PomodoroTimerProps {}

const PomodoroTimer: React.FC<PomodoroTimerProps> = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work');
  const [session, setSession] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  const longBreakTime = 10 * 60; // 10 minutes

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      if (mode === 'work') {
        // Work session finished, start break
        setMode('break');
        setTimeLeft(breakTime);
      } else {
        // Break finished, start new work session
        setMode('work');
        setTimeLeft(workTime);
        setSession(prev => prev + 1);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, mode, workTime, breakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setTimeLeft(workTime);
    } else if (mode === 'break') {
      setTimeLeft(breakTime);
    } else {
      setTimeLeft(longBreakTime);
    }
  };

  const switchMode = (newMode: 'work' | 'break' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'work') {
      setTimeLeft(workTime);
    } else if (newMode === 'break') {
      setTimeLeft(breakTime);
    } else {
      setTimeLeft(longBreakTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins, secs };
  };

  const { mins, secs } = formatTime(timeLeft);
  const getCurrentModeTime = () => {
    if (mode === 'work') return workTime;
    if (mode === 'break') return breakTime;
    return longBreakTime;
  };
  
  const progressPercentage = ((getCurrentModeTime() - timeLeft) / getCurrentModeTime()) * 100;

  const getModeLabel = () => {
    if (mode === 'work') return 'Focus Time';
    if (mode === 'break') return 'Break Time';
    return 'Long Break';
  };

  return (
    <div className="min-h-screen text-black flex" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* Progress indicator and session info */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-8 h-1 bg-orange-500 rounded-full mb-4"></div>
            <div className="text-orange-500 text-sm font-medium mb-2">{Math.round(progressPercentage)}%</div>
            <div style={{ color: '#737373' }} className="text-xs mb-4">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: '2-digit',
                weekday: 'short'
              })}
            </div>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-0.5 rounded-full transition-colors ${
                    num <= session ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mode Switcher - Moved above timer */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Button
              onClick={() => switchMode('work')}
              variant="ghost"
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                mode === 'work'
                  ? 'bg-white border border-gray-200 shadow-lg text-black' 
                  : 'hover:bg-gray-100'
              }`}
              style={mode !== 'work' ? { color: '#737373' } : {}}
            >
              Work (25min)
            </Button>
            <Button
              onClick={() => switchMode('break')}
              variant="ghost"
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                mode === 'break'
                  ? 'bg-white border border-gray-200 shadow-lg text-black' 
                  : 'hover:bg-gray-100'
              }`}
              style={mode !== 'break' ? { color: '#737373' } : {}}
            >
              Break (5min)
            </Button>
            <Button
              onClick={() => switchMode('longBreak')}
              variant="ghost"
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                mode === 'longBreak'
                  ? 'bg-white border border-gray-200 shadow-lg text-black' 
                  : 'hover:bg-gray-100'
              }`}
              style={mode !== 'longBreak' ? { color: '#737373' } : {}}
            >
              Long Break (10min)
            </Button>
          </div>

          {/* Timer Display */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white border border-gray-200 shadow-lg rounded-3xl p-8 mx-2 min-w-[120px]">
              <div className="text-8xl font-bold tracking-wider" style={{ color: '#000000' }}>
                {mins.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-lg rounded-3xl p-8 mx-2 min-w-[120px]">
              <div className="text-8xl font-bold tracking-wider" style={{ color: '#000000' }}>
                {secs.toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Session Type Indicator */}
          <div className="mb-8">
            <div className="text-lg mb-2" style={{ color: '#737373' }}>
              {getModeLabel()}
            </div>
            <div className="text-sm" style={{ color: '#737373' }}>
              Session {session}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={toggleTimer}
              className="bg-white border border-gray-200 hover:bg-gray-50 shadow-lg text-black rounded-full px-8 py-3 transition-all duration-200"
            >
              {isActive ? (
                <Pause className="w-5 h-5 mr-2" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="ghost"
              className="hover:bg-gray-100 rounded-full px-6 py-3 transition-all duration-200"
              style={{ color: '#737373' }}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
