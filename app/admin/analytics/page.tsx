"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc, 
  writeBatch, 
  getDocs 
} from 'firebase/firestore';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "visites_pages"), orderBy("vues", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          nomPath: docData.nomPath || doc.id,
          vues: docData.vues || 0,
          derniereVisite: docData.derniereVisite ? docData.derniereVisite.toDate() : new Date(),
          derniereIp: docData.derniereIp || docData.ip || "197.234.221.14", // IP fallback
        };
      });
      setAnalytics(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // FILTRAGE SELON LE TEMPS SELECTIONNÉ
  const filteredData = analytics.filter(item => {
    if (timeFilter === 'all') return true;
    
    const now = new Date();
    const itemDate = new Date(item.derniereVisite);
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (timeFilter === 'day') return diffDays <= 1;
    if (timeFilter === 'week') return diffDays <= 7;
    if (timeFilter === 'month') return diffDays <= 30;

    return true;
  });

  const totalVues = filteredData.reduce((acc, curr) => acc + (curr.vues || 0), 0);

  // SUPPRIMER UNE PAGE SPÉCIFIQUE
  const handleDeletePage = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer les données de suivi de cette page ?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "visites_pages", id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

  // PURGER TOUTES LES DONNÉES
  const handleClearAll = async () => {
    if (!confirm("ATTENTION : Cela va réinitialiser l'intégralité du suivi de visites. Continuer ?")) return;
    try {
      const snap = await getDocs(collection(db, "visites_pages"));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans py-4">
      
      {/* EN-TÊTE ET BARRAGE DE FILTRES - CENTRÉS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
        <div>
          <span className="text-red-600 font-black text-xs uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Centre de Suivi & Trafic
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 uppercase italic tracking-tight mt-2">
            Analyse des <span className="text-red-600">Visites & Fréquentation</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Consultez le nombre de vues, les adresses IP récentes et réinitialisez les données si besoin.
          </p>
        </div>

        {/* BOUTONS DE FILTRES TEMPORELS */}
        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
          {[
            { key: 'all', label: 'Toutes les périodes' },
            { key: 'day', label: 'Aujourd\'hui (24h)' },
            { key: 'week', label: 'Cette Semaine (7j)' },
            { key: 'month', label: 'Ce Mois (30j)' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setTimeFilter(filter.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                timeFilter === filter.key
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* COMPTEUR TOTAL & ACTION PURGE */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase">Total Vues (Filtre actif) :</span>
            <span className="bg-blue-950 text-white px-3 py-1 rounded-lg font-black text-sm">
              {totalVues.toLocaleString()}
            </span>
          </div>

          {analytics.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 font-bold text-[11px] uppercase tracking-wider underline hover:no-underline"
            >
              Réinitialiser l'historique complet
            </button>
          )}
        </div>
      </div>

      {/* TABLEAU DES VISITES - CENTRÉ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-12 bg-slate-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16 p-6">
            <p className="text-slate-400 font-extrabold uppercase text-xs tracking-wider">
              Aucune donnée de visite enregistrée pour la période sélectionnée.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-4 px-6 text-center w-16">Rang</th>
                  <th className="py-4 px-6">Page Visitée</th>
                  <th className="py-4 px-6">Dernière IP</th>
                  <th className="py-4 px-6">Dernier Passage</th>
                  <th className="py-4 px-6 text-center">Vues</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredData.map((page, index) => {
                  const pourcentage = totalVues > 0 ? Math.round((page.vues / totalVues) * 100) : 0;

                  return (
                    <tr key={page.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* RANG */}
                      <td className="py-4 px-6 text-center">
                        <span className={`w-8 h-8 rounded-lg inline-flex items-center justify-center font-black text-xs ${
                          index === 0 ? "bg-red-600 text-white shadow-sm" : "bg-slate-100 text-blue-950"
                        }`}>
                          #{index + 1}
                        </span>
                      </td>

                      {/* NOM DE LA PAGE & JAUGE */}
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-blue-950 uppercase italic">
                          {page.nomPath || page.id}
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden max-w-[180px]">
                          <div 
                            className="bg-red-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pourcentage}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* ADRESSE IP */}
                      <td className="py-4 px-6 font-mono text-xs text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {page.derniereIp}
                        </span>
                      </td>

                      {/* DATE DU DERNIER PASSAGE */}
                      <td className="py-4 px-6 text-slate-500 font-medium text-xs">
                        {page.derniereVisite.toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* VUES ET POURCENTAGE */}
                      <td className="py-4 px-6 text-center">
                        <span className="text-base font-black text-red-600 block">
                          {Number(page.vues).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {pourcentage}% du trafic
                        </span>
                      </td>

                      {/* ACTION SUPPRIMER */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          disabled={deletingId === page.id}
                          className="bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 p-2 rounded-lg transition font-bold text-xs"
                          title="Supprimer les stats de cette page"
                        >
                          {deletingId === page.id ? "..." : "🗑️ Supprimer"}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}