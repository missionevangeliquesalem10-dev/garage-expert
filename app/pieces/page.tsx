"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// 📱 NUMÉRO WHATSAPP DU GARAGE (Sans le +)
const WHATSAPP_NUMBER = "2250797112581";

const categories = ["Tous", "Moteur", "Freinage", "Éclairage", "Carrosserie", "Électronique"];

export default function PiecesPage() {
  const [pieces, setPieces] = useState<any[]>([]);
  const [catSelectionnee, setCatSelectionnee] = useState("Tous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "pieces"), orderBy("dateAjout", "desc"));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPieces(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // FILTRE DE CATÉGORIE
  const piecesFiltrees = catSelectionnee === "Tous" 
    ? pieces 
    : pieces.filter(p => {
        return p.categorie?.toLowerCase().trim() === catSelectionnee.toLowerCase().trim();
      });

  // REDIRECTION WHATSAPP AVEC MESSAGE PERSONNALISÉ
  const openWhatsApp = (nomPiece: string, categoriePiece?: string) => {
    const detailCat = categoriePiece ? ` (Catégorie: ${categoriePiece})` : '';
    const message = `Bonjour, je souhaite vérifier la disponibilité et obtenir un devis pour la pièce suivante : *${nomPiece}*${detailCat}.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-36 pb-20 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-5 md:px-8">
        
        {/* BARRE LATÉRALE - FILTRES (COMPACTE) */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm sticky top-28">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider">
              Catégories
            </h2>
            <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatSelectionnee(cat)}
                  className={`text-left px-3.5 py-2.5 rounded-xl transition-all duration-300 font-bold uppercase text-[11px] tracking-wider whitespace-nowrap shrink-0 ${
                    catSelectionnee === cat 
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-blue-950"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL - GRILLE DES PIÈCES */}
        <main className="flex-1">
          <div className="mb-8">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest block mb-1">
              Pièces Détachées & Accessoires
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
              Catalogue <span className="text-blue-950">Pièces Auto</span>
            </h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-64 bg-slate-200/60 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {piecesFiltrees.map((piece) => (
                <div 
                  key={piece.id} 
                  onClick={() => openWhatsApp(piece.nom, piece.categorie)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* VISUEL PIÈCE (HAUTEUR RÉDUITE & OPTIMISÉE) */}
                    <div className="h-36 sm:h-44 bg-slate-100 relative overflow-hidden">
                      <img 
                        src={piece.image || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80"} 
                        alt={piece.nom} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        onError={(e) => { 
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80'; 
                      }}
                      />
                      {piece.stock && (
                        <span className="absolute top-2.5 right-2.5 bg-blue-950/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                          Stock: {piece.stock}
                        </span>
                      )}
                    </div>
                    
                    {/* INFORMATIONS COMPACTES */}
                    <div className="p-4 sm:p-5">
                      <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-1">
                        {piece.categorie || "Pièce Auto"}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-950 transition line-clamp-2 leading-snug">
                        {piece.nom}
                      </h3>
                    </div>
                  </div>
                  
                  {/* BOUTON WHATSAPP ÉLÉGANT EN BAS */}
                  <div className="p-4 sm:p-5 pt-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openWhatsApp(piece.nom, piece.categorie);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                      </svg>
                      <span className="truncate">Commander / WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ÉTAT VIDE */}
          {!loading && piecesFiltrees.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
              <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">
                Aucune pièce disponible dans la catégorie "{catSelectionnee}" pour le moment.
              </p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}