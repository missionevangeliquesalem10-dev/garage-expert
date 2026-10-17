"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Vérification de la connexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Ignorer la vérification sur la page de login
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      if (!currentUser) {
        // Rediriger vers la page de login si non connecté
        router.push('/admin/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Si on est sur la page de login, afficher sans la sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Écran de chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Vérification des accès admin...</p>
      </div>
    ); 
  }

  // Si pas connecté, ne rien afficher pendant la redirection
  if (!user) return null;

  const navigation = [
    { name: 'Vue Générale', href: '/admin' },
    { name: 'Parc Véhicules', href: '/admin/vehicules' },
    { name: 'Catalogue Pièces', href: '/admin/pieces' },
    { name: 'Analytics & Visites', href: '/admin/analytics' },
    { name: 'Abonnés Newsletter', href: '/admin/newsletter' },
    { name: 'Bannières & Pubs', href: '/admin/pub' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION ADMIN */}
      <aside className="w-full md:w-64 bg-blue-950 text-white flex-shrink-0 border-r border-blue-900/50 p-6 flex flex-col justify-between">
        <div>
          {/* Header Admin */}
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <span className="text-xl font-black uppercase italic tracking-tighter">
                <span className="text-red-600">SERVICE</span>
                <span className="text-white"> AUTO</span>
              </span>
            </Link>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 mt-1">
              Espace Administration
            </p>
          </div>

          {/* Menu de navigation */}
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "text-slate-300 hover:bg-blue-900/60 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pied de Sidebar avec Déconnexion */}
        <div className="pt-6 border-t border-blue-900/60 mt-6 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full text-center bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border border-red-500/30"
          >
            Se Déconnecter
          </button>
          
          <Link
            href="/"
            className="block text-center bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}