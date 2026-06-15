import {
  INITIAL_NOTIFICATIONS,
  AI_RECOMMENDATION,
  AI_PRIORITY_ALERTS,
  getUnreadCount,
  getPriorityAlerts,
  filterNotifications,
  groupByTime,
} from "../data/notificationsData.js";
import {
  EVENTS,
  EVENT_CATEGORIES,
  EVENT_LEVELS,
  CATEGORY_ICONS,
  AI_RECOMMENDATIONS,
  CLUB_EVENTS,
  FEATURED_EVENT_ALERT,
  getFeaturedEvent,
  getUpcomingEvents,
  getPastEvents,
  filterEvents,
  getRegisteredEvents,
  getRecommendedEvents,
  getEventById,
  getCountdown,
  getEventsAIAnswer,
  getDashboardEvents,
} from "../data/eventsData.js";
import {
  assignments,
  attendance,
  notices,
  getDailyBrief,
  getStudentContext,
  getNextClass,
  smartReminders,
} from "../data/studentData.js";
import {
  todayClasses,
  weeklySchedule,
  exams,
  freeSlots,
  aiSuggestions,
  defaultPersonalEvents,
  smartNotifications,
  WEEK_DAYS,
  getStudyRecommendation,
} from "../data/timetableData.js";
import {
  hostelOverview,
  messMenu,
  complaintCategories,
  defaultComplaints,
  hostelNotices,
  laundry,
  visitorPasses,
  leaveRequests,
  roommates,
  emergencyContacts as hostelEmergency,
  getHostelSummary,
  summarizeHostelNotices,
} from "../data/hostelData.js";
import {
  busOverview,
  todaySchedule,
  liveTracking,
  routeStops,
  busAlerts,
  transportNotices,
  seatAvailability,
  missedBusAlternatives,
  emergencyContacts as transportEmergency,
} from "../data/transportData.js";
import {
  readiness,
  resumeAnalysis,
  companies,
  interviewQuestions,
  codingProgress,
  aptitudeSections,
  companyRoadmaps,
  jobOpportunities,
  placementCalendar,
  skillGap,
  mockInterviewFeedback,
  getCompanyRoadmap,
  analyzeResumeUpload,
} from "../data/placementData.js";

const DEFAULT_SETTINGS = {
  notifications: {
    assignments: true,
    attendance: true,
    events: true,
    placement: true,
    hostel: true,
    transport: true,
  },
  aiPreferences: {
    dailyBrief: true,
    studyRecommendations: true,
    placementSuggestions: true,
    attendanceAlerts: true,
  },
  theme: "light",
};

/** Dashboard section cards — mirrors Home.jsx SECTIONS */
const ACTIVITY_SECTIONS = {
  classes: {
    accent: "#10b981",
    urgent: [
      { id: 1, task: "Advanced Algorithms", room: "Room 204 · Block A", deadline: "09:00 AM", eta: "LIVE NOW", timeReq: "1h 30m" },
      { id: 2, task: "DBMS Lab Practical", room: "Lab 3 · Ground Flr", deadline: "11:00 AM", eta: "2h left", timeReq: "2h" },
      { id: 3, task: "OS Tutorial", room: "Room 108 · Block B", deadline: "01:00 PM", eta: "4h left", timeReq: "30m" },
    ],
    left: [
      { sno: 1, task: "Machine Learning Lec", deadline: "03:00 PM", timeReq: "1h" },
      { sno: 2, task: "Computer Networks Lab", deadline: "05:00 PM", timeReq: "2h" },
    ],
    done: [{ sno: 1, task: "Data Structures Lec", deadline: "08:00 AM", timeReq: "1h" }],
  },
  assignments: {
    accent: "#ef4444",
    urgent: [
      { id: 1, task: "DBMS Assignment", room: "Upload Portal", deadline: "Tomorrow 8AM", eta: "URGENT", timeReq: "2h" },
      { id: 2, task: "AI Lab Report", room: "Email Submit", deadline: "In 2 Days", eta: "14h left", timeReq: "3h" },
    ],
    left: [
      { sno: 1, task: "Web Dev Project", deadline: "In 5 Days", timeReq: "8h" },
      { sno: 2, task: "Compiler Mini Project", deadline: "Jun 20", timeReq: "8h" },
    ],
    done: [{ sno: 1, task: "SE UML Diagrams", deadline: "Jun 10", timeReq: "3h" }],
  },
  events: {
    accent: "#f59e0b",
    urgent: [
      { id: 1, task: "Amazon HackOn", room: "Register Online", deadline: "Tomorrow", eta: "URGENT", timeReq: "10m" },
      { id: 2, task: "AI Workshop", room: "Seminar Hall", deadline: "Friday 4PM", eta: "3 days", timeReq: "2h" },
    ],
    left: [{ sno: 1, task: "Coding Contest", deadline: "Sunday", timeReq: "3h" }],
    done: [],
  },
  attendance: {
    accent: "#3b82f6",
    urgent: [
      { id: 1, task: "Mark Attendance — DBMS", room: "Lab 3", deadline: "11:05 AM", eta: "MARK NOW", timeReq: "1m" },
    ],
    left: [{ sno: 1, task: "AI Lab Sign-in", deadline: "02:05 PM", timeReq: "1m" }],
    done: [{ sno: 1, task: "DSA Lecture", deadline: "09:05 AM", timeReq: "1m" }],
  },
  notices: {
    accent: "#ec4899",
    urgent: [
      { id: 1, task: "Exam Form Released", room: "Admin Portal", deadline: "Today", eta: "NEW", timeReq: "5m" },
      { id: 2, task: "Fee Deadline Extended", room: "Accounts", deadline: "Tomorrow", eta: "UPDATE", timeReq: "5m" },
    ],
    left: [{ sno: 1, task: "Holiday Announcement", deadline: "Jun 20", timeReq: "2m" }],
    done: [],
  },
};

