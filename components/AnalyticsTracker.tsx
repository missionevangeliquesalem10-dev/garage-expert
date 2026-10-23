"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Ne pas enregistrer les visites de la section admin
    if (!pathname || pathname.startsWith('/admin')) return;

    const trackPageView = async () => {
      try {
        // Normalise le chemin (ex: "/" -> "accueil", "/vehicules" -> "vehicules")
        const pageId = pathname === '/' ? 'accueil' : pathname.replace(/\//g, '-').replace(/^-/, '');
        const pageRef = doc(db, "visites_pages", pageId);

        await setDoc(pageRef, {
          nomPath: pathname,
          titre: pageId.toUpperCase(),
          vues: increment(1),
          derniereVisite: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        // Erreur silencieuse pour ne pas perturber l'expérience utilisateur
        console.warn("Tracking analytics ignoré ou restreint.");
      }
    };

    trackPageView();
  }, [pathname]);

  return null; // Composant invisible
}