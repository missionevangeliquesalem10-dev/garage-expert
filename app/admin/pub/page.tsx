"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function AdminPublicite() {
  const [ads, setAds] = useState<any[]>([]);
  const [newAd, setNewAd] = useState({ nomEntreprise: '', imageAd: '', lienAd: '' });

  // Fonction utilitaire pour optimiser l'URL Cloudinary
  const getOptimizedUrl = (url: string) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    // On insère les paramètres de transformation : 
    // w_1200 (largeur), h_400 (hauteur), c_fill (remplissage), g_auto (centrage auto), q_auto (qualité auto), f_auto (format auto)
    return url.replace('/upload/', '/upload/w_1200,h_400,c_fill,g_auto,q_auto,f_auto/');
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "publicites"), (snap) => {
      setAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "publicites"), {
        ...newAd,
        createdAt: serverTimestamp()
      });
      setNewAd({ nomEntreprise: '', imageAd: '', lienAd: '' });
      alert("Publicité ajoutée !");
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Supprimer cette publicité ?")) {
      await deleteDoc(doc(db, "publicites", id));
    }
  };

  return (
    <div className="mt-12 p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-black uppercase italic mb-6">🎯 Régie Publicitaire</h2>
      
      {/* FORMULAIRE */}
      <form onSubmit={handleAddAd} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <input 
          placeholder="Nom de l'entreprise" 
          className="p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500"
          value={newAd.nomEntreprise}
          onChange={e => setNewAd({...newAd, nomEntreprise: e.target.value})}
          required
        />
        <input 
          placeholder="URL de l'image (Bannière)" 
          className="p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500"
          value={newAd.imageAd}
          onChange={e => setNewAd({...newAd, imageAd: e.target.value})}
          required
        />
        <input 
          placeholder="Lien du site partenaire" 
          className="p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500"
          value={newAd.lienAd}
          onChange={e => setNewAd({...newAd, lienAd: e.target.value})}
          required
        />
        <button className="md:col-span-3 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition">
          Ajouter l'annonceur
        </button>
      </form>

      {/* LISTE DES PUBS ACTIVES */}
      <div className="space-y-4">
        {ads.map(ad => (
          <div key={ad.id} className="flex items-center justify-between p-4 border rounded-2xl bg-gray-50">
            <div className="flex items-center gap-4">
              {/* Utilisation de l'URL optimisée pour la preview */}
              <img 
                src={getOptimizedUrl(ad.imageAd)} 
                className="w-24 h-12 object-cover rounded-lg border bg-white" 
                alt="preview" 
              />
              <div>
                <p className="font-bold text-sm uppercase">{ad.nomEntreprise}</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{ad.lienAd}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(ad.id)} className="text-red-500 font-bold text-xs uppercase p-2 hover:bg-red-50 rounded-lg transition">
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}