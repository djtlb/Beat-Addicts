import { supabase } from './supabase';

interface SongVision {
  enhancedVision: string;
  arrangement: string;
  productionNotes: string;
  mixingGuidance: string;
}

interface GenreAnalysis {
  suggestedGenre: string;
  bpm: number;
  duration: number;
  keyElements: string[];
  productionTips: string[];
  arrangement: string[];
}

class OpenAIClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    console.log('🚀 OpenAI Client initialized with direct API integration');
    
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }
  }

  async enhancePrompt(prompt: string, genre: string): Promise<string> {
    console.log('🎵 Enhancing prompt with real OpenAI API');
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `You are a professional music producer specializing in ${genre} music. Enhance music generation prompts with specific production details, technical specifications, and genre-appropriate elements. Focus on professional terminology and industry-standard techniques.`
            },
            {
              role: 'user',
              content: `Enhance this music prompt for professional ${genre} production: "${prompt}". Add specific production techniques, instruments, effects, arrangement details, and technical specifications that would result in a radio-ready track.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const enhancedPrompt = data.choices[0]?.message?.content?.trim();
      
      if (!enhancedPrompt) {
        throw new Error('No enhanced prompt received from OpenAI');
      }

      console.log('🎯 OpenAI enhanced prompt successfully');
      return enhancedPrompt;
    } catch (error) {
      console.error('OpenAI prompt enhancement failed:', error);
      throw error;
    }
  }

  async generateSongVision(beatPattern: any, userVision: string, genre: string, bpm: number): Promise<SongVision> {
    console.log('🎨 Creating professional song vision with real OpenAI API');
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `You are a world-class music producer and arranger. Create detailed professional song visions that include enhanced creative direction, specific arrangement structures, production techniques, and mixing guidance. Your expertise covers all genres with industry-standard terminology.`
            },
            {
              role: 'user',
              content: `Create a professional song vision for a ${genre} track at ${bpm} BPM with this user vision: "${userVision}". Beat pattern: ${JSON.stringify(beatPattern)}. 

Provide:
1. Enhanced Vision: Expanded creative direction with specific mood, energy, and musical elements
2. Arrangement: Detailed song structure with bar counts and transitions
3. Production Notes: Specific techniques, instruments, and sound design elements
4. Mixing Guidance: Professional mixing and mastering approach

Format as JSON with keys: enhancedVision, arrangement, productionNotes, mixingGuidance`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No song vision received from OpenAI');
      }

      // Try to parse as JSON, fall back to text parsing
      try {
        const parsed = JSON.parse(content);
        console.log('✨ Professional song vision created with real AI');
        return {
          enhancedVision: parsed.enhancedVision || content,
          arrangement: parsed.arrangement || 'Professional song structure with dynamic progression',
          productionNotes: parsed.productionNotes || 'Advanced production techniques and sound design',
          mixingGuidance: parsed.mixingGuidance || 'Professional mixing and mastering approach'
        };
      } catch {
        // Parse text response
        const lines = content.split('\n');
        return {
          enhancedVision: content,
          arrangement: 'Professional song structure with dynamic progression',
          productionNotes: 'Advanced production techniques and sound design',
          mixingGuidance: 'Professional mixing and mastering approach'
        };
      }
    } catch (error) {
      console.error('OpenAI song vision creation failed:', error);
      throw error;
    }
  }

  async generateLyrics(theme: string, style: string, songStructure?: string): Promise<string> {
    console.log('📝 Generating professional lyrics with real OpenAI API');
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `You are a professional songwriter and lyricist with expertise in ${style} music. Create original, engaging lyrics with proper song structure, strong hooks, and emotional depth. Use industry-standard formatting with section labels.`
            },
            {
              role: 'user',
              content: `Write original song lyrics with theme: "${theme}" in ${style} style. ${songStructure ? `Use this structure: ${songStructure}` : 'Use standard song structure with verses, chorus, and bridge.'}

Requirements:
- Include proper section labels [verse], [chorus], [bridge]
- Create memorable hooks and catchphrases
- Ensure rhythmic flow appropriate for the genre
- Make it emotionally engaging and relatable
- 200-400 words total`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const lyrics = data.choices[0]?.message?.content?.trim();
      
      if (!lyrics) {
        throw new Error('No lyrics received from OpenAI');
      }

      console.log('🎤 Professional lyrics generated with real AI');
      return lyrics;
    } catch (error) {
      console.error('OpenAI lyrics generation failed:', error);
      throw error;
    }
  }

  async analyzeGenreAndSuggestParameters(prompt: string): Promise<GenreAnalysis> {
    console.log('🎯 Analyzing genre with real OpenAI API');
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a music genre expert and producer. Analyze music descriptions and suggest appropriate genre classifications, BPM ranges, key elements, and production techniques. Provide practical, industry-standard recommendations.'
            },
            {
              role: 'user',
              content: `Analyze this music description and suggest production parameters: "${prompt}"

Provide analysis as JSON with:
- suggestedGenre: most appropriate genre (edm, house, trap, dubstep, techno, trance, hip-hop, rock, etc.)
- bpm: recommended BPM (number)
- duration: suggested track length in seconds (number)
- keyElements: array of key musical elements (strings)
- productionTips: array of specific production techniques (strings)
- arrangement: array of song structure sections (strings)`
            }
          ],
          temperature: 0.3,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No genre analysis received from OpenAI');
      }

      try {
        const parsed = JSON.parse(content);
        console.log('🎯 Advanced genre analysis completed with real AI');
        return {
          suggestedGenre: parsed.suggestedGenre || 'edm',
          bpm: parsed.bpm || 128,
          duration: parsed.duration || 180,
          keyElements: parsed.keyElements || [],
          productionTips: parsed.productionTips || [],
          arrangement: parsed.arrangement || []
        };
      } catch {
        // Fallback parsing if JSON fails
        return {
          suggestedGenre: 'edm',
          bpm: 128,
          duration: 180,
          keyElements: ['electronic elements', 'synthesizers', 'drum patterns'],
          productionTips: ['Use professional mixing', 'Apply mastering chain'],
          arrangement: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro']
        };
      }
    } catch (error) {
      console.error('OpenAI genre analysis failed:', error);
      throw error;
    }
  }

  isClientAvailable(): boolean {
    return !!this.apiKey;
  }

  getModelInfo(): string {
    return 'GPT-4 Turbo (Live API)';
  }
}

export const openaiClient = new OpenAIClient();