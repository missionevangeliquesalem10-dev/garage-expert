import Link from 'next/link';

export default function ConditionsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic text-slate-900 mb-10 tracking-tighter">
          Conditions Générales & <span className="text-blue-600">Politique</span>
        </h1>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-600">
          
          {/* SECTION 1 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">1. Informations Légales</h2>
            <p>
              Le site <strong>AutoGarage</strong> est édité par [Nom de ton entreprise], 
              située à [Ton Adresse, Ville, Pays]. 
              Contact : [Ton Email] | [Ton Téléphone].
            </p>
          </section>

          {/* SECTION 2 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">2. Prestations de Service</h2>
            <p>
              Toute intervention mécanique (réparation, entretien) fait l'objet d'un ordre de réparation signé par le client. 
              Les pièces vendues sont garanties selon les conditions constructeurs. 
              Le garage décline toute responsabilité pour les objets laissés à l'intérieur des véhicules.
            </p>
          </section>

          {/* SECTION 3 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">3. Vente de Véhicules</h2>
            <p>
              Les véhicules d'occasion sont vendus révisés et garantis (durée précisée sur le contrat de vente). 
              Le transfert de propriété n'intervient qu'après paiement intégral du prix convenu.
            </p>
          </section>

          {/* SECTION 4 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">4. Protection des Données (RGPD)</h2>
            <p>
              Les informations collectées (formulaires de contact, newsletter) sont utilisées exclusivement pour la gestion 
              de votre demande et la relation commerciale. Vous disposez d'un droit d'accès, de modification et de suppression de vos données.
            </p>
          </section>

          {/* SECTION 5 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">5. Cookies</h2>
            <p>
              Ce site utilise des cookies techniques pour améliorer votre expérience (ex: gestion de la session admin, affichage des publicités). 
              En naviguant sur ce site, vous acceptez leur utilisation.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-10 border-t border-gray-100 text-center">
          <Link href="/" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}