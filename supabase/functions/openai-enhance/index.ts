import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request for OpenAI enhance')
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    })
  }

  try {
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed. Use POST.'
        }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('🔑 OpenAI API key status:', openaiApiKey ? 'Available' : 'Missing')

    let requestBody
    try {
      const text = await req.text()
      console.log('📥 Request body received, length:', text.length)
      
      if (!text || text.trim() === '') {
        throw new Error('Empty request body')
      }
      
      requestBody = JSON.parse(text)
      console.log('✅ JSON parsed successfully')
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body',
          details: parseError.message
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    console.log('🤖 OpenAI Enhancement request received')
    
    const { type, prompt, genre, lyrics, theme, style, songStructure, beatPattern, userVision, bpm } = requestBody || {}
    
    if (!type) {
      console.log('❌ Missing type parameter')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Request type is required (enhancePrompt, generateSongVision, generateLyrics, analyzeGenre)'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🔄 Processing request type:', type)
    
    let result = {}

    // Use fallback responses if OpenAI key is missing or request fails
    if (!openaiApiKey) {
      console.log('⚠️ No OpenAI key, using fallback responses')
      result = generateFallbackResponse(type, { prompt, genre, theme, style, userVision, bpm })
    } else {
      try {
        result = await processOpenAIRequest(type, requestBody, openaiApiKey)
      } catch (openaiError) {
        console.error('❌ OpenAI request failed:', openaiError.message)
        result = generateFallbackResponse(type, { prompt, genre, theme, style, userVision, bpm })
        result.fallbackUsed = true
      }
    }

    console.log('✅ OpenAI Enhancement completed successfully')

    const response = {
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    )

  } catch (error) {
    console.error('💥 OpenAI Enhancement error:', error.message)
    console.error('📚 Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'OpenAI enhancement failed',
        fallbackUsed: true,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, // Return 200 with error in body to prevent retry loops
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

async function processOpenAIRequest(type: string, requestBody: any, apiKey: string) {
  console.log('🚀 Making OpenAI API request for type:', type)
  
  const { prompt, genre, lyrics, theme, style, songStructure, beatPattern, userVision, bpm } = requestBody
  
  let openaiResponse
  let result = {}

  switch (type) {
    case 'enhancePrompt':
      if (!prompt || !genre) {
        throw new Error('Prompt and genre are required for enhancement')
      }
      
      console.log(`🎵 Enhancing prompt for ${genre}`)
      
      openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a professional music producer. Enhance music prompts for ${genre} with specific production details.`
            },
            {
              role: "user",
              content: `Enhance this ${genre} music prompt: "${prompt}"`
            }
          ],
          max_tokens: 400,
          temperature: 0.8
        })
      })

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`)
      }

      const enhanceData = await openaiResponse.json()
      result = {
        enhancedPrompt: enhanceData.choices[0]?.message?.content?.trim() || prompt,
        model: "GPT-4o-mini"
      }
      break

    case 'generateSongVision':
      console.log('🎼 Generating song vision')
      result = {
        enhancedVision: `Professional ${genre || 'electronic'} production with dynamic arrangement and professional mixing`,
        arrangement: 'Intro → Verse → Chorus → Verse → Chorus → Bridge → Final Chorus → Outro',
        productionNotes: `Advanced production techniques for ${genre || 'electronic'} music with professional sound design`,
        mixingGuidance: 'Professional EQ, compression, and stereo imaging for commercial release quality',
        model: "Fallback Vision"
      }
      break

    case 'generateLyrics':
      console.log('📝 Generating lyrics')
      result = {
        lyrics: generateFallbackLyrics(theme || 'music', style || 'pop'),
        model: "Fallback Lyrics"
      }
      break

    case 'analyzeGenre':
      console.log('🔍 Analyzing genre')
      result = generateFallbackAnalysis(prompt || 'electronic music')
      break

    default:
      throw new Error(`Unknown request type: ${type}`)
  }

  return result
}

function generateFallbackResponse(type: string, params: any) {
  console.log('🔄 Generating fallback response for type:', type)
  
  switch (type) {
    case 'enhancePrompt':
      return {
        enhancedPrompt: fallbackPromptEnhancement(params.prompt || '', params.genre || 'electronic'),
        model: "Fallback Enhancement",
        fallbackUsed: true
      }
    case 'generateSongVision':
      return {
        ...fallbackSongVision(params.userVision || 'Create music', params.genre || 'electronic'),
        model: "Fallback Vision",
        fallbackUsed: true
      }
    case 'generateLyrics':
      return {
        lyrics: generateFallbackLyrics(params.theme || 'music', params.style || 'pop'),
        model: "Fallback Lyrics",
        fallbackUsed: true
      }
    case 'analyzeGenre':
      return {
        ...generateFallbackAnalysis(params.prompt || 'electronic music'),
        model: "Fallback Analysis",
        fallbackUsed: true
      }
    default:
      return {
        error: `Unknown request type: ${type}`,
        fallbackUsed: true
      }
  }
}

function fallbackPromptEnhancement(prompt: string, genre: string): string {
  const genreElements = {
    'edm': 'massive synth leads, thunderous bass drops, festival-ready energy, 128 BPM',
    'house': 'four-on-floor groove, soulful elements, deep basslines, 125 BPM',
    'trap': 'hard-hitting 808s, rapid hi-hat patterns, melodic leads, 150 BPM',
    'dubstep': 'wobble bass, aggressive drops, mechanical rhythms, 140 BPM',
    'techno': 'hypnotic loops, industrial elements, driving force, 130 BPM'
  }

  const elements = genreElements[genre as keyof typeof genreElements] || genreElements.edm
  return `${prompt}, ${elements}, professional production, radio-ready quality`
}

function fallbackSongVision(userVision: string, genre: string) {
  return {
    enhancedVision: `Professional ${genre} production: ${userVision} with cutting-edge sound design`,
    arrangement: 'Intro (8 bars) → Verse (16) → Chorus (16) → Verse (16) → Chorus (16) → Bridge (8) → Final Chorus (16) → Outro (8)',
    productionNotes: `Advanced ${genre} production techniques with professional mixing and dynamic processing`,
    mixingGuidance: 'Professional EQ, compression, stereo imaging, and master bus processing'
  }
}

function generateFallbackLyrics(theme: string, style: string): string {
  return `[verse]
${theme} inspiration flows through my soul
Every beat tells a story that makes me whole
Creating music that speaks to the heart
This is where the magic starts

[chorus]
This is the sound of ${style}
Rising up, reaching high
Every note a piece of me
Music sets my spirit free

[verse]
Through the speakers the energy flows
Every listener feels it and knows
This is more than just a song
This is where we all belong

[bridge]
From the studio to the stage
This is our golden age
Every melody, every rhyme
Living in this moment in time`
}

function generateFallbackAnalysis(prompt: string) {
  const promptLower = prompt.toLowerCase()
  
  if (promptLower.includes('electronic') || promptLower.includes('edm')) {
    return {
      suggestedGenre: 'edm',
      bpm: 128,
      duration: 240,
      keyElements: ['synth leads', 'bass drops', 'electronic drums'],
      productionTips: ['Use sidechain compression', 'Layer multiple synths', 'Add white noise sweeps'],
      arrangement: ['intro', 'buildup', 'drop', 'breakdown', 'drop', 'outro']
    }
  }
  
  return {
    suggestedGenre: 'pop',
    bpm: 120,
    duration: 210,
    keyElements: ['catchy melody', 'modern drums', 'radio-friendly'],
    productionTips: ['Focus on the hook', 'Keep it simple', 'Professional vocals'],
    arrangement: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro']
  }
}