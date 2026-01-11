import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Info, LogOut, User, Mail, Edit2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/auth-context'
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
  const { user, signOut } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [initials, setInitials] = useState<string>('')

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Récupérer l'utilisateur pour obtenir l'email
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser?.email) {
          setUserEmail(currentUser.email)
        }

        // Récupérer le profil depuis la table profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          // Si le profil n'existe pas, utiliser l'email comme nom par défaut
          if (currentUser?.email) {
            const defaultName = currentUser.email.split('@')[0]
            setUserName(defaultName)
            setInitials(getInitials(defaultName))
          }
        } else if (profile) {
          const name = profile.full_name || currentUser?.email?.split('@')[0] || 'Utilisateur'
          setUserName(name)
          setInitials(getInitials(name))
        } else {
          // Pas de profil trouvé, utiliser l'email
          if (currentUser?.email) {
            const defaultName = currentUser.email.split('@')[0]
            setUserName(defaultName)
            setInitials(getInitials(defaultName))
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        // En cas d'erreur, utiliser l'email comme fallback
        if (user?.email) {
          const defaultName = user.email.split('@')[0]
          setUserName(defaultName)
          setInitials(getInitials(defaultName))
          setUserEmail(user.email)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user?.id, user?.email])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
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
