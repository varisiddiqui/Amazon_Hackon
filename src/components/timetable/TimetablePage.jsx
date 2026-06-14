import { useState } from "react";
import {
  todayClasses,
  weeklySchedule,
  exams,
  freeSlots,
  aiSuggestions,
  defaultPersonalEvents,
  smartNotifications,
  getNextClass,
  getStudyRecommendation,
  TYPE_COLORS,
  WEEK_DAYS,
} from "../../data/timetableData";

function SectionCard({ title, icon, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-on-background">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.lecture;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${c.bg} ${c.text}`}>
      {type}
    </span>
  );
}

function ClassCard({ cls, selected, onSelect }) {
  const isLive = cls.status === "live";
  const isDone = cls.status === "completed";
  const colors = TYPE_COLORS[cls.type];

  return (
    <button
      type="button"
      onClick={() => onSelect(cls)}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected?.id === cls.id
          ? "border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-100"
          : isLive
            ? "border-emerald-200 bg-emerald-50/50"
            : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
      } ${isDone ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {isLive && (
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live Now
            </span>
          )}
          <p className="text-base font-bold text-on-background">{cls.subject}</p>
          <p className="mt-0.5 text-sm text-on-surface-variant">
            {cls.start} – {cls.end}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">{cls.room}</p>
        </div>
        <TypeBadge type={cls.type} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-200/60 pt-3">
        <div className="text-xs text-on-surface-variant">
          <span className="font-medium text-on-background">{cls.attendance.percent}%</span> attendance
        </div>
        <div className="text-xs text-on-surface-variant">
          Present: {cls.attendance.present} · Absent: {cls.attendance.absent}
        </div>
      </div>
    </button>
  );
}

