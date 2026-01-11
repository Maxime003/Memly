import { useNavigate } from 'react-router-dom'
import { useMockData } from '../hooks/useMockData'
import { BrainCircuit, Clock, PartyPopper } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'

export default function Dashboard() {
  const { getSubjectsDueForReview, isLoading } = useMockData()
  const subjectsToReview = getSubjectsDueForReview()
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
            Révisions du jour
          </h1>
          <p className="mt-2 text-slate-600">
            {subjectsToReview.length === 0
              ? "Aucune révision prévue aujourd'hui"
              : `${subjectsToReview.length} sujet${subjectsToReview.length > 1 ? 's' : ''} à réviser`}
          </p>
        </div>

        {subjectsToReview.length === 0 ? (
          <Card className="rounded-2xl p-6">
            <EmptyState
              icon={PartyPopper}
              title="Tout est à jour !"
              description="Aucune révision pour le moment. Profitez-en pour apprendre quelque chose de nouveau."
              actionLabel="Explorer la bibliothèque"
              onAction={() => navigate('/app/library')}
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjectsToReview.map((subject) => (
              <Card
                key={subject.id}
                className="rounded-2xl p-6"
                onClick={() => navigate(`/app/subject/${subject.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {subject.title}
                      </h2>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {subject.context}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-slate-600 line-clamp-2">
                      {subject.rawNotes.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          À réviser le {format(subject.nextReviewAt, 'd MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <span>Révisions: {subject.reviewCount}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <BrainCircuit className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
