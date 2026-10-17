"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [annonce, setAnnonce] = useState({ titre: '', message: '' });
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  // 3. Supprimer un abonné
  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer l'abonné : ${email} ?`)) return;
    
    setLoadingId(id);
    try {
      await deleteDoc(doc(db, "newsletter_subscribers", id));
    } catch (error) {
      console.error("Erreur de suppression:", error);
      alert("Erreur lors de la suppression de l'abonné.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans space-y-8">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-red-600 font-black text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block mb-2 border border-red-100">
          Gestion & Diffusion
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-blue-950">
          Gestion de la <span className="text-red-600">Newsletter & Annonces</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Diffusez des annonces sur le site et suivez l'ensemble de vos abonnés inscrits.
        </p>
      </div>

      {/* GRILLE PRINCIPALE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORMULAIRE DE CRÉATION D'ANNONCE (2 colonnes) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black uppercase italic text-blue-950 mb-4 flex items-center gap-2">
            <span className="text-red-600">📢</span> Créer une annonce site
          </h2>
          
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                Titre de l'annonce
              </label>
              <input 
                placeholder="Ex: Promotion Spéciale Freinage ce mois !" 
                className="w-full border border-slate-200 p-3.5 rounded-xl focus:border-red-600 focus:outline-none transition font-medium text-sm text-blue-950"
                value={annonce.titre}
                onChange={(e) => setAnnonce({...annonce, titre: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                Message / Détails
              </label>
              <textarea 
                placeholder="Détails de l'offre ou de l'annonce..." 
                className="w-full border border-slate-200 p-3.5 rounded-xl h-36 focus:border-red-600 focus:outline-none transition font-medium text-sm text-blue-950 resize-none"
                value={annonce.message}
                onChange={(e) => setAnnonce({...annonce, message: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-extrabold uppercase tracking-wider transition shadow-lg shadow-red-600/20 text-xs"
            >
              Diffuser sur le site
            </button>
          </form>
        </div>

        {/* LISTE DES ABONNÉS (1 colonne) */}
        <div className="bg-blue-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black uppercase italic text-white flex items-center gap-2">
                <span className="text-red-500">👥</span> Abonnés
              </h2>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black">
                {subscribers.length}
              </span>
            </div>
            <p className="text-slate-300 text-xs mb-6">Liste des emails enregistrés sur la plateforme.</p>
            
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {subscribers.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10 p-4">
                  <p className="text-slate-400 text-xs font-bold uppercase">Aucun abonné pour le moment.</p>
                </div>
              ) : (
                subscribers.map((sub) => (
                  <div key={sub.id} className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center justify-between gap-3 group">
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{sub.email}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-medium">
                        {sub.dateInscription?.toDate ? sub.dateInscription.toDate().toLocaleDateString('fr-FR') : "Récemment"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                      disabled={loadingId === sub.id}
                      className="bg-white/10 hover:bg-red-600 text-slate-300 hover:text-white p-2 rounded-lg transition text-xs shrink-0"
                      title="Supprimer cet abonné"
                    >
                      {loadingId === sub.id ? "..." : "🗑️"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 text-center font-medium">
            Services Auto — Administration sécurisée
          </div>
        </div>

      </div>
    </div>
  );
}