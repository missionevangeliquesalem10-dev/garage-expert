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
        // Normalise le chemin (ex: "/" -> "accueil", "/garage" -> "garage")
        const pageId = pathname === '/' ? 'accueil' : pathname.replace('/', '').replace('/', '-');
        const pageRef = doc(db, "visites_pages", pageId);

        await setDoc(pageRef, {
          nomPath: pathname,
          titre: pageId.toUpperCase(),
          vues: increment(1),
          derniereVisite: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error("Erreur de tracking analytics:", error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null; // Composant invisible
}