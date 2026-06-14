import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-sage-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">CZ</span>
              </div>
              <span className="font-semibold text-gray-800">CESI<span className="text-sage-500">Zen</span></span>
            </div>
            <p className="text-sm text-muted">L'application de votre santé mentale.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Navigation</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/informations" className="text-muted hover:text-sage-500 transition-colors">Informations</Link></li>
              <li><Link to="/respiration"  className="text-muted hover:text-sage-500 transition-colors">Exercices de respiration</Link></li>
              <li><Link to="/inscription"  className="text-muted hover:text-sage-500 transition-colors">Créer un compte</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Urgences</h3>
            <ul className="space-y-1.5 text-sm text-muted">
              <li>Prévention suicide : <strong className="text-gray-700">3114</strong></li>
              <li>SAMU : <strong className="text-gray-700">15</strong></li>
              <li>SOS Amitié : <strong className="text-gray-700">09 72 39 40 50</strong></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-4 text-center text-xs text-muted">
          © {new Date().getFullYear()} CESIZen – Ministère de la Santé et de la Prévention.
          Données hébergées en France · RGPD respecté.
        </div>
      </div>
    </footer>
  );
}
