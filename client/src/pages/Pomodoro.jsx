import { useEffect, useState } from 'react';
import { usePomodoroStore } from '../store/pomodoroStore';
import useSyllabusStore from "../store/syllabusStore";
import PomodoroTimer from "../components/PomodoroTimer";

export default function PomodoroPage() {
  const {
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    currentMode,
    setLengths,
    sessionLength,
    shortBreakLength,
    longBreakLength,
  } = usePomodoroStore();

  const { syllabus, incrementSessions } = useSyllabusStore();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTopicVisible, setIsTopicVisible] = useState(false); // New state for toggling the dropdown visibility

  const [settings, setSettings] = useState({
    session: sessionLength / 60,
    shortBreak: shortBreakLength / 60,
    longBreak: longBreakLength / 60,
  });

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: Number(value) });
  };

  const applySettings = () => {
    setLengths(settings);
  };

  const progressPercent = () => {
    const total =
      currentMode === 'work'
        ? sessionLength
        : currentMode === 'shortBreak'
        ? shortBreakLength
        : longBreakLength;
    return ((total - timeLeft) / total) * 100;
  };

  const handleComplete = () => {
    if (selectedTopic) {
      incrementSessions(selectedTopic);
    }
    alert("Pomodoro complete!");
  };

  // Toggle the visibility of the topic selection dropdown
  const toggleTopicDropdown = () => {
    setIsTopicVisible((prev) => !prev);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center capitalize">{currentMode} Time</h1>
      <div className="relative w-full h-8 bg-gray-200 rounded mb-4">
        <div
          className={`h-full rounded bg-green-500 transition-all duration-300`}
          style={{ width: `${progressPercent()}%` }}
        ></div>
      </div>

      <div className="text-4xl font-mono text-center mb-4">{minutes}:{seconds}</div>
      <div className="flex justify-center gap-4 mb-6">
        {!isRunning ? (
          <button onClick={startTimer} className="bg-blue-600 text-white px-4 py-2 rounded">
            Start
          </button>
        ) : (
          <button onClick={pauseTimer} className="bg-yellow-600 text-white px-4 py-2 rounded">
            Pause
          </button>
        )}
        <button onClick={resetTimer} className="bg-gray-600 text-white px-4 py-2 rounded">
          Reset
        </button>
      </div>

      <div className="mb-2 font-semibold">Customize Durations (mins)</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <input
          type="number"
          name="session"
          value={settings.session}
          onChange={handleInputChange}
          className="p-2 border rounded"
          placeholder="Session"
        />
        <input
          type="number"
          name="shortBreak"
          value={settings.shortBreak}
          onChange={handleInputChange}
          className="p-2 border rounded"
          placeholder="Short Break"
        />
        <input
          type="number"
          name="longBreak"
          value={settings.longBreak}
          onChange={handleInputChange}
          className="p-2 border rounded"
          placeholder="Long Break"
        />
      </div>
      <button onClick={applySettings} className="bg-green-600 text-white w-full py-2 rounded mb-4">
        Apply Settings
      </button>

      <h2 className="font-semibold mb-2">Link to a Topic</h2>

      {/* Button to toggle dropdown visibility */}
      <button
        onClick={toggleTopicDropdown}
        className="bg-blue-500 text-white w-full py-2 rounded mb-4"
      >
        {isTopicVisible ? 'Hide Topics' : 'Link a Topic'}
      </button>

      {/* Dropdown for topic selection */}
      {isTopicVisible && (
        <select
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select Topic</option>
          {syllabus.map((item) => (
            <option key={item.id} value={item.id}>
              {item.subject}
            </option>
          ))}
        </select>
      )}

      <PomodoroTimer onComplete={handleComplete} />
    </div>
  );
}
