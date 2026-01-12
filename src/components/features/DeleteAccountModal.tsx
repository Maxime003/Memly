import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { deleteAccount } from '../../services/authService'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Label from '../ui/Label'
import Button from '../ui/Button'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  email: string
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  userId,
  email,
}: DeleteAccountModalProps) {
  const navigate = useNavigate()
  const [confirmEmail, setConfirmEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (confirmEmail !== email) {
      setError("L'email ne correspond pas")
      return
    }

    setIsLoading(true)

    try {
      await deleteAccount(userId, email)
      // Rediriger vers la page de login après suppression
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setConfirmEmail('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Supprimer mon compte">
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-2">
                Attention : Cette action est irréversible
              </h3>
              <p className="text-sm text-red-800">
                La suppression de votre compte entraînera la perte définitive de toutes
                vos données, y compris :
              </p>
              <ul className="mt-2 ml-4 list-disc text-sm text-red-800 space-y-1">
                <li>Tous vos sujets et cartes mentales</li>
                <li>Votre historique de révisions</li>
                <li>Vos préférences et paramètres</li>
                <li>Votre profil utilisateur</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="confirmEmail" className="mb-2 block">
              Pour confirmer, veuillez saisir votre adresse email :{' '}
              <span className="font-semibold">{email}</span>
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Entrez votre email"
              disabled={isLoading}
              autoComplete="email"
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
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              Supprimer définitivement
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
