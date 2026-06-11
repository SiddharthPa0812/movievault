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
import { decodeJwt, loadGoogleScript } from "./utils/googleAuth";

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
    return saved ? JSON.parse(saved) : null;
  });
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  const handleGoogleCredential = ({ credential }) => {
    const profile = decodeJwt(credential);
    if (!profile) return;

    const user = {
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
    };

    window.localStorage.setItem("movievault-user", JSON.stringify(user));
    setAuthUser(user);
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("movievault-user");
    setAuthUser(null);

    try {
      const google = await loadGoogleScript();
      google?.accounts?.id?.disableAutoSelect();
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    if (!authUser) return;

    const loadCategories = () => {
      setBootError("");
      api
        .get("/entries/categories/")
        .then(({ data }) => setCategoryData(data))
        .catch(() => {
          setBootError("MovieVault can't reach the Django API. Make sure the backend server is still running on http://127.0.0.1:8000.");
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

  if (!authUser) {
    return <LoginPage onCredential={handleGoogleCredential} googleClientId={googleClientId} />;
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
