import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import DashboardHome from "./dashboard/DashboardHome";
import AIAssistantPage from "./ai/AIAssistantPage";
import TimetablePage from "./timetable/TimetablePage";
import HostelPage from "./hostel/HostelPage";
import TransportPage from "./transport/TransportPage";
import PlacementHubPage from "./placement/PlacementHubPage";
import SettingsPage from "./settings/SettingsPage";
import NotificationsPage from "./notifications/NotificationsPage";
import EventsPage from "./events/EventsPage";
import { loadRegistrations, saveRegistrations } from "../data/eventsData";
import { useStudentNav } from "../context/StudentNavContext";

const THEME = {
  bg: "#ffffff",
  surface: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  border2: "#cbd5e1",
  text: "#0f172a",
  muted: "#64748b",
  muted2: "#475569",
  violet: "#6366f1",
  violetGl: "#6366f120",
  mint: "#10b981",
  mintGl: "#10b98120",
  coral: "#ef4444",
  coralGl: "#ef444420",
  amber: "#f59e0b",
  amberGl: "#f59e0b20",
  sky: "#3b82f6",
  skyGl: "#3b82f620",
  rose: "#ec4899",
  roseGl: "#ec489920",
};

const SECTION_COLOR = {
  home: { a: THEME.violet, gl: THEME.violetGl },
  classes: { a: THEME.mint, gl: THEME.mintGl },
  assignments: { a: THEME.coral, gl: THEME.coralGl },
  events: { a: THEME.amber, gl: THEME.amberGl },
  attendance: { a: THEME.sky, gl: THEME.skyGl },
  notices: { a: THEME.rose, gl: THEME.roseGl },
};

const SECTION_TITLES = {
  home: "Dashboard",
  classes: "Timetable",
  assignments: "Assignments",
  attendance: "Attendance",
  events: "Campus Event Hub",
  notices: "Student Alert Center",
  placement: "Placement Hub",
  hostel: "Hostel",
  transport: "Transport",
  settings: "Settings",
  ai: "AI Assistant",
};

const SECTIONS = {
  classes: {
    accent: THEME.mint,
    urgent: [
      { id: 1, task: "Advanced Algorithms", room: "Room 204 · Block A", deadline: "09:00 AM", eta: "LIVE NOW", timeReq: "1h 30m" },
      { id: 2, task: "DBMS Lab Practical", room: "Lab 3 · Ground Flr", deadline: "11:00 AM", eta: "2h left", timeReq: "2h" },
      { id: 3, task: "OS Tutorial", room: "Room 108 · Block B", deadline: "01:00 PM", eta: "4h left", timeReq: "30m" },
    ],
    left: [
      { sno: 1, task: "Machine Learning Lec", deadline: "03:00 PM", timeReq: "1h" },
      { sno: 2, task: "Computer Networks Lab", deadline: "05:00 PM", timeReq: "2h" },
    ],
    done: [
      { sno: 1, task: "Data Structures Lec", deadline: "08:00 AM", timeReq: "1h" },
    ],
  },
  assignments: {
    accent: THEME.coral,
    urgent: [
      { id: 1, task: "DBMS Assignment", room: "Upload Portal", deadline: "Tomorrow 8AM", eta: "URGENT", timeReq: "2h" },
      { id: 2, task: "AI Lab Report", room: "Email Submit", deadline: "In 2 Days", eta: "14h left", timeReq: "3h" },
    ],
    left: [
      { sno: 1, task: "Web Dev Project", deadline: "In 5 Days", timeReq: "8h" },
      { sno: 2, task: "Compiler Mini Project", deadline: "Jun 20", timeReq: "8h" },
    ],
    done: [
      { sno: 1, task: "SE UML Diagrams", deadline: "Jun 10", timeReq: "3h" },
    ],
  },
  events: {
    accent: THEME.amber,
    urgent: [
      { id: 1, task: "Amazon HackOn", room: "Register Online", deadline: "Tomorrow", eta: "URGENT", timeReq: "10m" },
      { id: 2, task: "AI Workshop", room: "Seminar Hall", deadline: "Friday 4PM", eta: "3 days", timeReq: "2h" },
    ],
    left: [
      { sno: 1, task: "Coding Contest", deadline: "Sunday", timeReq: "3h" },
    ],
    done: [],
  },
  attendance: {
    accent: THEME.sky,
    urgent: [
      { id: 1, task: "Mark Attendance — DBMS", room: "Lab 3", deadline: "11:05 AM", eta: "MARK NOW", timeReq: "1m" },
    ],
    left: [
      { sno: 1, task: "AI Lab Sign-in", deadline: "02:05 PM", timeReq: "1m" },
    ],
    done: [
      { sno: 1, task: "DSA Lecture", deadline: "09:05 AM", timeReq: "1m" },
    ],
  },
  notices: {
    accent: THEME.rose,
    urgent: [
      { id: 1, task: "Exam Form Released", room: "Admin Portal", deadline: "Today", eta: "NEW", timeReq: "5m" },
      { id: 2, task: "Fee Deadline Extended", room: "Accounts", deadline: "Tomorrow", eta: "UPDATE", timeReq: "5m" },
    ],
    left: [
      { sno: 1, task: "Holiday Announcement", deadline: "Jun 20", timeReq: "2m" },
    ],
    done: [],
  },
};

