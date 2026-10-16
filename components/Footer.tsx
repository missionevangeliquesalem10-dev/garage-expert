"use client";
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email: email,
        dateInscription: serverTimestamp()
      });
      setStatus('Inscrit avec succès !');
      setEmail('');
      setTimeout(() => setStatus(''), 4000);
    } catch (error) {
      setStatus('Erreur lors de l\'inscription');
    }
  };

  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8 px-5 sm:px-8 border-t border-blue-900/50 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        
        {/* Colonne 1 : Infos Garage */}
        <div>
          <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">
            <span className="text-red-600">SERVICES</span>
            <span className="text-white">AUTO</span>
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Votre expert automobile de proximité à Abidjan. Entretien mécanique, pièces d'origine et vente de véhicules révisés.
          </p>
          
          <div className="text-slate-300 text-xs space-y-3 font-medium">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Dokui, non loin de l'école Adama Sanogo</span>
            </div>

            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>07 97 11 25 81 / 01 01 35 29 18</span>
            </div>
          </div>
        </div>

        {/* Colonne 2 : Horaires */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-5 border-b border-blue-900 pb-2 text-red-500">
            Horaires d'Ouverture
          </h4>
          <ul className="space-y-3 text-xs text-slate-300 font-medium">
            <li className="flex justify-between items-center border-b border-blue-900/40 pb-2">
              <span>Lundi - Vendredi</span> 
              <span className="font-bold text-white bg-blue-900/60 px-2 py-0.5 rounded">07:30 - 20:30</span>
            </li>
            <li className="flex justify-between items-center border-b border-blue-900/40 pb-2">
              <span>Samedi</span> 
              <span className="font-bold text-white bg-blue-900/60 px-2 py-0.5 rounded">08:30 - 16:30</span>
            </li>
            <li className="flex justify-between items-center pt-1">
              <span>Dimanche</span> 
              <span className="font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded">Fermé</span>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Newsletter */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-5 border-b border-blue-900 pb-2 text-red-500">
            Newsletter
          </h4>
          <p className="text-xs text-slate-300 mb-4 font-normal">
            Recevez nos dernières arrivées de véhicules et nos offres promotionnelles.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2.5">
            <input 
              type="email" 
              placeholder="Votre adresse email..." 
              className="w-full bg-blue-900/40 border border-blue-800/80 p-3 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:border-red-600 transition font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-600/20"
            >
              S'abonner
            </button>
          </form>
          {status && (
            <p className={`mt-2 text-[10px] font-extrabold uppercase tracking-wider ${status.includes('Erreur') ? 'text-red-400' : 'text-emerald-400'}`}>
              {status}
            </p>
          )}
        </div>

        {/* Colonne 4 : Carte de Localisation */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-5 border-b border-blue-900 pb-2 text-red-500">
            Plan d'Accès
          </h4>
          <div className="h-44 rounded-2xl overflow-hidden border border-blue-800/60 shadow-lg relative bg-blue-900">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.094705464554!2d-3.999065324273171!3d5.402541635172257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1952fc9707e31%3A0xcadd349572f4306!2sServices%20Auto!5e0!3m2!1sfr!2sci!4v1792170564127!5m2!1sfr!2sci" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* SECTION LIENS LÉGAUX */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-blue-900/60 flex flex-wrap justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">
        <Link href="/conditions" className="hover:text-red-500 transition">
          Conditions Générales
        </Link>
        <Link href="/conditions" className="hover:text-red-500 transition">
          Politique de Confidentialité
        </Link>
        <Link href="/contact" className="hover:text-red-500 transition">
          Support & Contact
        </Link>
      </div>

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto mt-6 text-center text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
        <p>© {new Date().getFullYear()} ServicesAuto. Tous droits réservés.</p>
      </div>
    </footer>
  );
}