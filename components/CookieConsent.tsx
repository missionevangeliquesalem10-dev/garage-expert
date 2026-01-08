"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On vérifie si l'utilisateur a déjà accepté
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl text-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h5 className="text-lg font-black uppercase italic mb-2 flex items-center gap-2">
            <span className="text-xl">🍪</span> Respect de votre vie privée
          </h5>
          <p className="text-slate-400 text-xs leading-relaxed">
            Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et diffuser des publicités pertinentes. 
            En cliquant sur "Accepter", vous consentez à notre utilisation des cookies. 
            Consultez nos <Link href="/conditions" className="text-blue-400 underline hover:text-blue-300">Conditions Générales</Link> pour plus d'infos.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/10 transition"
          >
            Refuser
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}