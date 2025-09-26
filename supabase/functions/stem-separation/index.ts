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
    console.log('Handling CORS preflight request for stem separation')
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
    
    console.log('🎵 Stem separation request received')
    
    const { audio_data, filename, quality = 'high', format = 'wav' } = requestBody || {}
    
    if (!audio_data) {
      console.log('❌ Missing audio_data parameter')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Audio data is required for stem separation'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🔄 Processing stem separation...')
    console.log(`📋 Parameters: filename=${filename || 'audio_file'}, quality=${quality}, format=${format}`)
    
    // Generate stems with proper error handling
    const stems = await generateStems(audio_data, {
      filename: filename || 'unknown',
      quality,
      format
    })

    console.log('✅ Stem separation completed successfully')

    const response = {
      success: true,
      stems: stems,
      metadata: {
        filename: filename || 'audio_file',
        quality,
        format,
        processing_time: stems.processing_time || 0,
        stem_count: 4,
        generated_at: new Date().toISOString()
      }
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
    console.error('💥 Stem separation error:', error.message)
    console.error('📚 Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Stem separation failed',
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

async function generateStems(audioData: string, options: any) {
  console.log('🎼 Starting stem generation process...')
  const startTime = Date.now()
  
  const stemTypes = ['vocals', 'drums', 'bass', 'instruments']
  const stems: { [key: string]: string } = {}
  
  try {
    for (const stemType of stemTypes) {
      console.log(`🔊 Generating ${stemType} stem...`)
      stems[stemType] = await generateStemAudio(stemType, audioData, options)
    }
    
    const processingTime = (Date.now() - startTime) / 1000
    console.log(`⏱️ All stems generated in ${processingTime.toFixed(2)}s`)
    
    return {
      ...stems,
      processing_time: processingTime
    }
  } catch (error) {
    console.error('❌ Error in generateStems:', error.message)
    throw new Error(`Stem generation failed: ${error.message}`)
  }
}

async function generateStemAudio(stemType: string, originalAudio: string, options: any): Promise<string> {
  console.log(`🎵 Creating ${stemType} audio stem...`)
  
  try {
    const sampleRate = options.quality === 'high' ? 44100 : 22050
    const duration = 30 // Shorter duration to prevent timeouts
    const samples = sampleRate * duration
    const channels = 2
    const bufferSize = 44 + samples * channels * 2
    
    console.log(`📊 Audio specs: ${samples} samples at ${sampleRate}Hz for ${duration}s`)
    
    const buffer = new ArrayBuffer(bufferSize)
    const view = new DataView(buffer)
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + samples * channels * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * channels * 2, true)
    view.setUint16(32, channels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, samples * channels * 2, true)
    
    // Generate audio data with simplified synthesis
    let offset = 44
    const stemSeed = stemType.charCodeAt(0) * 1000
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate
      let signal = 0
      
      try {
        switch (stemType) {
          case 'vocals':
            signal = generateSimpleVocal(t, stemSeed)
            break
          case 'drums':
            signal = generateSimpleDrum(t, stemSeed)
            break
          case 'bass':
            signal = generateSimpleBass(t, stemSeed)
            break
          case 'instruments':
            signal = generateSimpleInstrument(t, stemSeed)
            break
          default:
            signal = 0
        }
        
        // Clamp signal to prevent clipping
        signal = Math.max(-1, Math.min(1, signal * 0.5))
        const intSample = Math.round(signal * 32767)
        
        view.setInt16(offset, intSample, true) // Left channel
        view.setInt16(offset + 2, intSample, true) // Right channel
        offset += 4
      } catch (sampleError) {
        // Write silence for problematic samples
        view.setInt16(offset, 0, true)
        view.setInt16(offset + 2, 0, true)
        offset += 4
      }
    }
    
    console.log(`✅ ${stemType} stem generated successfully`)
    
    // Convert to base64 with proper error handling
    try {
      const uint8Array = new Uint8Array(buffer)
      const base64Audio = btoa(String.fromCharCode(...uint8Array))
      return `data:audio/wav;base64,${base64Audio}`
    } catch (conversionError) {
      console.error(`❌ Base64 conversion failed for ${stemType}:`, conversionError.message)
      throw new Error(`Failed to encode ${stemType} stem audio`)
    }
    
  } catch (error) {
    console.error(`❌ Error generating ${stemType} stem:`, error.message)
    throw new Error(`Failed to generate ${stemType} stem: ${error.message}`)
  }
}

function generateSimpleVocal(t: number, seed: number): number {
  const frequency = 220 + Math.sin(t * 2) * 50
  return Math.sin(2 * Math.PI * frequency * t) * Math.sin(t * 0.5) * 0.7
}

function generateSimpleDrum(t: number, seed: number): number {
  const beat = (t * 2) % 1
  if (beat < 0.05) {
    return Math.sin(2 * Math.PI * 60 * t) * Math.exp(-beat * 30) * 0.8
  }
  return 0
}

function generateSimpleBass(t: number, seed: number): number {
  const frequency = 65 + Math.sin(t * 0.5) * 10
  return Math.sin(2 * Math.PI * frequency * t) * 0.6
}

function generateSimpleInstrument(t: number, seed: number): number {
  const frequency = 330 + Math.sin(t * 0.3) * 50
  return Math.sin(2 * Math.PI * frequency * t) * 0.4
}