import { useEffect } from 'react';
import { usePomodoroStore } from '../store/pomodoroStore';
import { useNavigate } from 'react-router-dom';

export default function FloatingPomodoro() {
  const navigate = useNavigate();
  const { timeLeft, isRunning, tick } = usePomodoroStore();

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div
      className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer z-50"
      onClick={() => navigate('/pomodoro')}
    >
      ⏱ {minutes}:{seconds}
    </div>
  );
}
