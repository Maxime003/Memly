import { useState, useEffect } from 'react'
import { updateProfile } from '../../services/profileService'
import type { Profile } from '../../types'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Label from '../ui/Label'
import Button from '../ui/Button'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile
  onProfileUpdated: (profile: Profile) => void
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState(profile.fullName || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mettre à jour le fullName quand le modal s'ouvre ou le profile change
  useEffect(() => {
    if (isOpen) {
      setFullName(profile.fullName || '')
      setError(null)
    }
  }, [isOpen, profile.fullName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const updatedProfile = await updateProfile(profile.userId, {
        fullName: fullName.trim() || null,
      })
      onProfileUpdated(updatedProfile)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le profil">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="mb-2 block">
            Nom complet
          </Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Votre nom"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
