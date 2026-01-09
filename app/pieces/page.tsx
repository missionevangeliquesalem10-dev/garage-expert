"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

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

  // --- LOGIQUE DE FILTRE CORRIGÉE ---
  const piecesFiltrees = catSelectionnee === "Tous" 
    ? pieces 
    : pieces.filter(p => {
        // On compare en mettant tout en minuscules pour éviter les erreurs de frappe
        return p.categorie?.toLowerCase().trim() === catSelectionnee.toLowerCase().trim();
      });

  return (
    // J'ai mis bg-slate-950 pour correspondre à ton style "Page Noire"
    <div className="bg-slate-950 min-h-screen pt-32 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-8">
        
        {/* Barre Latérale */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-black mb-6 text-white border-b border-white/10 pb-4 uppercase tracking-tighter italic">
            Catégories
          </h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatSelectionnee(cat)}
                className={`text-left px-4 py-3 rounded-2xl transition-all duration-300 font-bold uppercase text-[10px] tracking-widest ${
                  catSelectionnee === cat 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Grille des Produits */}
        <main className="flex-1">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Pièces Détachées</h1>
            <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mt-2">Inventaire Premium</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3].map(n => (
                 <div key={n} className="h-80 bg-white/5 animate-pulse rounded-[2rem]"></div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {piecesFiltrees.map((piece) => (
                <div key={piece.id} className="group bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 hover:border-blue-500 transition-all duration-500 shadow-sm">
                  <div className="h-56 bg-slate-800 relative overflow-hidden">
                    <img 
                      src={piece.image || "https://via.placeholder.com/400"} 
                      alt={piece.nom} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90" 
                    />
                    {piece.stock && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Stock: {piece.stock}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{piece.categorie}</span>
                    <h3 className="text-lg font-black text-white mt-2 uppercase tracking-tight">{piece.nom}</h3>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-xl font-black text-white">
                        {piece.prix ? Number(piece.prix).toLocaleString() : "---"} <span className="text-xs text-gray-500">FCFA</span>
                      </span>
                      <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && piecesFiltrees.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                Aucune pièce en "{catSelectionnee}" pour le moment.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}