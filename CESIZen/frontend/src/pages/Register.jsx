import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PWD_RULES = [
  { label: '8 caractères minimum',  test: p => p.length >= 8 },
  { label: '1 lettre majuscule',    test: p => /[A-Z]/.test(p) },
  { label: '1 chiffre',             test: p => /[0-9]/.test(p) },
  { label: '1 caractère spécial',   test: p => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', confirm: '', rgpd: false,
  });
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [showRules,  setShowRules]  = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const pwdRulesMet = PWD_RULES.map(r => r.test(form.password));
  const pwdValid    = pwdRulesMet.every(Boolean);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!pwdValid) {
      return setError('Le mot de passe ne respecte pas toutes les règles de sécurité.');
    }
    if (form.password !== form.confirm) {
      return setError('Les mots de passe ne correspondent pas.');
    }
    if (!form.rgpd) {
      return setError('Vous devez accepter la politique de confidentialité (RGPD) pour créer un compte.');
    }

    setLoading(true);
    try {
      await register({
        first_name: form.first_name,
        last_name:  form.last_name,
        email:      form.email,
        password:   form.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setError(msgs ? msgs[0].msg : err.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">CZ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-muted text-sm mt-1">Rejoignez CESIZen gratuitement</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom / Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                <input
                  type="text" name="first_name" required
                  value={form.first_name} onChange={handleChange}
                  className="input-field" placeholder="Alice"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                <input
                  type="text" name="last_name" required
                  value={form.last_name} onChange={handleChange}
                  className="input-field" placeholder="Martin"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                className="input-field" placeholder="vous@exemple.fr"
                autoComplete="email"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input
                type="password" name="password" required
                value={form.password} onChange={handleChange}
                onFocus={() => setShowRules(true)}
                className="input-field"
                placeholder="Créez un mot de passe sécurisé"
                autoComplete="new-password"
              />

              {/* Indicateur de force en temps réel */}
              {(showRules && form.password.length > 0) && (
                <ul className="mt-2 space-y-1">
                  {PWD_RULES.map((r, i) => (
                    <li key={r.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        pwdRulesMet[i] ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <span className="font-bold">{pwdRulesMet[i] ? '✓' : '○'}</span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password" name="confirm" required
                value={form.confirm} onChange={handleChange}
                className={`input-field ${
                  form.confirm && form.confirm !== form.password
                    ? 'border-red-300 focus:ring-red-300 focus:border-red-400'
                    : ''
                }`}
                placeholder="Répétez le mot de passe"
                autoComplete="new-password"
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Case RGPD obligatoire */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" name="rgpd"
                  checked={form.rgpd} onChange={handleChange}
                  className="mt-0.5 w-4 h-4 accent-sage-400 flex-shrink-0"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  J'ai lu et j'accepte la{' '}
                  <strong className="text-gray-700">politique de confidentialité</strong>{' '}
                  (RGPD). Mes données personnelles sont traitées exclusivement
                  pour le fonctionnement de CESIZen et ne sont pas communiquées
                  à des tiers. Conformément au règlement européen, je peux
                  demander la modification ou la suppression de mes données
                  à tout moment.{' '}
                  <span className="text-red-500 font-semibold">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !form.rgpd}
              className={`btn-primary w-full justify-center py-3 ${
                !form.rgpd ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            Déjà un compte ?{' '}
            <Link to="/connexion" className="text-sage-500 hover:text-sage-600 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
