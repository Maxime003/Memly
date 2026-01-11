import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/auth-context'
import { fetchSubjectById, updateSubject } from '../services/subjectService'
import { calculateNextReview } from '../lib/sm2'
import type { MindMapNode, Subject } from '../types'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ArrowLeft, ChevronRight, ChevronDown } from 'lucide-react'

interface MindMapNodeProps {
  node: MindMapNode
  level?: number
}

function MindMapNodeComponent({ node, level = 0 }: MindMapNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="ml-4">
      <div
        className={`flex items-start gap-2 rounded-xl border border-stone-300 p-3 shadow-sm transition-colors ${
          level === 0
            ? 'bg-blue-50 text-blue-900'
            : 'bg-white text-slate-700 hover:bg-slate-50'
        }`}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-slate-600"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        <div className="flex-1">
          <div className="font-medium">{node.text}</div>
          {node.description && (
            <div className="mt-1 text-sm text-slate-600">{node.description}</div>
          )}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-2 border-l-2 border-stone-300 pl-2">
          {node.children!.map((child) => (
            <MindMapNodeComponent key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SubjectView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)

  useEffect(() => {
    const loadSubject = async () => {
      if (!id || !user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const loadedSubject = await fetchSubjectById(id, user.id)
        if (!loadedSubject) {
          setError('Sujet introuvable')
        } else {
          setSubject(loadedSubject)
        }
      } catch (err) {
        console.error('Error loading subject:', err)
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    loadSubject()
  }, [id, user?.id])

  const handleReview = async (quality: 3 | 4 | 5) => {
    if (!subject || !user?.id || isReviewing) {
      return
    }

    setIsReviewing(true)

    try {
      // Calculate new SM-2 values
      const sm2Result = calculateNextReview(
        quality,
        subject.lastInterval,
        subject.reviewCount,
        subject.difficultyFactor
      )

      // Update subject in database
      const updatedSubject = await updateSubject(
        subject.id,
        {
          difficultyFactor: sm2Result.newEaseFactor,
          reviewCount: sm2Result.newRepetitions,
          lastInterval: sm2Result.newInterval,
          nextReviewAt: sm2Result.nextReviewAt,
        },
        user.id
      )

      // Update local state
      setSubject(updatedSubject)

      // Show success message
      const qualityLabels = { 3: 'Difficile', 4: 'Moyen', 5: 'Facile' }
      toast.success(
        `Révision enregistrée (${qualityLabels[quality]}). Prochaine révision dans ${sm2Result.newInterval} jour${sm2Result.newInterval > 1 ? 's' : ''}.`
      )

      // Optionally redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/app')
      }, 1500)
    } catch (err) {
      console.error('Error updating review:', err)
      toast.error('Erreur lors de l\'enregistrement de la révision. Veuillez réessayer.')
    } finally {
      setIsReviewing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (error || !subject) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            {error || 'Sujet introuvable'}
          </h1>
          <Link
            to="/app/library"
            className="text-blue-600 hover:underline"
          >
            Retour à la bibliothèque
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-50 bg-noise">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white/90 backdrop-blur-sm px-4 py-4 sm:px-6">
        <Link
          to="/app/library"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la bibliothèque
        </Link>
        <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-2xl font-bold text-transparent">
          {subject.title}
        </h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium">
            {subject.context}
          </span>
          <span>Révisions: {subject.reviewCount}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
        {/* Mind Map */}
        <Card className="mb-8 rounded-2xl p-6 shadow-2xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Mind Map</h2>
          <div className="space-y-2">
            <MindMapNodeComponent node={subject.mindMap} />
          </div>
        </Card>

        {/* Raw Notes */}
        <Card className="mb-8 rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Notes originales</h2>
          <div className="whitespace-pre-wrap text-sm text-slate-700">
            {subject.rawNotes}
          </div>
        </Card>

        {/* Review Actions */}
        <Card className="sticky bottom-0 rounded-2xl p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Comment s'est passée cette révision ?
          </h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleReview(3)}
              disabled={isReviewing}
            >
              Difficile
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => handleReview(4)}
              disabled={isReviewing}
            >
              Moyen
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-green-50 text-green-700 hover:bg-green-100"
              onClick={() => handleReview(5)}
              disabled={isReviewing}
            >
              Facile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
