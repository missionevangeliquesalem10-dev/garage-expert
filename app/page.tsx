"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const [avis, setAvis] = useState<any[]>([]);
  const [promo, setPromo] = useState<any>(null);
  const [showPromo, setShowPromo] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      
      {/* BANDEAU PROMO */}
      {promo && showPromo && (
        <div className="bg-blue-600 text-white py-3 px-6 relative z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="bg-white text-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">Flash</span>
              <p className="text-sm font-black uppercase italic truncate">{promo.titre || promo.nom} : {promo.message}</p>
            </div>
            <button onClick={() => setShowPromo(false)} className="hover:bg-white/10 rounded-full p-1">✕</button>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION (RESTE EN NOIR) */}
      <section className="relative min-h-[90vh] lg:h-[85vh] w-full flex items-center overflow-hidden bg-slate-900 py-20 lg:py-0">
        <video 
          ref={videoRef} autoPlay loop muted={isMuted} playsInline 
          className="absolute z-0 min-w-full min-h-full object-cover opacity-60"
        >
          <source src="https://res.cloudinary.com/damkharxh/video/upload/v1767090967/Vid%C3%A9o_Publicitaire_Agence_Voyage_Abidjan_syxaja.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent z-10"></div>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8 text-center lg:text-left">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
              L'excellence <br/> 
              <span className="text-blue-500 inline-block lg:translate-x-2">Automobile</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto lg:mx-0 font-medium">
              Vente de véhicules, vente de pièce auto, entretien expert et pièces garanties à Abidjan.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-black transition uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20">Prendre RDV</Link>
              <Link href="/vehicules" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-2xl font-black transition uppercase text-xs tracking-widest">Notre Stock</Link>
            </div>
          </div>

          {/* ANIMATION DES IMAGES (LOGOS) - DÉSORMAIS VISIBLE SUR MOBILE */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[280px] lg:w-72 h-[350px] lg:h-[450px] bg-white/5 backdrop-blur-2xl rounded-[3rem] lg:rounded-[3.5rem] border border-white/10 p-8 shadow-2xl flex flex-col items-center overflow-hidden">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mb-8 lg:mb-10 z-10 text-center">Nos Marques</p>
              <div className="relative h-full w-full overflow-hidden">
                <div className="animate-marquee-vertical flex flex-col items-center gap-10 lg:gap-14 py-4">
                  {["/ton-logo-toyota.png", "/ton-logo-hyundai.png", "/ton-logo-mercedes.png", "/ton-logo-ford.png", "/ton-logo-kia.png"].map((imgSrc, idx) => (
                    <img key={idx} src={imgSrc} alt="Marque" className="w-12 h-12 lg:w-16 lg:h-16 object-contain brightness-0 invert opacity-60 hover:opacity-100 transition" />
                  ))}
                  {/* Doublon pour boucle infinie */}
                  {["/ton-logo-toyota.png", "/ton-logo-hyundai.png", "/ton-logo-mercedes.png", "/ton-logo-ford.png", "/ton-logo-kia.png"].map((imgSrc, idx) => (
                    <img key={`dup-${idx}`} src={imgSrc} alt="Marque" className="w-12 h-12 lg:w-16 lg:h-16 object-contain brightness-0 invert opacity-60" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button onClick={toggleSound} className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-30 bg-white/10 backdrop-blur-xl p-3 lg:p-4 rounded-full border border-white/30 text-lg lg:text-xl">{isMuted ? "🔇" : "🔊"}</button>
      </section>

      {/* 2. SECTION SERVICES (EN BLANC) */}
      <section className="py-20 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {[
            {icon: "🔧", title: "Mécanique", text: "Diagnostic et réparations toutes marques.", link: "/garage"},
            {icon: "⚙️", title: "Pièces", text: "Vaste choix de pièces neuves et d'occasion.", link: "/pieces"},
            {icon: "🚗", title: "Vente", text: "Véhicules révisés et garantis au meilleur prix.", link: "/vehicules"}
          ].map((s, i) => (
            <div key={i} className="group p-8 lg:p-10 bg-gray-50 border border-gray-100 rounded-[2.5rem] lg:rounded-[3rem] hover:border-blue-500 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
              <div className="text-4xl lg:text-5xl mb-6">{s.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter">{s.title}</h3>
              <p className="text-gray-500 mb-6 leading-relaxed text-sm lg:text-base">{s.text}</p>
              <Link href={s.link} className="font-black text-blue-600 uppercase text-xs tracking-widest flex items-center gap-2">Découvrir <span>→</span></Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION TÉMOIGNAGES (EN BLANC / GRIS CLAIR) */}
      <section className="py-20 lg:py-24 bg-slate-50 px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
              Ils nous font <span className="text-blue-600">Confiance</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {!loading && avis.length > 0 ? (
              avis.map((a) => (
                <div key={a.id} className="bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-lg transition relative group">
                  <div className="absolute -top-4 -left-4 w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl shadow-lg">“</div>
                  <div className="flex mb-4 lg:mb-6 text-yellow-400 text-xs lg:text-sm">
                    {Array.from({ length: Number(a.stock) || 5 }).map((_, i) => <span key={i}>⭐</span>)}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed mb-6 lg:mb-8 text-base lg:text-lg">"{a.message}"</p>
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-black uppercase text-sm lg:text-base">
                        {a.nom?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase text-xs lg:text-sm tracking-widest">{a.nom || "Client"}</p>
                      <p className="text-[9px] lg:text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em]">Avis Vérifié</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-10 text-gray-400 italic text-sm">
                {loading ? "Chargement des avis..." : "Aucun avis pour le moment."}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}