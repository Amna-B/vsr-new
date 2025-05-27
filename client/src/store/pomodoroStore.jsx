import { create } from 'zustand';

export const usePomodoroStore = create((set, get) => ({
  sessionLength: 25 * 60,
  shortBreakLength: 5 * 60,
  longBreakLength: 15 * 60,
  timeLeft: 25 * 60,
  isRunning: false,
  currentMode: 'work', // 'work' | 'shortBreak' | 'longBreak'
  completedSessions: 0,

  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => {
    const { currentMode, sessionLength, shortBreakLength, longBreakLength } = get();
    const newTime =
      currentMode === 'work'
        ? sessionLength
        : currentMode === 'shortBreak'
        ? shortBreakLength
        : longBreakLength;
    set({ timeLeft: newTime, isRunning: false });
  },

  tick: () => {
    const { timeLeft, currentMode, completedSessions, sessionLength, shortBreakLength, longBreakLength } = get();

    if (timeLeft > 1) {
      set((state) => ({ timeLeft: state.timeLeft - 1 }));
    } else {
      // Auto-switch
      if (currentMode === 'work') {
        const isLongBreak = (completedSessions + 1) % 4 === 0;
        set({
          currentMode: isLongBreak ? 'longBreak' : 'shortBreak',
          timeLeft: isLongBreak ? longBreakLength : shortBreakLength,
          completedSessions: completedSessions + 1,
        });
      } else {
        set({
          currentMode: 'work',
          timeLeft: sessionLength,
        });
      }
    }
  },

  setLengths: ({ session, shortBreak, longBreak }) =>
    set(() => ({
      sessionLength: session * 60,
      shortBreakLength: shortBreak * 60,
      longBreakLength: longBreak * 60,
      timeLeft: session * 60,
    })),
}));
