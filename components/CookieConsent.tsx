"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérification du consentement déjà enregistré
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-[120] animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-blue-950/95 backdrop-blur-md text-white p-5 sm:p-6 rounded-2xl shadow-2xl border border-blue-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        
        {/* TEXTE D'INFORMATION */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white mb-1">
              Respect de votre vie privée
            </h5>
            <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed font-normal">
              Nous utilisons des cookies pour optimiser votre navigation et mesurer l'audience de notre site. Consultez notre{" "}
              <Link href="/conditions" className="text-red-400 font-bold underline hover:text-red-300 transition">
                Politique de Confidentialité
              </Link>{" "}
              pour en savoir plus.
            </p>
          </div>
        </div>
        
        {/* BOUTONS D'ACTION */}
        <div className="flex gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-blue-900/60 md:border-t-0">
          <button 
            onClick={declineCookies}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-slate-300 border border-slate-700 hover:bg-white/10 transition text-center"
          >
            Refuser
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 transition text-center"
          >
            Accepter
          </button>
        </div>

      </div>
    </div>
  );
}