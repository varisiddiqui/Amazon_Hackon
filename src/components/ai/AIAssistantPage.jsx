import { useState, useRef, useEffect, useCallback } from "react";
import {
  askAI,
  summarizeNoticeText,
  analyzeResume,
  generateStudyPlan,
  getAttendanceAdvice,
  getPlacementRoadmap,
  getEventRecommendations,
  getSmartReminders,
  getAllNotices,
} from "../../services/aiService";

const TOOLS = [
  { id: "chat", icon: "💬", label: "CampusGPT" },
  { id: "notice", icon: "📋", label: "Notice Summarizer" },
  { id: "study", icon: "📚", label: "Study Planner" },
  { id: "attendance", icon: "📊", label: "Attendance" },
  { id: "placement", icon: "💼", label: "Placement" },
  { id: "resume", icon: "📄", label: "Resume" },
  { id: "voice", icon: "🎤", label: "Voice" },
  { id: "reminders", icon: "🔔", label: "Reminders" },
];

const QUICK_SUGGESTIONS = [
  { icon: "📅", text: "What's my next class?", prompt: "What is my next class?" },
  { icon: "📝", text: "Pending assignments", prompt: "Do I have any assignment due?" },
  { icon: "📊", text: "Attendance status", prompt: "How much attendance do I need?" },
  { icon: "🎉", text: "Upcoming events", prompt: "Any useful events this week?" },
  { icon: "💼", text: "Placement prep", prompt: "Prepare me for Amazon interview" },
];

const DEMO_PROMPTS = [
  "What is my next class?",
  "Summarize today's notices",
  "How much attendance do I need?",
];

function renderBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-on-background">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function AIMessageContent({ message }) {
  const {
    text,
    items,
    stats,
    bullets,
    phases,
    recommendation,
    footer,
    score,
    strengths,
    improvements,
  } = message;

  return (
    <div className="space-y-3">
      {text && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-on-background">
          {renderBold(text)}
        </p>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-2 py-3 text-center"
            >
              <p className="text-lg font-bold text-indigo-600">{s.value}</p>
              <p className="text-[10px] text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {items && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-on-background">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-on-surface-variant">{item.subtitle}</p>
                )}
              </div>
              {item.badge && (
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    item.badgeColor === "red"
                      ? "bg-red-100 text-red-700"
                      : item.badgeColor === "amber"
                        ? "bg-amber-100 text-amber-700"
                        : item.badgeColor === "emerald"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {bullets && (
        <ul className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-on-background">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                {i + 1}
              </span>
              <span>{renderBold(b)}</span>
            </li>
          ))}
        </ul>
      )}

      {phases && (
        <div className="space-y-2">
          {phases.map((p, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                {p.days}
              </p>
              <p className="text-sm font-semibold">{p.subject}</p>
              {p.topics && <p className="text-xs text-on-surface-variant">{p.topics}</p>}
            </div>
          ))}
        </div>
      )}

      {score !== undefined && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{score}/100</p>
          <p className="text-xs text-on-surface-variant">Resume Score</p>
        </div>
      )}

      {strengths && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
          <p className="mb-1 text-xs font-bold text-emerald-600">Strengths</p>
          {strengths.map((s) => (
            <p key={s} className="text-sm text-emerald-800">
              ✓ {s}
            </p>
          ))}
        </div>
      )}

      {improvements && (
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
          <p className="mb-1 text-xs font-bold text-amber-600">Improvements</p>
          {improvements.map((s) => (
            <p key={s} className="text-sm text-amber-800">
              → {s}
            </p>
          ))}
        </div>
      )}

      {footer && (
        <p className="text-xs text-on-surface-variant">{renderBold(footer)}</p>
      )}

      {recommendation && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
          {recommendation}
        </div>
      )}
    </div>
  );
}

