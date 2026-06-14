import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StatCard = ({ label, value, to, color }) => (
  <Link to={to} className="card flex items-center gap-4 hover:border-sage-200">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl`}>
      {value}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  </Link>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: '–', pages: '–', exercises: '–' });

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/pages'),
      api.get('/breathing'),
    ]).then(([u, p, b]) => {
      setStats({
        users:     u.data.users.length,
        pages:     p.data.pages.length,
        exercises: b.data.exercises.length,
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-muted">Bonjour, {user?.first_name}. Gérez la plateforme CESIZen.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <Link to="/admin/utilisateurs" className="card hover:border-sage-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">👥</div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.users}</div>
            <div className="text-sm text-muted">Utilisateurs</div>
          </div>
        </Link>

        <Link to="/admin/pages" className="card hover:border-sage-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-xl">📝</div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.pages}</div>
            <div className="text-sm text-muted">Pages d'information</div>
          </div>
        </Link>

        <Link to="/admin/respiration" className="card hover:border-sage-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">🌬️</div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.exercises}</div>
            <div className="text-sm text-muted">Exercices de respiration</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { to: '/admin/utilisateurs', label: 'Gérer les utilisateurs', icon: '👥', desc: 'Créer, modifier, désactiver des comptes' },
          { to: '/admin/pages',        label: 'Gérer les pages',        icon: '📝', desc: 'Créer et modifier les contenus informatifs' },
          { to: '/admin/respiration',  label: 'Gérer les exercices',    icon: '🌬️', desc: 'Configurer les exercices de cohérence cardiaque' },
          { to: '/',                   label: 'Voir le site',           icon: '🌐', desc: 'Prévisualiser le site public' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="card flex items-center gap-4 hover:border-sage-200">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <div className="font-semibold text-gray-800">{item.label}</div>
              <div className="text-sm text-muted">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
