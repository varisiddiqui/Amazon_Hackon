import { useState } from "react";
import {
  busOverview,
  todaySchedule,
  liveTracking,
  routeStops,
  busAlerts,
  transportNotices,
  seatAvailability,
  missedBusAlternatives,
  emergencyContacts,
  AI_TRANSPORT_QUESTIONS,
  getTransportAIAnswer,
} from "../../data/transportData";

function Section({ title, icon, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-on-background">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}

export default function TransportPage({ onOpenAI }) {
  const [localAiReply, setLocalAiReply] = useState(null);

  function askTransportAI(q) {
    if (onOpenAI) {
      onOpenAI(q);
    } else {
      setLocalAiReply(getTransportAIAnswer(q));
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Alerts strip */}
      {busAlerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <span className="text-xl">🔔</span>
          <div>
            <p className="text-sm font-bold text-amber-900">{alert.title}</p>
            <p className="text-xs text-amber-800">{alert.message}</p>
          </div>
        </div>
      ))}

      {/* 1. Bus Overview */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-on-background">🚌 Bus Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Bus No", value: busOverview.busNo },
            { label: "Route", value: busOverview.route },
            { label: "Driver", value: busOverview.driver },
            {
              label: "Status",
              value: busOverview.statusLabel,
              highlight: busOverview.status === "on_time",
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/80 p-3 text-center shadow-sm">
              <p
                className={`text-lg font-bold ${item.highlight ? "text-emerald-600" : "text-indigo-600"}`}
              >
                {item.value}
              </p>
              <p className="text-[11px] text-on-surface-variant">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3. Live Tracking */}
        <Section title="Live Bus Tracking" icon="📍">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-blue-50">
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <span className="text-4xl">🗺️</span>
                <p className="mt-2 text-sm font-semibold text-on-background">
                  {liveTracking.currentLocation}
                </p>
                <p className="text-xs text-on-surface-variant">
                  Google Maps integration — coming soon
                </p>
              </div>
            </div>
            <div className="h-1.5 bg-slate-200">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${liveTracking.progress}%` }}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-xl font-bold text-indigo-600">{liveTracking.distanceAway}</p>
              <p className="text-[11px] text-on-surface-variant">Away from you</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-xl font-bold text-emerald-600">{liveTracking.etaMinutes} min</p>
              <p className="text-[11px] text-on-surface-variant">Expected arrival</p>
            </div>
          </div>
        </Section>

        {/* 2. Today's Schedule */}
        <Section title="Today's Bus Schedule" icon="🕐">
          <div className="space-y-3">
            {[todaySchedule.morning, todaySchedule.evening].map((slot) => (
              <div
                key={slot.label}
                className={`flex items-center justify-between rounded-xl px-4 py-4 ${
                  slot.status === "upcoming"
                    ? "border border-indigo-200 bg-indigo-50/50"
                    : "bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-xs font-bold uppercase text-on-surface-variant">
                    {slot.label}
                  </p>
                  <p className="text-lg font-bold text-on-background">{slot.time}</p>
                </div>
                {slot.status === "completed" ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Done
                  </span>
                ) : (
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                    Upcoming
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs text-on-surface-variant">Seat availability</p>
            <p className="text-lg font-bold text-on-background">
              {seatAvailability.remaining}{" "}
              <span className="text-sm font-normal text-on-surface-variant">
                / {seatAvailability.total} remaining
              </span>
            </p>
          </div>
        </Section>
      </div>

      {/* 4. Route Information */}
      <Section title="Route Stops" icon="🛣️">
        <div className="relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-indigo-200" />
          <div className="space-y-4 pl-10">
            {routeStops.map((stop) => (
              <div key={stop.id} className="relative">
                <span
                  className={`absolute -left-[1.85rem] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                    stop.active ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                />
                <div
                  className={`rounded-xl px-4 py-3 ${
                    stop.active ? "border border-indigo-200 bg-indigo-50" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-on-background">{stop.name}</p>
                    <p className="text-xs text-on-surface-variant">{stop.time}</p>
                  </div>
                  {stop.active && (
                    <p className="mt-1 text-[10px] font-bold uppercase text-indigo-600">
                      Bus currently here
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 6. Transport Notices — MVP */}
        <Section title="Transport Notices" icon="📢">
          <ul className="space-y-2">
            {transportNotices.map((n) => (
              <li
                key={n.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-on-background">{n.title}</p>
                <p className="text-[11px] text-on-surface-variant">{n.date}</p>
                <p className="mt-1 text-xs text-on-surface-variant">{n.summary}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 8. Missed Bus Assistant */}
        <Section title="Missed Bus Assistant" icon="🤖">
          <p className="mb-3 text-sm text-on-surface-variant">
            Missed your bus? AI finds the next best option.
          </p>
          <button
            type="button"
            onClick={() => askTransportAI("I missed my bus")}
            className="mb-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            I missed my bus
          </button>
          <div className="space-y-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
            <p className="text-xs font-bold text-indigo-700">Quick preview</p>
            <p className="text-sm">
              Next Bus: <strong>{missedBusAlternatives.nextBus.time}</strong>
            </p>
            <p className="text-sm">
              Distance: <strong>{missedBusAlternatives.distance}</strong> · ETA{" "}
              <strong>{missedBusAlternatives.etaMinutes} min</strong>
            </p>
          </div>
        </Section>
      </div>

      {/* 9. Emergency Contacts */}
      <Section title="Emergency Contacts" icon="☎️">
        <div className="grid gap-2 sm:grid-cols-3">
          {emergencyContacts.map((c) => (
            <a
              key={c.label}
              href={`tel:${c.phone}`}
              className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/40 px-4 py-3 hover:bg-red-50"
            >
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="text-sm font-semibold text-on-background">{c.label}</p>
                <p className="text-xs text-on-surface-variant">{c.phone}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* 10. AI Transport Assistant — MVP */}
      <Section title="AI Transport Assistant" icon="🤖">
        <p className="mb-3 text-xs text-on-surface-variant">
          Ask CampusFlow AI about your bus, route, or delays
        </p>
        <div className="flex flex-wrap gap-2">
          {AI_TRANSPORT_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => askTransportAI(q)}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {q}
            </button>
          ))}
        </div>
        {localAiReply && !onOpenAI && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm">
            <p className="font-semibold">{localAiReply.text}</p>
            {localAiReply.eta && <p className="mt-1 text-xs">{localAiReply.eta}</p>}
            {localAiReply.bullets?.map((b) => (
              <p key={b} className="mt-1 text-xs">
                • {b}
              </p>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
