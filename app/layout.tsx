// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import CookieConsent from '../components/CookieConsent';
import WhatsAppButton from '../components/WhatsAppButton'; // <-- AJOUT ICI

export const metadata = {
  title: "Garage Auto Angré | Entretien, Pièces & Vente de Véhicules à Abidjan",
  description: "Expert en mécanique automobile à Abidjan Angré. Vente de pièces détachées (Moteur, Freinage) et véhicules d'occasion garantis. Prenez rendez-vous en ligne !",
  keywords: ["Garage auto Abidjan", "Mécanicien Angré", "Pièces détachées Côte d'Ivoire", "Vente de voiture Abidjan", "Réparation automobile"],
  openGraph: {
    title: "Garage Auto Angré - L'excellence Automobile",
    description: "Entretien expert et vente de véhicules à Abidjan.",
    url: 'https://www.mongarage-auto.com',
    siteName: 'Garage Auto Angré',
    images: [
      {
        url: '/logo.png', // Image affichée lors du partage sur WhatsApp/Facebook
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