"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import AdBanner from '@/components/AdBanner';

// 📱 NUMÉRO WHATSAPP POUR RÉSERVER OU DEMANDER DES INFO SUR UN VÉHICULE
const WHATSAPP_NUMBER = "2250797112581";

export default function VehiculesPage() {
  const [voitures, setVoitures] = useState<any[]>([]);
  const [prixMax, setPrixMax] = useState(100000000);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);

  // ÉTATS POUR LA MODALE E-COMMERCE
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const q = query(collection(db, "vehicules"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVoitures(data);
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore :", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // FILTRE
  const voituresFiltrees = voitures.filter(auto => {
    const prix = Number(auto.prix) || 0;
    const nom = (auto.nom || auto.marque || auto.modele || "Véhicule sans nom").toLowerCase();
    
    const correspondAuPrix = prixMax === 100000000 ? true : prix <= prixMax;
    const correspondALaRecherche = nom.includes(recherche.toLowerCase().trim());
    
    return correspondAuPrix && correspondALaRecherche;
  });

  const openWhatsApp = (nomVoiture: string, annee?: string, prix?: number) => {
    const detailAnnee = annee ? ` (${annee})` : '';
    const detailPrix = prix ? ` - Prix : ${Number(prix).toLocaleString()} FCFA` : '';
    const message = `Bonjour, je suis intéressé par le véhicule : *${nomVoiture}*${detailAnnee}${detailPrix}. Est-il toujours disponible ?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // OUVRIR LA MODALE
  const handleOpenModal = (auto: any) => {
    setSelectedVehicle(auto);
    // Récupère toutes les images (tableau `images` ou unique `image`)
    const allImages = auto.images && Array.isArray(auto.images) && auto.images.length > 0 
      ? auto.images 
      : [auto.image].filter(Boolean);
    setActiveImage(allImages[0] || "");
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-36 pb-20 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* EN-TÊTE DE PAGE */}
        <div className="mb-8">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest block mb-1">
            Vente & Importation Auto
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-blue-950">
            Parc Automobile <span className="text-red-600">& Occasions Guaranteed</span>
          </h1>
        </div>

        {/* SECTION FILTRES COMPACTE */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            
            <div className="lg:col-span-4">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block tracking-wider">
                Recherche par nom ou marque
              </label>
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text"
                  placeholder="Ex: Toyota RAV4, Hyundai..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition text-xs font-semibold text-slate-800"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Budget Maximum
                </label>
                <span className="text-xs font-black text-red-600">
                  {prixMax === 100000000 ? "Tous les prix" : `${prixMax.toLocaleString()} FCFA`}
                </span>
              </div>
              <input 
                type="range" 
                min="1000000" 
                max="100000000" 
                step="1000000"
                value={prixMax}
                onChange={(e) => setPrixMax(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            <div className="lg:col-span-3 flex justify-between items-center bg-blue-950 text-white p-2.5 px-4 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Résultats
              </span>
              <span className="text-sm font-black text-red-500">
                {voituresFiltrees.length} véhicule(s)
              </span>
            </div>

          </div>
        </div>

        {/* CHARGEMENT SKELETON */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
              <div key={n} className="h-60 bg-slate-200/70 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          /* GRILLE DES VÉHICULES COMPACTE AVEC INCITATION AU CLIC */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {voituresFiltrees.map((auto) => (
              <div 
                key={auto.id} 
                onClick={() => handleOpenModal(auto)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200/80 hover:border-red-600 flex flex-col justify-between cursor-pointer hover:-translate-y-1 transform"
              >
                <div>
                  {/* IMAGE AVEC SURVOL INTERACTIF ET BADGE CLIGNOTANT */}
                  <div className="h-32 sm:h-36 bg-slate-900 relative overflow-hidden">
                    {auto.image ? (
                      <img 
                        src={auto.image} 
                        alt={auto.nom || "Véhicule"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
                        Visuel indisponible
                      </div>
                    )}
                    
                    {/* OVERLAY QUI APPARAÎT AU SURVOL POUR INCITER AU CLIC */}
                    <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-white/90 text-blue-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        👁️ Cliquez pour voir
                      </span>
                    </div>

                    {/* BADGE ANIMÉ DE PICS DE PHOTOS */}
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-md animate-pulse">
                      VOIR PHOTOS 📸
                    </span>

                    {/* ANNÉE */}
                    <span className="absolute top-2 right-2 bg-blue-950/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                      {auto.annee || "N/C"}
                    </span>
                  </div>

                  {/* DETAILS DE LA CARTE */}
                  <div className="p-3">
                    <h2 className="text-xs sm:text-sm font-black text-blue-950 group-hover:text-red-600 transition truncate leading-snug mb-2">
                      {auto.nom || `${auto.marque || ''} ${auto.modele || 'Véhicule'}`}
                    </h2>

                    {/* BADGES KILOMÉTRAGE ET CARBURANT */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 border border-slate-200/60">
                        <svg className="w-2.5 h-2.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {auto.km ? `${Number(auto.km).toLocaleString()} km` : "N/C"}
                      </span>

                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 border border-slate-200/60">
                        <svg className="w-2.5 h-2.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {auto.categorie || auto.carburant || "Essence"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BAS DE LA CARTE : PRIX ET BOUTON ACTION ATTRAYANT ET CLIGNOTANT */}
                <div className="p-3 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
                  <div className="pt-2">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Prix</p>
                    <span className="text-xs sm:text-sm font-black text-red-600 tracking-tight block">
                      {auto.prix ? `${Number(auto.prix).toLocaleString()} FCFA` : "Sur Devis"}
                    </span>
                  </div>

                  {/* BOUTON CLIGNOTANT QUI AVERTIT D'OUVRIR LA GALERIE */}
                  <span className="text-[9px] font-black text-white bg-red-600 px-2.5 py-1.5 rounded-lg shadow-md group-hover:bg-blue-950 transition animate-pulse uppercase tracking-wider flex items-center gap-1">
                    GALERIE ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AUCUN RÉSULTAT */}
        {voituresFiltrees.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
            <h3 className="text-base font-extrabold text-blue-950 uppercase italic">
              Aucun véhicule ne correspond à vos critères
            </h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Essayez d'élargir votre budget ou de modifier votre terme de recherche.
            </p>
            <button 
              onClick={() => { setRecherche(""); setPrixMax(100000000); }} 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition shadow-md"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* MODALE E-COMMERCE (GALERIE PHOTO + DETAILS) */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 my-8 border border-white/20">
              
              {/* BOUTON FERMER */}
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center transition shadow-md"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* SECTION GALERIE PHOTOS */}
                <div className="p-4 sm:p-6 bg-slate-950 flex flex-col justify-between">
                  {/* Image Principale */}
                  <div className="h-64 sm:h-72 rounded-2xl overflow-hidden bg-black relative shadow-inner">
                    <img 
                      src={activeImage || selectedVehicle.image} 
                      alt="Véhicule" 
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                  </div>

                  {/* Miniatures (si plusieurs photos) */}
                  {(() => {
                    const list = selectedVehicle.images && Array.isArray(selectedVehicle.images) 
                      ? selectedVehicle.images 
                      : [selectedVehicle.image].filter(Boolean);

                    if (list.length <= 1) return null;

                    return (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {list.map((imgUrl: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImage(imgUrl)}
                            className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${activeImage === imgUrl ? 'border-red-600 scale-105 shadow-md shadow-red-600/30' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={imgUrl} alt="Miniature" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* SECTION INFORMATIONS & WHATSAPP */}
                <div className="p-6 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-red-600 font-extrabold text-[10px] uppercase tracking-widest block mb-1">
                      {selectedVehicle.marque || "Véhicule"}
                    </span>
                    <h2 className="text-xl font-black text-blue-950 uppercase tracking-tight mb-3">
                      {selectedVehicle.nom || `${selectedVehicle.marque || ''} ${selectedVehicle.modele || ''}`}
                    </h2>

                    <div className="text-2xl font-black text-red-600 mb-4">
                      {selectedVehicle.prix ? `${Number(selectedVehicle.prix).toLocaleString()} FCFA` : "Sur Devis"}
                    </div>

                    <div className="space-y-2 mb-6 text-xs border-y border-slate-100 py-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Année :</span>
                        <span className="font-extrabold text-blue-950">{selectedVehicle.annee || "N/C"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Kilométrage :</span>
                        <span className="font-extrabold text-blue-950">{selectedVehicle.km ? `${Number(selectedVehicle.km).toLocaleString()} km` : "N/C"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Carburant / Catégorie :</span>
                        <span className="font-extrabold text-blue-950">{selectedVehicle.categorie || selectedVehicle.carburant || "Essence"}</span>
                      </div>
                    </div>

                    {selectedVehicle.message && (
                      <p className="text-slate-600 text-xs mb-6 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {selectedVehicle.message}
                      </p>
                    )}
                  </div>

                  {/* BOUTON WHATSAPP */}
                  <button 
                    onClick={() => openWhatsApp(selectedVehicle.nom || selectedVehicle.marque || "Véhicule", selectedVehicle.annee, selectedVehicle.prix)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                    </svg>
                    Réserver / Discuter sur WhatsApp
                  </button>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* BANNIÈRE PUBLICITAIRE HORIZONTALE EN BAS DE CATALOGUE */}
        <div className="pt-6">
          <AdBanner format="horizontal" />
        </div>

      </div>
    </div>
  );
}