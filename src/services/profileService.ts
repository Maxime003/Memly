import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

// Type pour les données brutes de la base de données (snake_case)
interface ProfileFromDB {
  id: string // Clé primaire qui référence auth.users(id)
  full_name: string | null
  notifications_enabled?: boolean // Optionnel car peut ne pas exister dans la table
  notification_time?: string // Optionnel car peut ne pas exister dans la table
  created_at: string
  updated_at: string
}

// Type pour les données à envoyer à la base de données (snake_case)
interface ProfileToDB {
  full_name?: string | null
  notifications_enabled?: boolean
  notification_time?: string
  updated_at?: string
}

/**
 * Transforme un objet Profile de la base de données (snake_case) en objet Profile TypeScript (camelCase)
 */
function mapProfileFromDB(data: ProfileFromDB, email: string): Profile {
  return {
    userId: data.id, // id est la référence vers auth.users(id)
    fullName: data.full_name,
    email,
    notificationsEnabled: data.notifications_enabled ?? true, // Valeur par défaut si la colonne n'existe pas
    notificationTime: data.notification_time ?? '09:00', // Valeur par défaut si la colonne n'existe pas
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

/**
 * Récupère le profil de l'utilisateur depuis Supabase
 * Crée le profil s'il n'existe pas
 */
export async function fetchProfile(userId: string): Promise<Profile> {
  // Récupérer l'email de l'utilisateur
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error(`Erreur lors de la récupération de l'utilisateur: ${userError?.message || 'Utilisateur non trouvé'}`)
  }

  const email = user.email || ''

  // Récupérer le profil
  // Note: Si la table utilise RLS, on peut utiliser .eq('id', userId)
  // Sinon, on essaie d'abord avec 'id', puis avec 'user_id' en fallback
  let { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // Si ça échoue avec 'id', essayer avec 'user_id' (pour compatibilité)
  if (error && error.code !== 'PGRST116') {
    const { data: dataAlt, error: errorAlt } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (!errorAlt) {
      data = dataAlt
      error = null
    }
  }

  if (error) {
    // Si le profil n'existe pas, le créer
    if (error.code === 'PGRST116') {
      const newProfile: ProfileToDB = {
        full_name: null,
        notifications_enabled: true,
        notification_time: '09:00',
        updated_at: new Date().toISOString(),
      }

      // Essayer d'abord avec 'id' (structure standard Supabase)
      let { data: createdData, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId, // id référence auth.users(id)
          ...newProfile,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // Si ça échoue, essayer avec 'user_id' (structure alternative)
      if (createError) {
        const { data: dataAlt, error: errorAlt } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            ...newProfile,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()
        
        if (!errorAlt) {
          createdData = dataAlt
          createError = null
        }
      }

      if (createError || !createdData) {
        throw new Error(`Erreur lors de la création du profil: ${createError?.message || 'Données non retournées'}`)
      }

      return mapProfileFromDB(createdData, email)
    }

    throw new Error(`Erreur lors de la récupération du profil: ${error.message}`)
  }

  if (!data) {
    throw new Error('Aucune donnée retournée')
  }

  return mapProfileFromDB(data, email)
}

/**
 * Met à jour le profil de l'utilisateur
 */
export async function updateProfile(userId: string, updates: Partial<Omit<Profile, 'userId' | 'email' | 'createdAt'>>): Promise<Profile> {
  // Récupérer l'email de l'utilisateur
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error(`Erreur lors de la récupération de l'utilisateur: ${userError?.message || 'Utilisateur non trouvé'}`)
  }

  const email = user.email || ''

  // Transforme les champs camelCase en snake_case pour la mise à jour
  const updatesToDB: ProfileToDB & Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.fullName !== undefined) updatesToDB.full_name = updates.fullName
  
  // Ne mettre à jour les colonnes de notifications que si elles existent dans la table
  // On essaie quand même, mais on gère l'erreur si les colonnes n'existent pas
  if (updates.notificationsEnabled !== undefined) {
    updatesToDB.notifications_enabled = updates.notificationsEnabled
  }
  if (updates.notificationTime !== undefined) {
    updatesToDB.notification_time = updates.notificationTime
  }

  // Essayer d'abord avec 'id', puis 'user_id' en fallback
  let { data, error } = await supabase
    .from('profiles')
    .update(updatesToDB)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    const { data: dataAlt, error: errorAlt } = await supabase
      .from('profiles')
      .update(updatesToDB)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (!errorAlt) {
      data = dataAlt
      error = null
    }
  }

  if (error) {
    // Si l'erreur est due à des colonnes manquantes, on essaie de mettre à jour seulement full_name
    if (error.message.includes('notifications_enabled') || error.message.includes('notification_time')) {
      // Mettre à jour seulement full_name si présent
      if (updates.fullName !== undefined) {
        const { data: dataAlt, error: errorAlt } = await supabase
          .from('profiles')
          .update({ full_name: updates.fullName, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single()
        
        if (!errorAlt && dataAlt) {
          // Retourner le profil avec les valeurs par défaut pour les notifications
          return mapProfileFromDB(dataAlt, email)
        }
      }
      // Si on ne peut pas mettre à jour, retourner le profil actuel avec les valeurs par défaut
      const currentProfile = await fetchProfile(userId)
      return currentProfile
    }
    throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`)
  }

  if (!data) {
    throw new Error('Aucune donnée retournée après la mise à jour du profil')
  }

  return mapProfileFromDB(data, email)
}

/**
 * Met à jour les préférences de notifications
 */
export async function updateNotificationPreferences(
  userId: string,
  enabled: boolean,
  time: string
): Promise<Profile> {
  return updateProfile(userId, {
    notificationsEnabled: enabled,
    notificationTime: time,
  })
}
