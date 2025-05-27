import React, { useState } from "react";
import useSyllabusStore from "../store/syllabusStore";

const SyllabusTracker = () => {
  const {
    syllabus,
    addSubject,
    addTopic,
    updateTopicStatus,
    logActualTime,
  } = useSyllabusStore();

  const [newSubject, setNewSubject] = useState("");
  const [topicName, setTopicName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Syllabus Tracker</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="New Subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={() => {
            if (newSubject) {
              addSubject(newSubject);
              setSelectedSubject(newSubject);
              setNewSubject("");
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Subject
        </button>
      </div>

      {syllabus.length > 0 && (
        <>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select a subject</option>
            {syllabus.map((subj) => (
              <option key={subj.subjectName} value={subj.subjectName}>
                {subj.subjectName}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Topic Name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <input
              type="number"
              placeholder="Estimated Time (mins)"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <button
              onClick={() => {
                if (selectedSubject && topicName && estimatedTime) {
                  addTopic(selectedSubject, {
                    topicName,
                    estimatedTime: parseInt(estimatedTime),
                  });
                  setTopicName("");
                  setEstimatedTime("");
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Topic
            </button>
          </div>
        </>
      )}

      {selectedSubject && (
        <div>
          <h3 className="text-xl font-semibold mt-4">Topics for {selectedSubject}:</h3>
          {syllabus
            .find((s) => s.subjectName === selectedSubject)
            ?.topics.map((topic, i) => (
              <div key={i} className="border rounded p-3 my-2">
                <div className="font-medium">{topic.topicName}</div>
                <div className="text-sm">
                  Estimated: {topic.estimatedTime} min | Actual: {topic.actualTime} min
                </div>
                <div className="text-sm">Status: {topic.status}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateTopicStatus(selectedSubject, topic.topicName, "in-progress")
                    }
                    className="text-white bg-yellow-500 px-2 py-1 rounded"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() =>
                      updateTopicStatus(selectedSubject, topic.topicName, "completed")
                    }
                    className="text-white bg-green-600 px-2 py-1 rounded"
                  >
                    Completed
                  </button>
                  // In SyllabusTracker.jsx
      <p className="text-sm text-green-700 mt-1">
        {/* Pomodoro Sessions: {item.sessions} */}
      </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SyllabusTracker;
