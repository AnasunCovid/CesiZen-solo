import { useEffect, useState } from 'react';
import api from '../../services/api';

const EMPTY = { name: '', label: '', inhale_duration: 5, hold_duration: 0, exhale_duration: 5, description: '' };

export default function AdminBreathing() {
  const [exercises, setExercises] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');

  const load = () => {
    setLoading(true);
    api.get('/breathing')
      .then(r => setExercises(r.data.exercises))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing('new'); setMsg(''); };

  const openEdit = (ex) => {
    setForm({
      name:            ex.name,
      label:           ex.label,
      inhale_duration: ex.inhale_duration,
      hold_duration:   ex.hold_duration,
      exhale_duration: ex.exhale_duration,
      description:     ex.description || '',
    });
    setEditing(ex);
    setMsg('');
  };

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'number' ? parseInt(value) || 0 : value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      if (editing === 'new') {
        await api.post('/breathing', form);
        setMsg('Exercice créé ✓');
      } else {
        await api.put(`/breathing/${editing.id}`, form);
        setMsg('Exercice mis à jour ✓');
      }
      load();
      setEditing(null);
    } catch (err) {
      const errs = err.response?.data?.errors;
      setMsg(errs ? errs[0].msg : err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (ex) => {
    await api.put(`/breathing/${ex.id}`, { is_active: !ex.is_active });
    load();
  };

  const handleDelete = async (ex) => {
    if (!confirm(`Supprimer "${ex.name}" ?`)) return;
    await api.delete(`/breathing/${ex.id}`);
    load();
  };

  const totalDuration = ex => ex.inhale_duration + ex.hold_duration + ex.exhale_duration;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exercices de respiration</h1>
          <p className="text-muted text-sm">{exercises.length} exercice(s)</p>
        </div>
        <button onClick={openNew} className="btn-primary">+ Nouvel exercice</button>
      </div>

      {msg && (
        <div className="bg-sage-50 border border-sage-200 text-sage-700 text-sm rounded-xl px-4 py-2 mb-4">
          {msg}
        </div>
      )}

      {/* Formulaire */}
      {editing !== null && (
        <form onSubmit={handleSave} className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editing === 'new' ? 'Nouvel exercice' : `Modifier : ${editing.name}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input name="name" required className="input-field"
                value={form.name} onChange={handleChange} placeholder="Cohérence cardiaque 5-5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label affiché</label>
              <input name="label" required className="input-field"
                value={form.label} onChange={handleChange} placeholder="5-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspiration (s)</label>
              <input type="number" name="inhale_duration" min="1" max="60" required
                className="input-field" value={form.inhale_duration} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apnée (s)</label>
              <input type="number" name="hold_duration" min="0" max="60"
                className="input-field" value={form.hold_duration} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration (s)</label>
              <input type="number" name="exhale_duration" min="1" max="60" required
                className="input-field" value={form.exhale_duration} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <div className="bg-sage-50 rounded-xl px-3 py-2 text-sm text-sage-600">
              Durée d'un cycle : <strong>{form.inhale_duration + form.hold_duration + form.exhale_duration}s</strong>
              {' '}· Rythme : <strong>{Math.round(60 / (form.inhale_duration + form.hold_duration + form.exhale_duration) * 10) / 10}</strong> cycles/min
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={3} className="input-field"
              value={form.description} onChange={handleChange} />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12 text-muted">Chargement…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map(ex => (
            <div key={ex.id} className={`card ${!ex.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl font-bold text-sage-500">{ex.label}</span>
                <span className={ex.is_active ? 'badge-active' : 'badge-inactive'}>
                  {ex.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{ex.name}</h3>

              <div className="flex gap-2 text-xs text-muted mb-3">
                <span className="bg-blue-50 px-2 py-0.5 rounded-full">↑ {ex.inhale_duration}s</span>
                {ex.hold_duration > 0 && (
                  <span className="bg-sage-50 px-2 py-0.5 rounded-full">⏸ {ex.hold_duration}s</span>
                )}
                <span className="bg-purple-50 px-2 py-0.5 rounded-full">↓ {ex.exhale_duration}s</span>
              </div>

              <div className="text-xs text-muted mb-4">
                Cycle : {totalDuration(ex)}s · {(60 / totalDuration(ex)).toFixed(1)} cycles/min
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEdit(ex)}
                  className="text-xs text-sage-600 hover:underline">Modifier</button>
                <button onClick={() => toggleActive(ex)}
                  className={`text-xs hover:underline ${ex.is_active ? 'text-orange-500' : 'text-green-600'}`}>
                  {ex.is_active ? 'Désactiver' : 'Réactiver'}
                </button>
                <button onClick={() => handleDelete(ex)}
                  className="text-xs text-red-500 hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
