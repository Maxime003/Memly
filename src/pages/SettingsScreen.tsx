import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Info, LogOut, User, Mail, Edit2, Bell } from 'lucide-react'
import { useAuth } from '../context/auth-context'
import { fetchProfile, updateNotificationPreferences } from '../services/profileService'
import type { Profile } from '../types'
import {
  requestNotificationPermission,
  hasNotificationPermission,
  scheduleNotification,
  cancelScheduledNotifications,
  testNotification,
  scheduleTestNotification,
} from '../lib/notifications'
import Button from '../components/ui/Button'
import Switch from '../components/ui/Switch'
import EditProfileModal from '../components/features/EditProfileModal'
import ChangePasswordModal from '../components/features/ChangePasswordModal'
import DeleteAccountModal from '../components/features/DeleteAccountModal'

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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notifications, setNotifications] = useState<boolean>(false) // Désactivé par défaut
  const [notificationTime, setNotificationTime] = useState<string>('09:00')
  const [notificationError, setNotificationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [initials, setInitials] = useState<string>('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default')
  const [isTestingNotification, setIsTestingNotification] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const profileData = await fetchProfile(user.id)
        setProfile(profileData)
        setUserEmail(profileData.email)
        setNotifications(profileData.notificationsEnabled ?? false) // Désactivé par défaut
        setNotificationTime(profileData.notificationTime ?? '09:00')
        setNotificationError(null)
        
        const name = profileData.fullName || profileData.email.split('@')[0] || 'Utilisateur'
        setUserName(name)
        setInitials(getInitials(name))
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

  // Gérer les notifications
  useEffect(() => {
    if (!profile) return

    // Vérifier la permission au chargement
    const checkPermission = async () => {
      if (hasNotificationPermission()) {
        setNotificationPermissionStatus('granted')
      } else if ('Notification' in window) {
        setNotificationPermissionStatus(window.Notification.permission as 'default' | 'granted' | 'denied')
      } else {
        setNotificationPermissionStatus('denied')
      }
    }

    checkPermission()

    // Si les notifications sont activées et la permission est accordée, programmer
    if (profile.notificationsEnabled && hasNotificationPermission()) {
      const cancelFn = scheduleNotification(
        profile.notificationTime,
        'Rappel de révision',
        'Il est temps de réviser vos sujets !'
      )

      return () => {
        cancelFn()
      }
    } else {
      // Annuler les notifications si désactivées
      cancelScheduledNotifications()
    }
  }, [profile?.notificationsEnabled, profile?.notificationTime, profile])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!user?.id || !profile) return
    
    setNotificationError(null)
    
    try {
      // Si on active les notifications, demander la permission
      if (enabled && !hasNotificationPermission()) {
        const permission = await requestNotificationPermission()
        setNotificationPermissionStatus(permission)
        
        if (permission !== 'granted') {
          // Si la permission est refusée, ne pas activer les notifications
          return
        }
      }

      setNotifications(enabled)
      await updateNotificationPreferences(user.id, enabled, notificationTime)
      const updatedProfile = await fetchProfile(user.id)
      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      
      // Si l'erreur est due à des colonnes manquantes, afficher un message spécifique
      if (errorMessage.includes('notifications_enabled') || errorMessage.includes('notification_time')) {
        setNotificationError('Les colonnes de notifications n\'existent pas encore dans la base de données. Veuillez exécuter la migration SQL pour les ajouter.')
      } else {
        setNotificationError(errorMessage)
      }
      
      // Revert on error
      setNotifications(!enabled)
    }
  }

  const handleNotificationTimeChange = async (time: string) => {
    if (!user?.id || !profile) return
    
    try {
      setNotificationTime(time)
      await updateNotificationPreferences(user.id, notifications, time)
      const updatedProfile = await fetchProfile(user.id)
      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating notification time:', error)
    }
  }

  const handleProfileUpdated = async (updatedProfile: Profile) => {
    setProfile(updatedProfile)
    const name = updatedProfile.fullName || updatedProfile.email.split('@')[0] || 'Utilisateur'
    setUserName(name)
    setInitials(getInitials(name))
  }

  const handleTestNotification = async () => {
    setIsTestingNotification(true)
    
    try {
      // Vérifier d'abord la permission
      if (!hasNotificationPermission()) {
        const permission = await requestNotificationPermission()
        
        if (permission !== 'granted') {
          alert(`Les notifications ne sont pas autorisées. Statut: ${permission}. Veuillez autoriser les notifications dans les paramètres du navigateur.`)
          setIsTestingNotification(false)
          return
        }
        
        setNotificationPermissionStatus(permission)
      }

      // Vérifier le contexte de sécurité
      const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
      if (!isSecureContext) {
        alert('Les notifications nécessitent un contexte sécurisé (HTTPS ou localhost). Vous êtes actuellement sur: ' + location.protocol + '//' + location.hostname)
        setIsTestingNotification(false)
        return
      }

      const success = await testNotification()
      
      if (!success) {
        const permission = window.Notification?.permission || 'unknown'
        alert(`Impossible d'afficher la notification.\n\nVérifications:\n- Permission: ${permission}\n- Contexte sécurisé: ${isSecureContext}\n- Support: ${'Notification' in window ? 'Oui' : 'Non'}\n\nVérifiez la console pour plus de détails.`)
      }
    } catch (error) {
      console.error('[SettingsScreen] Error testing notification:', error)
      alert('Erreur lors du test de notification: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsTestingNotification(false)
    }
  }

  const handleTestScheduledNotification = () => {
    if (!hasNotificationPermission()) {
      alert('Veuillez d\'abord autoriser les notifications')
      return
    }

    // Vérifier le contexte de sécurité
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
    if (!isSecureContext) {
      alert('Les notifications nécessitent un contexte sécurisé (HTTPS ou localhost)')
      return
    }

    const cancelFn = scheduleTestNotification(5)
    alert('Une notification de test sera affichée dans 5 secondes. Gardez cette page ouverte.')
    
    // Annuler après 10 secondes pour éviter les notifications multiples
    setTimeout(() => {
      cancelFn()
    }, 10000)
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
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => {
                if (!profile) {
                  console.error('Cannot open edit modal: profile is null')
                  return
                }
                console.log('Opening edit modal, profile:', profile)
                setIsEditModalOpen(true)
              }}
              disabled={!profile || isLoading}
            >
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
          <div className="mt-4 border-t border-slate-200 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="w-full sm:w-auto"
            >
              Changer le mot de passe
            </Button>
          </div>
        </div>

        {/* Section Préférences */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Préférences</h2>
          </div>
          <div className="space-y-4">
            <Switch
              label="Notifications de rappel"
              checked={notifications ?? false}
              onChange={(e) => handleNotificationToggle(e.target.checked)}
            />
            {notificationError && (
              <div className="ml-6 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
                {notificationError}
              </div>
            )}
            {notifications && (
              <div className="ml-6 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Heure de notification
                  </label>
                  <input
                    type="time"
                    value={notificationTime}
                    onChange={(e) => handleNotificationTimeChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  />
                </div>
                
                {notificationPermissionStatus === 'granted' && (
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-700">Tester les notifications</p>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Autorisées</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestNotification}
                        disabled={isTestingNotification}
                        isLoading={isTestingNotification}
                        className="text-xs"
                      >
                        Test immédiat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestScheduledNotification}
                        className="text-xs"
                      >
                        Test dans 5s
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Utilisez ces boutons pour vérifier que les notifications fonctionnent correctement.
                    </p>
                  </div>
                )}
                
                {notificationPermissionStatus === 'denied' && (
                  <p className="text-xs text-red-600">
                    Les notifications sont bloquées par votre navigateur. Veuillez les autoriser dans les paramètres.
                  </p>
                )}
                {notificationPermissionStatus === 'default' && (
                  <p className="text-xs text-slate-500">
                    Cliquez sur le switch pour autoriser les notifications.
                  </p>
                )}
              </div>
            )}
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
              <Link
                to="/terms"
                className="block text-sm text-blue-600 hover:underline"
              >
                Conditions d'utilisation
              </Link>
              <Link
                to="/privacy"
                className="block text-sm text-blue-600 hover:underline"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>

        {/* Zone de Danger */}
        <div className="rounded-xl border-2 border-red-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Zone de Danger</h2>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-500 bg-red-50 text-red-700 hover:border-red-600 hover:bg-red-100"
              onClick={() => setIsDeleteAccountModalOpen(true)}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => {
            console.log('Closing edit modal')
            setIsEditModalOpen(false)
          }}
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />

      {/* Delete Account Modal */}
      {user && profile && (
        <DeleteAccountModal
          isOpen={isDeleteAccountModalOpen}
          onClose={() => setIsDeleteAccountModalOpen(false)}
          userId={user.id}
          email={profile.email}
        />
      )}
    </div>
  )
}
