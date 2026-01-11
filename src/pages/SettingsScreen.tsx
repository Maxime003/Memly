import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Info, LogOut, User, Mail, Edit2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Switch from '../components/ui/Switch'

// Fonction pour générer les initiales à partir d'un nom
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function SettingsScreen() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const userName = 'Maxime Durand'
  const userEmail = 'maxime@minddrawer.app'
  const initials = getInitials(userName)

  const handleLogout = () => {
    // TODO: Implémenter la déconnexion réelle
    navigate('/login')
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        </div>

        {/* Section Profil */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Profil</h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Modifier
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-semibold text-white shadow-lg ring-4 ring-blue-50">
                {initials}
              </div>
              <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500"></div>
            </div>

            {/* Informations */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{userName}</h3>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-600 sm:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{userEmail}</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Compte actif
              </div>
            </div>
          </div>
        </div>

        {/* Section Préférences */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Moon className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Préférences</h2>
          </div>
          <div className="space-y-4">
            <Switch
              label="Mode Sombre"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <Switch
              label="Notifications de rappel"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </div>
        </div>

        {/* Section À Propos */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">À Propos</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Version</span>
              <span className="text-sm font-medium text-slate-900">v1.0.0</span>
            </div>
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <a
                href="#"
                className="block text-sm text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Ouvrir les conditions d'utilisation
                }}
              >
                Conditions d'utilisation
              </a>
              <a
                href="#"
                className="block text-sm text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Ouvrir la politique de confidentialité
                }}
              >
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>

        {/* Zone de Danger */}
        <div className="rounded-xl border-2 border-red-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Zone de Danger</h2>
          </div>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  )
}
