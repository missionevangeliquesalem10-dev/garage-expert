"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    // bg-white: Fond blanc | text-slate-900: Texte noir
    <nav className="bg-white text-slate-900 shadow-sm border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Logo Auto Garage" 
                className="h-10 w-auto object-contain" 
              />
              <span className="text-xl font-black tracking-tighter text-blue-600 hidden sm:block uppercase italic">
                SERVICE<span className="text-slate-900"> AUTO</span>
              </span>
            </Link>
          </div>

          {/* Liens de navigation - Desktop (Couleur Noire) */}
          <div className="hidden md:flex space-x-8 items-center">
            {['Accueil', 'Apropos', 'Garage', 'Pieces', 'Blog', 'Vehicules'].map((item) => (
              <Link 
                key={item}
                href={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`} 
                className="text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item === 'Apropos' ? 'À Propos' : item}
              </Link>
            ))}
            
            <Link href="/contact" className="bg-slate-900 text-white hover:bg-blue-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200">
              Demander un Devis
            </Link>
          </div>

          {/* Bouton Burger - Mobile (Noir) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-900 focus:outline-none p-2"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-slate-900 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`h-0.5 w-full bg-slate-900 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 w-full bg-slate-900 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Déroulant (Fond Blanc) */}
      <div className={`md:hidden bg-white transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-1">
          {['Accueil', 'Apropos', 'Garage', 'Pieces', 'Blog', 'Vehicules'].map((item) => (
            <Link 
              key={item}
              href={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`}
              onClick={closeMenu}
              className="block px-3 py-4 rounded-xl text-sm font-bold text-slate-700 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              {item === 'Apropos' ? 'À Propos' : item}
            </Link>
          ))}
          <div className="pt-4">
            <Link href="/contact" onClick={closeMenu} className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
              Demander un Devis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}