import Header from "../components/Header";

export default function FacultyDashboard() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto max-w-4xl py-12">
          <h1 className="text-3xl font-bold text-on-background">
            Faculty Dashboard
          </h1>
          <p className="mt-2 text-on-surface-variant">
            Manage classes, attendance, and student notices from one place.
          </p>
          <div className="glass-card mt-8 rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-primary">
              school
            </span>
            <p className="mt-4 text-on-surface-variant">
              Faculty tools coming soon — timetable, grading, and announcements.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
