"use client";
import Link from 'next/link';
import { MapPin, Phone } from "lucide-react";

export default function ConditionsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-36 pb-20 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        
        {/* EN-TÊTE DE PAGE */}
        <div className="mb-12 text-center sm:text-left">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-red-100 shadow-sm">
            Mentions Légales & Engagements
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-blue-950 leading-tight">
            Conditions Générales & <span className="text-red-600">Politique</span>
          </h1>
          <div className="h-1.5 w-20 bg-red-600 mt-4 rounded-full mx-auto sm:mx-0"></div>
        </div>

        {/* CONTENU DES SECTIONS JURIDIQUES STRUCTURÉES */}
        <div className="space-y-6">
          
          {/* SECTION 1 : INFORMATIONS LÉGALES */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600/60 transition-all duration-300">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shrink-0 font-black text-sm">
                01
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-blue-950 uppercase tracking-tight">
                Informations Légales
              </h2>
            </div>
            <div className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pl-0 sm:pl-13 space-y-2">
              <p>
                Le site web officiel est édité par l'entreprise <strong>SERVICES AUTO</strong>, spécialisée dans les prestations mécaniques, la vente de véhicules et de pièces détachées.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-slate-700 text-xs space-y-1 mt-3">
                <p className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-blue-950" />
                <strong>Adresse :</strong> Dokui, non loin de l'école Adama Sanogo, Abidjan
              </p>

              <p className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-blue-950" />
                <strong>Téléphone :</strong> +225 07 97 11 25 81 / +225 01 01 35 29 18
              </p>
              </div>
            </div>
          </section>

          {/* SECTION 2 : PRESTATIONS DE SERVICE */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600/60 transition-all duration-300">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shrink-0 font-black text-sm">
                02
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-blue-950 uppercase tracking-tight">
                Prestations de Service & Atelier
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pl-0 sm:pl-13">
              Toute intervention mécanique (diagnostic, réparation, entretien régulier) est exécutée après validation préalable d'un devis ou d'un ordre de réparation. Les pièces de rechange neuves ou d'occasion fournies par l'atelier bénéficient des garanties légales et constructeurs applicables.
            </p>
          </section>

          {/* SECTION 3 : VENTE DE VÉHICULES */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600/60 transition-all duration-300">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shrink-0 font-black text-sm">
                03
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-blue-950 uppercase tracking-tight">
                Vente de Véhicules d'Occasion
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pl-0 sm:pl-13">
              Les véhicules mis en vente sur la plateforme ou directement au parc automobile sont vendus révisés avec un contrôle technique préalable. Le transfert de propriété et la remise des documents d'immatriculation s'effectuent à la suite du règlement intégral du montant convenu.
            </p>
          </section>

          {/* SECTION 4 : PROTECTION DES DONNÉES */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600/60 transition-all duration-300">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shrink-0 font-black text-sm">
                04
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-blue-950 uppercase tracking-tight">
                Protection des Données Personnelles
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pl-0 sm:pl-13">
              Les données personnelles collectées via les formulaires de demande de devis, d'abonnement à la newsletter ou de contact restent strictement confidentielles. Elles ne sont jamais cédées à des tiers et servent uniquement au suivi administratif et à la relation client.
            </p>
          </section>

          {/* SECTION 5 : UTILISATION DES COOKIES */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600/60 transition-all duration-300">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shrink-0 font-black text-sm">
                05
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-blue-950 uppercase tracking-tight">
                Utilisation des Cookies
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pl-0 sm:pl-13">
              Notre site emploie des cookies techniques essentiels pour assurer un fonctionnement fluide (navigation, enregistrement des préférences, sécurité). En continuant votre visite sur notre plateforme, vous consentez à l'utilisation de ces traceurs.
            </p>
          </section>

        </div>

        {/* PIED DE PAGE AVEC BOUTON DE RETOUR */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 shadow-lg shadow-red-600/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}