import { useState } from "react";
import {
  NOTIFICATION_TYPES,
  PRIORITY_STYLES,
  AI_RECOMMENDATION,
  AI_PRIORITY_ALERTS,
  filterNotifications,
  groupByTime,
} from "../../data/notificationsData";

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "assignment", label: "Assignments" },
  { id: "attendance", label: "Attendance" },
  { id: "event", label: "Events" },
  { id: "placement", label: "Placements" },
  { id: "timetable", label: "Timetable" },
];

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
  { id: "important", label: "Important" },
];

function PriorityDot({ priority }) {
  return (
    <span className="shrink-0 text-sm" aria-hidden>
      {PRIORITY_STYLES[priority]?.dot || "⚪"}
    </span>
  );
}

function NotificationActions({ notification, onMarkRead, onDismiss, onNavigate }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {!notification.isRead && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-on-background hover:bg-slate-50"
        >
          Mark as Read
        </button>
      )}
      <button
        type="button"
        onClick={() => onNavigate?.(notification.type)}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
      >
        View Details
      </button>
      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-slate-100"
      >
        Dismiss
      </button>
    </div>
  );
}

function AssignmentCard({ notification, ...handlers }) {
  const { meta } = notification;
  return (
    <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/80 to-white p-4">
      <div className="flex items-start gap-3">
        <PriorityDot priority={notification.priority} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h3 className="text-sm font-bold text-on-background">{meta.assignmentName}</h3>
            {!notification.isRead && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
            )}
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            {meta.due} · {meta.dueTime}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlers.onNavigate?.("assignments")}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              View Assignment
            </button>
            <button
              type="button"
              onClick={() => handlers.onMarkRead(notification.id)}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceCard({ notification, ...handlers }) {
  const { meta } = notification;
  return (
    <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/80 to-white p-4">
      <div className="flex items-start gap-3">
        <PriorityDot priority={notification.priority} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="text-sm font-bold text-on-background">Attendance Alert</h3>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <p className="text-xs text-on-surface-variant">Current</p>
              <p className="text-xl font-bold text-orange-600">{meta.current}%</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <p className="text-xs text-on-surface-variant">Required</p>
              <p className="text-xl font-bold text-on-background">{meta.required}%</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              AI Advice
            </p>
            <p className="mt-1 text-xs text-on-background">{meta.aiAdvice}</p>
          </div>
          <NotificationActions notification={notification} {...handlers} />
        </div>
      </div>
    </div>
  );
}

function TimetableCard({ notification, ...handlers }) {
  const { meta } = notification;
  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4">
      <div className="flex items-start gap-3">
        <PriorityDot priority={notification.priority} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <h3 className="text-sm font-bold text-on-background">Class Rescheduled</h3>
          </div>
          <p className="mt-2 text-sm font-semibold text-on-background">{meta.subject}</p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {meta.oldTime} → <span className="font-semibold text-blue-600">{meta.newTime}</span>
          </p>
          <NotificationActions notification={notification} {...handlers} />
        </div>
      </div>
    </div>
  );
}

function EventCard({ notification, ...handlers }) {
  const { meta } = notification;
  return (
    <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-4">
      <div className="flex items-start gap-3">
        <PriorityDot priority={notification.priority} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <h3 className="text-sm font-bold text-on-background">{meta.eventName}</h3>
          </div>
          <p className="mt-1 text-xs text-amber-700">
            Starts in {meta.startsIn}
            {meta.location && ` · ${meta.location}`}
          </p>
          <button
            type="button"
            onClick={() => handlers.onNavigate?.("events")}
            className="mt-3 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
          >
            Join Event
          </button>
          <NotificationActions notification={notification} {...handlers} />
        </div>
      </div>
    </div>
  );
}

function PlacementCard({ notification, ...handlers }) {
  const { meta } = notification;
  return (
    <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-4">
      <div className="flex items-start gap-3">
        <PriorityDot priority={notification.priority} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <h3 className="text-sm font-bold text-on-background">
              {meta.company} {meta.role || "Opportunity"}
            </h3>
          </div>
          {meta.deadline && (
            <p className="mt-1 text-xs font-semibold text-red-600">
              Registration Closes {meta.deadline}
            </p>
          )}
          {meta.date && (
            <p className="mt-1 text-xs text-on-surface-variant">
              Interview: {meta.date} · {meta.time}
            </p>
          )}
          <NotificationActions notification={notification} {...handlers} />
        </div>
      </div>
    </div>
  );
}

function GenericCard({ notification, ...handlers }) {
  const typeInfo = NOTIFICATION_TYPES[notification.type] || {};
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <PriorityDot priority={notification.priority} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeInfo.icon || "🔔"}</span>
            <h3 className="text-sm font-bold text-on-background">{notification.title}</h3>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
            )}
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">{notification.message}</p>
          <NotificationActions notification={notification} {...handlers} />
        </div>
      </div>
    </div>
  );
}

function NotificationCard(props) {
  const { notification } = props;
  switch (notification.type) {
    case "assignment":
      return <AssignmentCard {...props} />;
    case "attendance":
      return <AttendanceCard {...props} />;
    case "timetable":
      return <TimetableCard {...props} />;
    case "event":
      return <EventCard {...props} />;
    case "placement":
      return <PlacementCard {...props} />;
    default:
      return <GenericCard {...props} />;
  }
}

function TimeGroup({ label, items, handlers }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((n) => (
          <NotificationCard key={n.id} notification={n} {...handlers} />
        ))}
      </div>
    </section>
  );
}

export default function NotificationsPage({
  notifications,
  onMarkRead,
  onDismiss,
  onNavigate,
}) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = filterNotifications(notifications, {
    type: typeFilter,
    status: statusFilter,
  });
  const grouped = groupByTime(filtered);

  const navMap = {
    assignment: "assignments",
    attendance: "attendance",
    event: "events",
    placement: "placement",
    timetable: "classes",
    ai: "ai",
  };

  function handleNavigate(type) {
    onNavigate?.(navMap[type] || "home");
  }

  const handlers = { onMarkRead, onDismiss, onNavigate: handleNavigate };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* AI Priority Alerts */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">⭐</span>
          <h2 className="text-sm font-bold text-on-background">AI Priority Alerts</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {AI_PRIORITY_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm"
            >
              <PriorityDot priority={alert.priority} />
              <span className="text-sm font-medium text-on-background">{alert.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Recommendation */}
      <section className="rounded-2xl border border-indigo-200 bg-indigo-600 p-5 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h2 className="text-sm font-bold">AI Recommendation</h2>
        </div>
        <p className="mt-3 text-sm font-semibold">{AI_RECOMMENDATION.action}</p>
        <p className="mt-1 text-xs text-indigo-100">
          <span className="font-semibold text-white">Reason:</span> {AI_RECOMMENDATION.reason}
        </p>
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTypeFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                typeFilter === f.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-on-surface-variant hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === f.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-on-surface-variant hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped notifications */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <span className="text-4xl">🔔</span>
          <p className="mt-3 text-sm font-semibold text-on-background">No notifications</p>
          <p className="mt-1 text-xs text-on-surface-variant">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <TimeGroup label="Today" items={grouped.today} handlers={handlers} />
          <TimeGroup label="Yesterday" items={grouped.yesterday} handlers={handlers} />
          <TimeGroup label="Earlier" items={grouped.earlier} handlers={handlers} />
        </div>
      )}
    </div>
  );
}