function glow(color, spread = 12) {
  return `0 0 ${spread}px ${color}`;
}

function UrgentCard({ item, accent }) {
  const isLive = /NOW|TODAY|URGENT|MARK|NEW|UPDATE/.test(item.eta);
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${accent}12, ${accent}06)`,
        border: `1px solid ${accent}35`,
        borderRadius: 14,
        padding: "13px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: accent,
          borderRadius: "3px 0 0 3px",
        }}
      />
      <div style={{ paddingLeft: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: THEME.text, marginBottom: 4 }}>
          {item.task}
        </div>
        <div style={{ fontSize: 11, color: THEME.muted2 }}>
          {item.room && <span>{item.room} · </span>}
          <span>⏰ {item.deadline}</span>
        </div>
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.1em",
          color: accent,
          background: `${accent}20`,
          border: `1px solid ${accent}40`,
          padding: "3px 8px",
          borderRadius: 6,
          textTransform: "uppercase",
          flexShrink: 0,
          marginLeft: 8,
          boxShadow: isLive ? glow(accent, 6) : "none",
        }}
      >
        {item.eta}
      </div>
    </div>
  );
}

function TaskTable({ rows, done, accent }) {
  if (!rows.length) {
    return (
      <div style={{ textAlign: "center", color: THEME.muted, padding: "28px 0", fontSize: 13 }}>
        {done ? "🎉 Nothing completed yet" : "✅ All clear!"}
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["#", "Task", "Deadline", "Time", ""].map((h, i) => (
              <th
                key={i}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: THEME.muted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "6px 8px",
                  textAlign: "left",
                  borderBottom: `1px solid ${THEME.border}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${THEME.border}20` }}>
              <td style={{ padding: "10px 8px", fontSize: 10, color: THEME.muted, fontWeight: 700 }}>{r.sno}</td>
              <td style={{ padding: "10px 8px", fontSize: 12, color: done ? THEME.muted : THEME.text, textDecoration: done ? "line-through" : "none" }}>{r.task}</td>
              <td style={{ padding: "10px 8px", fontSize: 11, color: THEME.muted2, whiteSpace: "nowrap" }}>{r.deadline}</td>
              <td style={{ padding: "10px 8px", fontSize: 11, color: THEME.muted2 }}>{r.timeReq}</td>
              <td style={{ padding: "10px 8px" }}>
                {done ? (
                  <span style={{ color: THEME.mint, fontSize: 14 }}>✓</span>
                ) : (
                  <span style={{ display: "block", width: 7, height: 7, borderRadius: "50%", background: accent, margin: "auto" }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionView({ id }) {
  const [tab, setTab] = useState("left");
  const data = SECTIONS[id];
  if (!data) return null;
  const { accent, urgent, left, done } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: glow(accent) }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: accent, textTransform: "uppercase" }}>
            🔥 Priority
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {urgent.map((item) => (
            <UrgentCard key={item.id} item={item} accent={accent} />
          ))}
        </div>
      </div>
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 18 }}>
        <div style={{ display: "flex", background: THEME.surface, borderRadius: 10, padding: 3, marginBottom: 14, gap: 3 }}>
          {[
            { key: "left", label: `Pending (${left.length})` },
            { key: "done", label: `Done (${done.length})` },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 8,
                border: "none",
                background: tab === t.key ? `${accent}20` : "transparent",
                color: tab === t.key ? accent : THEME.muted,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <TaskTable rows={tab === "left" ? left : done} done={tab === "done"} accent={accent} />
      </div>
    </div>
  );
}

function ComingSoon({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white py-20 shadow-sm">
      <span className="text-5xl">{icon}</span>
      <h2 className="mt-4 text-xl font-bold text-on-background">{title}</h2>
      <p className="mt-2 text-sm text-on-surface-variant">Coming soon in CampusFlow</p>
    </div>
  );
}

const VALID_SECTIONS = new Set([
  "home",
  "ai",
  "classes",
  "assignments",
  "attendance",
  "events",
  "notices",
  "placement",
  "hostel",
  "transport",
  "settings",
]);

function normalizeSection(section) {
  return VALID_SECTIONS.has(section) ? section : "home";
}

export default function Home() {
  const { user, logout } = useAuth();
  const studentNav = useStudentNav();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState(() =>
    normalizeSection(searchParams.get("section") || "home")
  );
  const [previousActive, setPreviousActive] = useState("home");
  const [aiInitialPrompt, setAiInitialPrompt] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState(loadRegistrations);
  const applySectionRef = useRef(null);

  const notifications = studentNav?.notifications ?? [];
  const markNotificationRead = studentNav?.markNotificationRead;
  const dismissNotification = studentNav?.dismissNotification;

  function registerForEvent(event) {
    if (eventRegistrations.includes(event.id)) return;
    const next = [...eventRegistrations, event.id];
    setEventRegistrations(next);
    saveRegistrations(next);
    studentNav?.addNotification({
      id: Date.now(),
      userId: "student",
      title: `Registered: ${event.title}`,
      message: `You're registered for ${event.title} on ${event.dateLabel} at ${event.time}. Reminder set!`,
      type: "event",
      priority: "informational",
      isRead: false,
      isImportant: false,
      isDismissed: false,
      timeGroup: "today",
      createdAt: new Date().toISOString(),
      meta: { eventName: event.title, startsIn: event.dateLabel },
    });
  }

  function syncUrl(section) {
    if (section === "home") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ section }, { replace: true });
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openAI(prompt, { updateUrl = true } = {}) {
    if (active !== "ai") {
      setPreviousActive(active);
    }
    setAiInitialPrompt(prompt || null);
    setActive("ai");
    if (updateUrl) syncUrl("ai");
  }

  function applySection(id, { updateUrl = true } = {}) {
    if (id === "logout") {
      handleLogout();
      return;
    }
    if (id === "ai") {
      openAI(null, { updateUrl });
      return;
    }
    setActive(id);
    if (updateUrl) syncUrl(id);
  }

  function handleNavigate(id) {
    applySection(id);
  }

  applySectionRef.current = applySection;

  useEffect(() => {
    studentNav?.registerSectionNav((id) => applySectionRef.current?.(id));
  }, [studentNav]);

  useEffect(() => {
    studentNav?.setActiveSection(active);
  }, [active, studentNav]);

  useEffect(() => {
    const section = normalizeSection(searchParams.get("section") || "home");
    if (section !== active) {
      applySection(section, { updateUrl: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function renderContent() {
    if (active === "ai") {
      return (
        <AIAssistantPage
          user={user}
          initialPrompt={aiInitialPrompt}
          onBack={() => {
            setActive(previousActive);
            setAiInitialPrompt(null);
            syncUrl(previousActive);
          }}
        />
      );
    }
    if (active === "home") {
      return (
        <DashboardHome
          user={user}
          onNavigate={handleNavigate}
          onOpenAI={() => openAI()}
          notifications={notifications}
        />
      );
    }
    if (active === "classes") {
      return <TimetablePage onOpenAI={openAI} />;
    }
    if (active === "notices") {
      return (
        <NotificationsPage
          notifications={notifications}
          onMarkRead={markNotificationRead}
          onDismiss={dismissNotification}
          onNavigate={handleNavigate}
        />
      );
    }
    if (active === "events") {
      return (
        <EventsPage
          registrations={eventRegistrations}
          onRegister={registerForEvent}
          onOpenAI={() => openAI("Any useful events this week?")}
        />
      );
    }
    if (SECTIONS[active]) return <SectionView id={active} />;
    if (active === "hostel") return <HostelPage onOpenAI={openAI} />;
    if (active === "transport") return <TransportPage onOpenAI={openAI} />;
    if (active === "placement") return <PlacementHubPage onOpenAI={openAI} />;
    if (active === "settings") {
      return <SettingsPage user={user} onLogout={handleLogout} />;
    }
    return null;
  }

  return (
    <>
      <Header activeSection={active} onSectionNav={handleNavigate} />

      <div className="flex h-screen w-full overflow-hidden bg-white pt-[72px]">
        <main
          className={`flex min-h-0 flex-1 flex-col bg-white ${
            active === "ai" ? "overflow-hidden p-0" : "overflow-y-auto p-4 sm:p-6 lg:p-8"
          }`}
        >
          {active !== "ai" && (
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-on-background">
                {SECTION_TITLES[active] || "Dashboard"}
              </h1>
              <span className="text-xs text-on-surface-variant">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {active !== "ai" && (
        <button
          type="button"
          onClick={() => openAI()}
          className="fixed bottom-6 right-6 z-[400] flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/40 transition-all hover:scale-105 hover:shadow-xl"
        >
          <span className="text-lg">🤖</span>
          <span className="hidden sm:inline">Ask CampusFlow AI</span>
        </button>
      )}
    </>
  );
}