const userState = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultUserState() {
  return {
    notifications: clone(INITIAL_NOTIFICATIONS),
    eventRegistrations: [1, 2, 4],
    settings: clone(DEFAULT_SETTINGS),
    personalEvents: clone(defaultPersonalEvents),
    complaints: clone(defaultComplaints),
    leaveRequests: clone(leaveRequests),
    nextNotificationId: INITIAL_NOTIFICATIONS.length + 1,
    nextComplaintId: defaultComplaints.length + 1,
    nextLeaveId: leaveRequests.length + 1,
    nextPersonalEventId: defaultPersonalEvents.length + 1,
  };
}

export function getUserState(userId) {
  if (!userState.has(userId)) {
    userState.set(userId, defaultUserState());
  }
  return userState.get(userId);
}

export function getDashboardBrief(user) {
  const firstName = user?.fullName?.split(" ")[0] || "Student";
  return {
    ...getDailyBrief(firstName),
    overview: [
      { label: "Classes Today", value: "4", icon: "📅" },
      { label: "Assignments Due", value: String(assignments.filter((a) => a.daysLeft <= 2).length), icon: "📝" },
      { label: "Attendance", value: `${attendance.current}%`, icon: "📊" },
      { label: "Events", value: String(getUpcomingEvents().length), icon: "🎉" },
    ],
    dashboardEvents: getDashboardEvents(getUserState(user.id).eventRegistrations),
  };
}

export function getStudentProfileData(user) {
  const state = getUserState(user.id);
  return {
    assignments,
    attendance,
    notices,
    reminders: smartReminders,
    nextClass: getNextClass(),
    context: getStudentContext(user),
  };
}

export function getNotificationsPayload(userId, filters = {}) {
  const state = getUserState(userId);
  const notifications = filterNotifications(state.notifications, filters);
  return {
    notifications,
    grouped: groupByTime(notifications),
    unreadCount: getUnreadCount(state.notifications),
    aiRecommendation: AI_RECOMMENDATION,
    aiPriorityAlerts: AI_PRIORITY_ALERTS,
    types: {
      assignment: "Assignments",
      attendance: "Attendance",
      event: "Events",
      placement: "Placements",
      timetable: "Timetable",
      ai: "AI",
    },
  };
}

export function markNotificationRead(userId, id) {
  const state = getUserState(userId);
  const notification = state.notifications.find((n) => n.id === Number(id));
  if (!notification) return null;
  notification.isRead = true;
  return notification;
}

export function dismissNotification(userId, id) {
  const state = getUserState(userId);
  const notification = state.notifications.find((n) => n.id === Number(id));
  if (!notification) return null;
  notification.isDismissed = true;
  return notification;
}

export function addNotification(userId, notification) {
  const state = getUserState(userId);
  const created = {
    id: state.nextNotificationId++,
    userId,
    isRead: false,
    isDismissed: false,
    timeGroup: "today",
    createdAt: new Date().toISOString(),
    ...notification,
  };
  state.notifications.unshift(created);
  return created;
}