function FacultyPanel({ cls }) {
  if (!cls) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-on-surface-variant">
        Click a class to view faculty & details
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5">
      <p className="text-lg font-bold text-on-background">{cls.subject}</p>
      <TypeBadge type={cls.type} />
      <dl className="mt-4 space-y-3">
        {[
          { label: "Faculty", value: cls.faculty },
          { label: "Room", value: cls.room },
          { label: "Credits", value: cls.credits },
          { label: "Time", value: `${cls.start} – ${cls.end}` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-on-surface-variant">{row.label}</dt>
            <dd className="font-medium text-on-background">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 rounded-lg bg-white p-3">
        <p className="text-xs font-bold text-on-surface-variant">Attendance</p>
        <p className="mt-1 text-2xl font-bold text-indigo-600">{cls.attendance.percent}%</p>
        <p className="text-xs text-on-surface-variant">
          Present {cls.attendance.present} · Absent {cls.attendance.absent}
        </p>
      </div>
      {cls.online && (
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Join Class
        </button>
      )}
    </div>
  );
}

export default function TimetablePage({ onOpenAI }) {
  const [selectedClass, setSelectedClass] = useState(
    todayClasses.find((c) => c.status === "live") || todayClasses[0]
  );
  const [personalEvents, setPersonalEvents] = useState(defaultPersonalEvents);
  const [showAddPersonal, setShowAddPersonal] = useState(false);
  const [newPersonal, setNewPersonal] = useState({ title: "", day: "Mon", time: "" });

  const nextClass = getNextClass();

  function addPersonalEvent(e) {
    e.preventDefault();
    if (!newPersonal.title.trim()) return;
    setPersonalEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newPersonal.title,
        day: newPersonal.day,
        time: newPersonal.time || "18:00–19:00",
        icon: "⭐",
      },
    ]);
    setNewPersonal({ title: "", day: "Mon", time: "" });
    setShowAddPersonal(false);
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Smart notifications strip */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {smartNotifications.map((n) => (
          <div
            key={n.id}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium ${
              n.urgent
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-white text-on-surface-variant"
            }`}
          >
            <span>{n.icon}</span>
            {n.text}
          </div>
        ))}
      </div>

      {/* Section 1 + 5: Today's Schedule + Faculty */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Today's Schedule" icon="📅" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {todayClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                selected={selectedClass}
                onSelect={setSelectedClass}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Faculty & Class Info" icon="👨‍🏫">
          <FacultyPanel cls={selectedClass} />
        </SectionCard>
      </div>

      {/* Section 3: Upcoming Class */}
      {nextClass && (
        <SectionCard title="Next Class" icon="⏭️">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-bold text-on-background">{nextClass.subject}</p>
              <p className="mt-1 text-sm text-indigo-600 font-medium">
                {nextClass.status === "live"
                  ? "Happening now"
                  : "Starts in ~25 minutes"}
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">{nextClass.room}</p>
              <p className="text-sm text-on-surface-variant">
                Faculty: <strong className="text-on-background">{nextClass.faculty}</strong>
              </p>
            </div>
            <div className="flex gap-2">
              {nextClass.online && (
                <button
                  type="button"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Join Class
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenAI?.(`When should I study ${nextClass.subject}?`)}
                className="rounded-xl border border-indigo-200 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                Ask AI
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Section 2: Weekly Calendar */}
      <SectionCard title="Weekly Calendar" icon="🗓️">
        <div className="mb-4 flex flex-wrap gap-3 text-[11px]">
          {Object.entries(TYPE_COLORS).map(([type, c]) => (
            <span key={type} className="flex items-center gap-1.5 capitalize text-on-surface-variant">
              <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
              {type}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-indigo-600">
                {day}
              </p>
              <div className="space-y-2">
                {(weeklySchedule[day] || []).map((item, i) => {
                  const c = TYPE_COLORS[item.type];
                  return (
                    <div
                      key={i}
                      className={`rounded-lg border px-2 py-2 ${c.bg} ${c.border}`}
                    >
                      <p className={`text-xs font-semibold ${c.text}`}>{item.subject}</p>
                      <p className="text-[10px] text-on-surface-variant">{item.time}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 4: Exam Schedule */}
        <SectionCard title="Upcoming Exams" icon="📝">
          <div className="space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/30 px-4 py-3"
              >
                <div>
                  <p className="font-bold text-on-background">{exam.subject}</p>
                  <p className="text-xs text-on-surface-variant">
                    {exam.date} · {exam.time} · {exam.room}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{exam.daysLeft}</p>
                  <p className="text-[10px] text-on-surface-variant">days left</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            🔔 DBMS Exam in 6 Days — start revision today
          </p>
        </SectionCard>

        {/* Section 8: Free Time Finder */}
        <SectionCard title="Free Time Finder" icon="⏰">
          <p className="mb-3 text-xs text-on-surface-variant">
            AI-detected gaps in your schedule today
          </p>
          <div className="space-y-2">
            {freeSlots.map((slot, i) => (
              <div
                key={i}
                className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-3"
              >
                <p className="font-semibold text-on-background">
                  {slot.start} – {slot.end}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Perfect for: {slot.uses.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Section 7: AI Smart Suggestions */}
      <SectionCard title="AI Smart Suggestions" icon="🤖">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiSuggestions.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border p-4 ${
                s.priority === "high"
                  ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <span className="text-2xl">{s.icon}</span>
              <p className="mt-2 text-sm font-bold text-on-background">{s.title}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{s.body}</p>
              <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-xs font-semibold text-indigo-700">
                → {s.action}
              </p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onOpenAI?.("When should I study DBMS?")}
          className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          🤖 Ask AI Schedule Optimizer
        </button>
      </SectionCard>

      {/* Section 9: Personal Timetable */}
      <SectionCard title="Personal Planner" icon="⭐">
        <p className="mb-4 text-xs text-on-surface-variant">
          Academic + personal — gym, library, interview prep & more
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {personalEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/30 px-4 py-3"
            >
              <span className="text-xl">{ev.icon}</span>
              <div>
                <p className="text-sm font-semibold text-on-background">{ev.title}</p>
                <p className="text-xs text-on-surface-variant">
                  {ev.day} · {ev.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        {showAddPersonal ? (
          <form onSubmit={addPersonalEvent} className="mt-4 flex flex-wrap gap-2">
            <input
              value={newPersonal.title}
              onChange={(e) => setNewPersonal((p) => ({ ...p, title: e.target.value }))}
              placeholder="Activity name"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
            <select
              value={newPersonal.day}
              onChange={(e) => setNewPersonal((p) => ({ ...p, day: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {WEEK_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              value={newPersonal.time}
              onChange={(e) => setNewPersonal((p) => ({ ...p, time: e.target.value }))}
              placeholder="e.g. 18:00–19:00"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddPersonal(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddPersonal(true)}
            className="mt-4 rounded-xl border border-dashed border-indigo-200 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            + Add personal activity
          </button>
        )}
      </SectionCard>
    </div>
  );
}

export { getStudyRecommendation };
