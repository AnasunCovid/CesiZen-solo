import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
  });
  const [pwdForm, setPwdForm] = useState({
    current_password: '', new_password: '', confirm: '',
  });

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [pwdMsg,     setPwdMsg]     = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleProfileChange = e =>
    setProfileForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePwdChange = e =>
    setPwdForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfile = async e => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const { data } = await api.put('/profile', profileForm);
      updateUser(data.user);
      setProfileMsg({ type: 'ok', text: 'Profil mis à jour ✓' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async e => {
    e.preventDefault();
    if (pwdForm.new_password !== pwdForm.confirm) {
      return setPwdMsg({ type: 'err', text: 'Les mots de passe ne correspondent pas' });
    }
    setSavingPwd(true);
    setPwdMsg({ type: '', text: '' });
    try {
      await api.put('/profile/password', {
        current_password: pwdForm.current_password,
        new_password:     pwdForm.new_password,
      });
      setPwdMsg({ type: 'ok', text: 'Mot de passe modifié ✓' });
      setPwdForm({ current_password: '', new_password: '', confirm: '' });
    } catch (err) {
      setPwdMsg({ type: 'err', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setSavingPwd(false);
    }
  };

  const msgClass = type => type === 'ok'
    ? 'bg-sage-50 border border-sage-200 text-sage-700 text-sm rounded-xl px-4 py-2'
    : 'bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h1>
      <p className="text-muted mb-8">
        <span className={user?.role === 'admin' ? 'badge-admin' : 'badge-user'}>
          {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
        </span>
        {' '}· Membre depuis le {new Date(user?.created_at).toLocaleDateString('fr-FR')}
      </p>

      {/* Informations personnelles */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations personnelles</h2>

        {profileMsg.text && <p className={msgClass(profileMsg.type) + ' mb-4'}>{profileMsg.text}</p>}

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
              <input
                type="text" name="first_name" required
                value={profileForm.first_name} onChange={handleProfileChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
              <input
                type="text" name="last_name" required
                value={profileForm.last_name} onChange={handleProfileChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email" value={user?.email} disabled
              className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-muted mt-1">L'email ne peut pas être modifié.</p>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>

      {/* Changement de mot de passe */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Changer le mot de passe</h2>

        {pwdMsg.text && <p className={msgClass(pwdMsg.type) + ' mb-4'}>{pwdMsg.text}</p>}

        <form onSubmit={savePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe actuel</label>
            <input
              type="password" name="current_password" required
              value={pwdForm.current_password} onChange={handlePwdChange}
              className="input-field"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
            <input
              type="password" name="new_password" required
              value={pwdForm.new_password} onChange={handlePwdChange}
              className="input-field" placeholder="8 car. min, majuscule, chiffre, caractère spécial"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer</label>
            <input
              type="password" name="confirm" required
              value={pwdForm.confirm} onChange={handlePwdChange}
              className="input-field"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={savingPwd} className="btn-secondary">
            {savingPwd ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}
