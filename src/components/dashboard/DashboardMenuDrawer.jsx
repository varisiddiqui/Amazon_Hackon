const SIDEBAR_ITEMS = [
  { id: "home", icon: "🏠", label: "Dashboard" },
  { id: "ai", icon: "🤖", label: "AI Assistant" },
  { id: "classes", icon: "📅", label: "Timetable" },
  { id: "assignments", icon: "📝", label: "Assignments" },
  { id: "attendance", icon: "📊", label: "Attendance" },
  { id: "events", icon: "🎉", label: "Events" },
  { id: "placement", icon: "🏆", label: "Placement Hub" },
  { id: "hostel", icon: "🛏️", label: "Hostel" },
  { id: "transport", icon: "🚌", label: "Transport" },
  { id: "notices", icon: "🔔", label: "Notifications" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function DashboardMenuDrawer({ open, onClose, active, onNavigate, onLogout }) {
  if (!open) return null;

  function handleNav(id) {
    onNavigate(id);
    onClose();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-0 z-[70] flex h-full w-[260px] flex-col border-r border-black/5 bg-slate-50 shadow-xl">
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                  isActive
                    ? "bg-indigo-100 font-semibold text-indigo-700 shadow-sm"
                    : "text-on-surface-variant hover:bg-white hover:text-on-background"
                }`}
              >
                <span className="shrink-0 text-base">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-black/5 px-2 py-3">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export { SIDEBAR_ITEMS };
