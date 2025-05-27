import { useEffect } from "react";
import { usePomodoroStore } from "../store/pomodoroStore";

const PomodoroTimer = () => {
  const {
    timeLeft,
    isRunning,
    mode,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
  } = usePomodoroStore();

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="text-center p-4 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-2 capitalize">{mode} Time</h2>
      <div className="text-5xl font-bold mb-4">{formatTime(timeLeft)}</div>
      <div className="space-x-2">
        {!isRunning ? (
          <button className="btn" onClick={startTimer}>Start</button>
        ) : (
          <button className="btn" onClick={pauseTimer}>Pause</button>
        )}
        <button className="btn" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
