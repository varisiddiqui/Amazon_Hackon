import { apiGet, apiPost, apiPut, apiPatch } from "../lib/apiClient.js";

// ── Auth ──────────────────────────────────────────────────────────────────────

function authError(message) {
  return new Error(message);
}

function assertAuthResponse(res, label = "Auth") {
  if (!res?.user || !res?.token) {
    throw authError(
      `${label} failed — wrong backend responded. Restart CampusFlow backend: cd backend && npm run dev (port 5002)`
    );
  }
  return res;
}

export async function login(credentials) {
  const res = assertAuthResponse(await apiPost("/auth/login", credentials), "Login");
  return { user: res.user, token: res.token };
}

export async function register(data) {
  const res = assertAuthResponse(await apiPost("/auth/register", data), "Signup");
  return { user: res.user, token: res.token };
}

export async function loginGuest() {
  const res = assertAuthResponse(await apiPost("/auth/guest"), "Guest login");
  return { user: res.user, token: res.token };
}

export async function loginGoogle() {
  const res = assertAuthResponse(await apiPost("/auth/google"), "Google login");
  return { user: res.user, token: res.token };
}

export async function loginFirebase(payload) {
  const res = assertAuthResponse(await apiPost("/auth/firebase", payload), "Firebase login");
  return { user: res.user, token: res.token };
}

export async function getMe() {
  const res = await apiGet("/auth/me");
  return res.user;
}

export async function updateProfile(patch) {
  const res = await apiPatch("/auth/me", patch);
  return res.user;
}

export async function fetchUsersByRole(role) {
  const qs = role ? `?role=${encodeURIComponent(role)}` : "";
  const res = await apiGet(`/auth/users${qs}`);
  return res;
}

// ── Dashboard ───────────────────────────────────────────────────────────────

export async function getDashboardBrief() {
  const res = await apiGet("/dashboard/brief");
  return res.data;
}

export async function getActivitySection(type) {
  const res = await apiGet(`/dashboard/activities/${type}`);
  return res.data;
}

// ── Notifications ───────────────────────────────────────────────────────────

export async function fetchNotifications(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/notifications${qs ? `?${qs}` : ""}`);
  return res.data;
}

export async function markNotificationRead(id) {
  const res = await apiPatch(`/notifications/${id}/read`);
  return res.data;
}

export async function dismissNotification(id) {
  const res = await apiPatch(`/notifications/${id}/dismiss`);
  return res.data;
}

export async function createNotification(notification) {
  const res = await apiPost("/notifications", notification);
  return res.data;
}

// ── Events ──────────────────────────────────────────────────────────────────

export async function fetchEvents(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/events${qs ? `?${qs}` : ""}`);
  return res.data;
}

export async function fetchEventRegistrations() {
  const res = await apiGet("/events/registrations");
  return res.data;
}

export async function registerForEvent(eventId) {
  const res = await apiPost(`/events/${eventId}/register`);
  return res.data;
}

// ── Timetable ─────────────────────────────────────────────────────────────────

export async function fetchTimetable() {
  const res = await apiGet("/timetable");
  return res.data;
}

export async function addPersonalEvent(data) {
  const res = await apiPost("/timetable/personal-events", data);
  return res.data;
}

// ── Hostel ────────────────────────────────────────────────────────────────────

export async function fetchHostel() {
  const res = await apiGet("/hostel");
  return res.data;
}

export async function submitComplaint(data) {
  const res = await apiPost("/hostel/complaints", data);
  return res.data;
}

export async function submitLeaveRequest(data) {
  const res = await apiPost("/hostel/leave-requests", data);
  return res.data;
}

// ── Transport & Placement ─────────────────────────────────────────────────────

export async function fetchTransport() {
  const res = await apiGet("/transport");
  return res.data;
}

export async function fetchPlacement() {
  const res = await apiGet("/placement");
  return res.data;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function fetchSettings() {
  const res = await apiGet("/settings");
  return res.data;
}

export async function saveSettings(settings) {
  const res = await apiPut("/settings", settings);
  return res.data;
}

// ── AI ────────────────────────────────────────────────────────────────────────

export async function aiChat(question) {
  const res = await apiPost("/ai/chat", { question });
  return res.data;
}

export async function getAiStatus() {
  const res = await apiGet("/ai/status");
  return res.ai;
}

export async function aiNoticeSummary(payload) {
  const res = await apiPost("/ai/tools/notice-summary", payload);
  return res.data;
}

export async function aiAnalyzeResume() {
  const res = await apiPost("/ai/tools/resume");
  return res.data;
}

export async function aiStudyPlan(days) {
  const res = await apiPost("/ai/tools/study-plan", { days });
  return res.data;
}

export async function aiAttendanceAdvice(action) {
  const res = await apiPost("/ai/tools/attendance-advice", { action });
  return res.data;
}

export async function aiPlacementRoadmap(company) {
  const res = await apiGet(`/ai/tools/placement-roadmap?company=${encodeURIComponent(company)}`);
  return res.data;
}

export async function aiEventRecommendations() {
  const res = await apiGet("/ai/tools/event-recommendations");
  return res.data;
}

export async function aiSmartReminders() {
  const res = await apiGet("/ai/tools/reminders");
  return res.data;
}

// ── AWS (S3 + SES) ────────────────────────────────────────────────────────────

export async function getAwsStatus() {
  const res = await apiGet("/aws/status");
  return res.aws;
}

export async function uploadFile(file, category = "document") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const token = (await import("../lib/apiClient.js")).getToken();
  const response = await fetch("/api/aws/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Upload failed");
  return body.data;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = (await import("../lib/apiClient.js")).getToken();
  const response = await fetch("/api/aws/upload/resume", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Resume upload failed");
  return body.data;
}

export async function getPresignedUrl(fileName, mimeType, category = "document") {
  const res = await apiPost("/aws/presign", { fileName, mimeType, category });
  return res.data;
}

export async function listMyFiles(category) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await apiGet(`/aws/files${qs}`);
  return res.data;
}

export async function deleteFile(id) {
  const res = await fetch(`/api/aws/files/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${(await import("../lib/apiClient.js")).getToken()}`,
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Delete failed");
  return body;
}
