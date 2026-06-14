import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '📖',
    title: 'Informations',
    desc: 'Accédez à des ressources fiables sur la santé mentale, la gestion du stress et la prévention.',
    to: '/informations',
    label: 'En savoir plus',
  },
  {
    icon: '🌬️',
    title: 'Respiration',
    desc: 'Pratiquez des exercices de cohérence cardiaque guidés pour réduire le stress immédiatement.',
    to: '/respiration',
    label: 'Commencer',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sage-50 to-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>🌿</span> Application de santé mentale
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Prenez soin de votre<br />
            <span className="text-sage-500">santé mentale</span> au quotidien
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            CESIZen vous accompagne dans la compréhension de votre santé mentale
            et vous fournit des outils concrets pour gérer le stress et cultiver le bien-être.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link to="/respiration" className="btn-primary text-base px-8 py-3">
                Pratiquer un exercice
              </Link>
            ) : (
              <>
                <Link to="/inscription" className="btn-primary text-base px-8 py-3">
                  Commencer gratuitement
                </Link>
                <Link to="/informations" className="btn-secondary text-base px-8 py-3">
                  En savoir plus
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-10">
          Nos outils pour votre bien-être
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="card flex flex-col gap-4">
              <div className="text-4xl">{f.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
              <Link to={f.to} className="btn-primary self-start text-sm">
                {f.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-sage-400 py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
          {[
            { num: '1/4', label: 'personnes touchées par un trouble mental dans leur vie' },
            { num: '3114', label: 'numéro national de prévention du suicide, 24h/24' },
            { num: '5 min', label: 'suffisent pour une séance de cohérence cardiaque' },
          ].map(s => (
            <div key={s.num}>
              <div className="text-3xl font-bold mb-2">{s.num}</div>
              <div className="text-sage-100 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Prêt à commencer votre parcours bien-être ?
          </h2>
          <p className="text-muted mb-6">
            Créez votre compte gratuitement et accédez à tous nos outils.
          </p>
          <Link to="/inscription" className="btn-primary text-base px-8 py-3">
            S'inscrire gratuitement
          </Link>
        </section>
      )}
    </div>
  );
}
