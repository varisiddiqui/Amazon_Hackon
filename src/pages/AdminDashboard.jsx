import Header from "../components/Header";

export default function AdminDashboard() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto max-w-4xl py-12">
          <h1 className="text-3xl font-bold text-on-background">
            Club Admin Dashboard
          </h1>
          <p className="mt-2 text-on-surface-variant">
            Create events, manage registrations, and publish campus updates.
          </p>
          <div className="glass-card mt-8 rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-secondary">
              admin_panel_settings
            </span>
            <p className="mt-4 text-on-surface-variant">
              Admin panel coming soon — events, clubs, and campus-wide notices.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
