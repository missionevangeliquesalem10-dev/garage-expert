"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase'; // Importez auth aussi
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function AdminDevis() {
  // --- ÉTATS POUR L'AUTH ---
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // --- ÉTATS POUR LES DEVIS ---
  const [devis, setDevis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Surveillance de l'utilisateur connecté
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Récupération des devis (uniquement si user est là)
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "devis"), orderBy("date", "desc"));
    const unsubscribeDevis = onSnapshot(q, (querySnapshot) => {
      const docs: any[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDevis(docs);
      setLoading(false);
    });

    return () => unsubscribeDevis();
  }, [user]);

  // --- FONCTIONS ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Erreur de connexion : Identifiants incorrects.");
    }
  };

  const changerStatut = async (id: string, nouveauStatut: string) => {
    await updateDoc(doc(db, "devis", id), { statut: nouveauStatut });
  };

  const supprimerDevis = async (id: string) => {
    if(confirm("Supprimer ce devis ?")) {
      await deleteDoc(doc(db, "devis", id));
    }
  };

  // --- AFFICHAGE ---

  if (authLoading) return <div className="p-10 text-center">Vérification de l'accès...</div>;

  // Si pas connecté -> Formulaire de login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl font-black mb-6 text-center text-slate-900">ADMINISTRATION</h1>
          <div className="space-y-4">
            <input 
              type="email" placeholder="Email admin" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)} required
            />
            <input 
              type="password" placeholder="Mot de passe" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setPassword(e.target.value)} required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Si connecté -> Tableau de bord
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Tableau de bord des Devis</h1>
          <button onClick={() => signOut(auth)} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold">
            Déconnexion
          </button>
        </div>
        
        {loading ? (
          <p>Chargement des messages...</p>
        ) : (
          <div className="grid gap-4">
            {devis.map((item) => (
              <div key={item.id} className={`p-6 rounded-xl shadow-sm bg-white border-l-8 ${item.statut === 'termine' ? 'border-green-500' : 'border-orange-500'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-xl">{item.nom}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                        {item.date?.toDate().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-blue-600 font-bold text-sm mb-3">Service : {item.service}</p>
                    <p className="bg-gray-50 p-4 rounded-lg text-gray-700 border italic">"{item.message}"</p>
                    <p className="mt-3 text-sm font-medium text-gray-500">Contact : {item.email}</p>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 justify-end">
                    <button 
                      onClick={() => changerStatut(item.id, 'termine')}
                      className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-xs font-bold border border-green-200 hover:bg-green-100"
                    >
                      Marquer Terminé
                    </button>
                    <button 
                      onClick={() => supprimerDevis(item.id)}
                      className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-xs font-bold border border-red-200 hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {devis.length === 0 && <p className="text-center py-10 text-gray-500">Aucun devis reçu pour le moment.</p>}
          </div>
        )}
      </div>
    </div>
  );
}