/** Mock student database — powers CampusFlow AI with personalized answers */

export const timetable = [
  { time: "09:00", name: "DSA", room: "Room 204 · Block A", status: "completed" },
  { time: "11:00", name: "DBMS", room: "Room 204 · Block A", status: "live" },
  { time: "14:00", name: "AI Lab", room: "Lab 3 · Ground Flr", status: "upcoming" },
  { time: "16:00", name: "Web Development", room: "Room 108 · Block B", status: "upcoming" },
];

export const assignments = [
  { name: "DBMS Assignment", due: "Tomorrow 8:00 AM", urgency: "urgent", daysLeft: 1 },
  { name: "AI Lab Report", due: "In 2 Days", urgency: "medium", daysLeft: 2 },
  { name: "Web Development Project", due: "In 4 Days", urgency: "safe", daysLeft: 4 },
  { name: "Compiler Mini Project", due: "Jun 20", urgency: "safe", daysLeft: 8 },
];

export const attendance = {
  current: 78,
  target: 80,
  totalClasses: 50,
  attended: 39,
  classesNeeded: 3,
};

export const events = [
  { name: "Amazon HackOn", when: "Tomorrow", day: "Saturday", type: "hackathon" },
  { name: "AI Workshop", when: "Friday 4:00 PM", day: "Friday", type: "workshop" },
  { name: "Coding Contest", when: "Sunday", day: "Sunday", type: "contest" },
  { name: "Resume Building Session", when: "Sunday 2:00 PM", day: "Sunday", type: "career" },
];

export const notices = [
  {
    id: 1,
    title: "Exam Form Released",
    date: "Today",
    fullText: `SUBJECT: End Semester Examination — June 2026

Dear Students,

This is to inform all students of B.Tech programs that the End Semester Examination for Even Semester 2025-26 will commence from June 20, 2026.

Important Instructions:
1. All students must fill the examination form online through the student portal by June 15, 2026.
2. Admit cards will be available for download from June 15, 2026 onwards.
3. Reporting time for all examinations is 8:30 AM. No student will be allowed entry after 9:00 AM.
4. Students must carry their college ID card and admit card to the examination hall.
5. Mobile phones and electronic devices are strictly prohibited inside the examination hall.
6. Any student found using unfair means will be debarred from the examination.

For queries, contact the Examination Cell, Room 101, Admin Block.

Regards,
Controller of Examinations`,
  },
  {
    id: 2,
    title: "Fee Deadline Extended",
    date: "Today",
    fullText: `NOTICE: Extension of Fee Payment Deadline

The last date for payment of semester fees has been extended from June 10 to June 18, 2026.

Students who have not yet paid their fees are requested to complete the payment at the earliest to avoid late fine charges. Late fine of Rs. 500 per day will be applicable from June 19 onwards.

Payment can be made online through the college portal or at the Accounts Section, Ground Floor, Admin Block (9 AM – 4 PM).

Accounts Office`,
  },
  {
    id: 3,
    title: "Holiday Announcement",
    date: "Jun 20",
    fullText: `Holiday Notice — Eid-ul-Adha

The college will remain closed on June 20, 2026 on account of Eid-ul-Adha. Regular classes will resume from June 21, 2026.

Hostel mess will operate on holiday schedule. Transport services will be limited.

Administration`,
  },
];

export const placementProgress = {
  resumeScore: 82,
  aptitude: 60,
  coding: 70,
  upcomingInterviews: 2,
  recommendations: ["Improve SQL", "Practice Arrays", "Update Resume"],
};

export const smartReminders = [
  { level: "urgent", text: "DBMS assignment due tomorrow", icon: "🔴" },
  { level: "warning", text: "Attendance below 75% threshold warning", icon: "🟡" },
  { level: "info", text: "Amazon HackOn registration closes in 2 hours", icon: "🟢" },
];

export function getNextClass() {
  return timetable.find((c) => c.status === "live") || timetable.find((c) => c.status === "upcoming");
}

export function getDailyBrief(firstName) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return {
    greeting: `${greeting} ${firstName} 👋`,
    items: [
      `${timetable.filter((c) => c.status !== "completed").length} Classes remaining today`,
      `${assignments.filter((a) => a.daysLeft <= 2).length} Assignment${assignments.filter((a) => a.daysLeft <= 2).length !== 1 ? "s" : ""} Due`,
      `Attendance ${attendance.current}%`,
      `${events.filter((e) => e.when.includes("Today") || e.when === "Tomorrow").length || 1} Event Scheduled`,
      "Placement Drive Tomorrow",
    ],
    recommendedAction: "Complete DBMS assignment before 8 PM.",
  };
}

export function getStudentContext(user) {
  return {
    user: {
      name: user?.fullName || "Student",
      firstName: user?.fullName?.split(" ")[0] || "Student",
      department: user?.department || "Computer Science",
      year: user?.year || "3rd Year",
    },
    timetable,
    assignments,
    attendance,
    events,
    notices,
    placementProgress,
    smartReminders,
    nextClass: getNextClass(),
  };
}
