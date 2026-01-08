"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      
      {/* --- SECTION HERO (En-tête) --- */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover" 
            alt="Garage Background" 
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
            L'Art de la <br/> <span className="text-blue-500">Performance</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Plus qu'un simple garage, nous sommes les gardiens de votre passion automobile depuis plus de 10 ans.
          </p>
        </div>
      </section>

      {/* --- SECTION HISTOIRE & VALEURS --- */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-50 rounded-[3rem] rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80" 
              alt="Notre atelier" 
              className="relative rounded-[3rem] shadow-2xl object-cover h-[500px] w-full border-8 border-white"
            />
          </div>

          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Notre ADN</h2>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-8 leading-none">
              Expertise technique <br/> & Transparence totale
            </h3>
            <div className="space-y-6 text-gray-500 leading-relaxed italic">
              <p>
                Fondé par des passionnés de mécanique, notre établissement s'est construit sur une promesse simple : traiter chaque véhicule comme s'il était le nôtre.
              </p>
              <p>
                Que vous veniez pour une révision de routine, l'achat d'un véhicule d'exception ou une pièce rare, notre équipe d'experts certifiés met son savoir-faire au service de votre sécurité et de votre plaisir de conduire.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 mt-12">
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
                  <Counter target="12" suffix="+" />
                </p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">Années d'expérience</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
                  <Counter target="2.5" suffix="k" />
                </p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">Clients satisfaits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION SERVICES --- */}
      <section className="py-24 bg-slate-50 border-y border-gray-100 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Pourquoi nous choisir ?</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "QUALITÉ PREMIUM", desc: "Nous n'utilisons que des pièces certifiées et des outils de diagnostic de dernière génération.", icon: "💎" },
              { title: "CONSEILS EXPERTS", desc: "Chaque client bénéficie d'un accompagnement personnalisé pour ses projets d'achat.", icon: "🤝" },
              { title: "RAPIDITÉ", desc: "Votre temps est précieux. Nous optimisons nos interventions sans jamais sacrifier la qualité.", icon: "⚡" }
            ].map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="text-4xl mb-6">{v.icon}</div>
                <h4 className="text-lg font-black uppercase mb-4">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium italic">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION CTA --- */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-200">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase italic tracking-tighter">
            Prêt à rouler avec nous ?
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
            Contactez notre équipe pour un devis gratuit ou venez découvrir notre stock en concession.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 px-12 py-5 rounded-2xl font-black transition uppercase text-sm tracking-widest">
              Prendre RDV
            </Link>
            <Link href="/vehicules" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-slate-900 px-12 py-5 rounded-2xl font-black transition uppercase text-sm tracking-widest text-white">
              Voir le Stock
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}