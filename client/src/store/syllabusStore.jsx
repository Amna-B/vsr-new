import { create } from 'zustand'

const useSyllabusStore = create((set) => ({
syllabus: [],

addSubject: (subjectName) =>
set((state) => ({
syllabus: [
...state.syllabus,
{ subjectName, topics: [] }
],
})),

addTopic: (subjectName, topic) =>
set((state) => ({
syllabus: state.syllabus.map((subject) =>
subject.subjectName === subjectName
? {
...subject,
topics: [...subject.topics, { ...topic, actualTime: 0, status: 'pending' }],
}
: subject
),
})),

updateTopicStatus: (subjectName, topicName, newStatus) =>
set((state) => ({
syllabus: state.syllabus.map((subject) =>
subject.subjectName === subjectName
? {
...subject,
topics: subject.topics.map((topic) =>
topic.topicName === topicName ? { ...topic, status: newStatus } : topic
),
}
: subject
),
})),

logActualTime: (subjectName, topicName, timeInMinutes) =>
set((state) => ({
syllabus: state.syllabus.map((subject) =>
subject.subjectName === subjectName
? {
...subject,
topics: subject.topics.map((topic) =>
topic.topicName === topicName
? { ...topic, actualTime: topic.actualTime + timeInMinutes }
: topic
),
}
: subject
),
})),

addSyllabusItem: (item) =>
    set((state) => ({
      syllabus: [...state.syllabus, { ...item, sessions: 0 }],
    })),
incrementSessions: (id) =>
    set((state) => ({
      syllabus: state.syllabus.map((item) =>
        item.id === id ? { ...item, sessions: item.sessions + 1 } : item
      ),
    })),
}))

export default useSyllabusStore