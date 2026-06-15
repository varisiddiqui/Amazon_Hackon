/** Campus Event Hub — events database, registrations & AI helpers */

export const EVENT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "hackathon", label: "Hackathons" },
  { id: "workshop", label: "Workshops" },
  { id: "coding", label: "Coding" },
  { id: "cultural", label: "Cultural" },
  { id: "sports", label: "Sports" },
  { id: "seminar", label: "Seminars" },
];

export const CATEGORY_ICONS = {
  hackathon: "🚀",
  workshop: "🛠️",
  coding: "💻",
  cultural: "🎭",
  sports: "⚽",
  seminar: "🎤",
  career: "💼",
  contest: "🏅",
};

const now = new Date("2026-06-14T12:00:00");

function daysFromNow(days, hours = 10) {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
}

export const EVENTS = [
  {
    id: 1,
    title: "Amazon HackOn 2026",
    description:
      "Build innovative solutions using AWS services. 24-hour hackathon with mentorship from Amazon engineers. Teams of 2–4. Top 3 teams win prizes and internship interviews.",
    category: "hackathon",
    date: "2026-06-15",
    dateLabel: "15 June 2026",
    time: "10:00 AM",
    venue: "Online + Campus Lab 4",
    organizer: "Amazon × CampusFlow",
    capacity: 200,
    registeredCount: 155,
    prizePool: "₹1,00,000",
    registrationDeadline: "Tomorrow",
    featured: true,
    club: null,
    requirements: ["Laptop with stable internet", "Team of 2–4 members", "AWS account (free tier)"],
    status: "upcoming",
    level: "national",
    startsAt: daysFromNow(1, 10),
    hasCertificate: true,
  },
  {
    id: 8,
    title: "Smart India Hackathon (SIH) 2026",
    description:
      "India's biggest hackathon — solve real-world problem statements from ministries & industries. Internal campus round first; winners represent college at national level. Teams of 6 (5 students + 1 mentor).",
    category: "hackathon",
    date: "2026-06-18",
    dateLabel: "18 June 2026",
    time: "9:00 AM",
    venue: "Main Auditorium · Block C",
    organizer: "Innovation Cell · MHRD SIH",
    capacity: 120,
    registeredCount: 89,
    prizePool: "₹1,00,000 + National Finals",
    registrationDeadline: "17 June",
    featured: false,
    club: "Innovation Cell",
    requirements: [
      "Team of 6 (5 students + faculty mentor)",
      "All members must have valid college ID",
      "Problem statement preference form",
      "Laptop + charger",
    ],
    status: "upcoming",
    level: "national",
    startsAt: daysFromNow(4, 9),
    hasCertificate: true,
  },
  {
    id: 9,
    title: "CodeStorm — Intra-College Hackathon",
    description:
      "24-hour overnight hackathon open to all branches. Build anything — web, mobile, AI, IoT. Mentors from senior batches & faculty. Top 5 teams get certificates + swag.",
    category: "hackathon",
    date: "2026-06-21",
    dateLabel: "21 June 2026",
    time: "6:00 PM",
    venue: "Computer Centre · Ground Floor",
    organizer: "Coding Club · CSE Dept",
    capacity: 150,
    registeredCount: 98,
    prizePool: "₹30,000",
    registrationDeadline: "20 June",
    featured: false,
    club: "Coding Club",
    requirements: ["Team of 2–4", "Any year / any branch", "Laptop mandatory"],
    status: "upcoming",
    level: "college",
    startsAt: daysFromNow(7, 18),
    hasCertificate: true,
  },
  {
    id: 10,
    title: "TechVista — Annual Tech Fest",
    description:
      "College's flagship tech fest — hackathons, robo wars, tech quiz, project expo & startup pitch. 3 days of innovation. Register for individual events or full fest pass.",
    category: "coding",
    date: "2026-06-24",
    dateLabel: "24–26 June 2026",
    time: "10:00 AM",
    venue: "Entire Campus · All Blocks",
    organizer: "Student Council · Tech Committee",
    capacity: 500,
    registeredCount: 312,
    prizePool: "₹2,00,000 Total",
    registrationDeadline: "22 June",
    featured: false,
    club: null,
    requirements: ["College ID", "Fest pass (₹200 for students)"],
    status: "upcoming",
    level: "college",
    startsAt: daysFromNow(10, 10),
    hasCertificate: true,
  },
  {
    id: 11,
    title: "Momentum — Cultural Fest",
    description:
      "Annual college cultural fest — dance, music, drama, fashion show & food stalls. Inter-department competitions. Open mic night on Day 2.",
    category: "cultural",
    date: "2026-06-27",
    dateLabel: "27–28 June 2026",
    time: "5:00 PM",
    venue: "Open Air Theatre",
    organizer: "Cultural Committee",
    capacity: 800,
    registeredCount: 445,
    prizePool: "₹75,000",
    registrationDeadline: "25 June",
    featured: false,
    club: "Cultural Club",
    requirements: ["College ID", "Register for each event separately"],
    status: "upcoming",
    level: "college",
    startsAt: daysFromNow(13, 17),
    hasCertificate: false,
  },
  {
    id: 12,
    title: "CSE Department Symposium",
    description:
      "Paper presentations, poster sessions & industry talks. Present your mini-project or research. Best paper wins internship referral.",
    category: "seminar",
    date: "2026-06-19",
    dateLabel: "19 June 2026",
    time: "11:00 AM",
    venue: "Seminar Hall · CSE Block",
    organizer: "CSE Department",
    capacity: 100,
    registeredCount: 67,
    prizePool: "₹15,000",
    registrationDeadline: "18 June",
    featured: false,
    club: null,
    requirements: ["Abstract submission", "CSE / IT / AI branches only"],
    status: "upcoming",
    level: "college",
    startsAt: daysFromNow(5, 11),
    hasCertificate: true,
  },
  {
    id: 13,
    title: "Inter-College Hack Battle",
    description:
      "5 colleges compete in a 12-hour hackathon. Problem statements released on spot. Judges from industry. Represent your college!",
    category: "hackathon",
    date: "2026-06-25",
    dateLabel: "25 June 2026",
    time: "8:00 AM",
    venue: "Convention Centre · Host College",
    organizer: "Tech Consortium · 5 Colleges",
    capacity: 80,
    registeredCount: 54,
    prizePool: "₹80,000",
    registrationDeadline: "23 June",
    featured: false,
    club: "Coding Club",
    requirements: ["Team of 4", "Selected via CodeStorm shortlist", "Travel on own"],
    status: "upcoming",
    level: "inter-college",
    startsAt: daysFromNow(11, 8),
    hasCertificate: true,
  },
  {
    id: 14,
    title: "Freshers' Welcome & Talent Hunt",
    description:
      "Welcome party for 1st year students. Talent hunt, DJ night & games. All seniors invited as mentors. Free entry for freshers.",
    category: "cultural",
    date: "2026-06-17",
    dateLabel: "17 June 2026",
    time: "6:30 PM",
    venue: "Student Activity Centre",
    organizer: "Student Council",
    capacity: 400,
    registeredCount: 280,
    prizePool: null,
    registrationDeadline: "16 June",
    featured: false,
    club: "Cultural Club",
    requirements: ["College ID", "1st years: free · Others: ₹50"],
    status: "upcoming",
    level: "college",
    startsAt: daysFromNow(3, 18),
    hasCertificate: false,
  },
  {
    id: 2,
    title: "AI Workshop",
    description:
      "Hands-on workshop on LLMs, prompt engineering, and building AI apps. Includes live demo with CampusFlow AI integration.",
    category: "workshop",
    date: "2026-06-16",
    dateLabel: "16 June 2026",
    time: "4:00 PM",
    venue: "Seminar Hall · Block A",
    organizer: "Coding Club",
    capacity: 80,
    registeredCount: 35,
    prizePool: null,
    registrationDeadline: "16 June",
    featured: false,
    club: "Coding Club",
    requirements: ["Basic Python knowledge", "Laptop"],
    status: "upcoming",
    startsAt: daysFromNow(2, 16),
    hasCertificate: true,
  },
  {
    id: 3,
    title: "Coding Contest",
    description:
      "Competitive programming contest on HackerRank. 2 hours, 5 problems. Open to all branches. Placement-focused difficulty.",
    category: "coding",
    date: "2026-06-20",
    dateLabel: "20 June 2026",
    time: "2:00 PM",
    venue: "Computer Lab 2",
    organizer: "Tech Society",
    capacity: 100,
    registeredCount: 62,
    prizePool: "₹50,000",
    registrationDeadline: "19 June",
    featured: false,
    club: "Coding Club",
    requirements: ["HackerRank account", "C++ or Python"],
    status: "upcoming",
    startsAt: daysFromNow(6, 14),
    hasCertificate: true,
  },
  {
    id: 4,
    title: "Resume Building Session",
    description:
      "Learn how to craft ATS-friendly resumes. Includes live resume review and placement tips from alumni.",
    category: "seminar",
    date: "2026-06-16",
    dateLabel: "16 June 2026",
    time: "2:00 PM",
    venue: "Room 108 · Block B",
    organizer: "Placement Cell",
    capacity: 60,
    registeredCount: 48,
    prizePool: null,
    registrationDeadline: "15 June",
    featured: false,
    club: null,
    requirements: ["Draft resume (optional)"],
    status: "upcoming",
    startsAt: daysFromNow(2, 14),
    hasCertificate: false,
  },
  {
    id: 5,
    title: "Photo Walk",
    description:
      "Explore campus with Photography Club. Learn composition and mobile photography basics.",
    category: "cultural",
    date: "2026-06-16",
    dateLabel: "Sunday · 16 June",
    time: "6:00 AM",
    venue: "Main Gate",
    organizer: "Photography Club",
    capacity: 30,
    registeredCount: 18,
    prizePool: null,
    registrationDeadline: "15 June",
    featured: false,
    club: "Photography Club",
    requirements: ["Camera or smartphone"],
    status: "upcoming",
    startsAt: daysFromNow(2, 6),
    hasCertificate: false,
  },
  {
    id: 6,
    title: "Inter-College Cricket",
    description:
      "Annual sports tournament. Register your team of 11. Knockout format over 3 days.",
    category: "sports",
    date: "2026-06-22",
    dateLabel: "22 June 2026",
    time: "8:00 AM",
    venue: "Sports Ground",
    organizer: "Sports Committee",
    capacity: 16,
    registeredCount: 12,
    prizePool: "₹25,000",
    registrationDeadline: "20 June",
    featured: false,
    club: null,
    requirements: ["Team of 11", "Sports kit"],
    status: "upcoming",
    startsAt: daysFromNow(8, 8),
    hasCertificate: false,
  },
  {
    id: 7,
    title: "AWS Cloud Seminar",
    description:
      "Introduction to AWS cloud architecture, certification paths, and career opportunities.",
    category: "seminar",
    date: "2026-06-05",
    dateLabel: "5 June 2026",
    time: "11:00 AM",
    venue: "Auditorium",
    organizer: "AWS Educate",
    capacity: 150,
    registeredCount: 150,
    prizePool: null,
    registrationDeadline: "Closed",
    featured: false,
    club: null,
    requirements: [],
    status: "completed",
    startsAt: daysFromNow(-9, 11),
    hasCertificate: true,
  },
];

