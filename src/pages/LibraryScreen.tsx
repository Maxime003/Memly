import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { fetchSubjects } from '../services/subjectService'
import type { Subject } from '../types'
import { BookOpen, Calendar, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'

const contextLabels: Record<string, string> = {
  course: 'Cours',
  book: 'Livre',
  article: 'Article',
  idea: 'Idée',
}

export default function LibraryScreen() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSubjects = async () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/464f17b4-208c-4491-89e5-e0758e7f99e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LibraryScreen.tsx:28',message:'loadSubjects entry',data:{hasUser:!!user,userId:user?.id,userEmail:user?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      if (!user?.id) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/464f17b4-208c-4491-89e5-e0758e7f99e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LibraryScreen.tsx:30',message:'No user.id branch - early return',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        console.log('[LibraryScreen] Fetching subjects for user:', user.id, 'on', window.location.hostname)
        const loadedSubjects = await fetchSubjects(user.id)
        
        console.log('[LibraryScreen] Subjects loaded from Supabase:', loadedSubjects.length, 'subjects')
        console.log('[LibraryScreen] Subject titles:', loadedSubjects.map(s => s.title))
        console.log('[LibraryScreen] Subject IDs:', loadedSubjects.map(s => s.id))
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/464f17b4-208c-4491-89e5-e0758e7f99e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LibraryScreen.tsx:37',message:'Subjects loaded successfully',data:{subjectsLength:loadedSubjects.length,firstSubjectId:loadedSubjects[0]?.id,firstSubjectTitle:loadedSubjects[0]?.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        setSubjects(loadedSubjects)
        console.log('[LibraryScreen] State updated with', loadedSubjects.length, 'subjects')
      } catch (err) {
        console.error('Error loading subjects:', err)
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/464f17b4-208c-4491-89e5-e0758e7f99e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LibraryScreen.tsx:40',message:'Error caught in loadSubjects',data:{errorMessage:err instanceof Error ? err.message : String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    loadSubjects()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-50 bg-noise p-4 sm:p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
            Bibliothèque
          </h1>
          <p className="mt-2 text-slate-600">
            {subjects.length} sujet{subjects.length > 1 ? 's' : ''} dans votre bibliothèque
          </p>
          {/* DEBUG: Indicateur de version pour vérifier le déploiement */}
          <div className="mt-4 rounded-lg border-2 border-red-500 bg-red-50 p-3 text-xs font-mono text-red-800">
            <div className="font-bold">🔴 [DEBUG VERSION CHECK] 🔴</div>
            <div>Version: 2025-01-15-v2</div>
            <div>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'server'}</div>
            <div>Subjects in state: {subjects.length}</div>
            <div>Subject IDs: {subjects.length > 0 ? subjects.map(s => s.id).join(', ') : 'none'}</div>
            <div>Subject Titles: {subjects.length > 0 ? subjects.map(s => s.title).join(' | ') : 'none'}</div>
          </div>
          {/* #region agent log */}
          {(() => {
            fetch('http://127.0.0.1:7242/ingest/464f17b4-208c-4491-89e5-e0758e7f99e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LibraryScreen.tsx:73',message:'Render with subjects',data:{subjectsLength:subjects.length,subjectsIds:subjects.map(s=>s.id),subjectsTitles:subjects.map(s=>s.title),isVercel:window.location.hostname.includes('vercel'),hostname:window.location.hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            return null;
          })()}
          {/* #endregion */}
        </div>

        {subjects.length === 0 ? (
          <Card className="rounded-2xl p-6">
            <EmptyState
              icon={BookOpen}
              title="Bibliothèque vide"
              description="Vous n'avez pas encore créé de connaissances. Commencez maintenant !"
              actionLabel="Créer un sujet"
              onAction={() => navigate('/app/create')}
            />
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, index) => {
              const isDue = new Date(subject.nextReviewAt) <= new Date()
              
              // #region agent log
              if (index === 0) {
                fetch('http://127.0.0.1:7242/ingest/464f17b4-208c-4491-89e5-e0758e7f99e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LibraryScreen.tsx:113',message:'Rendering subject card',data:{subjectId:subject.id,subjectTitle:subject.title,isVercel:window.location.hostname.includes('vercel'),hostname:window.location.hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
              }
              // #endregion
              
              return (
                <Card
                  key={subject.id}
                  className="group flex flex-col rounded-2xl p-6"
                  onClick={() => navigate(`/app/subject/${subject.id}`)}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="mb-2 text-lg font-semibold text-slate-900 line-clamp-2">
                        {subject.title}
                      </h2>
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {contextLabels[subject.context] || subject.context}
                      </span>
                    </div>
                    <BookOpen className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                  </div>

                  <p className="mb-4 flex-1 text-sm text-slate-600 line-clamp-3">
                    {subject.rawNotes.substring(0, 100)}...
                  </p>

                  <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(subject.nextReviewAt, 'd MMM', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{subject.reviewCount} révision{subject.reviewCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    {isDue && (
                      <div className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
                        À réviser
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
