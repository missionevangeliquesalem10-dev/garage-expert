"use client";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "articles"), orderBy("dateAjout", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-20 text-center italic">Chargement des conseils...</div>;

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-4 text-center">CONSEILS MÉCANIQUES</h1>
        <p className="text-gray-500 text-center mb-12">L'expertise de votre garage pour entretenir votre véhicule.</p>

        <div className="grid gap-12">
          {articles.map((post) => (
            <article key={post.id} className="grid md:grid-cols-2 gap-8 items-center border-b pb-12">
              <div className="h-72 rounded-3xl overflow-hidden shadow-xl">
                <img src={post.image} alt={post.nom} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Conseil Expert</span>
                <h2 className="text-3xl font-bold mt-2 mb-4 text-slate-900">{post.nom}</h2>
                <p className="text-gray-600 leading-relaxed line-clamp-4 mb-6">
                  {post.message}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold">A</div>
                  <p className="text-sm font-bold text-slate-800">Par l'Administrateur</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}