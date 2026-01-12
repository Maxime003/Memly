import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/app/settings">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux paramètres
          </Button>
        </Link>

        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">
            Politique de confidentialité
          </h1>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                1. Introduction
              </h2>
              <p>
                Mind Drawer s'engage à protéger votre vie privée. Cette politique de
                confidentialité explique comment nous collectons, utilisons et protégeons
                vos informations personnelles lorsque vous utilisez notre service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                2. Informations que nous collectons
              </h2>
              <p>Nous collectons les types d'informations suivants :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Informations de compte :</strong> adresse e-mail, nom complet
                  (optionnel), mot de passe crypté
                </li>
                <li>
                  <strong>Données de contenu :</strong> notes, cartes mentales et autres
                  contenus que vous créez dans l'application
                </li>
                <li>
                  <strong>Données d'utilisation :</strong> informations sur la façon dont
                  vous utilisez le service, y compris les dates de révision et les
                  préférences
                </li>
                <li>
                  <strong>Données techniques :</strong> adresse IP, type de navigateur,
                  système d'exploitation
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                3. Comment nous utilisons vos informations
              </h2>
              <p>Nous utilisons vos informations pour :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Fournir et améliorer notre service</li>
                <li>Générer des cartes mentales à partir de vos notes</li>
                <li>Gérer votre compte et vos préférences</li>
                <li>Vous envoyer des notifications de rappel (si activées)</li>
                <li>Assurer la sécurité et prévenir les fraudes</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                4. Partage de vos informations
              </h2>
              <p>
                Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à
                des tiers. Nous pouvons partager vos informations uniquement dans les cas
                suivants :
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Avec des prestataires de services de confiance qui nous aident à exploiter
                  notre service (hébergement, analyse)
                </li>
                <li>Lorsque la loi l'exige ou pour protéger nos droits</li>
                <li>Avec votre consentement explicite</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                5. Stockage et sécurité
              </h2>
              <p>
                Vos données sont stockées de manière sécurisée sur les serveurs de Supabase.
                Nous utilisons des mesures de sécurité techniques et organisationnelles
                appropriées pour protéger vos informations contre tout accès non autorisé,
                altération, divulgation ou destruction.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                6. Vos droits
              </h2>
              <p>Vous avez le droit de :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Accéder à vos informations personnelles</li>
                <li>Corriger des informations inexactes</li>
                <li>Demander la suppression de vos données</li>
                <li>Vous opposer au traitement de vos données</li>
                <li>Retirer votre consentement à tout moment</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                7. Cookies et technologies similaires
              </h2>
              <p>
                Nous utilisons des cookies et des technologies similaires pour améliorer
                votre expérience, analyser l'utilisation du service et personnaliser le
                contenu. Vous pouvez contrôler les cookies via les paramètres de votre
                navigateur.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                8. Conservation des données
              </h2>
              <p>
                Nous conservons vos données aussi longtemps que votre compte est actif ou
                aussi longtemps que nécessaire pour fournir nos services. Vous pouvez
                supprimer votre compte à tout moment, ce qui entraînera la suppression de
                toutes vos données personnelles.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                9. Modifications de cette politique
              </h2>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps à
                autre. Nous vous informerons de tout changement en publiant la nouvelle
                politique sur cette page et en mettant à jour la date de "dernière mise à
                jour".
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                10. Contact
              </h2>
              <p>
                Si vous avez des questions ou des préoccupations concernant cette politique
                de confidentialité ou nos pratiques de traitement des données, veuillez
                nous contacter via les paramètres de l'application.
              </p>
            </section>

            <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
              <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
