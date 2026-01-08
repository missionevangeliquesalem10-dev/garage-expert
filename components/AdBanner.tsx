"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function AdBanner() {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction utilitaire pour optimiser l'URL Cloudinary (identique à l'admin)
  const getOptimizedUrl = (url: string) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    // w_1200, h_480 : adapté au format du bandeau (32-48 de hauteur tailwind)
    return url.replace('/upload/', '/upload/w_1200,h_480,c_fill,g_auto,q_auto,f_auto/');
  };

  useEffect(() => {
    const q = query(collection(db, "publicites"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-6 my-10">
      <div className="relative group overflow-hidden rounded-[2rem] border border-gray-100 shadow-xl">
        
        {/* Étiquette Sponsor */}
        <div className="absolute top-3 left-6 bg-slate-900/80 backdrop-blur-md text-[8px] text-white px-3 py-1 rounded-full uppercase tracking-[0.2em] z-20 font-black">
          Sponsorisé par {currentAd.nomEntreprise}
        </div>

        {/* Lien et Image avec animation de transition */}
        <a 
          href={currentAd.lienAd} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block relative h-32 md:h-48 transition-all duration-700 ease-in-out"
          key={currentAd.id} 
        >
          <img 
            src={getOptimizedUrl(currentAd.imageAd)} // APPLICATION DE L'OPTIMISATION ICI
            alt={currentAd.nomEntreprise} 
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent"></div>
        </a>

        {/* Indicateurs (petits points en bas) */}
        {ads.length > 1 && (
          <div className="absolute bottom-3 right-6 flex gap-2 z-20">
            {ads.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-6 bg-blue-500" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}