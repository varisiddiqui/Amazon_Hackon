import { GoogleGenerativeAI } from "@google/generative-ai";
import { getStudentContext } from "../data/studentData.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export function isGeminiConfigured() {
  return Boolean(GEMINI_API_KEY);
}

export function getGeminiConfig() {
  return {
    configured: isGeminiConfigured(),
    model: GEMINI_MODEL,
    provider: "Google Gemini",
    api: "Google Generative AI SDK",
  };
}

function buildCampusContextPrompt(ctx) {
  const { user, timetable, assignments, attendance, events, notices, nextClass, placementProgress } =
    ctx;

  return `
You are CampusFlow AI Assistant — a helpful campus copilot for college students.
You are powered by Google Gemini (${GEMINI_MODEL}).

STUDENT PROFILE:
- Name: ${user.name}
- Department: ${user.department}
- Year: ${user.year}

TIMETABLE TODAY:
${timetable.map((c) => `- ${c.time} ${c.name} (${c.room}) [${c.status}]`).join("\n")}

NEXT CLASS: ${nextClass ? `${nextClass.name} at ${nextClass.time} in ${nextClass.room}` : "None remaining today"}

ASSIGNMENTS:
${assignments.map((a) => `- ${a.name}: due ${a.due} (${a.urgency})`).join("\n")}

ATTENDANCE: ${attendance.current}% (target ${attendance.target}%, need ${attendance.classesNeeded} more classes)

UPCOMING EVENTS:
${events.slice(0, 5).map((e) => `- ${e.name} (${e.when})`).join("\n")}

NOTICES:
${notices.map((n) => `- ${n.title} (${n.date})`).join("\n")}

PLACEMENT: Resume ${placementProgress.resumeScore}%, Coding ${placementProgress.coding}%, Aptitude ${placementProgress.aptitude}%

RULES:
- Answer in a friendly, concise tone for Indian college students.
- Use **bold** for important terms when helpful.
- Prefer bullet points for lists.
- If asked about campus data above, use it accurately.
- For Amazon HackOn, placements, hackathons — be encouraging and practical.
- Keep answers under 200 words unless a study plan is requested.
`.trim();
}

/**
 * Chat with Google Gemini API
 * @see https://ai.google.dev/gemini-api/docs
 */
export async function askGemini(question, user) {
  if (!isGeminiConfigured()) {
    throw new Error("GEMINI_API_KEY is not configured in backend .env");
  }

  const ctx = getStudentContext(user);
  const systemContext = buildCampusContextPrompt(ctx);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  });

  const prompt = `${systemContext}\n\n---\nStudent question: ${question}\n\nAnswer:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text()?.trim();

  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  return {
    intent: "gemini_chat",
    type: "text",
    text,
    meta: {
      poweredBy: "Google Gemini",
      provider: "google-gemini",
      model: GEMINI_MODEL,
      api: "Google Generative AI",
      dataSources: ["timetable", "assignments", "attendance", "events", "notices", "gemini-api"],
    },
  };
}

/** Use Gemini for notice summarization */
export async function summarizeWithGemini(noticeText) {
  if (!isGeminiConfigured()) return null;

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const result = await model.generateContent(
    `Summarize this college notice in 5 bullet points. Use **bold** for dates and deadlines:\n\n${noticeText}`
  );

  const text = result.response.text();
  const bullets = text
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  return {
    type: "summary",
    text: "Notice Summary (Google Gemini):",
    bullets: bullets.length ? bullets : [text],
    meta: { poweredBy: "Google Gemini", model: GEMINI_MODEL, api: "Google Generative AI" },
  };
}