export const EVENT_LEVELS = {
  national: { label: "National", badge: "bg-blue-100 text-blue-700" },
  college: { label: "College Level", badge: "bg-emerald-100 text-emerald-700" },
  "inter-college": { label: "Inter-College", badge: "bg-purple-100 text-purple-700" },
};

export const AI_RECOMMENDATIONS = [
  { eventId: 8, reason: "SIH is open — great for national exposure & portfolio." },
  { eventId: 2, reason: "You are interested in AI and ML." },
  { eventId: 9, reason: "Perfect warm-up before Inter-College Hack Battle." },
  { eventId: 3, reason: "Matches your placement goals." },
  { eventId: 12, reason: "Present your project at CSE Symposium." },
];

export const CLUB_EVENTS = [
  { club: "Coding Club", eventIds: [2, 3, 9, 13] },
  { club: "Innovation Cell", eventIds: [8] },
  { club: "Photography Club", eventIds: [5] },
  { club: "Cultural Club", eventIds: [11, 14] },
];

export const FEATURED_EVENT_ALERT = {
  title: "Amazon HackOn registration closes in 12 hours.",
  recommendation: "Register today.",
};

const REG_KEY = "campusflow_event_registrations";
const DEFAULT_REGISTRATIONS = [1, 2, 4];

