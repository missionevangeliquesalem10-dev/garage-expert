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
    // 1. On utilise "dateAjout" pour correspondre à ton AdminInventaire
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

  const piecesFiltrees = catSelectionnee === "Tous" 
    ? pieces 
    : pieces.filter(p => p.categorie === catSelectionnee);

  return (
    <div className="bg-white min-h-screen pt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-8">
        
        {/* Barre Latérale */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-black mb-6 text-slate-900 border-b pb-4 uppercase tracking-tighter italic">Catégories</h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatSelectionnee(cat)}
                className={`text-left px-4 py-3 rounded-2xl transition-all duration-300 font-bold uppercase text-[10px] tracking-widest ${
                  catSelectionnee === cat 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
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
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Pièces Détachées</h1>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2">Inventaire mis à jour</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3].map(n => (
                 <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-[2rem]"></div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {piecesFiltrees.map((piece) => (
                <div key={piece.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-blue-500 transition-all duration-500 shadow-sm hover:shadow-2xl">
                  <div className="h-56 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={piece.image || "https://via.placeholder.com/400"} 
                      alt={piece.nom} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    />
                    {piece.stock && (
                      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Stock: {piece.stock}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{piece.categorie || "Pièce"}</span>
                    <h3 className="text-lg font-black text-slate-900 mt-2 uppercase tracking-tight">{piece.nom}</h3>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900">
                          {piece.prix ? Number(piece.prix).toLocaleString() : "---"} <span className="text-xs">FCFA</span>
                        </span>
                      </div>
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="font-bold">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && piecesFiltrees.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Aucune pièce trouvée</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}