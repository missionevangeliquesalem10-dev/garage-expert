"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [annonce, setAnnonce] = useState({ titre: '', message: '' });

  // 1. Récupérer les abonnés en temps réel
  useEffect(() => {
    const q = query(collection(db, "newsletter_subscribers"), orderBy("dateInscription", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubscribers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. Publier une annonce sur le site
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annonce.titre || !annonce.message) return;

    try {
      await addDoc(collection(db, "annonces"), {
        ...annonce,
        datePublication: serverTimestamp(),
        active: true
      });
      alert("Annonce publiée avec succès !");
      setAnnonce({ titre: '', message: '' });
    } catch (error) {
      alert("Erreur lors de la publication.");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-10">
        Gestion <span className="text-blue-600">Newsletter</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* FORMULAIRE DE CRÉATION D'ANNONCE */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-100">
          <h2 className="text-xl font-black uppercase italic mb-6">📢 Créer une annonce site</h2>
          <form onSubmit={handlePublish} className="space-y-4">
            <input 
              placeholder="Titre de l'annonce (ex: Promotion Freins !)" 
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition font-medium"
              value={annonce.titre}
              onChange={(e) => setAnnonce({...annonce, titre: e.target.value})}
            />
            <textarea 
              placeholder="Détails de l'annonce..." 
              className="w-full border-2 border-gray-100 p-4 rounded-2xl h-40 focus:border-blue-500 outline-none transition font-medium"
              value={annonce.message}
              onChange={(e) => setAnnonce({...annonce, message: e.target.value})}
            />
            <button className="bg-blue-600 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">
              Diffuser sur le site
            </button>
          </form>
        </div>

        {/* LISTE DES ABONNÉS */}
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
          <h2 className="text-xl font-black uppercase italic mb-2">👥 Abonnés</h2>
          <p className="text-blue-400 font-bold mb-6">{subscribers.length} Emails enregistrés</p>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {subscribers.map((sub) => (
              <div key={sub.id} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-sm font-medium">{sub.email}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">
                  Inscrit le {sub.dateInscription?.toDate().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}