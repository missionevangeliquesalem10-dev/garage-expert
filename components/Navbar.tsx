"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Détection du scroll uniquement sur les grands écrans
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-3 inset-x-0 z-[100] flex justify-center px-3 sm:px-6">
      <nav 
        className={`w-full max-w-5xl transition-all duration-300 rounded-2xl md:rounded-full px-5 py-3 border shadow-xl backdrop-blur-md ${
          /* SUR PC: Bleu marine au sommet (scrolled===false), Blanc au scroll (scrolled===true) */
          /* SUR MOBILE: Toujours Blanc (bg-white/95 text-slate-900) */
          scrolled 
            ? 'bg-white/95 text-slate-900 border-slate-200/80 shadow-slate-200/40' 
            : 'bg-white/95 text-slate-900 md:bg-blue-950 md:text-white border-slate-200/80 md:border-blue-900/60 shadow-slate-200/40 md:shadow-blue-950/40'
        }`}
      >
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Logo Auto Garage" 
                className="h-8 w-auto object-contain" 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="text-base sm:text-lg font-black tracking-tighter uppercase italic">
                <span className="text-red-600">SERVICE</span>
                <span className={`transition-colors ${scrolled ? 'text-blue-950' : 'text-blue-950 md:text-white'}`}>
                  {" "}AUTO
                </span>
              </span>
            </Link>
          </div>

          {/* Liens de navigation - Desktop */}
          <div className="hidden md:flex space-x-7 items-center">
            {['Accueil', 'Apropos', 'Garage', 'Pieces', 'Blog', 'Vehicules'].map((item) => (
              <Link 
                key={item}
                href={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`} 
                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                  scrolled 
                    ? 'text-slate-600 hover:text-red-600' 
                    : 'text-slate-200 hover:text-red-500'
                }`}
              >
                {item === 'Apropos' ? 'À Propos' : item}
              </Link>
            ))}
            
            <Link 
              href="/contact" 
              className={`px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md ${
                scrolled 
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30' 
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
              }`}
            >
              Devis
            </Link>
          </div>

          {/* Bouton Burger - Mobile (Toujours adapté au fond blanc du mobile) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-900 focus:outline-none p-2 rounded-xl transition hover:bg-black/5"
              aria-label="Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-slate-900 transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-0.5 w-full bg-slate-900 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 w-full bg-slate-900 transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Menu Mobile Déroulant (Toujours fond blanc) */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[450px] mt-3 pt-3 border-t border-slate-200/80' : 'max-h-0'
        }`}>
          <div className="space-y-1 pb-1">
            {['Accueil', 'Apropos', 'Garage', 'Pieces', 'Blog', 'Vehicules'].map((item) => (
              <Link 
                key={item}
                href={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`}
                onClick={closeMenu}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 hover:text-red-600 transition"
              >
                {item === 'Apropos' ? 'À Propos' : item}
              </Link>
            ))}
            <div className="pt-2">
              <Link 
                href="/contact" 
                onClick={closeMenu} 
                className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-md shadow-red-600/30 transition"
              >
                Demander un Devis
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}