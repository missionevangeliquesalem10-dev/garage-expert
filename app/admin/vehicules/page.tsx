"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';

interface Vehicule {
  id?: string;
  nom?: string;
  marque?: string;
  modele?: string;
  prix: number | string;
  annee?: string;
  km?: string | number;
  carburant?: string;
  categorie?: string;
  image: string; // Image principale
  images?: string[]; // Galerie d'images secondaires
  message?: string;
  dateAjout?: any;
}

const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique"];

export default function AdminVehiculesPage() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modale (Ajout / Modification)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Formulaire local matching Firestore
  const [formData, setFormData] = useState<Vehicule>({
    nom: '',
    marque: '',
    modele: '',
    prix: '',
    annee: '',
    km: '',
    carburant: 'Essence',
    categorie: 'Occasion',
    image: '',
    images: [],
    message: ''
  });

  // 1. Récupération des véhicules depuis Firebase
  useEffect(() => {
    const q = query(collection(db, "vehicules"), orderBy("dateAjout", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Vehicule[];
      setVehicules(data);
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore vehicules:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Ouvrir modale pour ajout
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      nom: '',
      marque: '',
      modele: '',
      prix: '',
      annee: new Date().getFullYear().toString(),
      km: '',
      carburant: 'Essence',
      categorie: 'Occasion',
      image: '',
      images: [],
      message: ''
    });
    setIsModalOpen(true);
  };

  // Ouvrir modale pour modification
  const handleOpenEditModal = (auto: Vehicule) => {
    setEditingId(auto.id || null);
    setFormData({
      nom: auto.nom || '',
      marque: auto.marque || '',
      modele: auto.modele || '',
      prix: auto.prix || '',
      annee: auto.annee || '',
      km: auto.km || '',
      carburant: auto.carburant || 'Essence',
      categorie: auto.categorie || 'Occasion',
      image: auto.image || '',
      images: Array.isArray(auto.images) ? auto.images : (auto.image ? [auto.image] : []),
      message: auto.message || ''
    });
    setIsModalOpen(true);
  };

  // Upload image principale sur Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'garage_preset');

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'damkharxh';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const resData = await res.json();
      if (resData.secure_url) {
        setFormData(prev => {
          const currentImages = prev.images || [];
          const updatedImages = currentImages.includes(resData.secure_url) 
            ? currentImages 
            : [resData.secure_url, ...currentImages];

          return { 
            ...prev, 
            image: resData.secure_url,
            images: updatedImages
          };
        });
      } else {
        alert("Erreur lors de l'envoi de l'image.");
      }
    } catch (err) {
      console.error("Erreur Cloudinary:", err);
      alert("Échec de l'upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload d'images secondaires multiples pour la galerie
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'damkharxh';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'garage_preset';

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: data,
        });
        const resData = await res.json();
        if (resData.secure_url) {
          uploadedUrls.push(resData.secure_url);
        }
      } catch (err) {
        console.error("Erreur upload photo galerie:", err);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        // Si l'image principale n'existait pas encore, on prend la 1ère de la galerie
        image: prev.image || uploadedUrls[0],
        images: [...(prev.images || []), ...uploadedUrls]
      }));
    }

    setUploadingGallery(false);
  };

  // Supprimer une photo de la galerie
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData(prev => {
      const updatedList = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updatedList,
        // Si la photo principale était celle supprimée, on réattribue la 1ère restante
        image: updatedList[0] || ''
      };
    });
  };

  // Soumission (Ajout ou Mise à jour)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom && (!formData.marque || !formData.modele)) {
      alert("Le nom ou la marque/modèle du véhicule est requis.");
      return;
    }

    try {
      const displayName = formData.nom || `${formData.marque || ''} ${formData.modele || ''}`.trim();
      const galleryList = formData.images && formData.images.length > 0 
        ? formData.images 
        : (formData.image ? [formData.image] : []);

      const payload = {
        nom: displayName,
        marque: formData.marque || '',
        modele: formData.modele || '',
        prix: Number(formData.prix) || 0,
        annee: formData.annee || '',
        km: formData.km || '',
        carburant: formData.carburant || 'Essence',
        categorie: formData.categorie || 'Occasion',
        image: formData.image || galleryList[0] || '',
        images: galleryList,
        message: formData.message || '',
      };

      if (editingId) {
        // Modification
        await updateDoc(doc(db, "vehicules", editingId), payload);
      } else {
        // Création
        await addDoc(collection(db, "vehicules"), {
          ...payload,
          dateAjout: serverTimestamp()
        });
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur enregistrement véhicule:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  // Suppression
  const handleDelete = async (id: string, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule : "${nom}" ?`)) {
      try {
        await deleteDoc(doc(db, "vehicules", id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Impossible de supprimer le véhicule.");
      }
    }
  };

  // Filtrage par recherche
  const filteredVehicules = vehicules.filter(auto => {
    const searchTarget = `${auto.nom || ''} ${auto.marque || ''} ${auto.modele || ''}`.toLowerCase();
    return searchTarget.includes(search.toLowerCase().trim());
  });

  // CALCULS KPI
  const totalVehicules = vehicules.length;
  const valeurTotaleParc = vehicules.reduce((acc, v) => acc + (Number(v.prix) || 0), 0);
  const prixMoyen = totalVehicules > 0 ? Math.round(valeurTotaleParc / totalVehicules) : 0;
  const recentsCount = vehicules.filter(v => Number(v.annee) >= 2020).length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* EN-TÊTE PRINCIPAL ET BOUTON DÉCLENCHEUR MODALE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block mb-2 border border-red-100">
            Gestion du Parc Auto
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-blue-950">
            Catalogue des <span className="text-red-600">Véhicules en Vente</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Ajoutez, modifiez ou retirez les voitures disponibles dans votre showroom.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-lg shadow-red-600/20 flex items-center gap-2"
        >
          <span className="text-base">+</span> Ajouter un véhicule
        </button>
      </div>

      {/* BLOC DES CARTES KPI (INDICATEURS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 : TOTAL VÉHICULES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Total Parc</span>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950">
                {loading ? "..." : totalVehicules}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-950 flex items-center justify-center font-black text-sm border border-blue-100">
              🚗
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Véhicules en catalogue</p>
        </div>

        {/* KPI 2 : VALEUR TOTALE DU PARC */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Valeur du Showroom</span>
              <h3 className="text-lg sm:text-xl font-black text-emerald-600 truncate max-w-[160px]">
                {loading ? "..." : `${valeurTotaleParc.toLocaleString()} F`}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm border border-emerald-100">
              💎
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Somme des prix de vente</p>
        </div>

        {/* KPI 3 : PRIX MOYEN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Prix Moyen</span>
              <h3 className="text-lg sm:text-xl font-black text-blue-950 truncate max-w-[160px]">
                {loading ? "..." : `${prixMoyen.toLocaleString()} F`}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-950 flex items-center justify-center font-black text-sm border border-blue-100">
              📊
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Moyenne par véhicule</p>
        </div>

        {/* KPI 4 : VÉHICULES RÉCENTS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Modèles Récents</span>
              <h3 className="text-2xl sm:text-3xl font-black text-red-600">
                {loading ? "..." : recentsCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm border border-red-100">
              ⚡
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Année 2020 et plus</p>
        </div>

      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-96 relative">
          <input 
            type="text" 
            placeholder="Rechercher par nom, marque ou modèle..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>

        <span className="text-xs font-bold text-slate-400 uppercase">
          {filteredVehicules.length} véhicule(s) affiché(s)
        </span>
      </div>

      {/* TABLEAU DES VÉHICULES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredVehicules.length === 0 ? (
          <div className="text-center py-16 p-6">
            <p className="text-slate-400 font-extrabold uppercase text-xs tracking-wider">
              Aucun véhicule trouvé dans le parc automobile.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-4 px-6">Aperçu</th>
                  <th className="py-4 px-6">Modèle / Nom</th>
                  <th className="py-4 px-6">Année & KM</th>
                  <th className="py-4 px-6">Carburant</th>
                  <th className="py-4 px-6">Prix (FCFA)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredVehicules.map((auto) => (
                  <tr key={auto.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* VISUEL */}
                    <td className="py-3 px-6">
                      <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0">
                        {auto.image ? (
                          <img src={auto.image} alt={auto.nom || "Voiture"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400 font-bold">N/A</div>
                        )}
                        {auto.images && auto.images.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                            +{auto.images.length - 1}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DÉSIGNATION */}
                    <td className="py-3 px-6">
                      <div className="font-extrabold text-blue-950 uppercase italic text-sm">
                        {auto.nom || `${auto.marque || ''} ${auto.modele || ''}`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {auto.categorie || "Occasion"}
                      </div>
                    </td>

                    {/* ANNÉE & KM */}
                    <td className="py-3 px-6">
                      <div className="font-bold text-blue-950">
                        {auto.annee || "N/C"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        {auto.km ? `${Number(auto.km).toLocaleString()} km` : "KM non renseigné"}
                      </div>
                    </td>

                    {/* CARBURANT */}
                    <td className="py-3 px-6">
                      <span className="bg-blue-50 text-blue-950 font-bold px-2.5 py-1 rounded-md text-[10px] uppercase border border-blue-100">
                        {auto.carburant || "Essence"}
                      </span>
                    </td>

                    {/* PRIX */}
                    <td className="py-3 px-6 font-black text-red-600">
                      {auto.prix ? `${Number(auto.prix).toLocaleString()} F` : 'Sur devis'}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(auto)}
                        className="bg-slate-100 hover:bg-blue-950 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs transition"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(auto.id!, auto.nom || "le véhicule")}
                        className="bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs transition"
                      >
                        🗑️
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALE D'AJOUT ET DE MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <h2 className="text-xl font-black uppercase italic text-blue-950">
                {editingId ? "Modifier le " : "Ajouter un "} <span className="text-red-600">Véhicule</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-600 hover:text-white font-black text-xs transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* NOM GLOBAL / MARQUE ET MODÈLE */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Nom / Désignation du Véhicule *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Toyota RAV4 VVT-i Limited"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                />
              </div>

              {/* MARQUE & MODÈLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Marque</label>
                  <input 
                    type="text"
                    placeholder="Ex: Toyota"
                    value={formData.marque}
                    onChange={(e) => setFormData({...formData, marque: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Modèle</label>
                  <input 
                    type="text"
                    placeholder="Ex: RAV4"
                    value={formData.modele}
                    onChange={(e) => setFormData({...formData, modele: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* PRIX & ANNÉE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Prix de Vente (FCFA)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 8500000"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Année</label>
                  <input 
                    type="text"
                    placeholder="Ex: 2021"
                    value={formData.annee}
                    onChange={(e) => setFormData({...formData, annee: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* KM & CARBURANT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Kilométrage (KM)</label>
                  <input 
                    type="text"
                    placeholder="Ex: 42000"
                    value={formData.km}
                    onChange={(e) => setFormData({...formData, km: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Carburant</label>
                  <select
                    value={formData.carburant}
                    onChange={(e) => setFormData({...formData, carburant: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-blue-950 focus:outline-none focus:border-red-600"
                  >
                    {CARBURANTS.map(carb => (
                      <option key={carb} value={carb}>{carb}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 1. IMAGE PRINCIPALE */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[10px] font-black uppercase text-blue-950">1. Image Principale (Affiche de couverture)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-950 file:text-white file:font-bold hover:file:bg-red-600 transition border border-slate-200 p-1 rounded-xl bg-white"
                />
                {uploadingImage && <p className="text-[10px] text-red-600 font-bold animate-pulse">Chargement de la photo principale...</p>}
                
                <input 
                  type="url"
                  placeholder="Ou collez l'URL directe de la photo principale"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-[11px] font-mono focus:outline-none focus:border-red-600"
                />
              </div>

              {/* 2. GALERIE PHOTOS SECONDAIRES (MULTIPLE) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-[10px] font-black uppercase text-blue-950">2. Galerie photos supplémentaires (Sélection multiple)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-bold hover:file:bg-red-700 transition border border-slate-200 p-1 rounded-xl bg-white"
                />
                {uploadingGallery && <p className="text-[10px] text-red-600 font-bold animate-pulse">Chargement des photos de la galerie...</p>}

                {/* APERÇU DE TOUTES LES PHOTOS SÉLECTIONNÉES */}
                {formData.images && formData.images.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-2">
                      {formData.images.length} photo(s) au total dans la galerie :
                    </span>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                      {formData.images.map((imgUrl, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group">
                          <img src={imgUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center opacity-80 hover:opacity-100 transition"
                            title="Supprimer cette photo"
                          >
                            ✕
                          </button>
                          {formData.image === imgUrl && (
                            <span className="absolute bottom-0 inset-x-0 bg-blue-950/80 text-white text-[7px] text-center font-bold">
                              Couverture
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* MESSAGE / DESCRIPTION */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Description / Équipements</label>
                <textarea 
                  rows={2}
                  placeholder="Climatisation, Boîte automatique, Caméra de recul, Papiers à jour..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600 resize-none"
                ></textarea>
              </div>

              {/* BOUTON ENREGISTRER */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploadingImage || uploadingGallery}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase tracking-wider text-xs py-4 rounded-xl shadow-lg shadow-red-600/20 transition disabled:opacity-50"
                >
                  {editingId ? "Mettre à jour le véhicule" : "Enregistrer le véhicule"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}