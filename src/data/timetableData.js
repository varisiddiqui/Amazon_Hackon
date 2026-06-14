/** Timetable module data — academic schedule, exams, AI insights */

export const TYPE_COLORS = {
  lecture: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  lab: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  event: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  exam: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  personal: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
};

export const todayClasses = [
  {
    id: 1,
    subject: "DSA",
    start: "09:00",
    end: "10:00",
    room: "Room 204 · Block A",
    faculty: "Dr. Mehta",
    credits: 4,
    type: "lecture",
    status: "completed",
    online: false,
    attendance: { present: 20, absent: 2, percent: 91 },
  },
  {
    id: 2,
    subject: "DBMS",
    start: "11:00",
    end: "12:00",
    room: "Room 204 · Block A",
    faculty: "Dr. Sharma",
    credits: 4,
    type: "lecture",
    status: "live",
    online: true,
    joinUrl: "#",
    attendance: { present: 18, absent: 4, percent: 81 },
  },
  {
    id: 3,
    subject: "AI Lab",
    start: "14:00",
    end: "16:00",
    room: "Lab 3 · Ground Flr",
    faculty: "Prof. Gupta",
    credits: 2,
    type: "lab",
    status: "upcoming",
    online: false,
    attendance: { present: 16, absent: 3, percent: 84 },
  },
  {
    id: 4,
    subject: "Web Development",
    start: "16:00",
    end: "17:00",
    room: "Room 108 · Block B",
    faculty: "Dr. Patel",
    credits: 3,
    type: "lecture",
    status: "upcoming",
    online: true,
    joinUrl: "#",
    attendance: { present: 19, absent: 2, percent: 90 },
  },
];

export const weeklySchedule = {
  Mon: [
    { subject: "DSA", type: "lecture", time: "09–10" },
    { subject: "DBMS", type: "lecture", time: "11–12" },
    { subject: "AI Lab", type: "lab", time: "14–16" },
  ],
  Tue: [
    { subject: "OS", type: "lecture", time: "09–10" },
    { subject: "Web Dev", type: "lecture", time: "11–12" },
    { subject: "ML Lab", type: "lab", time: "14–16" },
  ],
  Wed: [
    { subject: "DBMS", type: "lecture", time: "09–10" },
    { subject: "DSA", type: "lecture", time: "11–12" },
    { subject: "Seminar", type: "event", time: "15–16" },
  ],
  Thu: [
    { subject: "Web Dev", type: "lecture", time: "09–10" },
    { subject: "OS Lab", type: "lab", time: "11–13" },
    { subject: "AI", type: "lecture", time: "14–15" },
  ],
  Fri: [
    { subject: "ML", type: "lecture", time: "09–10" },
    { subject: "DBMS Lab", type: "lab", time: "11–13" },
    { subject: "Club Meet", type: "event", time: "16–17" },
  ],
};

export const exams = [
  { id: 1, subject: "DBMS", date: "20 June 2026", time: "09:00 AM", room: "Hall A", daysLeft: 6 },
  { id: 2, subject: "DSA", date: "24 June 2026", time: "09:00 AM", room: "Hall B", daysLeft: 10 },
  { id: 3, subject: "OS", date: "28 June 2026", time: "02:00 PM", room: "Hall A", daysLeft: 14 },
];

export const freeSlots = [
  { start: "10:00", end: "11:00", uses: ["Quick revision", "Assignment work"] },
  { start: "12:00", end: "14:00", uses: ["Study Planning", "Lunch + rest"] },
  { start: "17:00", end: "20:00", uses: ["Placement Prep", "Self Study", "Club Activities"] },
];

export const aiSuggestions = [
  {
    id: 1,
    icon: "🎯",
    title: "3-hour free slot detected",
    body: "You have a gap between 1 PM and 4 PM today.",
    action: "Finish DBMS Assignment",
    priority: "high",
  },
  {
    id: 2,
    icon: "📅",
    title: "Heavy schedule tomorrow",
    body: "Tomorrow has 5 classes scheduled.",
    action: "Complete Web Dev Project today",
    priority: "medium",
  },
  {
    id: 3,
    icon: "📚",
    title: "DBMS exam in 6 days",
    body: "Based on your free slots, best study window is today 3–5 PM.",
    action: "Study DBMS today from 3 PM to 5 PM",
    priority: "high",
  },
];

export const defaultPersonalEvents = [
  { id: 1, title: "Gym", day: "Mon", time: "07:00–08:00", icon: "💪" },
  { id: 2, title: "Library", day: "Wed", time: "17:00–19:00", icon: "📖" },
  { id: 3, title: "Interview Prep", day: "Fri", time: "18:00–20:00", icon: "💼" },
];

export const smartNotifications = [
  { id: 1, type: "class", text: "DBMS starts in 15 minutes", icon: "🔔", urgent: true },
  { id: 2, type: "exam", text: "DBMS exam tomorrow — revise normalization & SQL", icon: "📝", urgent: true },
  { id: 3, type: "free", text: "Free slot 3–5 PM — ideal for assignment work", icon: "✨", urgent: false },
];

export function getNextClass() {
  return (
    todayClasses.find((c) => c.status === "live") ||
    todayClasses.find((c) => c.status === "upcoming")
  );
}

export function getStudyRecommendation(subject) {
  const lower = subject?.toLowerCase() || "dbms";
  return {
    subject: subject || "DBMS",
    slots: [
      { day: "Today", time: "3:00 PM – 5:00 PM" },
      { day: "Tomorrow", time: "6:00 PM – 8:00 PM" },
    ],
    recommended: `Study ${subject || "DBMS"} today from 3 PM to 5 PM.`,
  };
}

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
