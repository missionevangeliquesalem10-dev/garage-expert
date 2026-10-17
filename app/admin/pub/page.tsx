"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

export default function AdminPublicite() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Formulaire d'annonceur
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [imageAd, setImageAd] = useState('');
  const [typeLien, setTypeLien] = useState<'site' | 'whatsapp'>('whatsapp');
  const [lienAd, setLienAd] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('2250700000000');
  const [formatAd, setFormatAd] = useState<'horizontal' | 'vertical' | 'popup' | 'marquee'>('horizontal');

  // Optimisation d'URL Cloudinary
  const getOptimizedUrl = (url: string) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
  };

  // 1. Récupération des pubs en temps réel
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "publicites"), (snap) => {
      setAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 2. Upload de l'image sur Cloudinary depuis l'ordinateur
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'garage_preset');

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'damkharxh';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageAd(data.secure_url);
      } else {
        alert("Erreur lors de l'envoi de l'image. Vérifiez votre preset Cloudinary.");
      }
    } catch (err) {
      console.error("Erreur Cloudinary:", err);
      alert("Impossible de télécharger l'image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // 3. Soumission du formulaire
  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageAd) {
      alert("Veuillez télécharger une image de bannière.");
      return;
    }

    setLoading(true);
    const targetLink = typeLien === 'whatsapp' 
      ? `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(nomEntreprise)}`
      : lienAd;

    try {
      await addDoc(collection(db, "publicites"), {
        nomEntreprise,
        imageAd,
        lienAd: targetLink,
        formatAd,
        active: true,
        createdAt: serverTimestamp()
      });

      // Réinitialisation
      setNomEntreprise('');
      setImageAd('');
      setLienAd('');
      alert("Annonce publicitaire publiée avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la publicité.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Activer/Désactiver une pub
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "publicites", id), { active: !currentStatus });
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Suppression
  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette publicité ?")) {
      await deleteDoc(doc(db, "publicites", id));
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'popup':
        return <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Pop-up Intégral</span>;
      case 'vertical':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Bannière Verticale</span>;
      case 'marquee':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Bande Déroulante</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Bannière Horizontale</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 font-sans space-y-8">
      
      {/* EN-TÊTE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-red-600 font-black text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block mb-2 border border-red-100">
            Régie & Marketing
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-blue-950">
            Gestion des <span className="text-red-600">Publicités & Bannières</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Programmez vos bannières partenaires, bannières déroulantes et fenêtres pop-up sur le site.
          </p>
        </div>

        <div className="bg-blue-950 text-white px-5 py-3 rounded-xl flex items-center gap-3">
          <span className="text-xs uppercase font-extrabold text-slate-300">Annonces Actives</span>
          <span className="text-xl font-black text-red-500">{ads.filter(a => a.active !== false).length}</span>
        </div>
      </div>

      {/* DISPOSITION PRINCIPALE : À GAUCHE LES PUBS / À DROITE LE FORMULAIRE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SECTION GAUCHE : PUBLICATIONS ACTIVES (7 COLONNES) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black uppercase italic text-blue-950 mb-1 flex items-center gap-2">
              <span className="text-red-600">🎯</span> Publicités & Campagnes Actives
            </h2>
            <p className="text-slate-500 text-xs mb-6">Aperçu en temps réel des affichages programmés sur le site.</p>

            {ads.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-extrabold uppercase text-xs tracking-wider">
                  Aucune publicité enregistrée pour le moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <div 
                    key={ad.id} 
                    className={`p-4 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      ad.active !== false ? "bg-white border-slate-200 hover:border-red-600 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* PREVIEW IMAGE */}
                      <div className="relative w-28 h-16 bg-slate-100 rounded-lg overflow-hidden border shrink-0">
                        <img 
                          src={getOptimizedUrl(ad.imageAd)} 
                          alt={ad.nomEntreprise}
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm uppercase text-blue-950 truncate max-w-[180px]">
                            {ad.nomEntreprise}
                          </h3>
                          {getFormatBadge(ad.formatAd)}
                        </div>

                        <a 
                          href={ad.lienAd} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-red-600 hover:underline font-semibold block truncate max-w-[220px]"
                        >
                          🔗 {ad.lienAd}
                        </a>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <button
                        onClick={() => toggleActive(ad.id, ad.active !== false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                          ad.active !== false 
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        }`}
                      >
                        {ad.active !== false ? "● En ligne" : "○ Masquée"}
                      </button>

                      <button 
                        onClick={() => handleDelete(ad.id)} 
                        className="bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 p-2 rounded-lg transition font-bold text-xs"
                        title="Supprimer la publicité"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION DROITE : FORMULAIRE DE CRÉATION (5 COLONNES) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
          <h2 className="text-lg font-black uppercase italic text-blue-950 mb-1 flex items-center gap-2">
            <span className="text-red-600">➕</span> Nouvelle Publicité
          </h2>
          <p className="text-slate-500 text-xs mb-6">Remplissez les détails et téléchargez la bannière depuis votre ordinateur.</p>

          <form onSubmit={handleAddAd} className="space-y-4">
            
            {/* 1. NOM ENTREPRISE */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                Nom de l'Annonceur / Entreprise
              </label>
              <input 
                type="text"
                placeholder="Ex: TotalEnergies Côte d'Ivoire" 
                className="w-full border border-slate-200 p-3 rounded-xl focus:border-red-600 focus:outline-none transition text-xs font-semibold text-blue-950"
                value={nomEntreprise}
                onChange={e => setNomEntreprise(e.target.value)}
                required
              />
            </div>

            {/* 2. FORMAT D'AFFICHAGE */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                Format & Emplacement Publicitaire
              </label>
              <select
                value={formatAd}
                onChange={(e) => setFormatAd(e.target.value as any)}
                className="w-full border border-slate-200 p-3 rounded-xl focus:border-red-600 focus:outline-none transition text-xs font-bold text-blue-950 bg-slate-50"
              >
                <option value="horizontal">🖼️ Bannière Horizontale (In-Page)</option>
                <option value="vertical">📱 Bannière Verticale (Sidebar)</option>
                <option value="popup">🚨 Fenêtre Pop-up (Ouverture du site)</option>
                <option value="marquee">🔄 Bande Déroulante (Marquee Continuel)</option>
              </select>
            </div>

            {/* 3. UPLOAD D'IMAGE DEPUIS LE PC */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                Image / Visuel de la publicité (Depuis votre PC)
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-950 file:text-white hover:file:bg-red-600 transition cursor-pointer border border-slate-200 p-1.5 rounded-xl"
              />
              {uploadingImage && (
                <p className="text-[10px] text-red-600 font-bold uppercase mt-1 animate-pulse">
                  Chargement de l'image sur le serveur Cloudinary...
                </p>
              )}
              {imageAd && (
                <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-slate-200">
                  <img src={imageAd} alt="Prévisualisation" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* 4. REDIRECTION (SITE OU WHATSAPP) */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1">
                Type de Redirection
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setTypeLien('whatsapp')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border ${
                    typeLien === 'whatsapp' ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  💬 WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setTypeLien('site')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border ${
                    typeLien === 'site' ? "bg-blue-950 text-white border-blue-950" : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  🌐 Lien Web
                </button>
              </div>

              {typeLien === 'whatsapp' ? (
                <input 
                  type="text"
                  placeholder="Numéro WhatsApp (ex: 2250700000000)" 
                  className="w-full border border-slate-200 p-3 rounded-xl focus:border-red-600 focus:outline-none transition text-xs font-semibold text-blue-950"
                  value={whatsappPhone}
                  onChange={e => setWhatsappPhone(e.target.value)}
                  required
                />
              ) : (
                <input 
                  type="url"
                  placeholder="https://site-partenaire.com" 
                  className="w-full border border-slate-200 p-3 rounded-xl focus:border-red-600 focus:outline-none transition text-xs font-semibold text-blue-950"
                  value={lienAd}
                  onChange={e => setLienAd(e.target.value)}
                  required
                />
              )}
            </div>

            {/* BOUTON SOUMISSION */}
            <button 
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-extrabold uppercase tracking-wider transition shadow-lg shadow-red-600/20 text-xs mt-2"
            >
              {loading ? "Enregistrement..." : "Publier la Publicité"}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}