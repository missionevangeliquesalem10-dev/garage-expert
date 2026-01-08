"use client";
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link'; // Import pour les liens internes

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
      setStatus('✅ Inscrit !');
      setEmail('');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Erreur');
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Colonne 1 : Infos Garage */}
        <div>
          <h3 className="text-2xl font-black text-blue-500 mb-6">Services<span className="text-white">AUTO</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Votre expert automobile de proximité. Qualité, rapidité et transparence.
          </p>
          <div className="text-gray-300 text-xs space-y-2 italic">
            <p>📍 Dokui non loin de l'ecole adama sanogo</p>
            <p>📞 07 97 11 25 81 / 01 01 35 29 18</p>
          </div>
        </div>

        {/* Colonne 2 : Horaires */}
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-700 pb-2 text-blue-400">Horaires</h4>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex justify-between"><span>Lun - Ven</span> <span className="font-bold text-white">07:30 - 17:30</span></li>
            <li className="flex justify-between"><span>Samedi</span> <span className="font-bold text-white">08:30 - 16:30</span></li>
            <li className="flex justify-between text-red-400"><span>Dimanche</span> <span>Fermé</span></li>
          </ul>
        </div>

        {/* Colonne 3 : Newsletter */}
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-700 pb-2 text-blue-400">Newsletter</h4>
          <p className="text-xs text-gray-400 mb-4 italic">Recevez nos annonces et promos.</p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input 
              type="email" 
              placeholder="Votre email..." 
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm outline-none focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-xs font-black uppercase transition">
              S'abonner
            </button>
          </form>
          {status && <p className="mt-2 text-[10px] font-bold uppercase tracking-tighter">{status}</p>}
        </div>

        {/* Colonne 4 : Localisation */}
        <div className="h-48 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3972.0941254888653!2d-3.9989847250159656!3d5.402630094576485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMjQnMDkuNSJOIDPCsDU5JzQ3LjEiVw!5e0!3m2!1sfr!2sci!4v1767857168771!5m2!1sfr!2sci" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* --- NOUVELLE SECTION : LIENS LÉGAUX --- */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 flex flex-wrap justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-gray-400">
        <Link href="/conditions" className="hover:text-blue-400 transition">
          Conditions Générales
        </Link>
        <Link href="/conditions" className="hover:text-blue-400 transition">
          Politique de Confidentialité
        </Link>
        <Link href="/contact" className="hover:text-blue-400 transition">
          Support
        </Link>
      </div>

      <div className="max-w-7xl mx-auto mt-6 text-center text-gray-500 text-[10px] uppercase tracking-[0.2em]">
        <p>© {new Date().getFullYear()} Servicesauto. Tous droits réservés.</p>
      </div>
    </footer>
  );
}