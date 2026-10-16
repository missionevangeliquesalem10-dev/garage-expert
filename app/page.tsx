"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';

// 📸 IMAGES DU HERO SLIDER (Dans votre dossier /public/images/)
const HERO_SLIDES = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
];

// 📱 NUMÉRO WHATSAPP DU GARAGE (Remplacer par votre vrai numéro sans le +)
const WHATSAPP_NUMBER = "2250797112581";

// ARTICLES & OFFRES EN STOCK (Sans prix)
const ARTICLES_STOCK = [
  {
    id: "art-1",
    titre: "protège de direction de airbag 2022 Tucson",
    categorie: "Pièces Auto",
    image: "/images/airbag.png",
    description: "Pièce destinée au système d’airbag du volant du Hyundai Tucson 2022. Contactez-nous pour vérifier la compatibilité avec votre véhicule et connaître la disponibilité."
  },
  {
    id: "art-2",
    titre: "moteur Santa Fe 2013-2016-2017",
    categorie: "Pièces Auto",
    image: "/images/moteur.jpeg",
    description: "Moteur pour Hyundai Santa Fe, modèles 2013 à 2017. Contactez-nous pour vérifier la compatibilité avec votre véhicule, connaître la disponibilité et obtenir un devis."
  },
  {
    id: "art-3",
    titre: "moteur Santa Fe 2.4-2017-2018-2019-2020",
    categorie: "Véhicules",
    image: "/images/SantaFe.jpeg",
    description: "Hyundai Santa Fe disponible à la vente. Contactez-nous sur WhatsApp pour obtenir le prix, connaître les caractéristiques du véhicule et organiser une visite."
  },
  {
    id: "art-4",
    titre: "état de boîte de Tucson 2022.",
    categorie: "Pièces Auto",
    image: "/images/etat.png",
    description: "Boîte de vitesses pour Hyundai Tucson 2022. Contactez-nous sur WhatsApp pour vérifier la compatibilité avec votre véhicule, connaître la disponibilité et obtenir un devis."
  }
];

