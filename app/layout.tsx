// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner'; // Importation du nouveau composant pub
import CookieConsent from '../components/CookieConsent';

export const metadata = {
  title: "AutoGarage | Expert Mécanique & Vente de Véhicules",
  description: "Vente, entretien et conseils experts pour votre véhicule. Découvrez notre stock et prenez rendez-vous en ligne.",
  icons: {
    icon: '/logo.png', // Utilise votre logo comme icône d'onglet
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <Navbar />

        {/* Le contenu principal occupe tout l'espace disponible */}
        <main className="flex-grow">
          {children}
        </main>

        {/* SECTION PUBLICITAIRE : Apparaît sur toutes les pages avant le footer */}
        <section className="bg-slate-50 py-4">
          <AdBanner />
        </section>

        <Footer />
        {/* Ajout du consentement ici */}
        <CookieConsent />
      </body>
    </html>
  );
}