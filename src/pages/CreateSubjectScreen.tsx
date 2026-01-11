import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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

  const onSubmit = async (data: CreateSubjectForm) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Simulated response data
      const responseData = {
        ...data,
        mindMap: {
          id: '1',
          text: data.title,
          children: [],
        },
      }
      
      console.log('Generated Mind Map:', responseData)
      toast.success('Mind Map generated successfully!')
    } catch (error) {
      console.error('Error generating Mind Map:', error)
      toast.error('Failed to generate Mind Map. Please try again.')
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
