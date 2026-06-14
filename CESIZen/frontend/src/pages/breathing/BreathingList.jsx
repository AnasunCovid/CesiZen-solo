import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const totalDuration = ex => ex.inhale_duration + ex.hold_duration + ex.exhale_duration;

export default function BreathingList() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/breathing')
      .then(r => setExercises(r.data.exercises))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-muted">Chargement…</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercices de respiration</h1>
        <p className="text-muted">
          Pratiquez la cohérence cardiaque pour réduire le stress et retrouver l'équilibre.
        </p>
      </div>

      {/* Intro */}
      <div className="bg-sage-50 border border-sage-200 rounded-2xl p-5 mb-8">
        <h2 className="text-sage-700 font-semibold mb-2">🌬️ Qu'est-ce que la cohérence cardiaque ?</h2>
        <p className="text-sm text-sage-600 leading-relaxed">
          La cohérence cardiaque est une technique scientifiquement validée qui synchronise
          la respiration avec le rythme cardiaque. Pratiquée régulièrement, elle réduit
          le cortisol (hormone du stress), améliore la concentration et favorise le bien-être.
          La méthode <strong>365</strong> recommande 3 séances de 5 minutes par jour.
        </p>
      </div>

      {exercises.length === 0 ? (
        <div className="card text-center py-12 text-muted">
          Aucun exercice disponible pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exercises.map(ex => (
            <div key={ex.id} className="card flex flex-col">
              {/* Label badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-sage-500">{ex.label}</span>
                <span className="badge bg-sage-100 text-sage-600">
                  {totalDuration(ex)}s / cycle
                </span>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-2">{ex.name}</h2>

              {/* Phases */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-blue-50 rounded-xl p-2 text-center">
                  <div className="text-xs text-muted mb-0.5">Inspiration</div>
                  <div className="font-semibold text-gray-800">{ex.inhale_duration}s</div>
                </div>
                {ex.hold_duration > 0 && (
                  <div className="flex-1 bg-sage-50 rounded-xl p-2 text-center">
                    <div className="text-xs text-muted mb-0.5">Apnée</div>
                    <div className="font-semibold text-gray-800">{ex.hold_duration}s</div>
                  </div>
                )}
                <div className="flex-1 bg-purple-50 rounded-xl p-2 text-center">
                  <div className="text-xs text-muted mb-0.5">Expiration</div>
                  <div className="font-semibold text-gray-800">{ex.exhale_duration}s</div>
                </div>
              </div>

              {ex.description && (
                <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">
                  {ex.description}
                </p>
              )}

              <div className="mt-auto">
                <Link to={`/respiration/${ex.id}`} className="btn-primary w-full text-center block">
                  Commencer l'exercice
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
