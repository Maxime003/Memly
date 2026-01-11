import { Link } from 'react-router-dom'
import { Brain, Zap, Layout, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-stone-50 bg-noise text-slate-900">
      {/* Header Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
              <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Memly
            </span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 text-sm sm:text-base px-3 sm:px-4">
                <span className="hidden sm:inline">Se connecter</span>
                <span className="sm:hidden">Connexion</span>
              </Button>
            </Link>
            <Link to="/signup">
              <Button 
                variant="default" 
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md text-sm sm:text-base px-3 sm:px-4"
              >
                <span className="hidden sm:inline">Commencer gratuitement</span>
                <span className="sm:hidden">Commencer</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">Transformez n'importe quel</span>
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                texte en savoir durable.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
              L'IA génère vos cartes mentales instantanément. Apprenez plus vite, retenez plus longtemps, sans effort.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 min-h-[44px]"
                >
                  <span className="hidden sm:inline">Générer ma première carte</span>
                  <span className="sm:hidden">Créer ma première carte</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Mind Map Preview Placeholder */}
            <div className="mt-12 sm:mt-16">
              <Card className="p-4 sm:p-6 md:p-8">
                <div className="relative mx-auto max-w-2xl">
                  {/* Simulated Mind Map Structure */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Central Node */}
                    <div className="flex justify-center">
                      <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 sm:px-6 sm:py-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <span className="font-semibold text-slate-900 text-sm sm:text-base">Sujet Principal</span>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Lines */}
                    <div className="hidden sm:flex justify-center">
                      <div className="flex gap-6 md:gap-8">
                        <div className="h-6 md:h-8 w-0.5 bg-slate-200" />
                        <div className="h-6 md:h-8 w-0.5 bg-slate-200" />
                        <div className="h-6 md:h-8 w-0.5 bg-slate-200" />
                      </div>
                    </div>

                    {/* Branch Nodes */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg bg-white border border-slate-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-slate-700">Idée clé {i}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section - Bento Grid */}
      <section className="py-12 sm:py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 md:grid-cols-3">
            {/* Card 1: Gain de temps */}
            <Card className="p-6 sm:p-8">
              <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-slate-900">Fini les résumés interminables</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Copiez un cours, un article ou un livre. Memly en extrait l'essentiel en 3 secondes.
              </p>
            </Card>

            {/* Card 2: Clarté */}
            <Card className="p-6 sm:p-8">
              <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Layout className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-slate-900">Visualisez pour comprendre</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Nos cartes mentales structurent l'information pour que votre cerveau l'assimile immédiatement.
              </p>
            </Card>

            {/* Card 3: Rétention */}
            <Card className="p-6 sm:p-8">
              <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Brain className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-slate-900">Ne l'oubliez jamais</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Révisez intelligemment grâce à notre système de répétition espacée intégré.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Comment ça marche
              </span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600">
              Trois étapes simples pour transformer votre apprentissage
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative text-center md:text-left">
              <div className="mx-auto mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 md:mx-0">
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-slate-900">Importez votre contenu</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Collez vos notes, cours, articles ou extraits de livres. Aucun formatage requis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center md:text-left">
              <div className="mx-auto mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 md:mx-0">
                <span className="text-xl sm:text-2xl font-bold text-violet-600">2</span>
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-slate-900">L'IA structure les idées clés</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Notre intelligence artificielle analyse et organise automatiquement vos contenus en cartes mentales.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center md:text-left">
              <div className="mx-auto mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 md:mx-0">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">3</span>
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-slate-900">Apprenez et maîtrisez le sujet</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Révisez intelligemment avec notre système de répétition espacée pour une mémorisation optimale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 sm:py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Card className="inline-block px-4 py-2.5 sm:px-6 sm:py-3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700">Rejoignez les étudiants et professionnels qui boostent leur productivité</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-12 sm:py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Prêt à libérer votre potentiel ?
              </span>
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600">
              Rejoignez Memly aujourd'hui et transformez votre façon d'apprendre
            </p>
            <div className="mt-8 sm:mt-10">
              <Link to="/signup" className="w-full sm:w-auto inline-block">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg text-base sm:text-lg px-6 py-5 sm:px-10 sm:py-6 min-h-[44px]"
                >
                  Créer un compte gratuit
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-8 sm:py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Memly
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} Memly. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
