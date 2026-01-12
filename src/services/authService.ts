import { supabase } from '../lib/supabase'

/**
 * Met à jour le mot de passe de l'utilisateur
 * Valide d'abord que l'ancien mot de passe est correct
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // Vérifier que l'ancien mot de passe est correct
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user?.email) {
    throw new Error('Utilisateur non trouvé')
  }

  // Tenter de se connecter avec l'ancien mot de passe pour valider
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (signInError) {
    throw new Error('Mot de passe actuel incorrect')
  }

  // Mettre à jour le mot de passe
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    throw new Error(`Erreur lors de la mise à jour du mot de passe: ${updateError.message}`)
  }
}

/**
 * Supprime le compte de l'utilisateur et toutes ses données
 * Appelle l'Edge Function delete-account pour une suppression sécurisée
 */
export async function deleteAccount(userId: string, email: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('delete-account', {
    body: { userId, email },
  })

  if (error) {
    throw new Error(`Erreur lors de la suppression du compte: ${error.message}`)
  }

  if (!data || !data.success) {
    throw new Error(data?.error || 'Erreur lors de la suppression du compte')
  }

  // Déconnexion après suppression
  await supabase.auth.signOut()
}