export function loadRegistrations() {
  try {
    const stored = localStorage.getItem(REG_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [...DEFAULT_REGISTRATIONS];
}

export function saveRegistrations(ids) {
  try {
    localStorage.setItem(REG_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function getEventById(id) {
  return EVENTS.find((e) => e.id === id);
}

export function getFeaturedEvent() {
  return EVENTS.find((e) => e.featured) || EVENTS[0];
}

export function getUpcomingEvents(events = EVENTS) {
  return events.filter((e) => e.status === "upcoming");
}

export function getPastEvents(events = EVENTS) {
  return events.filter((e) => e.status === "completed");
}

export function getCountdown(startsAt) {
  const target = new Date(startsAt);
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, label: "Started" };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const daySuffix = days !== 1 ? "s" : "";
  const hourSuffix = hours !== 1 ? "s" : "";
  const label =
    days > 0 ? `${days} Day${daySuffix}` : `${hours} Hour${hourSuffix}`;

  return { days, hours, label: `Starts In ${label}` };
}

export function filterEvents(events, { category, search }) {
  return events.filter((e) => {
    if (category && category !== "all" && e.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.level && e.level.toLowerCase().includes(q)) ||
        (e.club && e.club.toLowerCase().includes(q)) ||
        (/college|sih|smart india/i.test(q) && (e.level === "college" || /sih|smart india/i.test(e.title)))
      );
    }
    return true;
  });
}

export function getRegisteredEvents(registrations) {
  return registrations
    .map((id) => getEventById(id))
    .filter(Boolean)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
}

export function getRecommendedEvents(registrations) {
  return AI_RECOMMENDATIONS.map((r) => ({
    event: getEventById(r.eventId),
    reason: r.reason,
  })).filter((r) => r.event && !registrations.includes(r.event.id));
}

export function getSeatsLeft(event) {
  return Math.max(0, event.capacity - event.registeredCount);
}

export function getEventsAIAnswer(query, registrations) {
  const q = query.toLowerCase();
  const registered = getRegisteredEvents(registrations);
  const upcoming = getUpcomingEvents();

  if (/registered|my events|signed up|joined/.test(q)) {
    if (!registered.length) return "You haven't registered for any events yet. Check Upcoming Events!";
    return `You're registered for:\n${registered.map((e) => `✓ ${e.title} — ${e.dateLabel}`).join("\n")}`;
  }

  if (/sih|smart india/.test(q)) {
    const sih = upcoming.filter((e) => /sih|smart india/i.test(e.title));
    return sih.length
      ? `Smart India Hackathon:\n${sih.map((e) => `🇮🇳 ${e.title}\n   ${e.dateLabel} · ${e.venue}\n   Prize: ${e.prizePool}\n   Seats left: ${getSeatsLeft(e)}`).join("\n\n")}`
      : "SIH registration is not open right now.";
  }

  if (/college|intra|fest|symposium/.test(q)) {
    const college = upcoming.filter((e) => e.level === "college");
    return college.length
      ? `College-level events:\n${college.map((e) => `🏫 ${e.title} — ${e.dateLabel}`).join("\n")}`
      : "No college events scheduled.";
  }

  if (/hackathon|this week/.test(q)) {
    const hacks = upcoming.filter(
      (e) => e.category === "hackathon" || /hackathon/i.test(e.title)
    );
    if (!hacks.length) return "No hackathons this week. Amazon HackOn registration closes tomorrow!";
    return `Hackathons this week:\n${hacks.map((e) => `🚀 ${e.title} — ${e.dateLabel} · Prize: ${e.prizePool || "TBD"}`).join("\n")}`;
  }

  if (/recommend|placement|suggest/.test(q)) {
    const recs = getRecommendedEvents(registrations);
    if (!recs.length) return "You're registered for all recommended events. Great job!";
    return `Recommended for you:\n${recs.map((r) => `• ${r.event.title}\n  Reason: ${r.reason}`).join("\n")}`;
  }

  if (/workshop|ai/.test(q)) {
    const workshops = upcoming.filter((e) => e.category === "workshop" || /ai/i.test(e.title));
    return workshops.length
      ? `Workshops:\n${workshops.map((e) => `🛠️ ${e.title} — ${e.dateLabel} at ${e.time}`).join("\n")}`
      : "No upcoming workshops found.";
  }

  return `I can help with:\n• "Any hackathons this week?"\n• "Recommend events for placement"\n• "What events am I registered for?"`;
}

export function getDashboardEvents(limit = 2) {
  return getUpcomingEvents()
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
    .slice(0, limit)
    .map((e) => ({
      id: e.id,
      name: e.title,
      when: getCountdown(e.startsAt).label.replace("Starts In ", "") || e.registrationDeadline,
      dateLabel: e.dateLabel,
    }));
}
