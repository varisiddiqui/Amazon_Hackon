import { useState } from "react";
import {
  EVENT_CATEGORIES,
  EVENT_LEVELS,
  CATEGORY_ICONS,
  CLUB_EVENTS,
  getFeaturedEvent,
  getUpcomingEvents,
  getPastEvents,
  getCountdown,
  filterEvents,
  getRegisteredEvents,
  getRecommendedEvents,
  getSeatsLeft,
  getEventById,
  getEventsAIAnswer,
} from "../../data/eventsData";

function CountdownBadge({ startsAt }) {
  const { days, hours, label } = getCountdown(startsAt);
  return (
    <div className="rounded-xl bg-indigo-600 px-3 py-2 text-center text-white">
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Starts In</p>
      <p className="text-lg font-bold">
        {days > 0 ? `${days}d` : `${hours}h`}
      </p>
      <p className="text-[10px] opacity-80">{days > 0 ? `${hours}h left` : label.replace("Starts In ", "")}</p>
    </div>
  );
}

function LevelBadge({ level }) {
  if (!level || !EVENT_LEVELS[level]) return null;
  const { label, badge } = EVENT_LEVELS[level];
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge}`}>
      {label}
    </span>
  );
}

function EventCard({ event, registrations, onSelect, compact }) {
  const seats = getSeatsLeft(event);
  const isRegistered = registrations.includes(event.id);
  const icon = CATEGORY_ICONS[event.category] || "🎉";

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onSelect(event)}
        className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
      >
        <span className="text-xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-on-background">{event.title}</p>
          <p className="text-xs text-on-surface-variant">
            {event.dateLabel} · {event.time}
          </p>
        </div>
        {isRegistered && <span className="text-emerald-600">✓</span>}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-2xl">{icon}</span>
              <h3 className="mt-1 text-sm font-bold text-on-background">{event.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-xs capitalize text-on-surface-variant">{event.category}</p>
                <LevelBadge level={event.level} />
              </div>
            </div>
            <CountdownBadge startsAt={event.startsAt} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
            <span>📅 {event.dateLabel}</span>
            <span>🕐 {event.time}</span>
            <span>📍 {event.venue.split("·")[0].trim()}</span>
            {event.prizePool ? (
              <span className="font-semibold text-amber-600">🏆 {event.prizePool}</span>
            ) : (
              <span>👥 Seats: {seats}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {isRegistered ? (
              <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                ✓ Registered
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelect(event)}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Register
              </button>
            )}
            <button
              type="button"
              onClick={() => onSelect(event)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-on-background hover:bg-slate-50"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetail({
  event,
  registrations,
  onBack,
  onRegister,
  onAddCalendar,
}) {
  const isRegistered = registrations.includes(event.id);
  const seats = getSeatsLeft(event);
  const icon = CATEGORY_ICONS[event.category] || "🎉";
  const countdown = getCountdown(event.startsAt);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← Back to Events
      </button>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-4xl">{icon}</span>
            <h2 className="mt-2 text-xl font-bold text-on-background">{event.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm capitalize text-on-surface-variant">{event.category}</p>
              <LevelBadge level={event.level} />
            </div>
          </div>
          <CountdownBadge startsAt={event.startsAt} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{event.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Date", value: event.dateLabel, icon: "📅" },
            { label: "Time", value: event.time, icon: "🕐" },
            { label: "Venue", value: event.venue, icon: "📍" },
            { label: "Organizer", value: event.organizer, icon: "👤" },
            ...(event.prizePool
              ? [{ label: "Prize Pool", value: event.prizePool, icon: "🏆" }]
              : []),
            { label: "Seats Left", value: `${seats} / ${event.capacity}`, icon: "👥" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                {item.icon} {item.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-on-background">{item.value}</p>
            </div>
          ))}
        </div>

        {event.requirements?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Requirements
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {event.requirements.map((r) => (
                <li key={r} className="text-sm text-on-background">
                  • {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!isRegistered && event.status === "upcoming" && (
            <button
              type="button"
              onClick={() => onRegister(event)}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Register
            </button>
          )}
          {isRegistered && (
            <span className="rounded-xl bg-emerald-100 px-6 py-2.5 text-sm font-semibold text-emerald-700">
              ✓ Registered
            </span>
          )}
          <button
            type="button"
            onClick={() => onAddCalendar(event)}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-on-background hover:bg-slate-50"
          >
            Add To Calendar
          </button>
        </div>

        <p className="mt-3 text-xs text-amber-600">
          {countdown.label} · Registration closes {event.registrationDeadline}
        </p>
      </div>
    </div>
  );
}

function RegistrationConfirm({ event, onDone }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </span>
      <h2 className="text-xl font-bold text-on-background">Registration Confirmed!</h2>
      <p className="max-w-sm text-sm text-on-surface-variant">
        You&apos;re registered for <strong>{event.title}</strong>. A reminder has been added to
        your notifications.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        View My Events
      </button>
    </div>
  );
}

export default function EventsPage({
  registrations,
  onRegister,
  onOpenAI,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmEvent, setConfirmEvent] = useState(null);
  const [category, setCategory] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiReply, setAiReply] = useState(null);
  const [myEventsTab, setMyEventsTab] = useState("upcoming");

  const featured = getFeaturedEvent();
  const filtered = filterEvents(getUpcomingEvents(), { category, search }).filter(
    (e) => levelFilter === "all" || e.level === levelFilter
  );
  const registeredEvents = getRegisteredEvents(registrations);
  const recommended = getRecommendedEvents(registrations);
  const pastEvents = getPastEvents();
  const completedRegistered = registeredEvents.filter((e) => e.status === "completed");
  const upcomingRegistered = registeredEvents.filter((e) => e.status === "upcoming");

  function handleRegister(event) {
    onRegister(event);
    setConfirmEvent(event);
    setSelectedEvent(null);
  }

  function handleAddCalendar(event) {
    const text = `${event.title} — ${event.dateLabel} ${event.time} @ ${event.venue}`;
    navigator.clipboard?.writeText(text);
    alert(`Added to clipboard:\n${text}\n(Paste into your calendar app)`);
  }

  function askAI(q) {
    const query = q || aiQuery;
    if (!query.trim()) return;
    setAiReply(getEventsAIAnswer(query, registrations));
    setAiQuery("");
  }

  if (confirmEvent) {
    return (
      <RegistrationConfirm
        event={confirmEvent}
        onDone={() => setConfirmEvent(null)}
      />
    );
  }

  if (selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        registrations={registrations}
        onBack={() => setSelectedEvent(null)}
        onRegister={handleRegister}
        onAddCalendar={handleAddCalendar}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Featured Event */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 text-white shadow-lg">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-100">
            ⭐ Featured Event
          </p>
          <h2 className="mt-2 text-2xl font-bold">🚀 {featured.title}</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-amber-100">Registration Ends</p>
              <p className="font-bold">{featured.registrationDeadline}</p>
            </div>
            <div>
              <p className="text-amber-100">Prize Pool</p>
              <p className="font-bold">{featured.prizePool}</p>
            </div>
            <CountdownBadge startsAt={featured.startsAt} />
          </div>
          {registrations.includes(featured.id) ? (
            <span className="mt-5 inline-block rounded-xl bg-white/20 px-6 py-2.5 text-sm font-semibold">
              ✓ Already Registered
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setSelectedEvent(featured)}
              className="mt-5 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-orange-600 shadow-md hover:bg-amber-50"
            >
              Register Now
            </button>
          )}
        </div>
      </section>

      {/* Search & Categories */}
      <div className="flex flex-col gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Events... (SIH, Hackathon, College Fest, Amazon)"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <div className="flex flex-wrap gap-2">
          {EVENT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                category === c.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-on-surface-variant hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Levels" },
            { id: "national", label: "🇮🇳 National" },
            { id: "college", label: "🏫 College Level" },
            { id: "inter-college", label: "🎓 Inter-College" },
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevelFilter(l.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                levelFilter === l.id
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-on-surface-variant hover:bg-slate-50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Events */}
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-on-background">Upcoming Events</h2>
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-on-surface-variant">
              No events match your search.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  registrations={registrations}
                  onSelect={setSelectedEvent}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sidebar: My Events + AI Recs */}
        <div className="flex flex-col gap-6">
          {/* My Registered Events */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-on-background">My Registered Events</h2>
            <div className="mb-3 flex gap-2">
              {["upcoming", "completed"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMyEventsTab(tab)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold capitalize ${
                    myEventsTab === tab
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-on-surface-variant"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {(myEventsTab === "upcoming" ? upcomingRegistered : completedRegistered).length ===
              0 ? (
                <p className="py-4 text-center text-xs text-on-surface-variant">
                  No {myEventsTab} events
                </p>
              ) : (
                (myEventsTab === "upcoming" ? upcomingRegistered : completedRegistered).map(
                  (e) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      registrations={registrations}
                      onSelect={setSelectedEvent}
                      compact
                    />
                  )
                )
              )}
            </div>
          </section>

          {/* AI Recommendations */}
          <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-on-background">
              <span>⭐</span> Recommended For You
            </h2>
            <div className="flex flex-col gap-3">
              {recommended.slice(0, 3).map(({ event, reason }) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="rounded-xl bg-white/90 p-3 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-on-background">{event.title}</p>
                  <p className="mt-1 text-xs text-indigo-600">
                    <span className="font-semibold">Reason:</span> {reason}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Club Events */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-on-background">Club Events</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CLUB_EVENTS.map(({ club, eventIds }) => (
            <div key={club} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-on-background">{club}</p>
              <div className="mt-2 flex flex-col gap-2">
                {eventIds.map((id) => {
                  const e = getEventById(id);
                  if (!e) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedEvent(e)}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-xs hover:bg-indigo-50"
                    >
                      <span className="font-medium text-on-background">{e.title}</span>
                      <span className="text-on-surface-variant">
                        {getCountdown(e.startsAt).label.replace("Starts In ", "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Events + Certificates */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-on-background">Past Events</h2>
          <div className="flex flex-col gap-2">
            {pastEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-on-background">{e.title}</p>
                  <p className="text-xs text-on-surface-variant">{e.dateLabel}</p>
                </div>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-on-background">Certificates</h2>
          {completedRegistered.filter((e) => e.hasCertificate).length === 0 ? (
            <p className="py-6 text-center text-xs text-on-surface-variant">
              Complete events to earn certificates
            </p>
          ) : (
            completedRegistered
              .filter((e) => e.hasCertificate)
              .map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-on-background">{e.title}</span>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Download Certificate
                  </button>
                </div>
              ))
          )}
        </section>
      </div>

      {/* AI Event Assistant */}
      <section className="rounded-2xl border border-indigo-200 bg-indigo-600 p-5 text-white shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
          <span>🤖</span> AI Event Assistant
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Any hackathons this week?",
            "Tell me about SIH",
            "College level events",
            "What events am I registered for?",
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => askAI(q)}
              className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/30"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="Ask about events..."
            className="flex-1 rounded-xl border-0 px-4 py-2.5 text-sm text-on-background outline-none"
          />
          <button
            type="button"
            onClick={() => askAI()}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Ask
          </button>
          {onOpenAI && (
            <button
              type="button"
              onClick={onOpenAI}
              className="rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Open CampusGPT
            </button>
          )}
        </div>
        {aiReply && (
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-white/10 p-4 text-sm leading-relaxed">
            {aiReply}
          </pre>
        )}
      </section>
    </div>
  );
}
