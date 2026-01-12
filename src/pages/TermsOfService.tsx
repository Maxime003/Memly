import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function TermsOfService() {
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
            Conditions d'utilisation
          </h1>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                1. Acceptation des conditions
              </h2>
              <p>
                En accédant et en utilisant Mind Drawer, vous acceptez d'être lié par ces
                conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez
                ne pas utiliser notre service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                2. Description du service
              </h2>
              <p>
                Mind Drawer est une application web d'apprentissage qui combine la création
                de cartes mentales et la répétition espacée pour améliorer la rétention des
                connaissances. Le service utilise l'intelligence artificielle pour générer
                des cartes mentales à partir de vos notes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                3. Compte utilisateur
              </h2>
              <p>
                Pour utiliser Mind Drawer, vous devez créer un compte en fournissant des
                informations exactes et à jour. Vous êtes responsable de maintenir la
                confidentialité de votre mot de passe et de toutes les activités qui se
                produisent sous votre compte.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                4. Utilisation acceptable
              </h2>
              <p>Vous vous engagez à :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Utiliser le service uniquement à des fins légales</li>
                <li>Ne pas tenter d'accéder à des parties non autorisées du service</li>
                <li>Ne pas perturber ou endommager le service</li>
                <li>Respecter les droits de propriété intellectuelle</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                5. Propriété intellectuelle
              </h2>
              <p>
                Le contenu de Mind Drawer, y compris mais sans s'y limiter, les textes,
                graphiques, logos et logiciels, est la propriété de Mind Drawer et est
                protégé par les lois sur le droit d'auteur et autres lois sur la propriété
                intellectuelle.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                6. Limitation de responsabilité
              </h2>
              <p>
                Mind Drawer est fourni "tel quel" sans garantie d'aucune sorte. Nous ne
                garantissons pas que le service sera ininterrompu, sécurisé ou exempt
                d'erreurs. Vous utilisez le service à vos propres risques.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                7. Modifications du service
              </h2>
              <p>
                Nous nous réservons le droit de modifier, suspendre ou interrompre le
                service à tout moment, avec ou sans préavis. Nous ne serons pas responsables
                envers vous ou tout tiers pour toute modification, suspension ou
                interruption du service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                8. Résiliation
              </h2>
              <p>
                Nous nous réservons le droit de résilier ou de suspendre votre compte et
                votre accès au service immédiatement, sans préavis, pour toute violation de
                ces conditions d'utilisation.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                9. Modifications des conditions
              </h2>
              <p>
                Nous nous réservons le droit de modifier ces conditions d'utilisation à
                tout moment. Les modifications entreront en vigueur dès leur publication
                sur cette page. Il est de votre responsabilité de consulter régulièrement
                ces conditions.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                10. Contact
              </h2>
              <p>
                Si vous avez des questions concernant ces conditions d'utilisation, veuillez
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
