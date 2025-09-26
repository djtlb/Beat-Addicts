interface GenerationParams {
  tags: string;
  lyrics?: string;
  duration: number;
  steps: number;
  guidance_scale: number;
  seed: number;
  scheduler_type: string;
  cfg_type: string;
  use_random_seed: boolean;
  genre?: string;
  structure?: string;
  production_style?: string;
}

interface ACEStepResponse {
  audio_url: string;
  duration: number;
  generation_time: number;
  rtf: number;
  metadata: {
    tags: string;
    lyrics?: string;
    params: GenerationParams;
    structure_analysis?: any;
  };
}

interface GenreStructure {
  name: string;
  typical_duration: number;
  structure: string[];
  bpm_range: [number, number];
  key_elements: string[];
  production_techniques: string[];
  arrangement_pattern: string;
}

class ACEStepClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.ace-step.ai/v1';

  // Define genre-specific structures and production techniques
  private genreStructures: { [key: string]: GenreStructure } = {
    edm: {
      name: 'EDM/Electronic Dance Music',
      typical_duration: 240,
      structure: ['intro', 'buildup', 'drop', 'breakdown', 'buildup2', 'drop2', 'outro'],
      bpm_range: [120, 140],
      key_elements: ['synth leads', 'bass drops', 'kick patterns', 'risers', 'white noise sweeps'],
      production_techniques: ['sidechain compression', 'filter automation', 'reverb tails', 'pitch bends'],
      arrangement_pattern: '[intro:16bars] -> [buildup:16bars] -> [drop:32bars] -> [breakdown:16bars] -> [buildup:16bars] -> [drop:32bars] -> [outro:16bars]'
    },
    house: {
      name: 'House Music',
      typical_duration: 300,
      structure: ['intro', 'verse', 'chorus', 'breakdown', 'verse2', 'chorus2', 'outro'],
      bpm_range: [120, 130],
      key_elements: ['four-on-floor kick', 'hi-hats', 'bass groove', 'vocal chops', 'piano stabs'],
      production_techniques: ['groove quantization', 'swing timing', 'filter sweeps', 'vocal processing'],
      arrangement_pattern: '[intro:32bars] -> [verse:32bars] -> [chorus:32bars] -> [breakdown:16bars] -> [verse:32bars] -> [chorus:32bars] -> [outro:32bars]'
    },
    trap: {
      name: 'Trap',
      typical_duration: 180,
      structure: ['intro', 'verse', 'hook', 'verse2', 'hook2', 'bridge', 'hook3', 'outro'],
      bpm_range: [130, 170],
      key_elements: ['808 drums', 'hi-hat rolls', 'snare patterns', 'melodic elements', 'vocal chops'],
      production_techniques: ['pitch automation', 'distortion', 'stereo imaging', 'compression'],
      arrangement_pattern: '[intro:8bars] -> [verse:16bars] -> [hook:16bars] -> [verse:16bars] -> [hook:16bars] -> [bridge:8bars] -> [hook:16bars] -> [outro:8bars]'
    },
    dubstep: {
      name: 'Dubstep',
      typical_duration: 210,
      structure: ['intro', 'buildup', 'drop', 'breakdown', 'buildup2', 'drop2', 'outro'],
      bpm_range: [140, 150],
      key_elements: ['wobble bass', 'syncopated drums', 'vocal samples', 'risers', 'impacts'],
      production_techniques: ['LFO modulation', 'distortion chains', 'frequency splitting', 'reverb automation'],
      arrangement_pattern: '[intro:16bars] -> [buildup:16bars] -> [drop:32bars] -> [breakdown:16bars] -> [buildup:16bars] -> [drop:32bars] -> [outro:16bars]'
    },
    techno: {
      name: 'Techno',
      typical_duration: 360,
      structure: ['intro', 'development', 'peak', 'breakdown', 'rebuild', 'climax', 'outro'],
      bpm_range: [120, 135],
      key_elements: ['driving kick', 'percussion loops', 'acid sequences', 'atmospheric pads'],
      production_techniques: ['loop-based arrangement', 'filter automation', 'delay effects', 'compression'],
      arrangement_pattern: '[intro:64bars] -> [development:64bars] -> [peak:32bars] -> [breakdown:32bars] -> [rebuild:32bars] -> [climax:64bars] -> [outro:32bars]'
    },
    trance: {
      name: 'Trance',
      typical_duration: 420,
      structure: ['intro', 'breakdown', 'buildup', 'climax', 'breakdown2', 'buildup2', 'climax2', 'outro'],
      bpm_range: [130, 140],
      key_elements: ['arpeggiated leads', 'uplifting melodies', 'epic pads', 'emotional breakdowns'],
      production_techniques: ['gate effects', 'reverb automation', 'pitch modulation', 'layered synthesis'],
      arrangement_pattern: '[intro:32bars] -> [breakdown:32bars] -> [buildup:32bars] -> [climax:64bars] -> [breakdown:32bars] -> [buildup:32bars] -> [climax:64bars] -> [outro:32bars]'
    },
    'hip-hop': {
      name: 'Hip-Hop',
      typical_duration: 200,
      structure: ['intro', 'verse', 'chorus', 'verse2', 'chorus2', 'bridge', 'chorus3', 'outro'],
      bpm_range: [70, 140],
      key_elements: ['drum breaks', 'bass lines', 'melodic samples', 'vocal elements'],
      production_techniques: ['sampling', 'chopping', 'layering', 'swing quantization'],
      arrangement_pattern: '[intro:8bars] -> [verse:16bars] -> [chorus:16bars] -> [verse:16bars] -> [chorus:16bars] -> [bridge:8bars] -> [chorus:16bars] -> [outro:8bars]'
    },
    dnb: {
      name: 'Drum & Bass',
      typical_duration: 300,
      structure: ['intro', 'buildup', 'drop', 'breakdown', 'buildup2', 'drop2', 'outro'],
      bpm_range: [170, 180],
      key_elements: ['breakbeats', 'sub bass', 'reese bass', 'atmospheric elements'],
      production_techniques: ['time-stretching', 'chopping breaks', 'bass modulation', 'reverb processing'],
      arrangement_pattern: '[intro:32bars] -> [buildup:16bars] -> [drop:64bars] -> [breakdown:32bars] -> [buildup:16bars] -> [drop:64bars] -> [outro:16bars]'
    },
    ambient: {
      name: 'Ambient',
      typical_duration: 480,
      structure: ['emergence', 'development', 'climax', 'resolution'],
      bpm_range: [60, 90],
      key_elements: ['atmospheric pads', 'field recordings', 'subtle percussion', 'evolving textures'],
      production_techniques: ['granular synthesis', 'long reverbs', 'modulation', 'spatial effects'],
      arrangement_pattern: '[emergence:120bars] -> [development:120bars] -> [climax:120bars] -> [resolution:120bars]'
    },
    rock: {
      name: 'Rock',
      typical_duration: 240,
      structure: ['intro', 'verse', 'chorus', 'verse2', 'chorus2', 'bridge', 'solo', 'chorus3', 'outro'],
      bpm_range: [110, 140],
      key_elements: ['electric guitars', 'bass guitar', 'drums', 'vocals'],
      production_techniques: ['guitar amp simulation', 'drum compression', 'harmonic saturation'],
      arrangement_pattern: '[intro:8bars] -> [verse:16bars] -> [chorus:16bars] -> [verse:16bars] -> [chorus:16bars] -> [bridge:8bars] -> [solo:16bars] -> [chorus:16bars] -> [outro:8bars]'
    }
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_ACE_STEP_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || '';
    console.log('ACE-Step initialized with real API key:', this.apiKey ? 'Available' : 'Missing');
    
    if (!this.apiKey) {
      throw new Error('ACE-Step API key is required. Please add VITE_ACE_STEP_API_KEY or VITE_OPENAI_API_KEY to your environment variables.');
    }
  }

  private detectGenre(tags: string): string {
    const normalizedTags = tags.toLowerCase();
    
    // Genre detection logic
    if (normalizedTags.includes('edm') || normalizedTags.includes('electronic dance')) return 'edm';
    if (normalizedTags.includes('house')) return 'house';
    if (normalizedTags.includes('trap')) return 'trap';
    if (normalizedTags.includes('dubstep')) return 'dubstep';
    if (normalizedTags.includes('techno')) return 'techno';
    if (normalizedTags.includes('trance')) return 'trance';
    if (normalizedTags.includes('hip-hop') || normalizedTags.includes('rap')) return 'hip-hop';
    if (normalizedTags.includes('drum') && normalizedTags.includes('bass') || normalizedTags.includes('dnb')) return 'dnb';
    if (normalizedTags.includes('ambient') || normalizedTags.includes('atmospheric')) return 'ambient';
    if (normalizedTags.includes('rock') || normalizedTags.includes('guitar')) return 'rock';
    
    // Default to EDM if no specific genre detected
    return 'edm';
  }

  private generateStructuredTags(params: GenerationParams): string {
    const genre = params.genre || this.detectGenre(params.tags);
    const structure = this.genreStructures[genre] || this.genreStructures.edm;
    
    console.log('Generating structured tags for genre:', genre, structure);

    // Build comprehensive tags based on genre structure
    let structuredTags = params.tags;

    // Add BPM specification
    const avgBpm = Math.round((structure.bpm_range[0] + structure.bpm_range[1]) / 2);
    structuredTags += `, ${avgBpm}bpm`;

    // Add key elements
    structuredTags += `, ${structure.key_elements.join(', ')}`;

    // Add production techniques
    structuredTags += `, ${structure.production_techniques.join(', ')}`;

    // Add structure-based arrangement
    structuredTags += `, professional arrangement, ${structure.arrangement_pattern}`;

    // Add genre-specific production elements
    switch (genre) {
      case 'edm':
        structuredTags += ', massive drops, festival ready, main stage energy, build tension, euphoric breakdown, hands in the air moment';
        break;
      case 'house':
        structuredTags += ', groove-based, dancefloor ready, infectious rhythm, deep bassline, uplifting energy';
        break;
      case 'trap':
        structuredTags += ', hard-hitting 808s, crisp snares, melodic elements, modern production, club ready';
        break;
      case 'dubstep':
        structuredTags += ', heavy wobbles, aggressive drops, mechanical rhythms, underground energy, festival bass';
        break;
      case 'techno':
        structuredTags += ', hypnotic loops, industrial sounds, driving force, warehouse atmosphere, peak time energy';
        break;
      case 'trance':
        structuredTags += ', emotional journey, uplifting melodies, epic breakdowns, hands-up moments, euphoric climax';
        break;
      case 'hip-hop':
        structuredTags += ', street credibility, lyrical flow, boom bap elements, modern trap influence, urban atmosphere';
        break;
      case 'dnb':
        structuredTags += ', jungle breaks, rolling basslines, fast-paced energy, underground vibes, liquid elements';
        break;
      case 'ambient':
        structuredTags += ', evolving soundscapes, meditative atmosphere, spatial depth, organic textures, minimal percussion';
        break;
      case 'rock':
        structuredTags += ', power chords, dynamic drums, guitar solos, anthemic chorus, stadium energy';
        break;
    }

    return structuredTags;
  }

  async generateMusic(params: GenerationParams): Promise<ACEStepResponse> {
    const genre = params.genre || this.detectGenre(params.tags);
    const structure = this.genreStructures[genre] || this.genreStructures.edm;
    
    console.log('ACE-Step generation started with real API for genre:', genre);
    
    // Use structured tags for better generation
    const enhancedParams = {
      ...params,
      tags: this.generateStructuredTags(params),
      duration: params.duration || structure.typical_duration
    };

    console.log('Enhanced generation parameters:', enhancedParams);

    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: enhancedParams.tags,
          lyrics: enhancedParams.lyrics || null,
          duration: enhancedParams.duration,
          inference_steps: enhancedParams.steps,
          guidance_scale: enhancedParams.guidance_scale,
          seed: enhancedParams.use_random_seed ? null : enhancedParams.seed,
          scheduler: enhancedParams.scheduler_type,
          cfg_type: enhancedParams.cfg_type,
          output_format: 'wav',
          sample_rate: 44100,
          genre_structure: structure,
          arrangement_mode: 'structured'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ACE-Step API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('ACE-Step real generation completed:', result);
      
      return {
        audio_url: result.audio_url,
        duration: result.duration,
        generation_time: result.generation_time,
        rtf: result.rtf || 27.27,
        metadata: {
          tags: enhancedParams.tags,
          lyrics: enhancedParams.lyrics,
          params: enhancedParams,
          structure_analysis: {
            genre: genre,
            structure: structure.structure,
            detected_elements: structure.key_elements,
            arrangement: structure.arrangement_pattern
          }
        }
      };
    } catch (error) {
      console.error('ACE-Step API error:', error);
      throw error;
    }
  }

  async lyricToFlow(lyrics: string, style: string): Promise<ACEStepResponse> {
    console.log('Lyric-to-flow generation with real ACE-Step API:', { lyrics: lyrics.substring(0, 50), style });
    
    const genre = style.includes('rap') || style.includes('hip-hop') ? 'hip-hop' : 'edm';
    
    const params: GenerationParams = {
      tags: `vocal, ${style}, lyrics, professional vocal production, clear articulation`,
      lyrics: lyrics,
      duration: Math.min(lyrics.length / 8 + 60, 240),
      steps: 27,
      guidance_scale: 7.5,
      seed: Math.floor(Math.random() * 1000000),
      scheduler_type: 'euler',
      cfg_type: 'constant',
      use_random_seed: true,
      genre: genre
    };
    
    return this.generateMusic(params);
  }

  async stemSeparation(audioFile: File): Promise<{
    vocals: string;
    drums: string;
    bass: string;
    instruments: string;
  }> {
    console.log('ACE-Step stem separation started for:', audioFile.name);
    
    if (!audioFile) {
      throw new Error('Audio file is required for stem separation');
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('model', 'htdemucs');
      formData.append('format', 'wav');

      const response = await fetch(`${this.baseUrl}/separate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ACE-Step stem separation error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('ACE-Step stem separation completed');
      
      return {
        vocals: result.stems.vocals,
        drums: result.stems.drums,
        bass: result.stems.bass,
        instruments: result.stems.other
      };
    } catch (error) {
      console.error('ACE-Step stem separation failed:', error);
      throw error;
    }
  }
}

export const aceStepClient = new ACEStepClient();
export type { GenerationParams, ACEStepResponse };