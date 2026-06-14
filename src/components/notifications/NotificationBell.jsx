import { useState, useRef, useEffect } from "react";
import { PRIORITY_STYLES } from "../../data/notificationsData";

export default function NotificationBell({
  notifications,
  onMarkRead,
  onViewAll,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = notifications.filter((n) => !n.isDismissed);
  const unreadCount = active.filter((n) => !n.isRead).length;
  const preview = active
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-indigo-50 sm:h-10 sm:w-10"
      >
        <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[250] mt-2 w-80 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl">
          <div className="border-b border-black/5 px-4 py-3">
            <p className="text-sm font-bold text-on-background">Notifications</p>
            {unreadCount > 0 && (
              <p className="text-xs text-on-surface-variant">{unreadCount} unread</p>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {preview.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-on-surface-variant">
                No notifications
              </p>
            ) : (
              preview.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    onMarkRead(n.id);
                    setOpen(false);
                    onViewAll?.();
                  }}
                  className={`flex w-full items-start gap-3 border-b border-black/5 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                    !n.isRead ? "bg-indigo-50/30" : ""
                  }`}
                >
                  <span className="shrink-0 text-sm">
                    {PRIORITY_STYLES[n.priority]?.dot || "🔔"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-on-background">
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
                      {n.message}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onViewAll?.();
            }}
            className="w-full border-t border-black/5 py-3 text-center text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
}
