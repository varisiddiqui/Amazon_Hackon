import {
  getStudentContext,
  getDailyBrief,
  notices as allNotices,
} from "../data/studentData";
import { getStudyRecommendation } from "../data/timetableData";
import { getHostelAIAnswer } from "../data/hostelData";
import { getTransportAIAnswer } from "../data/transportData";
import { getPlacementAIAnswer } from "../data/placementData";

const THINK_MS = 700;

function matchIntent(q) {
  const lower = q.toLowerCase();

  if (/next class|what class|my class/.test(lower)) return "next_class";
  if (/assignment|due|pending|submit/.test(lower) && !/summarize/.test(lower))
    return "assignments";
  if (/skip.*class|can i skip|miss.*class/.test(lower)) return "skip_class";
  if (/how much attendance|attendance.*need|reach.*80|safe zone/.test(lower))
    return "attendance_needed";
  if (/attendance|present|absent/.test(lower)) return "attendance";
  if (/summarize.*notice|today.*notice|notice.*summary|summarize today/.test(lower))
    return "summarize_notices";
  if (/event|hackathon|workshop|this week/.test(lower)) return "events";
  if (/review my resume|sql interview|learn next|career|placement hub/.test(lower))
    return "placement_hub";
  if (/transport|my bus|bus delay|missed my bus|bus route/.test(lower)) return "transport";
  if (/hostel|mess menu|laundry delivery|hostel notice/.test(lower)) return "hostel";
  if (/when should i study|study.*dbms|schedule optim|best time to study/.test(lower))
    return "study_schedule";
  if (/study plan|exam.*day|prepare.*exam|15 day/.test(lower)) return "study_plan";
  if (/amazon.*interview|prepare.*amazon|amazon.*prep/.test(lower))
    return "amazon_interview";
  if (/hr question|interview question|tell me about yourself/.test(lower))
    return "hr_questions";
  if (/tcs|placement prep|interview prep|prepare me/.test(lower))
    return "placement_prep";
  if (/daily brief|today overview|good morning/.test(lower)) return "daily_brief";
  if (/resume|cv/.test(lower)) return "resume";

  return "general";
}

