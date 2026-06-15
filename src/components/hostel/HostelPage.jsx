import { useState, useEffect } from "react";
import {
  hostelOverview,
  messMenu,
  complaintCategories,
  defaultComplaints,
  hostelNotices,
  laundry,
  visitorPasses,
  leaveRequests,
  roommates,
  emergencyContacts,
  STATUS_STYLES,
  summarizeHostelNotices,
  getHostelAIAnswer,
} from "../../data/hostelData";
import * as api from "../../services/api";
import { getToken } from "../../lib/apiClient";

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

function StatusBadge({ status }) {
  const label = status.replace("_", " ");
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}
    >
      {label}
    </span>
  );
}

export default function HostelPage({ onOpenAI }) {
  const [complaints, setComplaints] = useState(defaultComplaints);
  const [leaves, setLeaves] = useState(leaveRequests);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ title: "", category: "Internet" });
  const [newLeave, setNewLeave] = useState({ from: "", to: "", reason: "" });
  const [noticeSummary, setNoticeSummary] = useState(null);
  const [aiReply, setAiReply] = useState(null);

  useEffect(() => {
    if (!getToken()) return;
    api.fetchHostel().then((data) => {
      setComplaints(data.complaints);
      setLeaves(data.leaveRequests);
    }).catch(() => {});
  }, []);

  async function submitComplaint(e) {
    e.preventDefault();
    if (!newComplaint.title.trim()) return;

    if (getToken()) {
      try {
        const created = await api.submitComplaint(newComplaint);
        setComplaints((prev) => [created, ...prev]);
        setNewComplaint({ title: "", category: "Internet" });
        setShowComplaintForm(false);
        return;
      } catch {
        /* fallback */
      }
    }

    setComplaints((prev) => [
      {
        id: Date.now(),
        title: newComplaint.title,
        category: newComplaint.category,
        status: "pending",
        date: "Just now",
      },
      ...prev,
    ]);
    setNewComplaint({ title: "", category: "Internet" });
    setShowComplaintForm(false);
  }

  async function submitLeave(e) {
    e.preventDefault();
    if (!newLeave.from || !newLeave.to || !newLeave.reason.trim()) return;

    if (getToken()) {
      try {
        const created = await api.submitLeaveRequest(newLeave);
        setLeaves((prev) => [created, ...prev]);
        setNewLeave({ from: "", to: "", reason: "" });
        setShowLeaveForm(false);
        return;
      } catch {
        /* fallback */
      }
    }

    setLeaves((prev) => [
      {
        id: Date.now(),
        from: newLeave.from,
        to: newLeave.to,
        reason: newLeave.reason,
        status: "pending",
      },
      ...prev,
    ]);
    setNewLeave({ from: "", to: "", reason: "" });
    setShowLeaveForm(false);
  }

  function askHostelAI(q) {
    setAiReply(getHostelAIAnswer(q));
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* 1. Overview */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-on-background">🏠 Hostel Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Room No", value: hostelOverview.roomNo },
            { label: "Block", value: hostelOverview.block },
            { label: "Floor", value: hostelOverview.floor },
            { label: "Warden", value: hostelOverview.warden },
            { label: "Roommates", value: hostelOverview.roommates },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/80 p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-indigo-600">{item.value}</p>
              <p className="text-[11px] text-on-surface-variant">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. Mess Menu — MVP */}
        <Section title="Today's Menu" icon="🍽️">
          <div className="space-y-3">
            {[
              { meal: "Breakfast", item: messMenu.breakfast, time: messMenu.timings.breakfast },
              { meal: "Lunch", item: messMenu.lunch, time: messMenu.timings.lunch },
              { meal: "Dinner", item: messMenu.dinner, time: messMenu.timings.dinner },
            ].map((m) => (
              <div key={m.meal} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-xs font-bold uppercase text-on-surface-variant">{m.meal}</p>
                  <p className="text-sm font-semibold text-on-background">{m.item}</p>
                </div>
                <span className="text-[11px] text-on-surface-variant">{m.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-bold text-amber-700">🤖 AI Suggestion — Mess Special Today</p>
            <p className="mt-1 text-sm font-semibold text-amber-900">{messMenu.special}</p>
          </div>
        </Section>

        {/* 4. Hostel Notices — MVP */}
        <Section title="Hostel Notices" icon="📢">
          <ul className="space-y-2">
            {hostelNotices.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-on-background">{n.title}</p>
                  <p className="text-xs text-on-surface-variant">{n.date}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setNoticeSummary(summarizeHostelNotices())}
            className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Summarize Notices
          </button>
          {noticeSummary && (
            <ul className="mt-3 space-y-1 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
              {noticeSummary.map((b) => (
                <li key={b} className="text-xs text-on-background">
                  • {b}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3. Complaint System — MVP */}
        <Section title="Complaint System" icon="🔧">
          <button
            type="button"
            onClick={() => setShowComplaintForm((s) => !s)}
            className="mb-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Raise Complaint
          </button>
          {showComplaintForm && (
            <form onSubmit={submitComplaint} className="mb-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <select
                value={newComplaint.category}
                onChange={(e) => setNewComplaint((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {complaintCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                value={newComplaint.title}
                onChange={(e) => setNewComplaint((p) => ({ ...p, title: e.target.value }))}
                placeholder="Describe issue e.g. WiFi not working"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
              />
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          <div className="space-y-2">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-on-background">{c.title}</p>
                  <p className="text-xs text-on-surface-variant">
                    {c.category} · {c.date}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </Section>

        {/* 7. Leave Application — MVP */}
        <Section title="Leave Request" icon="📝">
          <button
            type="button"
            onClick={() => setShowLeaveForm((s) => !s)}
            className="mb-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + New Leave Request
          </button>
          {showLeaveForm && (
            <form onSubmit={submitLeave} className="mb-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newLeave.from}
                  onChange={(e) => setNewLeave((p) => ({ ...p, from: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
                <input
                  type="date"
                  value={newLeave.to}
                  onChange={(e) => setNewLeave((p) => ({ ...p, to: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <input
                value={newLeave.reason}
                onChange={(e) => setNewLeave((p) => ({ ...p, reason: e.target.value }))}
                placeholder="Reason for leave"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          <div className="space-y-2">
            {leaves.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-on-background">
                    {l.from} → {l.to}
                  </p>
                  <p className="text-xs text-on-surface-variant">{l.reason}</p>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Extra sections row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Section title="Laundry" icon="🧺">
          <p className="text-2xl font-bold text-indigo-600">{laundry.collected}</p>
          <p className="text-xs text-on-surface-variant">Clothes collected</p>
          <p className="mt-2 text-sm font-medium text-on-background">
            Delivery: {laundry.expectedDelivery}
          </p>
        </Section>

        <Section title="Visitor Pass" icon="👥">
          {visitorPasses.slice(0, 2).map((v) => (
            <div key={v.id} className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-xs">
              <p className="font-semibold">{v.name}</p>
              <p className="text-on-surface-variant">
                {v.date} · {v.time}
              </p>
              <StatusBadge status={v.status} />
            </div>
          ))}
          <button type="button" className="mt-1 text-xs font-semibold text-indigo-600 hover:underline">
            Request Pass
          </button>
        </Section>

        <Section title="Roommates" icon="👨‍🎓">
          {roommates.map((r) => (
            <div key={r.id} className="mb-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-[10px] text-on-surface-variant">{r.course}</p>
              </div>
              <a href={`tel:${r.phone}`} className="text-xs font-semibold text-indigo-600">
                Contact
              </a>
            </div>
          ))}
        </Section>

        <Section title="Emergency" icon="☎️">
          {emergencyContacts.map((c) => (
            <a
              key={c.label}
              href={`tel:${c.phone}`}
              className="mb-2 flex items-center gap-2 rounded-lg bg-red-50/50 px-3 py-2 text-xs hover:bg-red-50"
            >
              <span>{c.icon}</span>
              <span className="font-semibold">{c.label}</span>
              <span className="ml-auto text-on-surface-variant">{c.phone}</span>
            </a>
          ))}
        </Section>
      </div>

      {/* 10. AI Hostel Assistant */}
      <Section title="AI Hostel Assistant" icon="🤖">
        <div className="flex flex-wrap gap-2">
          {[
            "What's today's mess menu?",
            "When is laundry delivery?",
            "Any hostel notices?",
            "How many complaints are pending?",
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => (onOpenAI ? onOpenAI(q) : askHostelAI(q))}
              className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              {q}
            </button>
          ))}
        </div>
        {!onOpenAI && aiReply && (
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
            <p className="text-sm font-semibold text-on-background">{aiReply.text}</p>
            {aiReply.bullets?.map((b) => (
              <p key={b} className="mt-1 text-xs text-on-surface-variant">
                • {b}
              </p>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
