// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import CookieConsent from '../components/CookieConsent';
import WhatsAppButton from '../components/WhatsAppButton'; // <-- AJOUT ICI

export const metadata = {
  title: "AutoGarage | Expert Mécanique & Vente de Véhicules",
  description: "Vente, entretien et conseils experts pour votre véhicule. Découvrez notre stock et prenez rendez-vous en ligne.",
  icons: {
    icon: '/logo.png',
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

        <main className="flex-grow">
          {children}
        </main>

        <section className="bg-slate-50 py-4">
          <AdBanner />
        </section>

        <Footer />
        
        {/* COMPOSANTS FLOTTANTS */}
        <WhatsAppButton /> {/* <-- AJOUT ICI */}
        <CookieConsent />
      </body>
    </html>
  );
}