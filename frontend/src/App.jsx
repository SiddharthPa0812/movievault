import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { api } from "./api/client";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import { animeCategories, movieCategories } from "./data/navigation";
import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import EntriesPage from "./pages/EntriesPage";
import LoginPage from "./pages/LoginPage";
import ManageEntryPage from "./pages/ManageEntryPage";
import NotFoundPage from "./pages/NotFoundPage";
import StatisticsPage from "./pages/StatisticsPage";

const routeMeta = {
  "/": {
    title: "Dashboard",
    subtitle: "Your cinematic mission control",
  },
  "/movies": {
    title: "All Movies",
    subtitle: "Every film in your archive",
  },
  "/anime": {
    title: "All Anime",
    subtitle: "Every series and season tracked",
  },
  "/watchlist": {
    title: "Watchlist",
    subtitle: "Titles waiting for their moment",
  },
  "/favorites": {
    title: "Favorites",
    subtitle: "Your personal hall of fame",
  },
  "/statistics": {
    title: "Statistics",
    subtitle: "Performance across your archive",
  },
};

function App() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  const [bootError, setBootError] = useState("");
  const [authUser, setAuthUser] = useState(() => {
    const saved = window.localStorage.getItem("movievault-user");
    const token = window.localStorage.getItem("movievault-token");
    return saved && token ? JSON.parse(saved) : null;
  });
  const [authChecking, setAuthChecking] = useState(() => Boolean(window.localStorage.getItem("movievault-token")));

  const persistSession = (user) => {
    const { token, ...profile } = user;
    if (token) {
      window.localStorage.setItem("movievault-token", token);
    }
    window.localStorage.setItem("movievault-user", JSON.stringify(profile));
    setAuthUser(profile);
  };

  const clearSession = () => {
    window.localStorage.removeItem("movievault-user");
    window.localStorage.removeItem("movievault-token");
    setAuthUser(null);
    setCategoryData(null);
  };

  const handleLogin = (user) => {
    persistSession(user);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout/");
    } catch {
      // no-op
    }
    clearSession();
  };

  useEffect(() => {
    const token = window.localStorage.getItem("movievault-token");
    if (!token) {
      setAuthChecking(false);
      return;
    }

    api
      .get("/auth/me/")
      .then(({ data }) => {
        window.localStorage.setItem("movievault-user", JSON.stringify(data.user));
        setAuthUser(data.user);
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  useEffect(() => {
    if (!authUser) return;

    const loadCategories = () => {
      setBootError("");
      api
        .get("/entries/categories/")
        .then(({ data }) => setCategoryData(data))
        .catch(() => {
          setBootError("MovieVault can't reach the API. Check that the backend is running and VITE_API_BASE_URL is configured.");
        });
    };

    loadCategories();
    window.addEventListener("entries:changed", loadCategories);
    return () => window.removeEventListener("entries:changed", loadCategories);
  }, [authUser]);

  const meta = useMemo(
    () =>
      routeMeta[location.pathname] || {
        title: location.pathname.includes("entries")
          ? location.search.includes("type=Anime")
            ? "Add New Anime"
            : "Add New Movie"
          : "Categories",
        subtitle: "Build your archive with style",
      },
    [location.pathname, location.search],
  );

  useEffect(() => {
    document.title = `${meta.title} | MovieVault`;
  }, [meta]);

  if (authChecking) return <LoadingSpinner label="Restoring your session..." />;

  if (!authUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (bootError) {
    return (
      <div className="boot-shell">
        <div className="glass-card boot-card">
          <h2>Backend not connected</h2>
          <p>{bootError}</p>
          <p className="boot-hint">Start Django in a separate terminal, then refresh this page.</p>
        </div>
      </div>
    );
  }

  if (!categoryData) return <LoadingSpinner label="Preparing MovieVault..." />;

  return (
    <Layout title={meta.title} subtitle={meta.subtitle} query={query} onQueryChange={setQuery} user={authUser} onLogout={handleLogout}>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route
          path="/"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <DashboardPage query={query} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <EntriesPage title="Movies" type="Movie" query={query} categories={movieCategories} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/anime"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <EntriesPage title="Anime" type="Anime" query={query} categories={animeCategories} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <EntriesPage title="Watchlist" type="" query={query} categories={[...movieCategories, ...animeCategories]} extraFilters={{ in_watchlist: true }} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <EntriesPage title="Favorites" type="" query={query} categories={[...movieCategories, ...animeCategories]} extraFilters={{ is_favorite: true }} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies/categories"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <CategoriesPage title="Movie Categories" items={categoryData.movie_categories} variant="movie" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/anime/categories"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <CategoriesPage title="Anime Tiers" items={categoryData.anime_categories} variant="anime" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entries/new"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <ManageEntryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entries/:entryId/edit"
          element={
            <ProtectedRoute authenticated={Boolean(authUser)}>
              <ManageEntryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
