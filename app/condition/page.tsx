// Emplacement : app/confidentialite/page.tsx
// URL obtenue : https://www.mongarage-auto.com/confidentialite
// (Si votre projet utilise le dossier "pages/", renommez ce fichier en pages/confidentialite.tsx
//  et supprimez l'import/export "Metadata".)

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Services Auto",
  description:
    "Politique de confidentialité de Services Auto : données collectées, utilisation, conservation et vos droits.",
  alternates: { canonical: "https://www.mongarage-auto.com/confidentialite" },
};

// ⚠️ À MODIFIER : remplacez par votre vraie adresse e-mail
const CONTACT_EMAIL = "info@mongarage-auto.com";
const PHONES = "07 97 11 25 81 / 01 01 35 29 18";
const ADDRESS = "Dokui, non loin de l'école Adama Sanogo, Abidjan, Côte d'Ivoire";
const LAST_UPDATE = "9 novembre 2026";

type Section = {
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    title: "1. Qui sommes-nous ?",
    content: (
      <p>
        Services Auto est un garage situé à Abidjan (Dokui) proposant l&apos;entretien et la
        réparation mécanique, la vente de pièces détachées et la vente de véhicules d&apos;occasion
        révisés. Le présent site est accessible à l&apos;adresse{" "}
        <a href="https://www.mongarage-auto.com">www.mongarage-auto.com</a>.
      </p>
    ),
  },
  {
    title: "2. Données que nous collectons",
    content: (
      <>
        <p>Selon la façon dont vous nous contactez, nous pouvons collecter :</p>
        <ul>
          <li>Votre nom et prénom, et le nom de votre entreprise le cas échéant ;</li>
          <li>Votre numéro de téléphone (et WhatsApp) et votre adresse e-mail ;</li>
          <li>Votre commune de résidence ou d&apos;activité ;</li>
          <li>Le nombre de véhicules que vous possédez ou gérez ;</li>
          <li>
            Votre besoin principal : entretien, diagnostic, réparation, partenariat de
            maintenance, achat de pièces ou de véhicule ;
          </li>
          <li>Les informations que vous nous transmettez dans vos messages ou demandes de devis ;</li>
          <li>
            Des données techniques de navigation (type d&apos;appareil, pages consultées) lorsque
            vous visitez notre site.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Comment nous collectons ces données",
    content: (
      <ul>
        <li>Via nos formulaires de contact et de demande de devis sur le site ;</li>
        <li>Via nos formulaires publicitaires Facebook et Instagram (Meta Lead Ads) ;</li>
        <li>Via WhatsApp, par téléphone ou directement au garage ;</li>
        <li>Via l&apos;inscription à notre newsletter ;</li>
        <li>Via les avis clients que vous choisissez de publier.</li>
      </ul>
    ),
  },
  {
    title: "4. Pourquoi nous utilisons vos données",
    content: (
      <>
        <p>Vos données sont utilisées uniquement pour :</p>
        <ul>
          <li>Vous contacter (appel, SMS, WhatsApp ou e-mail) au sujet de votre demande ;</li>
          <li>Établir un devis, un diagnostic ou un rendez-vous ;</li>
          <li>Vous présenter nos services, nos pièces et nos véhicules disponibles ;</li>
          <li>
            Vous envoyer notre newsletter et nos offres, si vous vous y êtes inscrit (vous pouvez
            vous désinscrire à tout moment) ;
          </li>
          <li>Améliorer notre site et la qualité de notre service.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Partage de vos données",
    content: (
      <>
        <p>
          <strong>Nous ne vendons ni ne louons vos données personnelles.</strong> Elles peuvent
          uniquement être traitées par :
        </p>
        <ul>
          <li>Notre équipe commerciale et technique, pour répondre à votre demande ;</li>
          <li>
            Des prestataires techniques nécessaires au fonctionnement du site et de nos outils
            (hébergement, WhatsApp, Meta pour les formulaires Facebook/Instagram, Google Maps pour
            le plan d&apos;accès) ;
          </li>
          <li>Les autorités compétentes, si la loi l&apos;exige.</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Durée de conservation",
    content: (
      <p>
        Nous conservons vos données le temps nécessaire au traitement de votre demande et au suivi
        de notre relation commerciale, puis pendant une durée maximale de 3 ans après notre dernier
        échange. Les données de la newsletter sont conservées jusqu&apos;à votre désinscription.
      </p>
    ),
  },
  {
    title: "7. Sécurité",
    content: (
      <p>
        Nous mettons en œuvre des mesures raisonnables pour protéger vos données contre
        l&apos;accès non autorisé, la perte ou la divulgation. Aucune transmission sur Internet
        n&apos;étant totalement sûre, nous ne pouvons toutefois garantir une sécurité absolue.
      </p>
    ),
  },
  {
    title: "8. Cookies et services tiers",
    content: (
      <p>
        Notre site peut utiliser des cookies ou des technologies similaires pour son bon
        fonctionnement et pour mesurer son audience. Il intègre également des services tiers (Google
        Maps, Facebook, Instagram, WhatsApp) qui ont leurs propres politiques de confidentialité.
        Vous pouvez configurer votre navigateur pour refuser les cookies.
      </p>
    ),
  },
  {
    title: "9. Vos droits",
    content: (
      <>
        <p>
          Conformément à la loi ivoirienne n° 2013-450 du 19 juin 2013 relative à la protection des
          données à caractère personnel, vous disposez des droits suivants :
        </p>
        <ul>
          <li>Droit d&apos;accès à vos données ;</li>
          <li>Droit de rectification des données inexactes ;</li>
          <li>Droit de suppression de vos données ;</li>
          <li>Droit d&apos;opposition à leur utilisation, notamment à des fins de prospection ;</li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez-nous à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou appelez-nous au {PHONES}. Vous
          pouvez également saisir l&apos;Autorité de Régulation des Télécommunications/TIC de Côte
          d&apos;Ivoire (ARTCI), autorité de protection des données personnelles.
        </p>
      </>
    ),
  },
  {
    title: "10. Modifications de cette politique",
    content: (
      <p>
        Nous pouvons mettre à jour cette politique de temps à autre. La date de dernière mise à
        jour est indiquée en haut de cette page.
      </p>
    ),
  },
  {
    title: "11. Nous contacter",
    content: (
      <address style={{ fontStyle: "normal" }}>
        <strong>Services Auto</strong>
        <br />
        {ADDRESS}
        <br />
        Téléphone : {PHONES}
        <br />
        E-mail : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </address>
    ),
  },
];

export default function ConfidentialitePage() {
  return (
    <main
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "48px 20px 80px",
        lineHeight: 1.7,
        color: "#1f2937",
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Politique de confidentialité</h1>
        <p style={{ color: "#6b7280", margin: 0 }}>Dernière mise à jour : {LAST_UPDATE}</p>
      </header>

      <p>
        Chez Services Auto, nous respectons votre vie privée. Cette page explique quelles données
        nous collectons lorsque vous visitez notre site ou remplissez l&apos;un de nos formulaires
        (site web, Facebook, Instagram), comment nous les utilisons et quels sont vos droits.
      </p>

      {sections.map((section) => (
        <section key={section.title} style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>{section.title}</h2>
          {section.content}
        </section>
      ))}
    </main>
  );
}