"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link'; // <--- AJOUTEZ CETTE LIGNE
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function VehiculesPage() {
  const [voitures, setVoitures] = useState<any[]>([]);
  const [prixMax, setPrixMax] = useState(100000);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. On utilise la requête la plus simple possible (sans orderBy pour éviter les erreurs d'index)
    const q = query(collection(db, "vehicules"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log("Données reçues de Firestore (véhicules) :", data); 
      setVoitures(data);
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore :", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- LOGIQUE DE FILTRE ---
  const voituresFiltrees = voitures.filter(auto => {
    // Sécurité : on s'assure que prix et nom existent
    const prix = Number(auto.prix) || 0;
    const nom = (auto.nom || auto.marque || auto.modele || "Véhicule sans nom").toLowerCase();
    
    const correspondAuPrix = prix <= prixMax;
    const correspondALaRecherche = nom.includes(recherche.toLowerCase());
    
    return correspondAuPrix && correspondALaRecherche;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
       <p className="font-bold text-gray-500 italic">Connexion au parc automobile...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION FILTRES */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            
            <div>
              <h1 className="text-3xl font-black leading-none mb-2 italic uppercase">Catalogue</h1>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">
                {voituresFiltrees.length} modèles disponibles
              </p>
            </div>

            <div className="relative">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-[0.2em]">Rechercher</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                <input 
                  type="text"
                  placeholder="Marque ou modèle..."
                  className="w-full bg-gray-50 border-none p-3 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Budget Max</label>
                <span className="text-sm font-bold text-blue-600">{prixMax.toLocaleString()} €</span>
              </div>
              <input 
                type="range" min="0" max="100000" step="1000"
                value={prixMax}
                onChange={(e) => setPrixMax(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

          </div>
        </div>
        
        {/* GRILLE DES VOITURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {voituresFiltrees.map((auto) => (
            <div key={auto.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
              
              <div className="h-64 bg-gray-200 relative overflow-hidden">
                {auto.image ? (
                   <img src={auto.image} alt={auto.nom} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold">Pas de photo</div>
                )}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black shadow-sm uppercase italic">
                  Année {auto.annee || "NC"}
                </div>
              </div>

              <div className="p-8 flex-grow">
                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
                  {auto.nom || "Sans nom"}
                </h2>
                
                <div className="flex gap-3 mb-8">
                  <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-100 uppercase">
                    📍 {auto.km || 0} km
                  </span>
                  <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-100 uppercase">
                    ⛽ {auto.categorie || "Essence"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix de vente</p>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">
                        {Number(auto.prix || 0).toLocaleString()}€
                    </span>
                  </div>
                  <Link href="/contact" className="bg-slate-900 text-white w-14 h-14 rounded-[1.25rem] flex items-center justify-center hover:bg-blue-600 hover:-rotate-12 transition-all duration-300 shadow-xl shadow-slate-200">
                    ➜
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aucun résultat */}
        {voituresFiltrees.length === 0 && !loading && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-black text-slate-800 uppercase italic">Aucun véhicule trouvé</h3>
            <p className="text-gray-400 mt-2 mb-8 font-medium">Réduisez vos filtres pour voir plus de modèles.</p>
            <button onClick={() => {setRecherche(""); setPrixMax(100000)}} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition">
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  );
}