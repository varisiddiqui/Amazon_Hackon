import { getRecentNotifications, NOTIFICATION_TYPES } from "../../data/notificationsData";
import { getDashboardEvents, FEATURED_EVENT_ALERT } from "../../data/eventsData";

export default function DashboardHome({ user, onNavigate, onOpenAI, notifications = [] }) {
  const firstName = user?.fullName?.split(" ")[0] || "Student";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const overview = [
    { icon: "📚", text: "3 Classes Scheduled" },
    { icon: "📝", text: "2 Assignments Due" },
    { icon: "📊", text: "Attendance 78%" },
    { icon: "🎉", text: "1 Event Today" },
    { icon: "💼", text: "Placement Drive Tomorrow" },
  ];

  const quickActions = [
    { icon: "📅", label: "View Timetable", action: () => onNavigate("classes") },
    { icon: "📝", label: "Submit Assignment", action: () => onNavigate("assignments") },
    { icon: "🤖", label: "Ask AI", action: onOpenAI },
    { icon: "🎉", label: "Explore Events", action: () => onNavigate("events") },
  ];

  const classes = [
    { time: "09:00", name: "DSA", live: false },
    { time: "11:00", name: "DBMS", live: true },
    { time: "02:00", name: "AI Lab", live: false },
    { time: "04:00", name: "Web Development", live: false },
  ];

  const assignments = [
    { name: "DBMS Assignment", due: "Due Tomorrow", urgency: "red" },
    { name: "AI Lab Report", due: "Due in 2 Days", urgency: "yellow" },
    { name: "Web Dev Project", due: "Due in 5 Days", urgency: "green" },
  ];

  const dashboardEvents = getDashboardEvents(2);
  const recentNotifications = getRecentNotifications(notifications, 3);

  const reminders = [
    { color: "bg-red-500", text: "Assignment due tomorrow" },
    { color: "bg-amber-400", text: "Attendance below 75%" },
    { color: "bg-emerald-500", text: "Event registration open" },
  ];

  const achievements = [
    { icon: "🔥", title: "7 Day Study Streak" },
    { icon: "🏆", title: "Assignment Master" },
    { icon: "⭐", title: "Attendance Champion" },
  ];

  const urgencyStyles = {
    red: "border-red-200 bg-red-50 text-red-700",
    yellow: "border-amber-200 bg-amber-50 text-amber-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Section 1: AI Daily Brief */}
      <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-sm">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-600">
            {greeting} {firstName} 👋
          </p>
          <h2 className="mt-1 text-xl font-bold text-on-background">
            AI Daily Brief
          </h2>
          <p className="mt-3 text-sm font-semibold text-on-background">
            Today Overview
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {overview.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-2 text-sm text-on-surface-variant"
              >
                <span>{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              🎉 Event Alert
            </p>
            <p className="mt-1 text-sm font-semibold text-on-background">
              {FEATURED_EVENT_ALERT.title}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              <span className="font-semibold text-amber-700">Recommended:</span>{" "}
              {FEATURED_EVENT_ALERT.recommendation}
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-indigo-100 bg-white/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Recommended Action
            </p>
            <p className="mt-1 text-sm text-on-background">
              Complete DBMS assignment before 8 PM. You have AI Workshop at 4
              PM — block 2 hours for prep.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Quick Actions */}
      <section>
        <h3 className="mb-3 text-sm font-bold text-on-background">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.action}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-center text-xs font-semibold text-on-background">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 3: Today's Classes */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-on-background">
            Today&apos;s Schedule
          </h3>
          <div className="flex flex-col gap-2">
            {classes.map((cls) => (
              <div
                key={cls.name}
                className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                  cls.live
                    ? "border border-indigo-200 bg-indigo-50"
                    : "bg-slate-50"
                }`}
              >
                <div>
                  {cls.live && (
                    <span className="mb-1 inline-block rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Live Now
                    </span>
                  )}
                  <p className="text-sm font-semibold text-on-background">
                    {cls.name}
                  </p>
                </div>
                <span className="text-sm font-medium text-on-surface-variant">
                  {cls.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Assignments */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-on-background">
            Pending Assignments
          </h3>
          <div className="flex flex-col gap-2">
            {assignments.map((a) => (
              <div
                key={a.name}
                className={`rounded-xl border px-4 py-3 ${urgencyStyles[a.urgency]}`}
              >
                <p className="text-sm font-semibold">{a.name}</p>
                <p className="text-xs opacity-80">{a.due}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 5: Attendance */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-on-background">Attendance</h3>
          <div className="flex items-center gap-6">
            <div
              className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#6366f1 0% 78%, #e2e8f0 78% 100%)",
              }}
            >
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-lg font-bold text-indigo-600">
                78%
              </div>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">
                Current: <strong className="text-on-background">78%</strong>
              </p>
              <p className="text-sm text-on-surface-variant">
                Target: <strong className="text-on-background">80%</strong>
              </p>
              <p className="mt-1 text-sm font-medium text-amber-600">
                Need 3 More Classes
              </p>
              <p className="mt-2 text-xs text-on-surface-variant">
                Attend next 3 classes to reach safe zone.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Upcoming Events */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-background">🎉 Upcoming Events</h3>
            <button
              type="button"
              onClick={() => onNavigate("events")}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {dashboardEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-on-background">{ev.name}</p>
                  <p className="text-xs text-on-surface-variant">{ev.dateLabel}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  {ev.when}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Section 7: Placement Hub mini widget */}
      <section
        role="button"
        tabIndex={0}
        onClick={() => onNavigate("placement")}
        onKeyDown={(e) => e.key === "Enter" && onNavigate("placement")}
        id="placement-hub"
        className="cursor-pointer rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm transition-all hover:border-purple-200 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-background">🏆 Placement Hub</h3>
          <span className="text-xs font-semibold text-purple-700">Open Career Copilot →</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/80 p-3 text-center">
            <p className="text-xs text-on-surface-variant">Readiness</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">78%</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3 text-center">
            <p className="text-xs text-on-surface-variant">Interview</p>
            <p className="mt-1 text-sm font-semibold text-on-background">Amazon in 5 Days</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3 text-center">
            <p className="text-xs text-on-surface-variant">Resume Score</p>
            <p className="mt-1 text-2xl font-bold text-purple-600">82%</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Section 8: Recent Notifications */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-background">
              🔔 Recent Notifications
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("notices")}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View All
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {recentNotifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
                  !n.isRead ? "border border-indigo-100 bg-indigo-50/50" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  )}
                  <span className="font-medium text-on-background">{n.title}</span>
                </div>
                <span className="text-[10px] text-on-surface-variant">
                  {NOTIFICATION_TYPES[n.type]?.icon || "🔔"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 9: Smart Reminders */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-on-background">
            Smart Reminders
          </h3>
          <ul className="flex flex-col gap-3">
            {reminders.map((r) => (
              <li key={r.text} className="flex items-center gap-3 text-sm">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.color}`} />
                {r.text}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Hostel mini widget */}
      <section
        role="button"
        tabIndex={0}
        onClick={() => onNavigate("hostel")}
        onKeyDown={(e) => e.key === "Enter" && onNavigate("hostel")}
        className="cursor-pointer rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-on-background">
            🛏️ Hostel
          </h3>
          <span className="text-xs font-semibold text-amber-700">View all →</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/80 p-3 text-center">
            <p className="text-xs text-on-surface-variant">Today&apos;s Menu</p>
            <p className="mt-1 text-sm font-semibold text-on-background">Paneer Special</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3 text-center">
            <p className="text-xs text-on-surface-variant">Notices</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">2</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3 text-center">
            <p className="text-xs text-on-surface-variant">Complaints</p>
            <p className="mt-1 text-2xl font-bold text-red-500">1</p>
            <p className="text-[10px] text-on-surface-variant">Pending</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 10: Productivity */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-on-background">
            Today&apos;s Productivity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">5/8</p>
              <p className="text-xs text-on-surface-variant">Tasks Completed</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">4h</p>
              <p className="text-xs text-on-surface-variant">Study Time</p>
            </div>
          </div>
        </section>

        {/* Section 11: Achievements */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-on-background">
            Achievements
          </h3>
          <div className="flex flex-col gap-2">
            {achievements.map((a) => (
              <div
                key={a.title}
                className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3"
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-sm font-semibold text-on-background">
                  {a.title}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
