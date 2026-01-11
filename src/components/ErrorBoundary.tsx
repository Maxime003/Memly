import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Une erreur inattendue est survenue'
      
      // Check if it's a Supabase env variable error
      if (errorMessage.includes('Supabase environment variables')) {
        return (
          <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
            <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h1 className="mb-4 text-xl font-bold text-red-600">Configuration manquante</h1>
              <p className="mb-4 text-gray-700">
                Les variables d'environnement Supabase ne sont pas configurées.
              </p>
              <div className="rounded bg-gray-100 p-3 font-mono text-sm">
                <p className="mb-2">Variables requises :</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>VITE_SUPABASE_URL</li>
                  <li>VITE_SUPABASE_ANON_KEY</li>
                </ul>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Veuillez configurer ces variables dans les paramètres de votre projet Vercel.
              </p>
            </div>
          </div>
        )
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
          <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-4 text-xl font-bold text-red-600">Erreur</h1>
            <p className="mb-4 text-gray-700">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Recharger la page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
