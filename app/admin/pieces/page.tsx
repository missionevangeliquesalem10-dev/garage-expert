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

interface Piece {
  id?: string;
  nom: string;
  categorie: string;
  prix: number | string;
  stock: string | number;
  image: string;
  annee?: string;
  km?: string;
  message?: string;
  dateAjout?: any;
}

const CATEGORIES = ["Carrosserie", "Moteur", "Freinage", "Éclairage", "Électronique", "Autre"];

export default function AdminPiecesPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Toutes');

  // Gestion de la Modale (Ajout / Modification)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Formulaire local matching Firestore
  const [formData, setFormData] = useState<Piece>({
    nom: '',
    categorie: 'Carrosserie',
    prix: '',
    stock: '',
    image: '',
    annee: '',
    km: '',
    message: ''
  });

  // 1. Récupération des pièces depuis Firebase
  useEffect(() => {
    const q = query(collection(db, "pieces"), orderBy("dateAjout", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Piece[];
      setPieces(data);
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore pieces:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Ouvrir modale pour ajout
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      nom: '',
      categorie: 'Carrosserie',
      prix: '',
      stock: '1',
      image: '',
      annee: '',
      km: '',
      message: ''
    });
    setIsModalOpen(true);
  };

  // Ouvrir modale pour modification
  const handleOpenEditModal = (piece: Piece) => {
    setEditingId(piece.id || null);
    setFormData({
      nom: piece.nom || '',
      categorie: piece.categorie || 'Carrosserie',
      prix: piece.prix || '',
      stock: piece.stock || '',
      image: piece.image || '',
      annee: piece.annee || '',
      km: piece.km || '',
      message: piece.message || ''
    });
    setIsModalOpen(true);
  };

  // Upload image sur Cloudinary
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
        setFormData(prev => ({ ...prev, image: resData.secure_url }));
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

  // Soumission (Ajout ou Mise à jour)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom) {
      alert("Le nom de la pièce est requis.");
      return;
    }

    try {
      const payload = {
        nom: formData.nom,
        categorie: formData.categorie.toLowerCase(),
        prix: Number(formData.prix) || 0,
        stock: String(formData.stock),
        image: formData.image,
        annee: formData.annee || '',
        km: formData.km || '',
        message: formData.message || '',
      };

      if (editingId) {
        // Modification
        await updateDoc(doc(db, "pieces", editingId), payload);
      } else {
        // Création
        await addDoc(collection(db, "pieces"), {
          ...payload,
          dateAjout: serverTimestamp()
        });
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur enregistrement pièce:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  // Suppression
  const handleDelete = async (id: string, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la pièce : "${nom}" ?`)) {
      try {
        await deleteDoc(doc(db, "pieces", id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Impossible de supprimer la pièce.");
      }
    }
  };

  // Filtrage
  const filteredPieces = pieces.filter(p => {
    const matchSearch = (p.nom || '').toLowerCase().includes(search.toLowerCase().trim());
    const matchCat = selectedCat === 'Toutes' || (p.categorie || '').toLowerCase() === selectedCat.toLowerCase();
    return matchSearch && matchCat;
  });

  // CALCULS KPI
  const totalPieces = pieces.length;
  const totalValeurStock = pieces.reduce((acc, p) => acc + ((Number(p.prix) || 0) * (Number(p.stock) || 0)), 0);
  const ruptureStockCount = pieces.filter(p => Number(p.stock) <= 0 || p.stock === "0").length;
  const categoriesCount = new Set(pieces.map(p => (p.categorie || 'autre').toLowerCase())).size;

  return (
    <div className="space-y-8 font-sans">
      
      {/* EN-TÊTE PRINCIPAL ET BOUTON DÉCLENCHEUR MODALE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-block mb-2 border border-red-100">
            Gestion du Stock
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-blue-950">
            Catalogue des <span className="text-red-600">Pièces Détachées</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Ajoutez, modifiez ou supprimez les pièces disponibles pour vos clients.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-lg shadow-red-600/20 flex items-center gap-2"
        >
          <span className="text-base">+</span> Ajouter une pièce
        </button>
      </div>

      {/* BLOC DES CARTES KPI (INDICATEURS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 : TOTAL PIÈCES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Total Références</span>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950">
                {loading ? "..." : totalPieces}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-950 flex items-center justify-center font-black text-sm border border-blue-100">
              ⚙️
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Articles enregistrés</p>
        </div>

        {/* KPI 2 : VALEUR DU STOCK */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Valeur Estimée</span>
              <h3 className="text-lg sm:text-xl font-black text-emerald-600 truncate max-w-[160px]">
                {loading ? "..." : `${totalValeurStock.toLocaleString()} F`}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm border border-emerald-100">
              💰
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Prix x Quantité totale</p>
        </div>

        {/* KPI 3 : RUPTURES DE STOCK */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Hors Stock</span>
              <h3 className="text-2xl sm:text-3xl font-black text-red-600">
                {loading ? "..." : ruptureStockCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm border border-red-100">
              ⚠️
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Articles épuisés (stock = 0)</p>
        </div>

        {/* KPI 4 : CATÉGORIES ACTIVES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Catégories Utilisées</span>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950">
                {loading ? "..." : categoriesCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-950 flex items-center justify-center font-black text-sm border border-blue-100">
              📁
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Familles de pièces actives</p>
        </div>

      </div>

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-80 relative">
          <input 
            type="text" 
            placeholder="Rechercher une pièce par nom..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCat('Toutes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase shrink-0 transition ${
              selectedCat === 'Toutes' ? "bg-blue-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase shrink-0 transition ${
                selectedCat.toLowerCase() === cat.toLowerCase() ? "bg-blue-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TABLEAU DES PIÈCES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredPieces.length === 0 ? (
          <div className="text-center py-16 p-6">
            <p className="text-slate-400 font-extrabold uppercase text-xs tracking-wider">
              Aucune pièce trouvée dans la base de données.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-4 px-6">Aperçu</th>
                  <th className="py-4 px-6">Désignation</th>
                  <th className="py-4 px-6">Catégorie</th>
                  <th className="py-4 px-6">Prix (FCFA)</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredPieces.map((piece) => (
                  <tr key={piece.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* VISUEL */}
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0">
                        {piece.image ? (
                          <img src={piece.image} alt={piece.nom} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400 font-bold">N/A</div>
                        )}
                      </div>
                    </td>

                    {/* DÉSIGNATION */}
                    <td className="py-3 px-6">
                      <div className="font-extrabold text-blue-950 uppercase italic text-sm">
                        {piece.nom}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {piece.annee ? `Année: ${piece.annee}` : ''} {piece.km ? `| KM: ${piece.km}` : ''}
                      </div>
                    </td>

                    {/* CATÉGORIE */}
                    <td className="py-3 px-6">
                      <span className="bg-blue-50 text-blue-950 font-bold px-2.5 py-1 rounded-md text-[10px] uppercase border border-blue-100">
                        {piece.categorie || 'Carrosserie'}
                      </span>
                    </td>

                    {/* PRIX */}
                    <td className="py-3 px-6 font-black text-red-600">
                      {piece.prix ? `${Number(piece.prix).toLocaleString()} F` : 'Sur devis'}
                    </td>

                    {/* STOCK */}
                    <td className="py-3 px-6">
                      <span className={`font-black text-xs px-2.5 py-1 rounded-md border ${
                        Number(piece.stock) > 0 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {piece.stock ? `${piece.stock} dispo` : '0 dispo'}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(piece)}
                        className="bg-slate-100 hover:bg-blue-950 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs transition"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(piece.id!, piece.nom)}
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
                {editingId ? "Modifier la " : "Ajouter une "} <span className="text-red-600">Pièce</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-600 hover:text-white font-black text-xs transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* NOM DE LA PIÈCE */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Nom / Désignation *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Nez coupé, Pare-choc, Alternateur..."
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                />
              </div>

              {/* CATÉGORIE & PRIX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-blue-950 focus:outline-none focus:border-red-600"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Prix Unitaire (FCFA)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 800"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* STOCK & ANNÉE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Quantité en Stock</label>
                  <input 
                    type="text"
                    placeholder="Ex: 30"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Année Compatible (Optionnel)</label>
                  <input 
                    type="text"
                    placeholder="Ex: 2018-2022"
                    value={formData.annee}
                    onChange={(e) => setFormData({...formData, annee: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* KM & IMAGE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Kilométrage (Optionnel)</label>
                  <input 
                    type="text"
                    placeholder="Ex: 45000"
                    value={formData.km}
                    onChange={(e) => setFormData({...formData, km: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Image (Upload PC / URL)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-[11px] text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-950 file:text-white file:font-bold hover:file:bg-red-600 transition border border-slate-200 p-1 rounded-xl"
                  />
                  {uploadingImage && <p className="text-[10px] text-red-600 font-bold mt-1 animate-pulse">Envoi de l'image...</p>}
                </div>
              </div>

              {/* URL MANUELLE SI BESOIN */}
              <div>
                <input 
                  type="url"
                  placeholder="Ou collez l'URL directe de l'image (Cloudinary)"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[11px] font-mono focus:outline-none focus:border-red-600"
                />
              </div>

              {/* APERÇU DE L'IMAGE */}
              {formData.image && (
                <div className="relative w-full h-28 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* MESSAGE / DESCRIPTION */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Note / Détails complémentaires</label>
                <textarea 
                  rows={2}
                  placeholder="Ajoutez une description de la pièce..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-600 resize-none"
                ></textarea>
              </div>

              {/* BOUTON ENREGISTRER */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase tracking-wider text-xs py-4 rounded-xl shadow-lg shadow-red-600/20 transition"
                >
                  {editingId ? "Mettre à jour la pièce" : "Enregistrer la pièce"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}