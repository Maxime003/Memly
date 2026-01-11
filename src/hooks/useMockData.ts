import { useState, useEffect } from 'react'
import type { Subject } from '../types'
import { mockSubjects, demoSubject } from '../lib/mockData'

/**
 * Hook pour utiliser les données de test pendant le développement
 * À remplacer par de vrais appels Supabase en production
 * 
 * DEBUG: Pour tester les états vides, changez cette variable à true
 */
const DEBUG_EMPTY_STATE = false

export function useMockData() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simule un chargement asynchrone
    const loadData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      // DEBUG: Retourne un tableau vide si le flag est activé
      setSubjects(DEBUG_EMPTY_STATE ? [] : mockSubjects)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find((subject) => subject.id === id) || demoSubject
  }

  const getSubjectsDueForReview = (): Subject[] => {
    const now = new Date()
    return subjects.filter((subject) => new Date(subject.nextReviewAt) <= now)
  }

  return {
    subjects,
    isLoading,
    getSubjectById,
    getSubjectsDueForReview,
    demoSubject, // Export direct du sujet de démo pour un accès facile
  }
}
