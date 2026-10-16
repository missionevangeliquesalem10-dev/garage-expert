"use client";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// 📱 NUMÉRO WHATSAPP POUR QUESTIONS SUR UN ARTICLE
const WHATSAPP_NUMBER = "2250797112581";

export default function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    const q = query(collection(db, "articles"), orderBy("dateAjout", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openArticleModal = (post: any) => {
    setSelectedPost(post);
  };

  const closeArticleModal = () => {
    setSelectedPost(null);
  };

  const contactOnWhatsApp = (postTitle: string) => {
    const message = `Bonjour, j'ai lu votre article "${postTitle}" et j'aimerais avoir plus de conseils ou prendre un rdv.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Article à la Une (le premier publié) et les suivants
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-36 pb-20 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* EN-TÊTE BLOG */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-sm border border-red-100">
            Le Blog & Guide Auto
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-blue-950 leading-tight">
            Conseils <span className="text-red-600">Mécaniques</span> & Entretien
          </h1>
          <div className="h-1.5 w-20 bg-red-600 mx-auto mt-4 rounded-full mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Retrouvez tous nos conseils d'experts pour prendre soin de votre véhicule, prolonger la durée de vie de votre moteur et rouler en toute sécurité.
          </p>
        </div>

        {/* CONTENU EN COURS DE CHARGEMENT (SKELETONS) */}
        {loading ? (
          <div className="space-y-10">
            <div className="h-96 bg-slate-200/70 animate-pulse rounded-3xl w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-slate-200/70 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          /* AUCUN ARTICLE */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              📚
            </div>
            <h3 className="text-xl font-extrabold text-blue-950 uppercase mb-2">Aucun article publié</h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Nos techniciens préparent de nouveaux conseils mécaniques. Revenez très bientôt !
            </p>
          </div>
        ) : (
          /* LISTE D'ARTICLES */
          <div className="space-y-12">
            
            {/* ARTICLE À LA UNE (FEATURED HERO) */}
            {featuredArticle && (
              <div 
                onClick={() => openArticleModal(featuredArticle)}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto bg-slate-900 relative overflow-hidden">
                  <img 
                    src={featuredArticle.image || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80"} 
                    alt={featuredArticle.nom} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-95"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80";
                    }}
                  />
                  <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    À la Une
                  </span>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-red-600 block mb-2">
                      Conseil Pro
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-blue-950 group-hover:text-red-600 transition leading-snug mb-4">
                      {featuredArticle.nom}
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4 font-normal mb-6">
                      {featuredArticle.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-950 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        A
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-950">Expert Garage</p>
                        <p className="text-[10px] text-slate-400 font-medium">Recommandation certifiée</p>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Lire l'article ➔
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AUTRES ARTICLES EN GRILLE */}
            {otherArticles.length > 0 && (
              <div>
                <h3 className="text-xl font-black uppercase text-blue-950 tracking-tight mb-6 pb-2 border-b border-slate-200">
                  Tous nos <span className="text-red-600">Articles</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherArticles.map((post) => (
                    <article 
                      key={post.id} 
                      onClick={() => openArticleModal(post)}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* VISUEL ARTICLE */}
                        <div className="h-48 bg-slate-900 relative overflow-hidden">
                          <img 
                            src={post.image || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80"} 
                            alt={post.nom} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80";
                            }}
                          />
                          <span className="absolute top-3 left-3 bg-blue-950/90 backdrop-blur-md text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                            Maintien & Astuces
                          </span>
                        </div>

                        {/* TEXTE ARTICLE */}
                        <div className="p-6">
                          <h2 className="text-lg font-extrabold text-blue-950 group-hover:text-red-600 transition line-clamp-2 leading-snug mb-3">
                            {post.nom}
                          </h2>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-normal">
                            {post.message}
                          </p>
                        </div>
                      </div>

                      {/* PIED DE CARTE */}
                      <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 pt-3">
                          <div className="w-7 h-7 bg-slate-100 text-blue-950 rounded-full flex items-center justify-center font-extrabold text-[10px] border border-slate-200">
                            A
                          </div>
                          <span className="text-[11px] font-bold text-slate-600">L'Équipe Garage</span>
                        </div>

                        <span className="text-xs font-bold text-red-600 pt-3 group-hover:translate-x-0.5 transition-transform">
                          Lire ➔
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL DE LECTURE D'ARTICLE COMPLET */}
      {selectedPost && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl border border-slate-100 relative animate-fadeIn">
            
            {/* BOUTON FERMER */}
            <button 
              onClick={closeArticleModal}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/60 text-white hover:bg-red-600 transition flex items-center justify-center backdrop-blur-md"
              aria-label="Fermer"
            >
              ✕
            </button>

            {/* BANNIÈRE IMAGE */}
            <div className="h-64 sm:h-80 bg-slate-900 relative">
              <img 
                src={selectedPost.image || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80"} 
                alt={selectedPost.nom} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2">
                  Conseil Expert
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase italic leading-tight">
                  {selectedPost.nom}
                </h2>
              </div>
            </div>

            {/* CONTENU DE L'ARTICLE */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-blue-950 text-white rounded-full flex items-center justify-center font-extrabold text-sm uppercase">
                  A
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-950 uppercase">Rédigé par le Chef d'Atelier</p>
                  <p className="text-[10px] text-slate-400 font-medium">Article certifié par nos mécaniciens</p>
                </div>
              </div>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal space-y-4 whitespace-pre-line">
                {selectedPost.message}
              </div>

              {/* ACTION ET CONTACT */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <div>
                  <p className="font-extrabold text-blue-950 text-sm">Une question sur cet article ?</p>
                  <p className="text-slate-500 text-xs">Consultez directement un mécanicien pour votre véhicule.</p>
                </div>
                <button 
                  onClick={() => contactOnWhatsApp(selectedPost.nom)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md shrink-0"
                >
                  Question sur WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}