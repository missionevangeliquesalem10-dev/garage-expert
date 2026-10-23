"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  // Connexion Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      setError('Identifiants incorrects ou accès refusé.');
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du mot de passe via Firebase Auth
  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email pour réinitialiser le mot de passe.');
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(`Un lien de réinitialisation a été envoyé à l'adresse : ${email}`);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte administrateur trouvé avec cette adresse email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format d\'adresse email invalide.');
      } else {
        setError('Erreur lors de l\'envoi de l\'email de réinitialisation.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full">
        
        {/* En-tête / Logo */}
        <div className="text-center mb-8">
          <span className="text-xl font-black uppercase italic tracking-tight text-blue-950">
            <span className="text-red-600">SERVICE</span> AUTO
          </span>
          <h1 className="text-2xl font-black text-blue-950 uppercase italic mt-2">
            Connexion Admin
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Veuillez vous identifier pour accéder au panneau de contrôle.
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Message de succès */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3 rounded-xl mb-6 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Champ Email */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
              Email Administrateur
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@garage.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 text-sm"
            />
          </div>

          {/* Champ Mot de Passe avec Icône Œil */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                Mot de passe
              </label>
              {/* Bouton Réinitialiser Mot de passe */}
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="text-[11px] font-extrabold text-red-600 hover:text-red-700 hover:underline transition"
              >
                {resetLoading ? "Envoi..." : "Mot de passe oublié ?"}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 text-sm"
              />
              
              {/* Bouton pour afficher / masquer le mot de passe */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-red-600/30 mt-2 disabled:opacity-50"
          >
            {loading ? "Connexion en cours..." : "Se Connecter"}
          </button>
        </form>

      </div>
    </div>
  );
}