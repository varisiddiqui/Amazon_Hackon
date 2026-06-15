import { useEffect, useState } from "react";
import Header from "../components/Header";
import { fetchUsersByRole } from "../services/api";
import { getToken } from "../lib/apiClient";

const ROLE_LABELS = {
  student: { label: "Students", color: "bg-indigo-100 text-indigo-700" },
  faculty: { label: "Faculty", color: "bg-emerald-100 text-emerald-700" },
  admin: { label: "Admins", color: "bg-purple-100 text-purple-700" },
};

export default function AdminDashboard() {
  const [activeRole, setActiveRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchUsersByRole(activeRole === "all" ? undefined : activeRole)
      .then((data) => {
        setUsers(data.users || []);
        setStats(data.stats || []);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeRole]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-margin-mobile pb-16 pt-24 md:px-margin-desktop">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-on-background">Club Admin Dashboard</h1>
          <p className="mt-2 text-on-surface-variant">
            Manage users stored in MongoDB — filtered by role.
          </p>

          {/* Role stats */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.role}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  {ROLE_LABELS[s.role]?.label || s.role}
                </p>
                <p className="mt-1 text-2xl font-bold text-on-background">{s.count}</p>
              </div>
            ))}
          </div>

          {/* Role filter tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["all", "student", "faculty", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  activeRole === role
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-on-surface-variant hover:bg-slate-200"
                }`}
              >
                {role === "all" ? "All Users" : role}
              </button>
            ))}
          </div>

          {/* Users table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <p className="p-8 text-center text-sm text-on-surface-variant">Loading users...</p>
            ) : error ? (
              <p className="p-8 text-center text-sm text-red-600">{error}</p>
            ) : users.length === 0 ? (
              <p className="p-8 text-center text-sm text-on-surface-variant">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-4 py-3 font-medium text-on-background">{u.fullName}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${ROLE_LABELS[u.role]?.color || "bg-slate-100 text-slate-600"}`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">{u.department}</td>
                        <td className="px-4 py-3 capitalize text-on-surface-variant">{u.authProvider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
