"use client";
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function AdminInventaire() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<any[]>([]); // État pour la liste des objets

  const [type, setType] = useState<'vehicule' | 'piece' | 'article' | 'temoignage'>('vehicule');
  
  const [form, setForm] = useState({
    nom: '', prix: '', image: '', categorie: '', km: '', annee: '', stock: '5', message: ''
  });

  // 1. Gérer l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Charger les données en temps réel selon le type sélectionné
  useEffect(() => {
    if (!user) return;

    let collectionName = "vehicules";
    if (type === 'piece') collectionName = "pieces";
    if (type === 'article') collectionName = "articles";
    if (type === 'temoignage') collectionName = "temoignages";

    const q = query(collection(db, collectionName), orderBy("dateAjout", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    });

    return () => unsubscribe();
  }, [type, user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "garage_preset"); 

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/damkharxh/image/upload`, { method: "POST", body: formData });
      const data = await response.json();
      if (data.secure_url) setForm(prev => ({ ...prev, image: data.secure_url }));
    } catch (error) {
      alert("Erreur lors de l'envoi de la photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let collectionName = type === 'temoignage' ? "temoignages" : type === 'piece' ? "pieces" : type === 'article' ? "articles" : "vehicules";

    try {
      const docData = {
        nom: form.nom,
        image: form.image,
        message: form.message,
        dateAjout: serverTimestamp(),
        stock: type === 'temoignage' ? (form.stock || "5") : (form.stock || ""),
        prix: (type === 'article' || type === 'temoignage') ? 0 : Number(form.prix),
        annee: form.annee || "",
        km: form.km || "",
        categorie: form.categorie || ""
      };
      await addDoc(collection(db, collectionName), docData);
      alert(`Publication réussie !`);
      setForm({ nom: '', prix: '', image: '', categorie: '', km: '', annee: '', stock: '5', message: '' });
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  // 3. Fonction de suppression
  const handleDelete = async (id: string) => {
    let collectionName = type === 'temoignage' ? "temoignages" : type === 'piece' ? "pieces" : type === 'article' ? "articles" : "vehicules";
    if (window.confirm("Supprimer définitivement cet élément ?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        alert("Erreur de suppression");
      }
    }
  };

  if (authLoading) return <div className="p-10 text-center font-bold italic text-blue-600">Chargement...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <form onSubmit={(e) => { e.preventDefault(); signInWithEmailAndPassword(auth, email, password); }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl font-black mb-6 text-center text-slate-900 uppercase italic">Admin Access</h1>
          <input type="email" placeholder="Email" className="w-full border p-4 rounded-xl mb-4" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className="w-full border p-4 rounded-xl mb-6" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase">Connexion</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-slate-900 font-sans">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Tableau de Bord</h1>
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Connecté</p>
        </div>
        <button onClick={() => signOut(auth)} className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold text-xs uppercase hover:bg-red-100 transition">Déconnexion</button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        {/* FORMULAIRE */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl">
            {['vehicule', 'piece', 'article', 'temoignage'].map((t) => (
              <button key={t} onClick={() => setType(t as any)} className={`flex-1 py-2 px-3 rounded-xl font-black text-[10px] uppercase transition-all ${type === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                {t === 'article' ? 'Blog' : t === 'temoignage' ? 'Avis' : t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input placeholder="Titre / Nom" className="w-full border p-4 rounded-2xl bg-gray-50 focus:bg-white outline-none" onChange={(e) => setForm({...form, nom: e.target.value})} value={form.nom} required />
            
            {(type === 'vehicule' || type === 'piece') && (
               <input type="number" placeholder="Prix (€)" className="w-full border p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setForm({...form, prix: e.target.value})} value={form.prix} required />
            )}

            <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs cursor-pointer" />
            </div>

            {type === 'temoignage' ? (
              <><select className="w-full border p-4 rounded-2xl bg-gray-50" onChange={(e) => setForm({...form, stock: e.target.value})} value={form.stock}><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option></select><textarea placeholder="Avis client..." className="w-full border p-4 rounded-2xl h-32 bg-gray-50 outline-none" onChange={(e) => setForm({...form, message: e.target.value})} value={form.message} required /></>
            ) : type === 'article' ? (
              <textarea placeholder="Texte du blog..." className="w-full border p-4 rounded-2xl h-48 bg-gray-50 outline-none" onChange={(e) => setForm({...form, message: e.target.value})} value={form.message} required />
            ) : type === 'vehicule' ? (
              <div className="grid grid-cols-2 gap-4"><input placeholder="Année" className="border p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setForm({...form, annee: e.target.value})} value={form.annee}/><input placeholder="KM" className="border p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setForm({...form, km: e.target.value})} value={form.km}/></div>
            ) : (
              <div className="grid grid-cols-2 gap-4"><input placeholder="Catégorie" className="border p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setForm({...form, categorie: e.target.value})} value={form.categorie}/><input placeholder="Stock" className="border p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setForm({...form, stock: e.target.value})} value={form.stock}/></div>
            )}

            <button type="submit" disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition disabled:bg-gray-400 uppercase tracking-widest text-xs">
              {uploading ? "Envoi..." : "Publier maintenant"}
            </button>
          </form>
        </div>

        {/* LISTE DE GESTION (INVENTAIRE) */}
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-gray-200 overflow-hidden">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 text-slate-400">Liste {type}s en ligne</h2>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 group">
                <div className="flex items-center gap-4">
                  <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                    <p className="font-bold text-xs uppercase truncate max-w-[150px]">{item.nom}</p>
                    <p className="text-[10px] text-blue-600 font-bold">{item.prix ? `${item.prix} €` : type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-50 text-red-500 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"
                >
                  🗑️
                </button>
              </div>
            ))}
            {items.length === 0 && <p className="text-center text-gray-400 italic text-sm py-10">Aucun élément dans cette catégorie</p>}
          </div>
        </div>
      </div>
    </div>
  );
}