export default function HomePage() {
  const [avis, setAvis] = useState<any[]>([]);
  const [promo, setPromo] = useState<any>(null);
  const [showPromo, setShowPromo] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🎠 CAROUSEL HERO
  const [currentSlide, setCurrentSlide] = useState(0);

  // Défilement automatique carrousel (5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Récupération Firebase (Témoignages & Annonces)
  useEffect(() => {
    const qAvis = query(collection(db, "temoignages"), orderBy("dateAjout", "desc"), limit(3));
    const unsubAvis = onSnapshot(qAvis, (snapshot) => {
      setAvis(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const qPromo = query(collection(db, "annonces"), orderBy("dateAjout", "desc"), limit(1));
    const unsubPromo = onSnapshot(qPromo, (snapshot) => {
      if (!snapshot.empty) {
        setPromo(snapshot.docs[0].data());
        setShowPromo(true);
      }
    });

    return () => { unsubAvis(); unsubPromo(); };
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // Redirection vers WhatsApp avec message pré-rempli
  const openWhatsApp = (titreArticle: string) => {
    const message = `Bonjour, je souhaite réserver ou avoir plus d'informations concernant : *${titreArticle}*.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800">
      
      {/* ⚡ BANDEAU PROMO */}
      {promo && showPromo && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 px-4 relative z-50 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs md:text-sm">
            <div className="flex items-center gap-2 md:gap-3 truncate">
              <span className="bg-white text-red-600 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Flash
              </span>
              <p className="font-semibold truncate">
                <span className="font-bold uppercase italic">{promo.titre || promo.nom} :</span> {promo.message}
              </p>
            </div>
            <button 
              onClick={() => setShowPromo(false)} 
              className="ml-2 hover:bg-white/20 rounded-full p-1 transition text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION AVEC SLIDER */}
      <section className="relative min-h-[85vh] lg:h-[80vh] w-full flex items-center overflow-hidden bg-slate-950 py-16 lg:py-0">
        
        {/* CAROUSEL IMAGES */}
        {HERO_SLIDES.map((slideImg, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
              index === currentSlide ? "opacity-50 scale-100" : "opacity-0 scale-105"
            } transform transition-transform duration-[6000ms]`}
            style={{
              backgroundImage: `url(${slideImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* OVERLAY TONS SOMBRES */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10"></div>

        {/* BOUTONS NAVIGATION SLIDER */}
        <button 
          onClick={prevSlide}
          className="absolute left-5 z-30 p-3 rounded-full bg-slate-900/60 text-white hover:bg-red-600 transition border border-white/10 hidden md:flex items-center justify-center backdrop-blur-md"
        >
          ❮
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-5 z-30 p-3 rounded-full bg-slate-900/60 text-white hover:bg-red-600 transition border border-white/10 hidden md:flex items-center justify-center backdrop-blur-md"
        >
          ❯
        </button>

        {/* CONTENU HERO */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-white space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase italic leading-none">
              L'excellence <br/> 
              <span className="text-red-600 inline-block lg:translate-x-1 mt-1">Automobile</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed">
              Vente de véhicules révisés, pièces détachées garanties et entretien mécanique expert à Abidjan.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3.5 pt-2">
              <Link 
                href="/contact" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition uppercase text-xs tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                Prendre RDV
              </Link>
              <Link 
                href="/vehicules" 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-3.5 rounded-xl font-bold transition uppercase text-xs tracking-wider"
              >
                Notre Stock
              </Link>
            </div>
          </div>

          {/* CARTE ANIMATION LOGOS */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[260px] lg:w-64 h-[320px] lg:h-[380px] bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col items-center overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 mb-6 z-10 text-center">
                Marques Partenaires
              </p>
              <div className="relative h-full w-full overflow-hidden">
                <div className="animate-marquee-vertical flex flex-col items-center gap-8 py-2">
                  {["/ton-logo-toyota.png", "/ton-logo-hyundai.png", "/ton-logo-mercedes.png", "/ton-logo-ford.png", "/ton-logo-kia.png"].map((imgSrc, idx) => (
                    <img key={idx} src={imgSrc} alt="Marque" className="w-12 h-12 object-contain brightness-0 invert opacity-60 hover:opacity-100 transition" />
                  ))}
                  {["/ton-logo-toyota.png", "/ton-logo-hyundai.png", "/ton-logo-mercedes.png", "/ton-logo-ford.png", "/ton-logo-kia.png"].map((imgSrc, idx) => (
                    <img key={`dup-${idx}`} src={imgSrc} alt="Marque" className="w-12 h-12 object-contain brightness-0 invert opacity-60" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDICATEURS POINTS SLIDER */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? "w-7 bg-red-600" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* 2. SECTION SERVICES (MÉCANIQUE / PIÈCES / VENTE) */}
      <section className="py-16 md:py-20 px-5 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🔧", title: "Mécanique", text: "Diagnostic électronique poussé et réparations toutes marques.", link: "/garage" },
            { icon: "⚙️", title: "Pièces Auto", text: "Vaste catalogue de pièces d'origine neuves et d'occasion.", link: "/pieces" },
            { icon: "🚗", title: "Vente Auto", text: "Véhicules contrôlés, révisés et garantis au meilleur prix.", link: "/vehicules" }
          ].map((s, i) => (
            <div 
              key={i} 
              className="p-7 bg-white border border-slate-200/80 rounded-2xl hover:border-red-500/80 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-2xl flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition duration-300">
                  {s.icon}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 uppercase italic tracking-tight">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">{s.text}</p>
              </div>
              <Link href={s.link} className="font-bold text-red-600 uppercase text-xs tracking-wider flex items-center gap-1.5 hover:gap-2 transition-all">
                En savoir plus <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

     
        
{/* 3. GRILLE D'ARTICLES ET OFFRES EN STOCK */}
<section className="py-16 md:py-20 bg-slate-900 text-white px-5 md:px-8">
  <div className="max-w-7xl mx-auto">

    {/* EN-TÊTE DE LA SECTION */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-slate-800 pb-6">
      <div>
        <span className="text-red-500 font-extrabold uppercase text-[11px] tracking-widest block mb-2">
          Disponible immédiatement
        </span>

        <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight">
          Nos Articles &{" "}
          <span className="text-red-600">Offres du Moment</span>
        </h2>
      </div>

      <p className="text-slate-400 text-sm max-w-md leading-relaxed">
        Réservez votre article ou demandez un devis instantané directement sur WhatsApp.
      </p>
    </div>

    {/* GRILLE DES ARTICLES */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {ARTICLES_STOCK.map((item) => (
        <article
          key={item.id}
          className="group min-w-0 bg-slate-800/80 rounded-2xl border border-slate-700/70 overflow-hidden hover:border-red-500/80 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1"
        >
          {/* IMAGE : PLUS GRANDE ET BIEN VISIBLE */}
          <div className="relative w-full h-[230px] sm:h-[240px] lg:h-[250px] bg-slate-950 overflow-hidden">
            <img
              src={item.image}
              alt={item.titre}
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
              onError={(e) => {
                const image = e.currentTarget;
                image.style.visibility = "hidden";
              }}
            />

            {/* CATÉGORIE */}
            <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-md tracking-wider shadow-md">
              {item.categorie}
            </span>
          </div>

          {/* INFORMATIONS DE L'ARTICLE */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-extrabold text-base sm:text-lg mb-2 text-white group-hover:text-red-400 transition-colors leading-snug">
              {item.titre}
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5">
              {item.description}
            </p>

            {/* BOUTON TOUJOURS EN BAS */}
            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={() => openWhatsApp(item.titre)}
                className="w-full min-h-12 bg-indigo-800 hover:bg-indigo-600 active:bg-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 text-white font-bold py-3 px-3 rounded-xl transition-all duration-300 text-[11px] sm:text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md shadow-indigo-950/50"
              >
                Réserver sur WhatsApp
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>

  </div>
</section>

      {/* 4. SECTION TÉMOIGNAGES CLIENTS */}
      <section className="py-16 md:py-24 bg-white px-5 md:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest block mb-1">
              Avis Clients
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
              Ils nous font <span className="text-red-600">Confiance</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Découvrez les retours d'expérience de nos clients satisfaits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {!loading && avis.length > 0 ? (
              avis.map((a) => (
                <div 
                  key={a.id} 
                  className="bg-slate-50 p-7 rounded-2xl border border-slate-200/70 hover:border-red-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
                >
                  <div>
                    {/* ÉTOILES SVG ÉLÉGANTES */}
                    <div className="flex gap-1 text-amber-400 mb-4">
                      {Array.from({ length: Number(a.stock) || 5 }).map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-slate-700 italic text-sm leading-relaxed mb-6">
                      "{a.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 border-t border-slate-200/60 pt-4 mt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-black text-sm flex items-center justify-center uppercase shadow-inner">
                      {a.nom?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                        {a.nom || "Client Vérifié"}
                      </h4>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Avis Vérifié
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-12 text-slate-400 italic text-xs">
                {loading ? "Chargement des avis..." : "Aucun avis publié pour le moment."}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}