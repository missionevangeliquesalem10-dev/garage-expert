"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 📸 IMAGES POUR LE SLIDER DU DOSSIER À PROPOS
const ABOUT_SLIDES = [
  "https://res.cloudinary.com/damkharxh/image/upload/v1792169531/khjeudrsanixwa6jexty.jpg",
  "https://res.cloudinary.com/damkharxh/image/upload/v1792169583/hjwzpu7e6fbatgbgf31n.jpg",
  "https://res.cloudinary.com/damkharxh/image/upload/v1792169647/s1fplyxyk6kp9lbwafzw.png",
  "https://res.cloudinary.com/damkharxh/image/upload/v1792169648/ocixis5wqkslrm88djii.jpg",
  "https://res.cloudinary.com/damkharxh/image/upload/v1792169648/qu5vtoeonolasqwv2rhm.jpg"
];

// Composant interne pour l'animation des chiffres
const Counter = ({ target, duration = 2000, suffix = "" }: { target: string, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const endValue = parseFloat(target);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = progress * endValue;
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span>
      {count % 1 === 0 ? count.toFixed(0) : count.toFixed(1)}
      {suffix}
    </span>
  );
};

export default function AproposPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Défilement automatique du carrousel d'images (4 secondes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ABOUT_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % ABOUT_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + ABOUT_SLIDES.length) % ABOUT_SLIDES.length);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      
      {/* --- SECTION HERO (En-tête) --- */}
      <section className="relative py-20 sm:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover" 
            alt="Garage Background" 
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase italic tracking-tight mb-6">
            <span className="text-red-600">L'Art de la</span> <br/> 
            <span className="text-blue-900 drop-shadow-md">Performance</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Plus qu'un simple garage, nous sommes les gardiens de votre passion automobile depuis plus de 10 ans.
          </p>
        </div>
      </section>

      {/* --- SECTION HISTOIRE & VALEURS AVEC CAROUSEL --- */}
      <section className="py-16 sm:py-24 px-5 md:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* CARROUSEL D'IMAGES À GAUCHE */}
          <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
            {ABOUT_SLIDES.map((slideImg, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
                style={{
                  backgroundImage: `url(${slideImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}

            {/* Boutons de navigation manuelle du slider */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 text-white hover:bg-red-600 transition flex items-center justify-center backdrop-blur-md border border-white/20"
              aria-label="Image précédente"
            >
              ❮
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 text-white hover:bg-red-600 transition flex items-center justify-center backdrop-blur-md border border-white/20"
              aria-label="Image suivante"
            >
              ❯
            </button>

            {/* Indicateurs en bas du slider */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {ABOUT_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-6 bg-red-600" : "w-2 bg-white/60"}`}
                />
              ))}
            </div>
          </div>

          {/* TEXTE À DROITE */}
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2 block">
              NOTRE SAVOIR-FAIRE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight mb-6 leading-tight text-slate-900">
              Votre partenaire automobile, <br/>de <span className="text-blue-900">la pièce au véhicule</span>
            </h2>
            
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
              <p>
                Chez Service Auto Angré, nous vous accompagnons dans tous vos besoins automobiles. Que vous recherchiez une pièce détachée adaptée à votre véhicule, une voiture à acheter ou un garage de confiance pour son entretien, notre équipe est à votre écoute.
              </p>
              <p>
                Nous mettons notre expertise et notre engagement au service de votre satisfaction, avec une attention particulière portée à la qualité des pièces, au choix des véhicules et au soin apporté à chaque intervention mécanique.
              </p>
              <p>
                Notre engagement : vous conseiller avec transparence, vous proposer des solutions adaptées à vos besoins et vous accompagner pour prendre soin de votre véhicule en toute confiance.
              </p>
            </div>

            {/* COMPTEURS */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight italic">
                  <Counter target="12" suffix="+" />
                </p>
                <p className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider mt-1">
                  Années d'expérience
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight italic">
                  <Counter target="2.5" suffix="k" />
                </p>
                <p className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider mt-1">
                  Clients satisfaits
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION POURQUOI NOUS CHOISIR (ICÔNES CLASSIQUES ÉLÉGANTES) --- */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200/60 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-900">
              Pourquoi nous <span className="text-blue-900">Choisir</span> ?
            </h2>
            <div className="h-1 w-16 bg-red-600 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* CARTE 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/70 hover:border-blue-900 transition duration-300 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-white flex items-center justify-center mb-6 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold uppercase mb-2 text-slate-900 tracking-tight">Qualité Certifiée</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                Nous n'utilisons que des pièces certifiées conformes et des appareils de diagnostic de dernière génération.
              </p>
            </div>

            {/* CARTE 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/70 hover:border-blue-900 transition duration-300 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-white flex items-center justify-center mb-6 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold uppercase mb-2 text-slate-900 tracking-tight">Accompagnement Sur-Mesure</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                Chaque client bénéficie d'un suivi personnalisé et de conseils transparents adaptés à son budget.
              </p>
            </div>

            {/* CARTE 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/70 hover:border-blue-900 transition duration-300 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-white flex items-center justify-center mb-6 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold uppercase mb-2 text-slate-900 tracking-tight">Intervention Rapide</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                Votre temps est précieux. Nous optimisons nos délais de traitement sans jamais compromettre la qualité.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION CTA (FOND BLEU MARINE DU LOGO) --- */}
      <section className="py-16 sm:py-20 px-5 md:px-8">
        <div className="max-w-5xl mx-auto bg-blue-950 rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black mb-4 uppercase italic tracking-tight">
              Prêt à rouler avec nous ?
            </h2>
            <p className="text-slate-300 text-xs sm:text-base mb-8 max-w-xl mx-auto font-normal leading-relaxed">
              Contactez notre équipe pour obtenir un devis gratuit ou venez découvrir nos prestations directement en atelier.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition uppercase text-xs tracking-wider shadow-lg shadow-red-600/30"
              >
                Prendre RDV
              </Link>
              <Link 
                href="/vehicules" 
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-slate-900 px-8 py-3.5 rounded-xl font-bold transition uppercase text-xs tracking-wider text-white"
              >
                Voir le Stock
              </Link>
            </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}