import type { ReactNode } from 'react'
import { Brain } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full max-w-full overflow-x-hidden">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-4 sm:p-8 md:w-1/2">
        {children}
      </div>

      {/* Right Side - Brand */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white md:flex md:w-1/2">
        {/* Logo/Icon */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Brain className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Mind Drawer</h1>
        </div>

        {/* Quote */}
        <div className="mx-auto max-w-md text-center">
          <blockquote className="text-2xl font-medium leading-relaxed">
            "L'apprentissage n'est pas une destination, c'est un voyage continu qui transforme chaque jour notre compréhension du monde."
          </blockquote>
          <p className="mt-4 text-sm text-slate-400">
            — Proverbe sur l'apprentissage
          </p>
        </div>

        {/* Decorative Pattern */}
        <div className="flex justify-end">
          <div className="h-32 w-32 rounded-full bg-blue-600/20 blur-3xl" />
        </div>
      </div>
    </div>
  )
}
