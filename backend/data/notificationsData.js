/** Student Alert Center — notifications database & helpers */

export const NOTIFICATION_TYPES = {
  assignment: { label: "Assignments", icon: "📝", color: "red" },
  attendance: { label: "Attendance", icon: "📊", color: "orange" },
  event: { label: "Events", icon: "🎉", color: "amber" },
  placement: { label: "Placements", icon: "🏆", color: "purple" },
  timetable: { label: "Timetable", icon: "📅", color: "blue" },
  ai: { label: "AI", icon: "🤖", color: "indigo" },
};

export const PRIORITY_STYLES = {
  critical: { dot: "🔴", badge: "bg-red-100 text-red-700 border-red-200", label: "Critical" },
  important: { dot: "🟡", badge: "bg-amber-100 text-amber-700 border-amber-200", label: "Important" },
  informational: { dot: "🟢", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Info" },
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    userId: "student",
    title: "Assignment Due Tomorrow",
    message: "DBMS Assignment is due tomorrow at 2:00 PM. Submit before deadline.",
    type: "assignment",
    priority: "critical",
    isRead: false,
    isImportant: true,
    isDismissed: false,
    timeGroup: "today",
    createdAt: "2026-06-14T08:00:00",
    meta: {
      assignmentName: "DBMS Assignment",
      due: "Tomorrow",
      dueTime: "2:00 PM",
    },
  },
  {
    id: 2,
    userId: "student",
    title: "Attendance Below 75%",
    message: "Your current attendance is 74%. Required minimum is 75%.",
    type: "attendance",
    priority: "critical",
    isRead: false,
    isImportant: true,
    isDismissed: false,
    timeGroup: "today",
    createdAt: "2026-06-14T07:30:00",
    meta: {
      current: 74,
      required: 75,
      aiAdvice: "Attend next class to stay eligible.",
    },
  },
  {
    id: 3,
    userId: "student",
    title: "Placement Registration Ends Today",
    message: "Amazon SDE Internship registration closes today at 11:59 PM.",
    type: "placement",
    priority: "critical",
    isRead: false,
    isImportant: true,
    isDismissed: false,
    timeGroup: "today",
    createdAt: "2026-06-14T09:00:00",
    meta: {
      company: "Amazon",
      role: "SDE Internship",
      deadline: "Today",
    },
  },
  {
    id: 4,
    userId: "student",
    title: "Event Starts In 1 Hour",
    message: "AI Workshop begins at 4:00 PM in Seminar Hall.",
    type: "event",
    priority: "important",
    isRead: false,
    isImportant: false,
    isDismissed: false,
    timeGroup: "today",
    createdAt: "2026-06-14T14:00:00",
    meta: {
      eventName: "AI Workshop",
      startsIn: "1 Hour",
      location: "Seminar Hall",
    },
  },
  {
    id: 5,
    userId: "student",
    title: "Class Rescheduled",
    message: "DBMS class moved from 11:00 AM to 2:00 PM.",
    type: "timetable",
    priority: "important",
    isRead: false,
    isImportant: false,
    isDismissed: false,
    timeGroup: "today",
    createdAt: "2026-06-14T10:15:00",
    meta: {
      subject: "DBMS",
      oldTime: "11:00 AM",
      newTime: "2:00 PM",
    },
  },
  {
    id: 6,
    userId: "student",
    title: "Interview Scheduled",
    message: "Amazon SDE interview on 16 June at 10:00 AM.",
    type: "placement",
    priority: "important",
    isRead: true,
    isImportant: true,
    isDismissed: false,
    timeGroup: "today",
    createdAt: "2026-06-14T06:00:00",
    meta: {
      company: "Amazon",
      date: "16 June",
      time: "10:00 AM",
    },
  },
  {
    id: 7,
    userId: "student",
    title: "AI Workshop Tomorrow",
    message: "Don't forget to register for the AI Workshop happening tomorrow.",
    type: "event",
    priority: "important",
    isRead: true,
    isImportant: false,
    isDismissed: false,
    timeGroup: "yesterday",
    createdAt: "2026-06-13T16:00:00",
    meta: {
      eventName: "AI Workshop",
      startsIn: "Tomorrow",
    },
  },
  {
    id: 8,
    userId: "student",
    title: "AI Lab Report Due",
    message: "AI Lab Report submission deadline is in 2 days.",
    type: "assignment",
    priority: "important",
    isRead: true,
    isImportant: false,
    isDismissed: false,
    timeGroup: "yesterday",
    createdAt: "2026-06-13T12:00:00",
    meta: {
      assignmentName: "AI Lab Report",
      due: "In 2 Days",
      dueTime: "11:59 PM",
    },
  },
  {
    id: 9,
    userId: "student",
    title: "New Workshop Added",
    message: "Resume Building Session added on Sunday at 2:00 PM.",
    type: "event",
    priority: "informational",
    isRead: true,
    isImportant: false,
    isDismissed: false,
    timeGroup: "earlier",
    createdAt: "2026-06-11T09:00:00",
    meta: {
      eventName: "Resume Building Session",
      startsIn: "Sunday 2:00 PM",
    },
  },
  {
    id: 10,
    userId: "student",
    title: "Exam Form Released",
    message: "End semester exam form is now available on the student portal.",
    type: "ai",
    priority: "informational",
    isRead: true,
    isImportant: false,
    isDismissed: false,
    timeGroup: "earlier",
    createdAt: "2026-06-10T10:00:00",
    meta: {},
  },
];

export const AI_RECOMMENDATION = {
  action: "Complete DBMS assignment today.",
  reason: "Tomorrow you have 5 classes — no free slot to finish it.",
};

export const AI_PRIORITY_ALERTS = [
  { id: 1, text: "Assignment Due Tomorrow", priority: "critical" },
  { id: 2, text: "Attendance Below 75%", priority: "critical" },
  { id: 3, text: "Placement Registration Ends Today", priority: "critical" },
  { id: 4, text: "Event Starts In 1 Hour", priority: "important" },
];

const STORAGE_KEY = "campusflow_notifications";

export function loadNotifications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return INITIAL_NOTIFICATIONS.map((n) => ({ ...n }));
}

export function saveNotifications(notifications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    /* ignore */
  }
}

export function getUnreadCount(notifications) {
  return notifications.filter((n) => !n.isRead && !n.isDismissed).length;
}

export function getPriorityAlerts(notifications) {
  return notifications.filter(
    (n) => !n.isDismissed && (n.priority === "critical" || n.isImportant)
  ).slice(0, 4);
}

export function getRecentNotifications(notifications, limit = 3) {
  return notifications
    .filter((n) => !n.isDismissed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

export function filterNotifications(notifications, { type, status }) {
  return notifications.filter((n) => {
    if (n.isDismissed) return false;
    if (type && type !== "all" && n.type !== type) return false;
    if (status === "unread" && n.isRead) return false;
    if (status === "read" && !n.isRead) return false;
    if (status === "important" && !n.isImportant) return false;
    return true;
  });
}

export function groupByTime(notifications) {
  const groups = { today: [], yesterday: [], earlier: [] };
  for (const n of notifications) {
    const bucket = groups[n.timeGroup] ? n.timeGroup : "earlier";
    groups[bucket].push(n);
  }
  return groups;
}