function ToolPanel({ tool, onResult, onAsk }) {
  const [noticeText, setNoticeText] = useState(getAllNotices()[0]?.fullText || "");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const reminders = getSmartReminders();
  const meta = TOOLS.find((t) => t.id === tool);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      onAsk(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, [onAsk]);

  async function run(action) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    onResult(action());
    setLoading(false);
  }

  function startVoice() {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      onAsk("What is my next class?");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">{meta?.icon}</span>
        <h3 className="text-base font-bold text-on-background">{meta?.label}</h3>
      </div>

      {tool === "notice" && (
        <div className="space-y-3">
          <p className="text-sm text-on-surface-variant">
            Paste a college circular — AI extracts key points.
          </p>
          <textarea
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => run(() => summarizeNoticeText(noticeText))}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "Summarize Notice"}
          </button>
        </div>
      )}

      {tool === "study" && (
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            Generate a 15-day subject-wise study plan for your upcoming exams.
          </p>
          <button
            type="button"
            onClick={() => run(generateStudyPlan)}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Study Plan"}
          </button>
        </div>
      )}

      {tool === "attendance" && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => run(() => getAttendanceAdvice("skip"))}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Can I skip tomorrow?"}
          </button>
          <button
            type="button"
            onClick={() => onAsk("How much attendance do I need?")}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            Attendance needed
          </button>
        </div>
      )}

      {tool === "placement" && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => run(() => getPlacementRoadmap("Amazon"))}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Amazon Roadmap
          </button>
          <button
            type="button"
            onClick={() => onAsk("Generate HR questions")}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            HR Questions
          </button>
        </div>
      )}

      {tool === "resume" && (
        <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 px-6 py-10 hover:border-indigo-400">
          <span className="text-3xl">📎</span>
          <span className="mt-2 text-sm font-semibold text-indigo-700">Upload Resume PDF</span>
          <span className="mt-1 text-xs text-on-surface-variant">Click to analyze · Max 5MB</span>
          <input type="file" accept=".pdf" className="hidden" onChange={() => run(analyzeResume)} />
        </label>
      )}

      {tool === "voice" && (
        <div className="flex flex-col items-center py-4">
          <button
            type="button"
            onClick={startVoice}
            className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl shadow-lg transition-all ${
              listening
                ? "animate-pulse bg-red-500 text-white"
                : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:scale-105"
            }`}
          >
            🎤
          </button>
          <p className="mt-3 text-sm font-medium">
            {listening ? "Listening..." : "Ask CampusFlow"}
          </p>
        </div>
      )}

      {tool === "reminders" && (
        <div className="space-y-2">
          {reminders.map((r) => (
            <div
              key={r.text}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm"
            >
              <span>{r.icon}</span>
              {r.text}
            </div>
          ))}
          <button
            type="button"
            onClick={() => run(getEventRecommendations)}
            disabled={loading}
            className="mt-2 text-sm font-semibold text-indigo-600 hover:underline"
          >
            View recommended events →
          </button>
        </div>
      )}
    </div>
  );
}

export default function AIAssistantPage({ user, onBack, initialPrompt }) {
  const firstName = user?.fullName?.split(" ")[0] || "Student";
  const initials = firstName.slice(0, 2).toUpperCase();
  const [activeTool, setActiveTool] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const sendRef = useRef(null);

  const showWelcome = messages.length === 0 && activeTool === "chat";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, activeTool]);

  const handleSend = useCallback(
    async (question) => {
      const q = (question || input).trim();
      if (!q || loading) return;
      setInput("");
      setActiveTool("chat");
      setMessages((m) => [...m, { role: "user", text: q }]);
      setLoading(true);
      try {
        const response = await askAI(q, user);
        setMessages((m) => [...m, { role: "ai", ...response }]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, user]
  );

  sendRef.current = handleSend;

  useEffect(() => {
    if (initialPrompt) sendRef.current?.(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      sendRef.current?.(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  function handleToolResult(result) {
    setMessages((m) => [...m, { role: "ai", ...result }]);
    setActiveTool("chat");
  }

  function toggleMic() {
    if (!recognitionRef.current) {
      handleSend("What is my next class?");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      recognitionRef.current.start();
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-slate-50">
      {/* Header — full width, back left, chips right */}
      <header className="w-full shrink-0 border-b border-slate-200 bg-white px-5 py-3 lg:px-8">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                title="Back to Dashboard"
              >
                ←
              </button>
            )}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg text-white shadow-md">
              🤖
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-on-background sm:text-lg">
                CampusFlow AI Assistant
              </h1>
              <p className="text-xs text-emerald-600">● Online · CampusGPT</p>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {DEMO_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleSend(p)}
                className="whitespace-nowrap rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tool tabs — full width scroll */}
        <div className="mt-3 flex w-full gap-2 overflow-x-auto pb-1">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm ${
                activeTool === tool.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main scroll area */}
      <div className="min-h-0 w-full flex-1 overflow-y-auto">
        <div className="w-full px-5 py-6 lg:px-8">
          {activeTool !== "chat" ? (
            <ToolPanel tool={activeTool} onResult={handleToolResult} onAsk={handleSend} />
          ) : showWelcome ? (
            <div className="mx-auto w-full max-w-3xl py-4 sm:py-8">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg">
                  👋
                </div>
                <h2 className="text-xl font-bold text-on-background sm:text-2xl">
                  Hi {firstName}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  How can I help you today?
                </p>
              </div>

              <p className="mb-4 mt-10 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick suggestions
              </p>
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    type="button"
                    onClick={() => handleSend(s.prompt)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xl">
                      {s.icon}
                    </span>
                    <span className="text-sm font-medium leading-snug text-on-background">
                      {s.text}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:hidden">
                {DEMO_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSend(p)}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[11px] font-medium text-indigo-700"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Chat messages */}
          {messages.length > 0 && (
            <div className="mx-auto mt-4 flex w-full max-w-3xl flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {m.role === "ai" ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm">
                      🤖
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-white">
                      {initials}
                    </div>
                  )}
                  <div
                    className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="text-sm">{m.text}</p>
                    ) : (
                      <AIMessageContent message={m} />
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm">
                    🤖
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="w-full shrink-0 border-t border-slate-200 bg-white px-5 py-3 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
              listening ? "bg-red-500 text-white" : "bg-slate-100 hover:bg-indigo-50"
            }`}
          >
            🎤
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-300 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            Send
          </button>
        </div>
        <p className="mx-auto mt-2 w-full max-w-3xl text-center text-[10px] text-slate-400">
          Powered by CampusGPT · timetable · assignments · attendance · events
        </p>
      </div>
    </div>
  );
}
