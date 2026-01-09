"use client";
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Partie Gauche : Infos de contact */}
        <div className="bg-slate-900 text-white p-12">
          <h1 className="text-4xl font-black mb-6">Contactez-nous</h1>
          <p className="text-slate-400 mb-8 font-medium">
            Besoin d'un devis ou d'un rendez-vous ? Remplissez le formulaire et notre équipe vous répondra sous 24h.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center text-xl">📞</div>
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Téléphone</p>
                <p className="font-bold text-lg text-white">07 97 11 25 81 / 01 01 35 29 18</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center text-xl">📍</div>
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Adresse</p>
                <p className="font-bold text-lg text-white">Dokui non loin de l'école Adama Sanogo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partie Droite : Formulaire */}
        <div className="p-12 bg-white">
          {envoye ? (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="text-7xl mb-6">✅</div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 italic">MESSAGE ENVOYÉ !</h2>
              <p className="text-gray-500 mb-8 font-medium">Merci pour votre confiance, nous vous recontacterons très vite.</p>
              <button 
                onClick={() => setEnvoye(false)} 
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom Complet</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Jean Koffi" 
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                    onChange={(e) => setForm({...form, nom: e.target.value})} 
                    value={form.nom} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Téléphone</label>
                  <input 
                    type="tel" 
                    placeholder="07..." 
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                    onChange={(e) => setForm({...form, telephone: e.target.value})} 
                    value={form.telephone} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  value={form.email} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Service souhaité</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition font-bold appearance-none"
                  onChange={(e) => setForm({...form, service: e.target.value})} 
                  value={form.service}
                >
                  <option value="Mecanique">Réparation Mécanique</option>
                  <option value="Entretien">Entretien / Vidange</option>
                  <option value="Vente">Achat de véhicule</option>
                  <option value="Pieces">Pièces détachées</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Votre Message</label>
                <textarea 
                  placeholder="Décrivez votre besoin en quelques mots..." 
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition h-32 font-medium"
                  onChange={(e) => setForm({...form, message: e.target.value})} 
                  value={form.message} 
                  required 
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-blue-100 disabled:opacity-50"
              >
                {loading ? "Chargement..." : "Envoyer la demande"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}