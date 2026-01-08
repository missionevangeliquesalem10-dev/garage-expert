// app/garage/page.tsx
import Link from 'next/link';

const services = [
  {
    id: 1,
    titre: "Entretien & Vidange",
    description: "Révision complète, changement d'huile, filtres et mise à niveau des liquides.",
    prix: "À partir de 30 000 FCFA",
    image: "🔧"
  },
  {
    id: 5, // Nouveau Service
    titre: "Révision Générale",
    description: "Contrôle technique approfondi de 50 points de sécurité pour une sérénité totale sur la route.",
    prix: "À partir de 45 000 FCFA",
    image: "📋"
  },
  {
    id: 6, // Nouveau Service
    titre: "Réparation Totale",
    description: "Remise à neuf complète : moteur, transmission, carrosserie et trains roulants.",
    prix: "Sur Devis Expert",
    image: "🏗️"
  },
  {
    id: 2,
    titre: "Diagnostic Électronique",
    description: "Lecture des codes défauts avec valise de diagnostic pour identifier les pannes.",
    prix: "15 000 FCFA",
    image: "💻"
  },
  {
    id: 3,
    titre: "Système de Freinage",
    description: "Remplacement des plaquettes, disques et contrôle du liquide de frein.",
    prix: "Sur devis",
    image: "🛑"
  },
  {
    id: 4,
    titre: "Pneumatiques",
    description: "Montage, équilibrage et parallélisme de vos pneus toutes marques.",
    prix: "À partir de 7 000 FCFA",
    image: "🛞"
  }
];

export default function GaragePage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de page */}
        <div className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">
            L'Atelier <span className="text-blue-600">Expert</span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">
            De la simple vidange à la restauration complète de votre moteur, notre équipe déploie tout son savoir-faire pour garantir la performance et la longévité de votre véhicule.
          </p>
        </div>

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500 flex flex-col">
              <div className="text-5xl mb-6 group-hover:scale-110 transition duration-300">{service.image}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">{service.titre}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">
                {service.description}
              </p>
              <div className="pt-6 border-t border-gray-50">
                <p className="text-blue-600 font-black mb-6 uppercase text-sm tracking-widest">{service.prix}</p>
                <Link 
                  href="/contact" 
                  className="block text-center bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-lg shadow-slate-100"
                >
                  Réserver ou Devis
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Section Assurance/Qualité / Urgence */}
        <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden group">
            {/* Décoration de fond */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
            <div>
              <h2 className="text-3xl font-black text-white mb-4 uppercase italic">Besoin d'une réparation <span className="text-blue-500 text-4xl leading-none">urgente</span> ?</h2>
              <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">
                Panne moteur, batterie HS ou accident ? Nos experts interviennent rapidement. Votre sécurité n'attend pas.
              </p>
            </div>
            <a 
              href="tel:+2250797112581" 
              className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 text-lg shadow-2xl shadow-blue-900/40"
            >
              Appeler le 07 97 11 25 81
            </a>
          </div>
        </div>

        {/* Note sur la transparence */}
        <p className="mt-10 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          ⭐ Pièces garanties constructeurs • Devis gratuit • Transparence totale
        </p>

      </div>
    </div>
  );
}