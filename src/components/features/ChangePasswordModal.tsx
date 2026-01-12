import { useState } from 'react'
import { updatePassword } from '../../services/authService'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Label from '../ui/Label'
import Button from '../ui/Button'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {}

    if (!currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis'
    }

    if (!newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis'
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'La confirmation est requise'
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await updatePassword(currentPassword, newPassword)
      // Réinitialiser le formulaire et fermer
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onClose()
      // Optionnel: afficher un message de succès
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setValidationErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Changer le mot de passe">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="currentPassword" className="mb-2 block">
            Mot de passe actuel
          </Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Entrez votre mot de passe actuel"
            disabled={isLoading}
            autoComplete="current-password"
          />
          {validationErrors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword" className="mb-2 block">
            Nouveau mot de passe
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Entrez votre nouveau mot de passe"
            disabled={isLoading}
            autoComplete="new-password"
          />
          {validationErrors.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.newPassword}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-2 block">
            Confirmer le nouveau mot de passe
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez votre nouveau mot de passe"
            disabled={isLoading}
            autoComplete="new-password"
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.confirmPassword}
            </p>
          )}
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
            onClick={handleClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Changer le mot de passe
          </Button>
        </div>
      </form>
    </Modal>
  )
}
