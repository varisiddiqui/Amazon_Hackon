import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { getToken } from "../../lib/apiClient";

const STORAGE_KEY = "campusflow_settings";

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

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-on-background">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-on-background">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}

export default function SettingsPage({ user, onLogout }) {
  const { updateUser } = useAuth();
  const [settings, setSettings] = useState(loadSettings);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    department: user?.department || "",
    year: user?.year || "",
    rollNumber: user?.rollNumber || "CS2021042",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getToken()) return;
    api.fetchSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    saveSettings(settings);
    if (getToken()) {
      api.saveSettings(settings).catch(() => {});
    }
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [settings]);

  function updateNotifications(key, value) {
    setSettings((s) => ({
      ...s,
      notifications: { ...s.notifications, [key]: value },
    }));
  }

  function updateAI(key, value) {
    setSettings((s) => ({
      ...s,
      aiPreferences: { ...s.aiPreferences, [key]: value },
    }));
  }

  function setTheme(theme) {
    setSettings((s) => ({ ...s, theme }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (getToken()) {
      await updateUser({
        fullName: profile.fullName,
        department: profile.department,
        year: profile.year,
        rollNumber: profile.rollNumber,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = profile.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ST";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 pb-8">
      {/* Profile */}
      <Section title="Profile Settings" icon="👤">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
              {initials}
            </div>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Change Photo
            </button>
          </div>
          {[
            { key: "fullName", label: "Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "department", label: "Department", type: "text" },
            { key: "year", label: "Year", type: "text" },
            { key: "rollNumber", label: "Roll Number", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-xs font-medium text-on-surface-variant">
                {field.label}
              </label>
              <input
                type={field.type}
                value={profile[field.key]}
                onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300"
              />
            </div>
          ))}
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {saved ? "✓ Saved" : "Update Profile"}
          </button>
        </form>
      </Section>

      {/* Notifications */}
      <Section title="Notification Settings" icon="🔔">
        <div className="space-y-2">
          {[
            { key: "assignments", label: "Assignment Reminders" },
            { key: "attendance", label: "Attendance Alerts" },
            { key: "events", label: "Event Notifications" },
            { key: "placement", label: "Placement Updates" },
            { key: "hostel", label: "Hostel Notices" },
            { key: "transport", label: "Transport Alerts" },
          ].map((item) => (
            <Toggle
              key={item.key}
              label={item.label}
              checked={settings.notifications[item.key]}
              onChange={(v) => updateNotifications(item.key, v)}
            />
          ))}
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon="🎨">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "light", icon: "☀️", label: "Light" },
            { id: "dark", icon: "🌙", label: "Dark" },
            { id: "system", icon: "💻", label: "System" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
                settings.theme === t.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </Section>

      {/* AI Preferences */}
      <Section title="AI Preferences" icon="🤖">
        <p className="mb-3 text-xs text-on-surface-variant">
          Control what CampusFlow AI shows you
        </p>
        <div className="space-y-2">
          {[
            { key: "dailyBrief", label: "AI Daily Brief" },
            { key: "studyRecommendations", label: "Study Recommendations" },
            { key: "placementSuggestions", label: "Placement Suggestions" },
            { key: "attendanceAlerts", label: "Attendance Alerts" },
          ].map((item) => (
            <Toggle
              key={item.key}
              label={item.label}
              checked={settings.aiPreferences[item.key]}
              onChange={(v) => updateAI(item.key, v)}
            />
          ))}
        </div>
      </Section>

      {/* Account - simple */}
      <Section title="Account Settings" icon="🔐">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Change Password
          </button>
          <button
            type="button"
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete Account
          </button>
        </div>
      </Section>

      {/* Privacy - simple */}
      <Section title="Privacy & Security" icon="🛡️">
        <div className="space-y-3">
          <Toggle label="Two Factor Authentication" checked={false} onChange={() => {}} />
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-bold text-on-surface-variant">Active Session</p>
            <p className="mt-1 text-sm font-medium">Chrome — MacBook</p>
            <p className="text-xs text-on-surface-variant">Last active: 2 hours ago</p>
          </div>
        </div>
      </Section>

      {/* Connected Accounts */}
      <Section title="Connected Accounts" icon="🔗">
        <div className="space-y-2">
          {[
            { name: "Google", connected: true },
            { name: "GitHub", connected: false },
            { name: "LinkedIn", connected: false },
          ].map((acc) => (
            <div
              key={acc.name}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <span className="text-sm font-medium">{acc.name}</span>
              <span
                className={`text-xs font-semibold ${acc.connected ? "text-emerald-600" : "text-slate-400"}`}
              >
                {acc.connected ? "Connected" : "Connect"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Help */}
      <Section title="Help & Support" icon="💬">
        <div className="flex flex-wrap gap-2">
          {["FAQ", "Contact Support", "Report Bug", "Send Feedback"].map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              {item}
            </button>
          ))}
        </div>
      </Section>

      {/* About */}
      <section className="rounded-2xl border border-slate-200/80 bg-slate-50 p-5 text-center">
        <p className="text-sm font-bold text-on-background">CampusFlow AI</p>
        <p className="text-xs text-on-surface-variant">Version 1.0</p>
      </section>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
      >
        🚪 Logout
      </button>
    </div>
  );
}

export { loadSettings };
