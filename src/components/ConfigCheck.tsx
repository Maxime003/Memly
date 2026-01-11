import { hasSupabaseConfig } from '../lib/supabase'
import { AlertCircle } from 'lucide-react'

export function ConfigCheck() {
  if (hasSupabaseConfig) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg bg-red-50 border border-red-200 p-4 shadow-lg sm:left-auto">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">
            Configuration manquante
          </h3>
          <p className="text-xs text-red-700 mb-2">
            Les variables d'environnement Supabase ne sont pas configurées.
          </p>
          <div className="rounded bg-red-100 p-2 font-mono text-xs text-red-800">
            <p className="mb-1">Variables requises :</p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-red-600">
            Configurez ces variables dans les paramètres de votre projet Vercel.
          </p>
        </div>
      </div>
    </div>
  )
}
