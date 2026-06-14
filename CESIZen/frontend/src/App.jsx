import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Profile        from './pages/Profile';
import InfoList       from './pages/info/InfoList';
import InfoPage       from './pages/info/InfoPage';
import BreathingList  from './pages/breathing/BreathingList';
import BreathingExercise from './pages/breathing/BreathingExercise';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminPages     from './pages/admin/AdminPages';
import AdminBreathing from './pages/admin/AdminBreathing';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-sage-300" />
          <p className="text-muted text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"                    element={<Home />} />
          <Route path="/connexion"           element={<Login />} />
          <Route path="/inscription"         element={<Register />} />
          <Route path="/informations"        element={<InfoList />} />
          <Route path="/informations/:slug"  element={<InfoPage />} />
          <Route path="/respiration"         element={<BreathingList />} />
          <Route path="/respiration/:id"     element={<BreathingExercise />} />

          {/* Protégé – utilisateur connecté */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profil" element={<Profile />} />
          </Route>

          {/* Protégé – admin */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/utilisateurs" element={<AdminUsers />} />
            <Route path="/admin/pages"        element={<AdminPages />} />
            <Route path="/admin/respiration"  element={<AdminBreathing />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