function buildResponse(intent, ctx, question = "") {
  const { firstName, name } = ctx.user;
  const { nextClass, assignments, attendance, events, placementProgress } = ctx;

  switch (intent) {
    case "next_class":
      return {
        type: "text",
        text: nextClass
          ? `Your next class is **${nextClass.name}** at **${nextClass.time}** in **${nextClass.room}**.${nextClass.status === "live" ? "\n\n🔴 You're marked **LIVE NOW**!" : ""}`
          : "You have no more classes scheduled for today. Enjoy your evening!",
      };

    case "assignments": {
      const pending = assignments.filter((a) => a.daysLeft <= 7);
      return {
        type: "list",
        text: pending.length ? "Yes, you have pending assignments:" : "You're all caught up! No urgent assignments.",
        items: pending.map((a) => ({
          title: a.name,
          subtitle: a.due,
          badge: a.urgency === "urgent" ? "URGENT" : a.urgency === "medium" ? "SOON" : "SAFE",
          badgeColor:
            a.urgency === "urgent"
              ? "red"
              : a.urgency === "medium"
                ? "amber"
                : "emerald",
        })),
      };
    }

    case "attendance":
      return {
        type: "stats",
        text: `Here's your attendance overview, ${firstName}:`,
        stats: [
          { label: "Current", value: `${attendance.current}%`, color: "indigo" },
          { label: "Target", value: `${attendance.target}%`, color: "emerald" },
          { label: "Attended", value: `${attendance.attended}/${attendance.totalClasses}`, color: "slate" },
        ],
        footer: `You need **${attendance.classesNeeded} more classes** to reach the ${attendance.target}% safe zone.`,
      };

    case "attendance_needed":
      return {
        type: "stats",
        text: "Attendance Advisor Analysis:",
        stats: [
          { label: "Current", value: `${attendance.current}%`, color: "indigo" },
          { label: "Target", value: `${attendance.target}%`, color: "emerald" },
          { label: "Classes Needed", value: String(attendance.classesNeeded), color: "amber" },
        ],
        footer:
          "Attend your next **3 classes** to reach the safe zone. Missing tomorrow's class would drop you to **77.2%**.",
        recommendation: "✅ Recommended: Attend tomorrow's class.",
      };

    case "skip_class": {
      const projected = (attendance.attended / (attendance.totalClasses + 1)) * 100;
      return {
        type: "stats",
        text: "Attendance Advisor — Skip Analysis",
        stats: [
          { label: "Current", value: `${attendance.current}%`, color: "indigo" },
          { label: "If You Skip", value: `${projected.toFixed(1)}%`, color: "red" },
          { label: "Target", value: `${attendance.target}%`, color: "emerald" },
        ],
        footer: "Skipping tomorrow would put you further from the safe zone.",
        recommendation: "✅ Recommended: Attend tomorrow's class.",
      };
    }

    case "summarize_notices":
      return {
        type: "summary",
        text: "Summary of today's notices:",
        bullets: [
          "Exam starts on **June 20, 2026**",
          "Admit card available from **June 15**",
          "Reporting time **8:30 AM** (no entry after 9:00 AM)",
          "Fee deadline extended to **June 18**",
          "College closed **June 20** for Eid-ul-Adha",
        ],
      };

    case "events":
      return {
        type: "list",
        text: "Recommended events this week:",
        items: events.slice(0, 4).map((e) => ({
          title: e.name,
          subtitle: e.when,
          badge: e.type.toUpperCase(),
          badgeColor: "indigo",
        })),
      };

    case "study_plan":
      return {
        type: "plan",
        text: "📚 Study Plan Generated (15 days to exams)",
        phases: [
          { days: "Day 1–4", subject: "DBMS", topics: "Normalization, SQL, Transactions" },
          { days: "Day 5–8", subject: "DSA", topics: "Trees, Graphs, Dynamic Programming" },
          { days: "Day 9–11", subject: "Operating Systems", topics: "Scheduling, Memory, Deadlocks" },
          { days: "Day 12–15", subject: "Revision", topics: "Mock tests + weak topics" },
        ],
      };

    case "study_schedule": {
      const m = /study\s+(\w+)/i.exec(question);
      const subject = m ? m[1].toUpperCase() : "DBMS";
      const rec = getStudyRecommendation(subject);
      return {
        type: "plan",
        text: `📅 Schedule Optimizer — ${rec.subject}`,
        phases: rec.slots.map((s) => ({
          days: s.day,
          subject: "Free Slot",
          topics: s.time,
        })),
        recommendation: `✅ ${rec.recommended}`,
      };
    }

    case "hostel": {
      const ans = getHostelAIAnswer(question);
      return {
        type: ans.bullets ? "summary" : "text",
        text: ans.text,
        bullets: ans.bullets,
      };
    }

    case "transport": {
      const ans = getTransportAIAnswer(question);
      if (ans.type === "missed") {
        return {
          type: "list",
          text: ans.text,
          items: ans.items?.map((i) => ({
            title: i.title,
            subtitle: i.subtitle,
            badge: "ALT",
            badgeColor: "indigo",
          })),
          footer: ans.footer,
        };
      }
      return {
        type: ans.bullets ? "summary" : "text",
        text: ans.text,
        bullets: ans.bullets,
        footer: ans.eta,
      };
    }

    case "placement_hub": {
      const ans = getPlacementAIAnswer(question);
      if (ans.type === "resume") {
        return {
          type: "resume",
          text: ans.text,
          score: ans.score,
          strengths: ans.strengths,
          improvements: ans.improvements,
        };
      }
      if (ans.phases) {
        return { type: "plan", text: ans.text, phases: ans.phases, recommendation: ans.recommendation };
      }
      return {
        type: ans.bullets ? "summary" : "text",
        text: ans.text,
        bullets: ans.bullets,
        recommendation: ans.recommendation,
      };
    }

    case "amazon_interview":
      return {
        type: "plan",
        text: "💼 Amazon Interview Roadmap",
        phases: [
          { days: "Day 1", subject: "Arrays", topics: "Two pointers, sliding window, prefix sum" },
          { days: "Day 2", subject: "Strings", topics: "KMP, palindromes, anagrams" },
          { days: "Day 3", subject: "Trees", topics: "BST, traversals, LCA" },
          { days: "Day 4", subject: "System Design", topics: "Scalability, caching, load balancing" },
        ],
      };

    case "hr_questions":
      return {
        type: "list",
        text: "Common HR Interview Questions:",
        items: [
          { title: "Tell me about yourself.", subtitle: "2-min structured intro" },
          { title: "Why Amazon?", subtitle: "Company research + values alignment" },
          { title: "Describe a challenge you faced.", subtitle: "STAR format answer" },
          { title: "Where do you see yourself in 5 years?", subtitle: "Growth + learning focus" },
        ],
      };

    case "placement_prep":
      return {
        type: "stats",
        text: `Placement prep overview for ${name}:`,
        stats: [
          { label: "Resume Score", value: `${placementProgress.resumeScore}%`, color: "indigo" },
          { label: "Aptitude", value: `${placementProgress.aptitude}%`, color: "purple" },
          { label: "Coding", value: `${placementProgress.coding}%`, color: "emerald" },
        ],
        footer: `Focus on: **${placementProgress.recommendations.join("**, **")}**. Practice 2 medium LeetCode problems daily.`,
      };

    case "daily_brief": {
      const brief = getDailyBrief(firstName);
      return {
        type: "brief",
        text: brief.greeting,
        bullets: brief.items,
        recommendation: brief.recommendedAction,
      };
    }

    case "resume":
      return {
        type: "resume",
        text: "Upload your resume PDF using the **Resume Analyzer** panel on the left for a detailed score.",
        score: placementProgress.resumeScore,
        strengths: ["Projects section", "Technical skills listed", "Clean formatting"],
        improvements: ["Add metrics to projects", "Improve professional summary", "Add achievements & certifications"],
      };

    default:
      return {
        type: "text",
        text: `I can help with classes, assignments, attendance, events, notices, study plans, and placement prep.\n\nTry asking:\n• "What is my next class?"\n• "Summarize today's notices"\n• "How much attendance do I need?"`,
      };
  }
}

