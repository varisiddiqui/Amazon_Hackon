import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import DashboardMenuDrawer from "../components/dashboard/DashboardMenuDrawer";
import AIAssistantPage from "../components/ai/AIAssistantPage";
import { loadNotifications } from "../data/notificationsData";
import * as api from "../services/api";
import { getToken } from "../lib/apiClient";

const StudentNavContext = createContext(null);

export function StudentNavProvider({ children }) {
  const { user, isSignedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStudent = isSignedIn && user?.role === "student";

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [homeAiOpen, setHomeAiOpen] = useState(false);
  const [homeAiPrompt, setHomeAiPrompt] = useState(null);
  const [notifications, setNotifications] = useState(loadNotifications);
  const sectionNavRef = useRef(null);

  const refreshNotifications = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await api.fetchNotifications();
      setNotifications(data.notifications);
    } catch {
      /* keep local fallback */
    }
  }, []);

  useEffect(() => {
    if (isStudent && getToken()) {
      refreshNotifications();
    }
  }, [isStudent, refreshNotifications]);

  const registerSectionNav = useCallback((fn) => {
    sectionNavRef.current = fn;
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (getToken()) {
      try {
        await api.markNotificationRead(id);
      } catch {
        /* optimistic update kept */
      }
    }
  }, []);

  const dismissNotification = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isDismissed: true } : n))
    );
    if (getToken()) {
      try {
        await api.dismissNotification(id);
      } catch {
        /* optimistic update kept */
      }
    }
  }, []);

  const addNotification = useCallback(async (notification) => {
    if (getToken()) {
      try {
        const created = await api.createNotification(notification);
        setNotifications((prev) => [created, ...prev]);
        return;
      } catch {
        /* fall through to local */
      }
    }
    setNotifications((prev) => [
      { id: Date.now(), ...notification, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((o) => !o);
  }, []);

  const openHomeAI = useCallback((prompt) => {
    setHomeAiPrompt(prompt || null);
    setHomeAiOpen(true);
    setActiveSection("ai");
  }, []);

  const closeHomeAI = useCallback(() => {
    setHomeAiOpen(false);
    setHomeAiPrompt(null);
    setActiveSection("home");
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setHomeAiOpen(false);
      setHomeAiPrompt(null);
    }
  }, [location.pathname]);

  const handleNavigate = useCallback(
    (id) => {
      if (id === "logout") {
        logout();
        navigate("/login");
        setMenuOpen(false);
        return;
      }

      if (id === "ai") {
        if (location.pathname === "/dashboard" && sectionNavRef.current) {
          sectionNavRef.current(id);
        } else if (location.pathname === "/") {
          openHomeAI();
        } else {
          navigate("/dashboard?section=ai");
        }
        setMenuOpen(false);
        return;
      }

      if (location.pathname === "/dashboard" && sectionNavRef.current) {
        sectionNavRef.current(id);
      } else if (id === "home") {
        navigate("/dashboard");
      } else {
        navigate(`/dashboard?section=${id}`);
      }
      setMenuOpen(false);
    },
    [location.pathname, logout, navigate, openHomeAI]
  );

  const viewAllNotifications = useCallback(() => {
    if (location.pathname === "/dashboard" && sectionNavRef.current) {
      sectionNavRef.current("notices");
    } else {
      navigate("/dashboard?section=notices");
    }
    setMenuOpen(false);
  }, [location.pathname, navigate]);

  const value = useMemo(
    () => ({
      isStudent,
      menuOpen,
      setMenuOpen,
      toggleMenu,
      activeSection,
      setActiveSection,
      homeAiOpen,
      openHomeAI,
      closeHomeAI,
      registerSectionNav,
      handleNavigate,
      notifications,
      markNotificationRead,
      dismissNotification,
      viewAllNotifications,
      refreshNotifications,
      addNotification,
    }),
    [
      isStudent,
      menuOpen,
      toggleMenu,
      activeSection,
      homeAiOpen,
      openHomeAI,
      closeHomeAI,
      registerSectionNav,
      handleNavigate,
      notifications,
      markNotificationRead,
      dismissNotification,
      viewAllNotifications,
      refreshNotifications,
      addNotification,
    ]
  );

  return (
    <StudentNavContext.Provider value={value}>
      {children}
      {isStudent && homeAiOpen && location.pathname === "/" && (
        <div className="fixed inset-0 z-[400] flex flex-col bg-white pt-[72px]">
          <AIAssistantPage
            user={user}
            initialPrompt={homeAiPrompt}
            onBack={closeHomeAI}
          />
        </div>
      )}
      {isStudent && (
        <DashboardMenuDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          active={homeAiOpen && location.pathname === "/" ? "ai" : activeSection}
          onNavigate={handleNavigate}
          onLogout={() => handleNavigate("logout")}
        />
      )}
    </StudentNavContext.Provider>
  );
}

export function useStudentNav() {
  return useContext(StudentNavContext);
}
