import { supabase } from '../lib/supabase'
import type { Subject, MindMapNode } from '../types'

// Type pour les données brutes de la base de données (snake_case)
interface SubjectFromDB {
  id: string
  user_id: string
  title: string
  context: 'course' | 'book' | 'article' | 'idea'
  raw_notes: string
  mind_map: MindMapNode
  difficulty_factor: number
  review_count: number
  last_interval: number
  next_review_at: string
  created_at: string
}

// Type pour les données à envoyer à la base de données (snake_case)
interface SubjectToDB {
  user_id: string
  title: string
  context: 'course' | 'book' | 'article' | 'idea'
  raw_notes: string
  mind_map: MindMapNode
  difficulty_factor: number
  review_count: number
  last_interval: number
  next_review_at: string
}

/**
 * Transforme un objet Subject de la base de données (snake_case) en objet Subject TypeScript (camelCase)
 */
export function mapSubjectFromDB(data: SubjectFromDB): Subject {
  return {
    id: data.id,
    title: data.title,
    context: data.context,
    rawNotes: data.raw_notes,
    mindMap: data.mind_map,
    difficultyFactor: data.difficulty_factor,
    reviewCount: data.review_count,
    lastInterval: data.last_interval,
    createdAt: new Date(data.created_at),
    nextReviewAt: new Date(data.next_review_at),
  }
}

/**
 * Récupère tous les sujets de l'utilisateur connecté depuis Supabase
 */
export async function fetchSubjects(userId: string): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching subjects:', error)
    throw new Error(`Erreur lors de la récupération des sujets: ${error.message}`)
  }

  if (!data) {
    return []
  }

  return data.map(mapSubjectFromDB)
}

/**
 * Récupère les sujets à réviser (next_review_at <= maintenant)
 */
export async function fetchSubjectsDueForReview(userId: string): Promise<Subject[]> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_at', now)
    .order('next_review_at', { ascending: true })

  if (error) {
    console.error('Error fetching subjects due for review:', error)
    throw new Error(`Erreur lors de la récupération des révisions: ${error.message}`)
  }

  if (!data) {
    return []
  }

  return data.map(mapSubjectFromDB)
}

/**
 * Transforme un objet Subject TypeScript (camelCase) en objet pour la base de données (snake_case)
 */
function mapSubjectToDB(subject: Omit<Subject, 'id' | 'createdAt'>, userId: string): SubjectToDB {
  return {
    user_id: userId,
    title: subject.title,
    context: subject.context,
    raw_notes: subject.rawNotes,
    mind_map: subject.mindMap,
    difficulty_factor: subject.difficultyFactor,
    review_count: subject.reviewCount,
    last_interval: subject.lastInterval,
    next_review_at: subject.nextReviewAt.toISOString(),
  }
}

/**
 * Crée un nouveau sujet dans la base de données
 */
export async function createSubject(
  subject: Omit<Subject, 'id' | 'createdAt'>,
  userId: string
): Promise<Subject> {
  const subjectToDB = mapSubjectToDB(subject, userId)

  const { data, error } = await supabase
    .from('subjects')
    .insert(subjectToDB)
    .select()
    .single()

  if (error) {
    console.error('Error creating subject:', error)
    throw new Error(`Erreur lors de la création du sujet: ${error.message}`)
  }

  if (!data) {
    throw new Error('Aucune donnée retournée après la création du sujet')
  }

  return mapSubjectFromDB(data)
}

/**
 * Met à jour un sujet existant dans la base de données
 */
export async function updateSubject(
  subjectId: string,
  updates: Partial<Omit<Subject, 'id' | 'createdAt'>>,
  userId: string
): Promise<Subject> {
  // Transforme les champs camelCase en snake_case pour la mise à jour
  const updatesToDB: Partial<SubjectToDB> = {}

  if (updates.title !== undefined) updatesToDB.title = updates.title
  if (updates.context !== undefined) updatesToDB.context = updates.context
  if (updates.rawNotes !== undefined) updatesToDB.raw_notes = updates.rawNotes
  if (updates.mindMap !== undefined) updatesToDB.mind_map = updates.mindMap
  if (updates.difficultyFactor !== undefined) updatesToDB.difficulty_factor = updates.difficultyFactor
  if (updates.reviewCount !== undefined) updatesToDB.review_count = updates.reviewCount
  if (updates.lastInterval !== undefined) updatesToDB.last_interval = updates.lastInterval
  if (updates.nextReviewAt !== undefined) {
    updatesToDB.next_review_at = updates.nextReviewAt instanceof Date
      ? updates.nextReviewAt.toISOString()
      : updates.nextReviewAt
  }

  const { data, error } = await supabase
    .from('subjects')
    .update(updatesToDB)
    .eq('id', subjectId)
    .eq('user_id', userId) // Sécurité: s'assurer que l'utilisateur ne peut modifier que ses propres sujets
    .select()
    .single()

  if (error) {
    console.error('Error updating subject:', error)
    throw new Error(`Erreur lors de la mise à jour du sujet: ${error.message}`)
  }

  if (!data) {
    throw new Error('Aucune donnée retournée après la mise à jour du sujet')
  }

  return mapSubjectFromDB(data)
}

/**
 * Récupère un sujet par son ID
 */
export async function fetchSubjectById(subjectId: string, userId: string): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Aucun résultat trouvé
      return null
    }
    console.error('Error fetching subject by id:', error)
    throw new Error(`Erreur lors de la récupération du sujet: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return mapSubjectFromDB(data)
}
