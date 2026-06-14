import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function InfoList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pages')
      .then(r => setPages(r.data.pages))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-muted">
        Chargement…
      </div>
    );
  }

  const roots = pages.filter(p => !p.parent_id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Informations</h1>
        <p className="text-muted">
          Ressources sur la santé mentale, le stress et la prévention.
        </p>
      </div>

      {roots.length === 0 ? (
        <div className="card text-center py-12 text-muted">
          Aucun contenu disponible pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roots.map(page => (
            <Link
              key={page.id}
              to={`/informations/${page.slug}`}
              className="card hover:border-sage-200 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sage-200 transition-colors">
                <span className="text-sage-600 text-lg">📄</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-600 transition-colors">
                {page.title}
              </h2>
              {page.excerpt && (
                <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                  {page.excerpt}
                </p>
              )}
              <div className="mt-4 text-sage-500 text-sm font-medium group-hover:underline">
                Lire →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
