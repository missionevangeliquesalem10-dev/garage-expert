"use client";
import React from 'react';

// 📱 NUMÉRO WHATSAPP DU GARAGE (Sans le +)
const WHATSAPP_NUMBER = "2250797112581";

const services = [
  {
    id: 1,
    titre: "Entretien & Vidange",
    description: "Vidange moteur, remplacement de filtres certifiés et contrôle préventif des points de sécurité.",
    prix: "Sur WhatsApp",
    svgIcon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    id: 2,
    titre: "Diagnostic Électronique",
    description: "Analyse approfondie par valise de diagnostic pour détecter et réinitialiser tout code erreur.",
    prix: "Sur WhatsApp",
    svgIcon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  {
    id: 3,
    titre: "Système de Freinage",
    description: "Changement de plaquettes, disques ventilés et contrôle complet de la pression hydraulique.",
    prix: "Sur WhatsApp",
    svgIcon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 4,
    titre: "Pneumatiques & Train Roulant",
    description: "Montage, équilibrage de précision, géométrie et réglage du parallélisme.",
    prix: "Sur WhatsApp",
    svgIcon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    )
  },
  {
    id: 5,
    titre: "Révision Générale",
    description: "Inspection minutieuse sur 50 points de contrôle essentiels pour une totale tranquillité sur la route.",
    prix: "Sur WhatsApp",
    svgIcon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 6,
    titre: "Réparation Totale & Restauration",
    description: "Intervention lourde : réfection moteur, boîte de vitesses, train roulant et carrosserie.",
    prix: "Sur Devis Expert",
    svgIcon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zM4 14a2 2 0 00-2 2v1a2 2 0 002 2h16a2 2 0 002-2v-1a2 2 0 00-2-2H4z" />
      </svg>
    )
  }
];

export default function GaragePage() {
  // Redirection WhatsApp
  const openWhatsApp = (titreService: string) => {
    const message = `Bonjour, je souhaite obtenir un rdv ou un devis concernant le service : *${titreService}*.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-36 pb-20 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* EN-TÊTE DE PAGE */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest block mb-2">
            Prestations Ateliers & Garage
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-900 leading-tight">
            L'Atelier <span className="text-blue-950">Expert</span>
          </h1>
          <div className="h-1.5 w-20 bg-red-600 mt-4 rounded-full mb-6"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            De la maintenance régulière à la réfection mécanique complète, notre équipe qualifiée déploie des équipements de pointe pour assurer la durabilité et la performance de votre véhicule.
          </p>
        </div>

        {/* NOUVELLE GRILLE DE SERVICES STRUCTURÉE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl p-7 border border-slate-200/80 hover:border-blue-950 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* En-tête de la carte avec l'icône SVG */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 text-white flex items-center justify-center shadow-md group-hover:bg-red-600 transition duration-300">
                    {service.svgIcon}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    {service.prix}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-3 uppercase tracking-tight group-hover:text-blue-950 transition">
                  {service.titre}
                </h3>

                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>
              </div>

              {/* Bouton d'action WhatsApp */}
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => openWhatsApp(service.titre)}
                  className="w-full bg-blue-950 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  Réserver / Devis WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BANNIÈRE D'URGENCE (BLEU MARINE & ACCENTS ROUGES) */}
        <div className="mt-16 sm:mt-20 bg-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
            <div>
              <span className="text-red-500 font-extrabold uppercase text-xs tracking-widest block mb-1">
                Assistance & Dépannage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight mb-3">
                Besoin d'une intervention <span className="text-red-500">Urgente</span> ?
              </h2>
              <p className="text-slate-300 text-xs sm:text-base font-normal max-w-xl leading-relaxed">
                Panne subite, surchauffe ou incident mécanique ? Nos techniciens interviennent rapidement pour sécuriser et réparer votre véhicule.
              </p>
            </div>

            <a 
              href="tel:+2250797112581" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold uppercase text-xs sm:text-sm tracking-wider transition-all duration-300 shadow-lg shadow-red-600/30 flex items-center gap-3 shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Appeler le 07 97 11 25 81
            </a>
          </div>
        </div>

        {/* MENTIONS TRANSPARENCE */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Pièces d'origine garanties • Transparence sur les tarifs • Devis rapide
          </p>
        </div>

      </div>
    </div>
  );
}