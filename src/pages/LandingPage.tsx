import { Link } from 'react-router-dom'
import { Sparkles, BrainCircuit, Library } from 'lucide-react'

export default function LandingPage() {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonjour'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Mind Drawer</h1>
        <p className="mt-1 text-sm text-slate-600">
          {getGreeting()}, prêt à apprendre ?
        </p>
      </div>

      {/* Main Content - Navigation Cards */}
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {/* Carte 1: Nouvelle Connaissance (Mise en avant) */}
          <Link
            to="/app/create"
            className="group relative col-span-1 flex flex-col rounded-2xl bg-white p-8 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg md:col-span-2"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <Sparkles className="h-8 w-8" strokeWidth={2} />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">
              Ajouter un sujet
            </h2>
            <p className="text-sm text-slate-600">
              Collez vos notes, l'IA génère la structure.
            </p>
            <div className="mt-auto pt-4">
              <div className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Commencer
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Carte 2: Révisions du Jour */}
          <Link
            to="/app"
            className="group flex flex-col rounded-2xl bg-white p-8 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
              <BrainCircuit className="h-8 w-8" strokeWidth={2} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Lancer les révisions
            </h2>
            <p className="text-sm text-slate-600">
              Consolidez votre mémoire.
            </p>
            <div className="mt-auto pt-4">
              <div className="inline-flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                Réviser
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Carte 3: Bibliothèque */}
          <Link
            to="/app/library"
            className="group flex flex-col rounded-2xl bg-white p-8 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <Library className="h-8 w-8" strokeWidth={2} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Explorer mes sujets
            </h2>
            <p className="text-sm text-slate-600">
              Retrouvez tous vos cours et livres.
            </p>
            <div className="mt-auto pt-4">
              <div className="inline-flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                Explorer
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