export function summarizeNoticeText(text) {
  return {
    type: "summary",
    text: "Notice Summary:",
    bullets: [
      "Exam starts on **June 20, 2026**",
      "Admit card available from **June 15**",
      "Reporting time **8:30 AM**",
      "Carry college ID + admit card",
      "Mobile phones strictly prohibited",
    ],
  };
}

export function analyzeResume() {
  return {
    type: "resume",
    text: "Resume Analysis Complete",
    score: 82,
    strengths: ["Projects section", "Technical skills", "Education details"],
    improvements: ["Add metrics to projects", "Improve summary section", "Add achievements & certifications"],
  };
}

export function generateStudyPlan(days = 15) {
  return buildResponse("study_plan", getStudentContext({}));
}

export function getAttendanceAdvice(action = "skip") {
  return buildResponse(action === "skip" ? "skip_class" : "attendance_needed", getStudentContext({}));
}

export function getPlacementRoadmap(company = "Amazon") {
  if (/amazon/i.test(company)) return buildResponse("amazon_interview", getStudentContext({}));
  return buildResponse("placement_prep", getStudentContext({}));
}

export function getEventRecommendations() {
  return buildResponse("events", getStudentContext({}));
}

export function getSmartReminders() {
  return getStudentContext({}).smartReminders;
}

export function getNoticeById(id) {
  return allNotices.find((n) => n.id === id);
}

export function getAllNotices() {
  return allNotices;
}

export async function askAI(question, user) {
  const ctx = getStudentContext(user);
  const intent = matchIntent(question);
  const response = buildResponse(intent, ctx, question);

  await new Promise((r) => setTimeout(r, THINK_MS));

  return {
    intent,
    ...response,
    meta: { poweredBy: "CampusGPT", dataSources: ["timetable", "assignments", "attendance", "events", "notices"] },
  };
}

export async function askAIWithDelay(question, user, delay = THINK_MS) {
  const ctx = getStudentContext(user);
  const intent = matchIntent(question);
  const response = buildResponse(intent, ctx, question);
  await new Promise((r) => setTimeout(r, delay));
  return { intent, ...response };
}

export { getDailyBrief, getStudentContext };
