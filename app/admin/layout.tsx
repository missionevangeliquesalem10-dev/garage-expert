"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
  { name: 'Vue Générale', href: '/admin' },
  { name: 'Devis & Demandes', href: '/admin/devis' },
  { name: 'Gestion Inventaire', href: '/admin/inventaire' },
  { name: 'Analytics & Visites', href: '/admin/analytics' }, // <-- NOUVEAU LIEN
];

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

        {/* Pied de Sidebar */}
        <div className="pt-6 border-t border-blue-900/60 mt-6">
          <Link
            href="/"
            className="block text-center bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL DE CHAQUE PAGE ADMIN */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}