import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const EMPTY = { email: '', password: '', first_name: '', last_name: '', role: 'user' };

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/users')
      .then(r => setUsers(r.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async e => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/users', form);
      setMsg('Utilisateur créé ✓');
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur');
    } finally {
      setCreating(false);
    }
  };

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    await api.put(`/users/${u.id}`, { role: newRole });
    load();
  };

  const toggleActive = async (u) => {
    await api.put(`/users/${u.id}`, { is_active: !u.is_active });
    load();
  };

  const handleDelete = async (u) => {
    if (!confirm(`Supprimer définitivement ${u.first_name} ${u.last_name} ?`)) return;
    await api.delete(`/users/${u.id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-muted text-sm">{users.length} compte(s) au total</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Nouvel utilisateur'}
        </button>
      </div>

      {msg && (
        <div className="bg-sage-50 border border-sage-200 text-sage-700 text-sm rounded-xl px-4 py-2 mb-4">
          {msg}
        </div>
      )}

      {/* Formulaire création */}
      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Créer un compte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input className="input-field" required value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input className="input-field" required value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input-field" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" className="input-field" required value={form.password}
              placeholder="8 car. min, 1 majuscule, 1 chiffre"
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select className="input-field" value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <button type="submit" disabled={creating} className="btn-primary">
            {creating ? 'Création…' : 'Créer'}
          </button>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted">Chargement…</div>
      ) : (
        <div className="card overflow-hidden p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nom</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Rôle</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Statut</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className={!u.is_active ? 'opacity-50' : ''}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {u.first_name} {u.last_name}
                    {u.id === me?.id && (
                      <span className="ml-2 text-xs text-muted">(vous)</span>
                    )}
                    <div className="text-xs text-muted sm:hidden">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={u.role === 'admin' ? 'badge-admin' : 'badge-user'}>
                      {u.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={u.is_active ? 'badge-active' : 'badge-inactive'}>
                      {u.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== me?.id && u.email !== 'admin@cesizen.fr' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleRole(u)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {u.role === 'admin' ? 'Rétrograder' : 'Promouvoir'}
                        </button>
                        <button
                          onClick={() => toggleActive(u)}
                          className={`text-xs hover:underline ${u.is_active ? 'text-orange-500' : 'text-green-600'}`}
                        >
                          {u.is_active ? 'Désactiver' : 'Réactiver'}
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : u.email === 'admin@cesizen.fr' ? (
                      <div className="flex justify-end">
                        <span className="text-xs text-muted italic">Compte protégé</span>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
