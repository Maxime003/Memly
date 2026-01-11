// Supabase Edge Function: Generate Mind Map v2
// This function calls Google Gemini API to generate a structured Mind Map from raw notes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Try models in order of availability (most basic first)
// Start with gemini-pro which is the most widely available model
const GEMINI_API_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
]
const MAX_RETRIES = 2

interface RequestBody {
  title: string
  context: 'course' | 'book' | 'article' | 'idea'
  rawNotes: string
}

interface MindMapNode {
  id: string
  text: string
  description?: string
  children?: MindMapNode[]
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Log immediately to verify function is being called
  console.log('=== Edge Function generate-mindmap-v2 called ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  const authHeader = req.headers.get('Authorization')
  console.log('Authorization header present:', !!authHeader)
  console.log('Authorization header preview:', authHeader ? authHeader.substring(0, 30) + '...' : 'none')

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error', details: 'Missing Supabase credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Server configuration error', details: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with auth header from request
    const authHeaderFromRequest = req.headers.get('Authorization')
    if (!authHeaderFromRequest) {
      console.error('Missing Authorization header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeaderFromRequest },
      },
    })

    // Verify authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error('Authentication failed:', authError?.message)
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message || 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User authenticated:', user.id)

    // Parse request body
    let body: RequestBody
    try {
      body = await req.json()
    } catch (error) {
      console.error('Failed to parse request body:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid request body', details: 'Failed to parse JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate required fields
    const { title, context, rawNotes } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: 'title is required and must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!context || !['course', 'book', 'article', 'idea'].includes(context)) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: 'context must be one of: course, book, article, idea' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!rawNotes || typeof rawNotes !== 'string' || rawNotes.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: 'rawNotes is required and must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Define JSON schema for structured output
    // Limited to 2 levels of nesting to avoid "exceeds maximum nesting depth" error
    const mindMapSchema = {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Unique identifier for the root node (usually "root")',
        },
        text: {
          type: 'string',
          description: 'The main title or concept text (max 50 characters)',
        },
        description: {
          type: 'string',
          description: 'Optional detailed explanation of the main concept (max 200 characters)',
        },
        children: {
          type: 'array',
          description: 'Array of child nodes representing subtopics (max 2 levels deep)',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Unique identifier for the node (e.g., "1", "1.1", "1.2")',
              },
              text: {
                type: 'string',
                description: 'Concise label for the subtopic (max 50 characters)',
              },
              description: {
                type: 'string',
                description: 'Optional detailed explanation (max 200 characters)',
              },
              children: {
                type: 'array',
                description: 'Array of nested child nodes (second level only)',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    text: { type: 'string' },
                    description: { type: 'string' },
                  },
                  required: ['id', 'text'],
                },
              },
            },
            required: ['id', 'text'],
          },
        },
      },
      required: ['id', 'text'],
    }

    // Generate prompt for Gemini
    const prompt = `You are an expert at creating structured mind maps from educational content.

Given the following information:
- Title: ${title}
- Context: ${context}
- Raw Notes: ${rawNotes}

Generate a hierarchical mind map that:
1. Has a root node with the title as the main concept
2. Breaks down the content into logical subtopics and sub-subtopics
3. Each node has an id, text, optional description, and optional children array
4. The structure should be educational and help with understanding and memorization
5. Focus on creating a clear hierarchy that aids learning

IMPORTANT: The mind map should have a maximum of 2 levels of nesting (root -> children -> children). Do not create deeper nesting levels.`

    // First, try to get available models from Gemini API
    let availableModels: string[] = []
    try {
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`
      )
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json()
        availableModels = (modelsData.models || [])
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name?.replace('models/', '') || '')
          .filter((name: string) => name)
        console.log(`Found ${availableModels.length} available models from Gemini API`)
      } else {
        console.log('Could not fetch available models, will use fallback list')
      }
    } catch (error) {
      console.error('Error fetching available models:', error)
    }

    // Use available models if found, otherwise use fallback list
    const modelsToTry = availableModels.length > 0 
      ? availableModels.map(name => `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent`)
      : GEMINI_API_ENDPOINTS

    // Call Gemini API with retry logic and endpoint fallback
    let mindMap: MindMapNode | null = null
    let lastError: Error | null = null
    const attemptedModels: string[] = []
    const errorsByModel: Record<string, string> = {}


    for (let endpointIndex = 0; endpointIndex < modelsToTry.length; endpointIndex++) {
      const apiUrl = modelsToTry[endpointIndex]
      const modelName = apiUrl.match(/models\/([^:]+)/)?.[1] || 'unknown'
      console.log(`Trying Gemini API endpoint ${endpointIndex + 1}/${modelsToTry.length}: ${modelName}`)
      attemptedModels.push(modelName)

      // Check if model supports structured output (newer models)
      const supportsStructuredOutput = !modelName.includes('gemini-pro') && !modelName.includes('gemini-1.0-pro')

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          // Build generation config
          const generationConfig: any = {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }

          // Only add structured output for models that support it
          if (supportsStructuredOutput) {
            generationConfig.responseMimeType = 'application/json'
            generationConfig.responseJsonSchema = mindMapSchema
          }
          

          const response = await fetch(
            `${apiUrl}?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: supportsStructuredOutput 
                          ? prompt 
                          : `${prompt}\n\nIMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no code blocks, no explanations):\n${JSON.stringify({id: "root", text: title, description: "Main topic", children: []}, null, 2)}`,
                      },
                    ],
                  },
                ],
                generationConfig,
              }),
            }
          )

        if (!response.ok) {
          const errorText = await response.text()
          const errorMessage = `Gemini API error: ${response.status} - ${errorText}`
          errorsByModel[modelName] = errorMessage
          console.error(`API call failed for ${modelName}:`, response.status)
          throw new Error(errorMessage)
        }
        

        const data: GeminiResponse = await response.json()
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!textContent) {
          throw new Error('No content returned from Gemini API')
        }

        // Parse JSON from response
        // With structured output, the response should already be valid JSON
        // For older models, we need to extract JSON from the text
        let jsonText = textContent.trim()
        
        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        // Try to extract JSON if the response contains other text
        if (!jsonText.startsWith('{')) {
          const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            jsonText = jsonMatch[0]
          }
        }

        mindMap = JSON.parse(jsonText) as MindMapNode

        // Validate structure
        if (!mindMap.id || !mindMap.text) {
          throw new Error('Invalid mind map structure: missing id or text')
        }

          // Success - break both loops
          endpointIndex = GEMINI_API_ENDPOINTS.length
          break
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))
          console.error(`Attempt ${attempt + 1} failed for endpoint ${endpointIndex + 1}:`, lastError.message)


          // If it's a 404, try next endpoint immediately
          if (lastError.message.includes('404') && endpointIndex < modelsToTry.length - 1) {
            console.log(`404 error for ${modelName}, trying next endpoint...`)
            break
          }

          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
          }
        }
      }

      // If we got a successful response, break the endpoint loop
      if (mindMap) {
        break
      }
      
    }

    if (!mindMap) {
      console.error('All retry attempts failed')
      console.error('Attempted models:', attemptedModels)
      console.error('Last error:', lastError?.message)
      return new Response(
        JSON.stringify({
          error: 'Failed to generate mind map',
          details: lastError?.message || 'Unknown error',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({ mindMap }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
