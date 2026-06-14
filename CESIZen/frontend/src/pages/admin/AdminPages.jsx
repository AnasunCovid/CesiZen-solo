import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const EMPTY = { title: '', slug: '', excerpt: '', content: '', is_published: true };

const slugify = str =>
  str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function AdminPages() {
  const [pages,   setPages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | page object
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  const load = () => {
    setLoading(true);
    api.get('/pages')
      .then(r => setPages(r.data.pages))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(EMPTY);
    setEditing('new');
    setMsg('');
  };

  const openEdit = async (page) => {
    const { data } = await api.get(`/pages/${page.id}`);
    setForm({
      title:        data.page.title,
      slug:         data.page.slug,
      excerpt:      data.page.excerpt || '',
      content:      data.page.content || '',
      is_published: !!data.page.is_published,
    });
    setEditing(page);
    setMsg('');
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title' && editing === 'new') {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      if (editing === 'new') {
        await api.post('/pages', form);
        setMsg('Page créée ✓');
      } else {
        await api.put(`/pages/${editing.id}`, form);
        setMsg('Page mise à jour ✓');
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

  const handleDelete = async (page) => {
    if (!confirm(`Supprimer la page "${page.title}" ?`)) return;
    await api.delete(`/pages/${page.id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages d'information</h1>
          <p className="text-muted text-sm">{pages.length} page(s)</p>
        </div>
        <button onClick={openNew} className="btn-primary">+ Nouvelle page</button>
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
            {editing === 'new' ? 'Nouvelle page' : `Modifier : ${editing.title}`}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input name="title" required className="input-field"
                value={form.title} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <input name="slug" required className="input-field font-mono text-sm"
                value={form.slug} onChange={handleChange} placeholder="ex: sante-mentale" />
              <p className="text-xs text-muted mt-1">
                Sera accessible à : /informations/{form.slug || '…'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
              <input name="excerpt" className="input-field"
                value={form.excerpt} onChange={handleChange}
                placeholder="Courte description (optionnel)" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu (HTML)
              </label>
              <textarea name="content" rows={10} className="input-field font-mono text-sm"
                value={form.content} onChange={handleChange} />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_published" className="w-4 h-4 accent-sage-400"
                checked={form.is_published} onChange={handleChange} />
              <span className="text-sm text-gray-700">Publier cette page</span>
            </label>
          </div>

          <div className="flex gap-3 mt-5">
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
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-4 py-3 text-muted font-mono text-xs hidden sm:table-cell">
                    {p.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.is_published ? 'badge-active' : 'badge-inactive'}>
                      {p.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link to={`/informations/${p.slug}`} target="_blank"
                        className="text-xs text-blue-500 hover:underline">Voir</Link>
                      <button onClick={() => openEdit(p)}
                        className="text-xs text-sage-600 hover:underline">Modifier</button>
                      <button onClick={() => handleDelete(p)}
                        className="text-xs text-red-500 hover:underline">Supprimer</button>
                    </div>
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
