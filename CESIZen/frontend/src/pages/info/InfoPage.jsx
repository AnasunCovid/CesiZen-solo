import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function InfoPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/pages/slug/${slug}`)
      .then(r => setPage(r.data.page))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted">
        Chargement…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted mb-4">Page introuvable.</p>
        <Link to="/informations" className="btn-secondary">
          ← Retour aux informations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link to="/" className="hover:text-sage-500 transition-colors">Accueil</Link>
        <span>/</span>
        <Link to="/informations" className="hover:text-sage-500 transition-colors">Informations</Link>
        <span>/</span>
        <span className="text-gray-700">{page?.title}</span>
      </nav>

      <article className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{page?.title}</h1>

        {page?.excerpt && (
          <p className="text-muted text-lg border-l-4 border-sage-300 pl-4 mb-6 italic">
            {page.excerpt}
          </p>
        )}

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: page?.content }}
        />

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link to="/informations" className="btn-secondary text-sm">
            ← Retour aux informations
          </Link>
        </div>
      </article>
    </div>
  );
}
