"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalVues: 0,
    subscribers: 0,
    publicites: 0,
    topPage: '—'
  });
  
  const [topPages, setTopPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Visites & Analytics
        const visitesSnap = await getDocs(collection(db, "visites_pages"));
        let vuesTotal = 0;
        let highestVue = 0;
        let topPageName = "Accueil";

        visitesSnap.forEach((doc) => {
          const data = doc.data();
          const vues = data.vues || 0;
          vuesTotal += vues;
          if (vues > highestVue) {
            highestVue = vues;
            topPageName = data.nomPath || doc.id;
          }
        });

        // 2. Newsletter Subscribers
        const subsSnap = await getDocs(collection(db, "newsletter_subscribers"));

        // 3. Publicités & Bannières
        const pubsSnap = await getDocs(collection(db, "publicites"));

        setStats({
          totalVues: vuesTotal,
          subscribers: subsSnap.size,
          publicites: pubsSnap.size,
          topPage: topPageName
        });

        // 4. Récupération des 5 pages les plus visitées
        const qAnalytics = query(collection(db, "visites_pages"), orderBy("vues", "desc"), limit(5));
        const analyticsSnap = await getDocs(qAnalytics);
        const pagesList = analyticsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTopPages(pagesList);

      } catch (error) {
        console.error("Erreur lors du chargement des statistiques admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      
      {/* EN-TÊTE DU TABLEAU DE BORD */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-red-100 shadow-sm">
            Panneau de Contrôle Central
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-blue-950">
            Tableau de <span className="text-red-600">Bord</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Gestion du site SERVICES AUTO (Dokui, Abidjan).
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link 
            href="/admin/analytics" 
            className="flex-1 md:flex-none text-center bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition shadow-lg shadow-red-600/20"
          >
            Analytics & Trafic
          </Link>
          <Link 
            href="/admin/pub" 
            className="flex-1 md:flex-none text-center bg-blue-950 hover:bg-blue-900 text-white px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition shadow-lg shadow-blue-950/20"
          >
            Gérer les Pubs
          </Link>
        </div>
      </div>

      {/* GRILLE DES STATISTIQUES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CARTE 1 : VISITES TOTALES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Fréquentation Globale</span>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950">
                {loading ? "..." : stats.totalVues.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm border border-red-100">
              📈
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Page la plus vue : <strong className="text-blue-950">{stats.topPage}</strong></span>
            <Link href="/admin/analytics" className="text-red-600 font-extrabold hover:underline">Détails →</Link>
          </div>
        </div>

        {/* CARTE 2 : NEWSLETTER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Abonnés Newsletter</span>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950">
                {loading ? "..." : stats.subscribers}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-950 flex items-center justify-center font-black text-sm border border-blue-100">
              ✉️
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Emails enregistrés</span>
            <Link href="/admin/newsletter" className="text-blue-950 font-extrabold hover:underline">Consulter →</Link>
          </div>
        </div>

        {/* CARTE 3 : PUBLICITÉS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-red-600 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Campagnes Bannières</span>
              <h3 className="text-2xl sm:text-3xl font-black text-red-600">
                {loading ? "..." : stats.publicites}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm border border-red-100">
              📢
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Publicités actives</span>
            <Link href="/admin/pub" className="text-red-600 font-extrabold hover:underline">Gérer →</Link>
          </div>
        </div>

      </div>

      {/* APERÇU TOP PAGES VISITÉES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-blue-950 uppercase tracking-tight italic">
              Pages les plus <span className="text-red-600">Consultées</span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Classement des pages selon le volume de visites.</p>
          </div>
          <Link href="/admin/analytics" className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700">
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-14 bg-slate-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : topPages.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-xs font-bold uppercase">Aucune donnée de visite pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topPages.map((item, index) => {
              const total = stats.totalVues || 1;
              const percent = Math.round(((item.vues || 0) / total) * 100);

              return (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-950 text-white font-black text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-blue-950 uppercase block">
                        {item.nomPath || item.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{percent}% du trafic total</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-red-600 block">{Number(item.vues || 0).toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">visites</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}