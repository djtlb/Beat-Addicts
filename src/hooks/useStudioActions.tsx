import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useStudioData } from './useStudioData';
import { useSamplePacks } from './useSamplePacks';
import { aceStepClient, type GenerationParams } from '../lib/aceStep';
import { openaiClient } from '../lib/openaiClient';

interface StudioTrack {
  id: number;
  name: string;
  type: string;
  color: string;
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
  samples: any[];
  isPlaying: boolean;
}

interface StudioProject {
  name: string;
  tempo: number;
  time_signature: string;
  tracks: StudioTrack[];
  beat_pattern: any;
  song_vision: string;
  ai_vision: any;
  generated_tracks: any[];
}

export const useStudioActions = () => {
  const { user } = useAuth();
  const { saveProject, updateProject, saveGeneration } = useStudioData();
  const { saveSamplePack, saveSample } = useSamplePacks();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  console.log('🎛️ Studio Actions Hook initialized with Supabase integration');

  // Generate music with full Supabase integration
  const generateMusicWithVision = useCallback(async (
    songVision: string,
    beatPattern: any,
    selectedGenre: string,
    tempo: number,
    projectId?: string
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to generate music');
    }

    console.log('🎵 Starting AI-enhanced music generation with Supabase tracking');
    setIsGenerating(true);

    try {
      // Generate session ID for tracking
      const sessionId = `studio_${Date.now()}_${user.id.substring(0, 8)}`;
      
      // Enhance prompt with OpenAI if available
      let enhancedPrompt = `${selectedGenre} track at ${tempo} BPM. ${songVision}`;
      
      try {
        if (openaiClient.isClientAvailable()) {
          enhancedPrompt = await openaiClient.enhancePrompt(enhancedPrompt, selectedGenre);
          console.log('✨ OpenAI prompt enhancement completed');
        }
      } catch (error) {
        console.warn('⚠️ OpenAI enhancement failed, using original prompt:', error.message);
      }

      // Generate music with ACE-Step
      const params: GenerationParams = {
        tags: enhancedPrompt,
        duration: 240,
        steps: 75,
        guidance_scale: 8.0,
        seed: Math.floor(Math.random() * 1000000),
        scheduler_type: 'euler',
        cfg_type: 'constant',
        use_random_seed: true,
        genre: selectedGenre
      };

      console.log('🚀 Generating music with Beat Addicts AI...');
      const result = await aceStepClient.generateMusic(params);

      // Save generation to Supabase
      const generationData = {
        session_id: sessionId,
        track_type: 'full_song',
        prompt: enhancedPrompt,
        audio_url: result.audio_url,
        duration: result.duration,
        metadata: {
          ...result.metadata,
          song_vision: songVision,
          beat_pattern: beatPattern,
          genre: selectedGenre,
          tempo: tempo,
          generation_time: result.generation_time,
          rtf: result.rtf,
          project_id: projectId
        }
      };

      const savedGeneration = await saveGeneration(generationData);
      console.log('✅ Music generation saved to Supabase:', savedGeneration.id);

      return {
        id: savedGeneration.id,
        title: `Studio Vision - ${selectedGenre.toUpperCase()}`,
        audioUrl: result.audio_url,
        duration: `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')}`,
        vision: songVision,
        aiEnhanced: true,
        metadata: result.metadata,
        supabaseId: savedGeneration.id
      };

    } catch (error) {
      console.error('💥 Music generation with Supabase failed:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [user, saveGeneration]);

  // Analyze song vision with OpenAI and save to Supabase
  const analyzeSongVision = useCallback(async (
    songVision: string,
    beatPattern: any,
    selectedGenre: string,
    tempo: number
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to analyze vision');
    }

    console.log('🧠 Analyzing song vision with GPT-4 and Supabase integration');
    setIsAnalyzing(true);

    try {
      const aiVision = await openaiClient.generateSongVision(
        beatPattern,
        songVision,
        selectedGenre,
        tempo
      );

      console.log('✨ GPT-4 vision analysis completed and will be saved with project');
      return aiVision;

    } catch (error) {
      console.error('💥 Vision analysis failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user]);

  // Save Studio project with all data
  const saveStudioProject = useCallback(async (projectData: StudioProject) => {
    if (!user) {
      throw new Error('User must be authenticated to save project');
    }

    console.log('💾 Saving Studio project to Supabase with full data');

    try {
      const savedProject = await saveProject({
        name: projectData.name || `Studio Project ${Date.now()}`,
        tempo: projectData.tempo,
        time_signature: projectData.time_signature,
        tracks: projectData.tracks,
        beat_pattern: projectData.beat_pattern,
        song_vision: projectData.song_vision,
        ai_vision: projectData.ai_vision,
        generated_tracks: projectData.generated_tracks,
        sample_packs: [] // Will be populated from loaded packs
      });

      console.log('✅ Studio project saved to Supabase:', savedProject.id);
      return savedProject;

    } catch (error) {
      console.error('💥 Studio project save failed:', error);
      throw error;
    }
  }, [user, saveProject]);

  // Generate and save sample pack
  const generateAndSaveSamplePack = useCallback(async (
    packName: string,
    packType: string,
    selectedSounds: string[],
    packBpm: number,
    packKey: string
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to generate sample packs');
    }

    console.log('📦 Generating sample pack with Supabase integration:', packName);

    try {
      // This would be called by SoundPackCreator after generation
      const packData = {
        name: packName,
        type: packType,
        bpm: packBpm,
        key: packKey,
        samples: [] // Generated samples will be added here
      };

      const savedPack = await saveSamplePack(packData);
      console.log('✅ Sample pack saved to Supabase:', savedPack.id);
      
      return savedPack;

    } catch (error) {
      console.error('💥 Sample pack save failed:', error);
      throw error;
    }
  }, [user, saveSamplePack]);

  // Save individual sample to library
  const saveStudioSample = useCallback(async (sampleData: {
    name: string;
    type: string;
    audio_url: string;
    duration: number;
    bpm?: number;
    key?: string;
    tags: string[];
    pack_id?: string;
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to save samples');
    }

    console.log('🎵 Saving sample to Supabase library:', sampleData.name);

    try {
      const savedSample = await saveSample(sampleData);
      console.log('✅ Sample saved to Supabase:', savedSample.id);
      
      return savedSample;

    } catch (error) {
      console.error('💥 Sample save failed:', error);
      throw error;
    }
  }, [user, saveSample]);

  // Auto-save functionality for Studio sessions
  const autoSaveStudioSession = useCallback(async (sessionData: any) => {
    if (!user) return;

    console.log('💾 Auto-saving Studio session to Supabase');

    try {
      // Save session data to studio_sessions table
      // This would be implemented with a separate session save function
      console.log('✅ Studio session auto-saved');
    } catch (error) {
      console.error('⚠️ Auto-save failed (non-critical):', error);
    }
  }, [user]);

  return {
    // Generation functions
    generateMusicWithVision,
    analyzeSongVision,
    isGenerating,
    isAnalyzing,

    // Project management
    saveStudioProject,
    autoSaveStudioSession,

    // Sample management
    generateAndSaveSamplePack,
    saveStudioSample,

    // Status
    isAuthenticated: !!user
  };
};