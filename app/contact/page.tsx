"use client";
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AdBanner from '@/components/AdBanner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    service: 'Mecanique',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "devis"), {
        ...form,
        statut: 'nouveau',
        date: serverTimestamp()
      });
      setEnvoye(true);
      setForm({ nom: '', email: '', telephone: '', service: 'Mecanique', message: '' });
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-36 pb-20 px-5 md:px-8 font-sans text-slate-800 flex flex-col items-center justify-center">
      
      {/* 1. BLOC FORMULAIRE DE CONTACT ET INFORMATIONS ATELIER */}
      <div className="max-w-5xl w-full mx-auto grid md:grid-cols-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/80">
        
        {/* PARTIE GAUCHE : INFORMATIONS DE CONTACT (BLEU MARINE) */}
        <div className="md:col-span-5 bg-blue-950 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          
          {/* Motif décoratif discret */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-red-600 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

          <div>
            <span className="text-red-500 font-extrabold text-xs uppercase tracking-widest block mb-2">
              Assistance & Devis
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight mb-4 leading-none">
              Contactez-<span className="text-red-600">nous</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal mb-8">
              Besoin d'un devis rapide, d'une réparation ou d'un rendez-vous en atelier ? Remplissez ce formulaire et notre équipe vous répondra sous 24h.
            </p>
          </div>
          
          <div className="space-y-6 relative z-10 pt-6 border-t border-slate-800">
            
            {/* TÉLÉPHONE */}
            <div className="flex items-start gap-4">
              <div className="bg-slate-900/80 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-800 text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mb-0.5">Téléphone</p>
                <p className="font-bold text-sm sm:text-base text-white">07 97 11 25 81 / 01 01 35 29 18</p>
              </div>
            </div>
            
            {/* ADRESSE */}
            <div className="flex items-start gap-4">
              <div className="bg-slate-900/80 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-800 text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mb-0.5">Adresse Atelier</p>
                <p className="font-bold text-sm sm:text-base text-white">Dokui, non loin de l'école Adama Sanogo</p>
              </div>
            </div>

          </div>
        </div>

        {/* PARTIE DROITE : FORMULAIRE */}
        <div className="md:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-center">
          {envoye ? (
            <div className="text-center py-16 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-blue-950 uppercase italic mb-2">Message Envoyé !</h2>
              <p className="text-slate-500 text-xs sm:text-sm mb-8 font-normal">
                Merci pour votre confiance, notre équipe technique vous recontactera dans les plus brefs délais.
              </p>
              <button 
                onClick={() => setEnvoye(false)} 
                className="bg-blue-950 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Nom Complet</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Jean Koffi" 
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition text-xs font-semibold"
                    onChange={(e) => setForm({...form, nom: e.target.value})} 
                    value={form.nom} 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Téléphone</label>
                  <input 
                    type="tel" 
                    placeholder="Ex: 07 00 00 00 00" 
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition text-xs font-semibold"
                    onChange={(e) => setForm({...form, telephone: e.target.value})} 
                    value={form.telephone} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Adresse Email</label>
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition text-xs font-semibold"
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  value={form.email} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Service Souhaité</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition text-xs font-bold"
                  onChange={(e) => setForm({...form, service: e.target.value})} 
                  value={form.service}
                >
                  <option value="Mecanique">Réparation & Diagnostic Mécanique</option>
                  <option value="Entretien">Entretien Régulier & Vidange</option>
                  <option value="Vente">Achat de Véhicule</option>
                  <option value="Pieces">Recherche de Pièces Détachées</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Votre Message</label>
                <textarea 
                  placeholder="Décrivez votre besoin ou le modèle de votre véhicule..." 
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition h-28 text-xs font-semibold resize-none"
                  onChange={(e) => setForm({...form, message: e.target.value})} 
                  value={form.message} 
                  required 
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 shadow-lg shadow-red-600/30 disabled:opacity-50 mt-2"
              >
                {loading ? "Envoi en cours..." : "Envoyer la Demande"}
              </button>
            </form>
          )}
        </div>

      </div>

      {/* 2. EMPLACEMENT BANNIÈRE PUBLICITAIRE SPONSORISÉE */}
      <div className="w-full max-w-5xl mx-auto mt-10">
        <AdBanner format="horizontal" />
      </div>

    </div>
  );
}