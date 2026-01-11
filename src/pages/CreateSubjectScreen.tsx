import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/auth-context'
import { createSubject } from '../services/subjectService'
import { getInitialSM2Values } from '../lib/sm2'
import type { MindMapNode } from '../types'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import Textarea from '../components/ui/Textarea'

type ContextType = 'course' | 'book' | 'article' | 'idea'

interface CreateSubjectForm {
  title: string
  context: ContextType
  rawNotes: string
}

const contextOptions: { value: ContextType; label: string }[] = [
  { value: 'course', label: 'Course' },
  { value: 'book', label: 'Book' },
  { value: 'article', label: 'Article' },
  { value: 'idea', label: 'Idea' },
]

export default function CreateSubjectScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateSubjectForm>({
    defaultValues: {
      context: 'course',
    },
  })

  const selectedContext = watch('context')

  const generateMindMap = async (
    title: string,
    context: ContextType,
    rawNotes: string,
    retries = 2
  ): Promise<MindMapNode> => {
    try {
      // Ensure we have a valid session before calling the Edge Function
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('No active session:', sessionError)
        throw new Error('Vous devez être connecté pour générer un Mind Map')
      }

      console.log('Calling Edge Function with session:', !!session, 'Token present:', !!session?.access_token)
      console.log('Token preview:', session?.access_token?.substring(0, 20) + '...')

      // Get Supabase URL and anon key for direct fetch
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing')
      }

      // Try direct fetch call to bypass potential issues with supabase.functions.invoke()
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-mindmap-v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ title, context, rawNotes }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Edge Function response error:', response.status, errorText)
        throw new Error(`Edge Function returned ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      if (!data?.mindMap) {
        console.error('No mind map in response:', data)
        throw new Error('No mind map returned from API')
      }

      // Validate mind map structure
      const mindMap = data.mindMap as MindMapNode
      if (!mindMap.id || !mindMap.text) {
        console.error('Invalid mind map structure:', mindMap)
        throw new Error('Invalid mind map structure')
      }

      return mindMap
    } catch (error) {
      if (retries > 0 && !error?.message?.includes('authentification')) {
        console.log(`Retrying mind map generation... (${retries} attempts left)`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return generateMindMap(title, context, rawNotes, retries - 1)
      }
      throw error
    }
  }

  const onSubmit = async (data: CreateSubjectForm) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour créer un sujet')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Generate mind map via Edge Function
      toast.loading('Génération du Mind Map en cours...', { id: 'generating' })
      const mindMap = await generateMindMap(data.title, data.context, data.rawNotes)

      // Step 2: Get initial SM-2 values
      const sm2Values = getInitialSM2Values()

      // Step 3: Create subject in database
      toast.loading('Sauvegarde du sujet...', { id: 'saving' })
      const subject = await createSubject(
        {
          title: data.title,
          context: data.context,
          rawNotes: data.rawNotes,
          mindMap,
          difficultyFactor: sm2Values.difficultyFactor,
          reviewCount: sm2Values.reviewCount,
          lastInterval: sm2Values.lastInterval,
          nextReviewAt: sm2Values.nextReviewAt,
        },
        user.id
      )

      toast.success('Sujet créé avec succès !', { id: 'generating' })
      toast.dismiss('saving')

      // Step 4: Redirect to subject view
      navigate(`/app/subject/${subject.id}`)
    } catch (error) {
      console.error('Error creating subject:', error)
      toast.dismiss('generating')
      toast.dismiss('saving')

      const errorMessage =
        error instanceof Error
          ? error.message.includes('Unauthorized')
            ? 'Erreur d\'authentification. Veuillez vous reconnecter.'
            : error.message.includes('Failed to generate')
            ? 'Échec de la génération du Mind Map. Veuillez réessayer.'
            : 'Erreur lors de la création du sujet. Veuillez réessayer.'
          : 'Une erreur est survenue. Veuillez réessayer.'

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full max-w-full items-center justify-center overflow-x-hidden p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Subject</h1>
          <p className="mt-2 text-gray-600">
            Enter your notes and let AI generate a structured Mind Map
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Introduction to React Hooks"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Context Selector */}
          <div className="space-y-2">
            <Label>Context *</Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {contextOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue('context', option.value)}
                  className={`
                    rounded-lg border-2 p-4 text-center transition-colors
                    ${
                      selectedContext === option.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register('context', { required: true })}
            />
          </div>

          {/* Raw Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="rawNotes">Notes *</Label>
            <Textarea
              id="rawNotes"
              placeholder="Paste or type your notes here..."
              rows={10}
              {...register('rawNotes', { required: 'Notes are required' })}
            />
            {errors.rawNotes && (
              <p className="text-sm text-red-600">{errors.rawNotes.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Generating Mind Map...' : 'Generate Mind Map'}
          </Button>
        </form>
      </div>
    </div>
  )
}