export function getEventsPayload(userId, { category, search, level } = {}) {
  const state = getUserState(userId);
  let events = filterEvents(EVENTS, { category, search });
  if (level && level !== "all") {
    events = events.filter((e) => e.level === level);
  }

  return {
    events,
    featured: getFeaturedEvent(),
    upcoming: getUpcomingEvents(events),
    past: getPastEvents(events),
    categories: EVENT_CATEGORIES,
    categoryIcons: CATEGORY_ICONS,
    levels: EVENT_LEVELS,
    clubEvents: CLUB_EVENTS,
    featuredAlert: FEATURED_EVENT_ALERT,
    registrations: state.eventRegistrations,
    registeredEvents: getRegisteredEvents(state.eventRegistrations),
    recommended: getRecommendedEvents(state.eventRegistrations),
    aiRecommendations: AI_RECOMMENDATIONS,
  };
}

export function registerForEvent(userId, eventId) {
  const state = getUserState(userId);
  const event = getEventById(Number(eventId));
  if (!event) return { error: "Event not found", status: 404 };

  if (state.eventRegistrations.includes(event.id)) {
    return { error: "Already registered", status: 400 };
  }

  state.eventRegistrations.push(event.id);
  event.registeredCount += 1;

  const notification = addNotification(userId, {
    title: `Registered: ${event.title}`,
    message: `You're registered for ${event.title} on ${event.dateLabel} at ${event.time}. Reminder set!`,
    type: "event",
    priority: "informational",
    isImportant: false,
    meta: { eventName: event.title, startsIn: event.dateLabel },
  });

  return {
    registrationIds: [...state.eventRegistrations],
    event,
    notification,
  };
}

export function getEventDetail(eventId, userId) {
  const event = getEventById(Number(eventId));
  if (!event) return null;
  const state = getUserState(userId);
  return {
    event,
    countdown: getCountdown(event.startsAt),
    seatsLeft: Math.max(0, event.capacity - event.registeredCount),
    isRegistered: state.eventRegistrations.includes(event.id),
  };
}

export function getTimetablePayload(userId) {
  const state = getUserState(userId);
  return {
    todayClasses,
    weeklySchedule,
    exams,
    freeSlots,
    aiSuggestions,
    personalEvents: state.personalEvents,
    smartNotifications,
    weekDays: WEEK_DAYS,
    nextClass: todayClasses.find((c) => c.status === "live") || todayClasses.find((c) => c.status === "upcoming"),
  };
}

export function addPersonalEvent(userId, data) {
  const state = getUserState(userId);
  const event = {
    id: state.nextPersonalEventId++,
    title: data.title,
    day: data.day,
    time: data.time,
    icon: data.icon || "📌",
  };
  state.personalEvents.push(event);
  return event;
}

export function getHostelPayload(userId) {
  const state = getUserState(userId);
  return {
    overview: hostelOverview,
    messMenu,
    complaintCategories,
    complaints: state.complaints,
    notices: hostelNotices,
    laundry,
    visitorPasses,
    leaveRequests: state.leaveRequests,
    roommates,
    emergencyContacts: hostelEmergency,
    summary: getHostelSummary(),
    noticeSummary: summarizeHostelNotices(),
  };
}

export function addComplaint(userId, { title, category }) {
  const state = getUserState(userId);
  const complaint = {
    id: state.nextComplaintId++,
    title,
    category,
    status: "pending",
    date: "Today",
  };
  state.complaints.unshift(complaint);
  return complaint;
}

export function addLeaveRequest(userId, { from, to, reason }) {
  const state = getUserState(userId);
  const request = {
    id: state.nextLeaveId++,
    from,
    to,
    reason,
    status: "pending",
  };
  state.leaveRequests.unshift(request);
  return request;
}

export function getTransportPayload() {
  return {
    overview: busOverview,
    todaySchedule,
    liveTracking,
    routeStops,
    alerts: busAlerts,
    notices: transportNotices,
    seatAvailability,
    missedBusAlternatives,
    emergencyContacts: transportEmergency,
  };
}

export function getPlacementPayload() {
  return {
    readiness,
    resumeAnalysis,
    companies,
    interviewQuestions,
    codingProgress,
    aptitudeSections,
    companyRoadmaps,
    jobOpportunities,
    placementCalendar,
    skillGap,
    mockInterviewFeedback,
  };
}

export function getSettings(userId) {
  return getUserState(userId).settings;
}

export function saveSettings(userId, settings) {
  const state = getUserState(userId);
  state.settings = { ...DEFAULT_SETTINGS, ...settings };
  return state.settings;
}

export function getActivitySection(type) {
  return ACTIVITY_SECTIONS[type] || null;
}

export {
  getStudentContext,
  getStudyRecommendation,
  getEventsAIAnswer,
  getCompanyRoadmap,
  analyzeResumeUpload,
  getCountdown,
};
