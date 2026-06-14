import { useState } from "react";
import {
  readiness,
  resumeAnalysis,
  companies,
  interviewQuestions,
  codingProgress,
  aptitudeSections,
  getCompanyRoadmap,
  jobOpportunities,
  placementCalendar,
  skillGap,
  mockInterviewFeedback,
  AI_CAREER_QUESTIONS,
  analyzeResumeUpload,
} from "../../data/placementData";

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

function ProgressBar({ label, percent, color = "indigo" }) {
  const barColor =
    color === "purple" ? "bg-purple-500" : color === "emerald" ? "bg-emerald-500" : "bg-indigo-500";
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium text-on-background">{label}</span>
        <span className="text-on-surface-variant">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function PlacementHubPage({ onOpenAI }) {
  const [selectedCompany, setSelectedCompany] = useState("Amazon");
  const [resumeResult, setResumeResult] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [mockStep, setMockStep] = useState(0);
  const [mockDone, setMockDone] = useState(false);

  async function handleResumeUpload() {
    setResumeLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResumeResult(analyzeResumeUpload());
    setResumeLoading(false);
  }

  function generateRoadmap() {
    setRoadmap(getCompanyRoadmap(selectedCompany));
  }

  function startMockInterview() {
    setMockStep(0);
    setMockDone(false);
  }

  function nextMockStep() {
    if (mockStep < 1) setMockStep((s) => s + 1);
    else setMockDone(true);
  }

  const result = resumeResult || resumeAnalysis;

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Readiness Hero */}
      <section className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-indigo-50 to-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${readiness.score * 2.64} 264`}
              />
            </svg>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{readiness.score}%</p>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant">Ready</p>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold text-on-background">🏆 Placement Hub</h1>
            <p className="mt-1 text-sm font-medium text-emerald-600">{readiness.label}</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              AI Career Copilot — resume, interviews, roadmaps & more
            </p>
            {readiness.nextInterview && (
              <p className="mt-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                {readiness.nextInterview.company} interview in {readiness.nextInterview.daysLeft} days
              </p>
            )}
          </div>
        </div>

        {/* Section 1: Overview */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Applications", value: readiness.applications },
            { label: "Interviews", value: readiness.interviewsScheduled },
            { label: "Offers", value: readiness.offersReceived },
            { label: "Resume Score", value: `${readiness.resumeScore}%` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/80 p-3 text-center shadow-sm">
              <p className="text-xl font-bold text-indigo-600">{s.value}</p>
              <p className="text-[11px] text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 2: Resume Analyzer — MVP */}
        <Section title="Resume Analyzer" icon="📄">
          <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 px-6 py-8 hover:border-purple-400">
            <span className="text-3xl">📎</span>
            <span className="mt-2 text-sm font-semibold text-purple-700">Upload Resume.pdf</span>
            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
          </label>
          {resumeLoading && (
            <p className="mt-3 text-center text-sm text-indigo-600">Analyzing resume...</p>
          )}
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
            <p className="text-center text-3xl font-bold text-indigo-600">{result.score}/100</p>
            <p className="text-center text-xs text-on-surface-variant">Resume Score</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold text-emerald-600">Strengths</p>
                {result.strengths.map((s) => (
                  <p key={s} className="text-sm text-emerald-800">
                    ✓ {s}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-amber-600">Improvements</p>
                {result.improvements.map((s) => (
                  <p key={s} className="text-sm text-amber-800">
                    → {s}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenAI?.("Review my resume")}
            className="mt-3 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Improve Resume with AI
          </button>
        </Section>

        {/* Section 3: AI Interview Prep — MVP */}
        <Section title="AI Interview Prep" icon="💼">
          <p className="mb-3 text-xs text-on-surface-variant">Select company for top questions</p>
          <div className="flex flex-wrap gap-2">
            {companies.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCompany(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  selectedCompany === c
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {(interviewQuestions[selectedCompany] || []).map((q, i) => (
              <li
                key={i}
                className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-on-background"
              >
                {i + 1}. {q}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Section 4: Coding Progress */}
      <Section title="Coding Progress (DSA)" icon="💻">
        <div className="grid gap-4 sm:grid-cols-2">
          {codingProgress.map((item) => (
            <ProgressBar key={item.topic} label={item.topic} percent={item.percent} />
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 5: Aptitude */}
        <Section title="Aptitude Practice" icon="📝">
          <div className="grid grid-cols-2 gap-2">
            {aptitudeSections.map((s) => (
              <button
                key={s.name}
                type="button"
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-left hover:border-indigo-200"
              >
                <span className="text-lg">{s.icon}</span>
                <p className="mt-1 text-sm font-semibold">{s.name}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            Quick Test — 10 Questions · 15 Minutes
          </button>
        </Section>

        {/* Section 6: Company Roadmaps — MVP */}
        <Section title="Company Roadmaps" icon="🗺️">
          <div className="mb-3 flex flex-wrap gap-2">
            {["Amazon", "Google"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setSelectedCompany(c);
                  setRoadmap(getCompanyRoadmap(c));
                }}
                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                {c} SDE
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              generateRoadmap();
              onOpenAI?.(`Prepare me for ${selectedCompany} SDE`);
            }}
            className="mb-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white"
          >
            Generate {selectedCompany} Roadmap
          </button>
          {(roadmap || getCompanyRoadmap(selectedCompany)).map((r) => (
            <div key={r.week} className="mb-2 rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3">
              <p className="text-xs font-bold text-purple-600">{r.week}</p>
              <p className="text-sm font-semibold">{r.topic}</p>
              <p className="text-xs text-on-surface-variant">{r.detail}</p>
            </div>
          ))}
        </Section>
      </div>

      {/* Section 7: Job Opportunities */}
      <Section title="Open Opportunities" icon="🎯">
        <div className="grid gap-3 sm:grid-cols-2">
          {jobOpportunities.map((job) => (
            <div
              key={job.company + job.role}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
            >
              <div>
                <p className="font-bold text-on-background">{job.company}</p>
                <p className="text-sm text-on-surface-variant">{job.role}</p>
                <p className="text-xs text-red-500">Deadline: {job.deadline}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 8: Mock Interview */}
        <Section title="Mock Interview" icon="🎤">
          {!mockStep && !mockDone ? (
            <button
              type="button"
              onClick={startMockInterview}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white hover:opacity-90"
            >
              Start Mock Interview
            </button>
          ) : mockDone ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="text-sm font-bold text-on-background">AI Feedback</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {mockInterviewFeedback.confidence}/10
                  </p>
                  <p className="text-xs">Confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {mockInterviewFeedback.communication}/10
                  </p>
                  <p className="text-xs">Communication</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-amber-800">
                Improve: {mockInterviewFeedback.improve}
              </p>
              <button
                type="button"
                onClick={startMockInterview}
                className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-900">
                Q{mockStep + 1}:{" "}
                {mockStep === 0
                  ? "Introduce yourself."
                  : "Why do you want to join Amazon?"}
              </p>
              <textarea
                rows={3}
                placeholder="Type your answer..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
              />
              <button
                type="button"
                onClick={nextMockStep}
                className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white"
              >
                {mockStep < 1 ? "Next Question" : "Get AI Feedback"}
              </button>
            </div>
          )}
        </Section>

        {/* Section 9: Skill Gap */}
        <Section title="Skill Gap Analysis" icon="📊">
          <p className="text-sm">
            Target: <strong className="text-indigo-600">{skillGap.target}</strong>
          </p>
          <p className="mt-3 text-xs font-bold uppercase text-on-surface-variant">
            Missing Skills
          </p>
          <ul className="mt-2 space-y-2">
            {skillGap.missing.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                <span>⚠️</span> {s}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Section 10: Placement Calendar — MVP */}
      <Section title="Upcoming Placement Drives" icon="📅">
        <div className="grid gap-3 sm:grid-cols-3">
          {placementCalendar.map((ev) => (
            <div
              key={ev.company}
              className="rounded-xl border border-indigo-100 bg-indigo-50/30 px-4 py-4 text-center"
            >
              <p className="text-lg font-bold text-on-background">{ev.company}</p>
              <p className="text-sm text-indigo-600">{ev.date}</p>
              <p className="text-xs text-on-surface-variant">{ev.type}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 11: AI Career Assistant */}
      <Section title="AI Career Assistant" icon="🤖">
        <p className="mb-3 text-xs text-on-surface-variant">
          Your AI copilot for placement prep — powered by CampusGPT
        </p>
        <div className="flex flex-wrap gap-2">
          {AI_CAREER_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onOpenAI?.(q)}
              className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100"
            >
              {q}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
