"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

interface AdBannerProps {
  format?: 'horizontal' | 'vertical' | 'popup' | 'marquee';
}

export default function AdBanner({ format = 'horizontal' }: AdBannerProps) {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  // Fonction utilitaire pour optimiser l'URL Cloudinary selon le format
  const getOptimizedUrl = (url: string, currentFormat: string) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    if (currentFormat === 'vertical') {
      return url.replace('/upload/', '/upload/w_400,h_800,c_fill,g_auto,q_auto,f_auto/');
    }
    if (currentFormat === 'popup') {
      return url.replace('/upload/', '/upload/w_800,h_800,c_fill,g_auto,q_auto,f_auto/');
    }
    // Pour horizontal et marquee
    return url.replace('/upload/', '/upload/w_1200,h_480,c_fill,g_auto,q_auto,f_auto/');
  };

  useEffect(() => {
    // Filtrage des pubs par format et statut actif
    const q = query(
      collection(db, "publicites"),
      where("formatAd", "==", format)
    );

    const unsub = onSnapshot(q, (snap) => {
      // Filtrer côté client pour récupérer active !== false
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((ad: any) => ad.active !== false);
      
      setAds(data);
    }, (error) => {
      console.error(`Erreur Firestore Ads (${format}):`, error);
    });

    return () => unsub();
  }, [format]);

  // Rotation automatique toutes les 5 secondes s'il y a plusieurs pubs
  useEffect(() => {
    if (ads.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ads]);

  if (ads.length === 0) return null;
  const currentAd = ads[currentIndex];
  if (!currentAd) return null;

  // -------------------------------------------------------------
  // 1. FORMAT BANDE DÉROULANTE (MARQUEE)
  // -------------------------------------------------------------
  if (format === 'marquee') {
    return (
      <div className="bg-blue-950 text-white overflow-hidden py-2.5 border-b border-blue-900 shadow-inner">
        <div className="flex animate-marquee whitespace-nowrap items-center gap-8">
          {ads.map((ad, idx) => (
            <a
              key={ad.id || idx}
              href={ad.lienAd || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 hover:text-red-400 transition"
            >
              <span className="bg-red-600 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded">
                Sponsor
              </span>
              <span className="font-extrabold text-xs uppercase italic tracking-wider">
                {ad.nomEntreprise}
              </span>
              {ad.imageAd && (
                <img 
                  src={getOptimizedUrl(ad.imageAd, 'marquee')} 
                  alt={ad.nomEntreprise} 
                  className="h-6 w-auto rounded object-cover border border-white/20"
                />
              )}
              <span className="text-slate-400 text-xs font-semibold">➜ En savoir plus</span>
              <span className="text-red-500 font-bold mx-4">•</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. FORMAT POP-UP (FENÊTRE MODALE SUR-IMPRIMÉE)
  // -------------------------------------------------------------
  if (format === 'popup') {
    if (!showPopup) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-200">
          
          {/* Bouton de fermeture */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-3 right-3 bg-blue-950/80 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black z-30 transition shadow-md"
            title="Fermer la publicité"
          >
            ✕
          </button>

          {/* Tag Sponsor */}
          <div className="absolute top-3 left-4 bg-blue-950/90 text-[8px] text-white px-3 py-1 rounded-full uppercase tracking-widest z-20 font-black border border-white/10">
            Sponsorisé par {currentAd?.nomEntreprise || "Partenaire"}
          </div>

          <a
            href={currentAd?.lienAd || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            {currentAd?.imageAd ? (
              <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-900">
                <img
                  src={getOptimizedUrl(currentAd.imageAd, 'popup')}
                  alt={currentAd?.nomEntreprise || "Publicité"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            ) : (
              <div className="h-64 bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400 text-xs font-bold italic">Image non disponible</span>
              </div>
            )}

            <div className="p-5 bg-white flex items-center justify-between border-t border-slate-100">
              <div>
                <h4 className="font-black text-sm uppercase text-blue-950 italic">
                  {currentAd?.nomEntreprise}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Cliquez pour voir l'offre</p>
              </div>

              <span className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl uppercase tracking-wider transition">
                Découvrir →
              </span>
            </div>
          </a>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. FORMAT BANNIÈRE VERTICALE (SIDEBAR)
  // -------------------------------------------------------------
  if (format === 'vertical') {
    return (
      <div className="w-full my-6">
        <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-md bg-white">
          
          <div className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-md text-[8px] text-white px-2.5 py-1 rounded-full uppercase tracking-widest z-20 font-black border border-white/10">
            {currentAd?.nomEntreprise}
          </div>

          <a
            href={currentAd?.lienAd || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative h-80 sm:h-96 transition-all duration-700"
            key={currentAd?.id}
          >
            {currentAd?.imageAd ? (
              <img
                src={getOptimizedUrl(currentAd.imageAd, 'vertical')}
                alt={currentAd?.nomEntreprise || "Publicité"}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400 text-xs font-bold italic">Image non disponible</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent"></div>
          </a>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. FORMAT BANNIÈRE HORIZONATLE PAR DÉFAUT (IN-PAGE)
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-8 font-sans">
      <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-lg bg-white">
        
        {/* Étiquette Sponsor */}
        <div className="absolute top-3 left-4 sm:left-6 bg-blue-950/90 backdrop-blur-md text-[8px] sm:text-[9px] text-white px-3 py-1 rounded-full uppercase tracking-widest z-20 font-black border border-white/10">
          Sponsorisé par <span className="text-red-500">{currentAd?.nomEntreprise || "Partenaire"}</span>
        </div>

        {/* Lien et Image */}
        <a 
          href={currentAd?.lienAd || "#"} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block relative h-32 sm:h-44 md:h-52 transition-all duration-700 ease-in-out"
          key={currentAd?.id} 
        >
          {currentAd?.imageAd ? (
            <img 
              src={getOptimizedUrl(currentAd.imageAd, 'horizontal')} 
              alt={currentAd?.nomEntreprise || "Publicité"} 
              className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
               <span className="text-slate-400 text-xs font-bold italic">Image non disponible</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-transparent"></div>
        </a>

        {/* Indicateurs de carrousel (petits points) */}
        {ads.length > 1 && (
          <div className="absolute bottom-3 right-4 sm:right-6 flex gap-1.5 z-20">
            {ads.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-6 bg-red-600" : "w-1.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}