import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import CookieConsent from '../components/CookieConsent';
import WhatsAppButton from '../components/WhatsAppButton';
import AnalyticsTracker from '../components/AnalyticsTracker'; // <-- IMPORT DU TRACKER

export const metadata = {
  title: "Services Auto | Entretien, Pièces & Vente de Véhicules à Abidjan",
  description: "Expert en mécanique automobile à Abidjan Dokui. Vente de pièces détachées et véhicules d'occasion garantis. Prenez rendez-vous en ligne !",
  keywords: ["Garage auto Abidjan", "Mécanicien Dokui", "Pièces détachées Côte d'Ivoire", "Vente de voiture Abidjan", "Réparation automobile"],
  openGraph: {
    title: "Services Auto - L'excellence Automobile",
    description: "Entretien expert et vente de véhicules à Abidjan.",
    url: 'https://www.mongarage-auto.com',
    siteName: 'Service Auto',
    images: [
      {
        url: '/icon.png', // Image affichée lors du partage sur WhatsApp/Facebook
        width: 800,
        height: 600,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
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
        {/* SUIVI ET TRACKING DES VISITES */}
        <AnalyticsTracker />

        {/* BARRE DE NAVIGATION */}
        <Navbar />

        {/* CONTENU PRINCIPAL DE LA PAGE */}
        <main className="flex-grow">
          {children}
        </main>

        {/* BANNIÈRE PUBLICITAIRE */}
        <section className="bg-slate-50 py-4">
          <AdBanner />
        </section>

        {/* PIED DE PAGE */}
        <Footer />
        
        {/* COMPOSANTS FLOTTANTS ET BANNERE COOKIES */}
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}