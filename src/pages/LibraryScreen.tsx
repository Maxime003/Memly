import { useNavigate } from 'react-router-dom'
import { useMockData } from '../hooks/useMockData'
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
  const { subjects, isLoading } = useMockData()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
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
            {subjects.map((subject) => {
              const isDue = new Date(subject.nextReviewAt) <= new Date()
              
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
