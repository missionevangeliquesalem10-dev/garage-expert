"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "visites_pages"), orderBy("vues", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnalytics(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalVues = analytics.reduce((acc, curr) => acc + (curr.vues || 0), 0);

  return (
    <div className="space-y-8 font-sans">
      
      {/* EN-TÊTE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-red-600 font-black text-xs uppercase tracking-widest block mb-1">
            Statistiques & Fréquentation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 uppercase italic tracking-tight">
            Analyse des <span className="text-red-600">Pages Visitées</span>
          </h1>
        </div>

        <div className="bg-blue-950 text-white px-5 py-3 rounded-xl flex items-center gap-3">
          <span className="text-xs uppercase font-extrabold text-slate-300">Total Vues Cumulées</span>
          <span className="text-xl font-black text-red-500">{totalVues.toLocaleString()}</span>
        </div>
      </div>

      {/* RÉSULTATS DES PAGES */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-20 bg-slate-200/70 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : analytics.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6">
          <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">
            Aucune visite enregistrée pour le moment. Naviguez sur votre site pour commencer le suivi !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {analytics.map((page, index) => {
            const pourcentage = totalVues > 0 ? Math.round((page.vues / totalVues) * 100) : 0;

            return (
              <div 
                key={page.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    index === 0 ? "bg-red-600 text-white shadow-md shadow-red-600/30" : "bg-slate-100 text-blue-950"
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-blue-950 uppercase italic">
                      Page : {page.nomPath || page.id}
                    </h3>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden max-w-md">
                      <div 
                        className="bg-red-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pourcentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Part du trafic</span>
                    <span className="text-xs font-black text-blue-950">{pourcentage}%</span>
                  </div>

                  <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nombre de vues</span>
                    <span className="text-lg font-black text-red-600">{Number(page.vues || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}