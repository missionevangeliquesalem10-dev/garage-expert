"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full">
        
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-red-600/30 mt-2"
          >
            {loading ? "Connexion en cours..." : "Se Connecter"}
          </button>
        </form>

      </div>
    </div>
  );
}