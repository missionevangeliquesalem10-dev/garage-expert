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
          <p className="text-slate-400 mb-8">
            Besoin d'un devis ou d'un rendez-vous ? Remplissez le formulaire et notre équipe vous répondra sous 24h.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-sm text-slate-400">Téléphone</p>
                <p className="font-bold text-lg"> 07 97 11 25 81 / 01 01 35 29 18</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-sm text-slate-400">Adresse</p>
                <p className="font-bold text-lg">Dokui non loin de l'ecole adama sanogo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partie Droite : Formulaire */}
        <div className="p-12">
          {envoye ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Message envoyé !</h2>
              <p className="text-gray-500 mb-6">Merci pour votre confiance, nous vous recontacterons très vite.</p>
              <button onClick={() => setEnvoye(false)} className="text-blue-600 font-bold underline">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Nom complet" className="border p-3 rounded-xl w-full"
                  onChange={(e) => setForm({...form, nom: e.target.value})} value={form.nom} required
                />
                <input 
                  type="tel" placeholder="Téléphone" className="border p-3 rounded-xl w-full"
                  onChange={(e) => setForm({...form, telephone: e.target.value})} value={form.telephone} required
                />
              </div>
              <input 
                type="email" placeholder="Email" className="border p-3 rounded-xl w-full"
                onChange={(e) => setForm({...form, email: e.target.value})} value={form.email} required
              />
              <select 
                className="border p-3 rounded-xl w-full bg-white"
                onChange={(e) => setForm({...form, service: e.target.value})} value={form.service}
              >
                <option value="Mecanique">Réparation Mécanique</option>
                <option value="Entretien">Entretien / Vidange</option>
                <option value="Vente">Achat de véhicule</option>
                <option value="Pieces">Pièces détachées</option>
              </select>
              <textarea 
                placeholder="Décrivez votre besoin..." className="border p-3 rounded-xl w-full h-32"
                onChange={(e) => setForm({...form, message: e.target.value})} value={form.message} required
              ></textarea>
              
              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                {loading ? "Envoi en cours..." : "Demander mon Devis Gratuit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}