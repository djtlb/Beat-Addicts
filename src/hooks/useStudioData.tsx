import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface StudioProject {
  id: string;
  user_id: string;
  name: string;
  tempo: number;
  time_signature: string;
  tracks: any[];
  beat_pattern: any;
  song_vision: string;
  ai_vision: any;
  generated_tracks: any[];
  sample_packs: string[];
  created_at: string;
  updated_at: string;
}

interface MusicGeneration {
  id: string;
  user_id: string;
  session_id: string;
  track_type: string;
  prompt: string;
  audio_url: string;
  duration: number;
  metadata: any;
  created_at: string;
}

export const useStudioData = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [generations, setGenerations] = useState<MusicGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🗄️ Studio Data Hook initialized for user:', user?.email);

  // Load user's Studio projects
  const loadProjects = async () => {
    if (!user) return;

    console.log('📂 Loading Studio projects from Supabase...');
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('studio_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to load projects:', error);
        setError('Failed to load projects');
        return;
      }

      setProjects(data || []);
      console.log('✅ Loaded', data?.length || 0, 'Studio projects');
    } catch (err) {
      console.error('💥 Project loading error:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Load user's music generations
  const loadGenerations = async () => {
    if (!user) return;

    console.log('🎵 Loading music generations from Supabase...');
    
    try {
      const { data, error } = await supabase
        .from('music_generation')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Failed to load generations:', error);
        return;
      }

      setGenerations(data || []);
      console.log('✅ Loaded', data?.length || 0, 'music generations');
    } catch (err) {
      console.error('💥 Generation loading error:', err);
    }
  };

  // Save Studio project
  const saveProject = async (projectData: Omit<StudioProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('💾 Saving Studio project to Supabase:', projectData.name);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('studio_projects')
        .insert({
          ...projectData,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to save project:', error);
        throw new Error('Failed to save project');
      }

      console.log('✅ Project saved successfully:', data.id);
      await loadProjects(); // Refresh projects list
      return data;
    } catch (err) {
      console.error('💥 Project saving error:', err);
      throw err;
    }
  };

  // Update Studio project
  const updateProject = async (projectId: string, updates: Partial<StudioProject>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('📝 Updating Studio project:', projectId);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('studio_projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update project:', error);
        throw new Error('Failed to update project');
      }

      console.log('✅ Project updated successfully');
      await loadProjects(); // Refresh projects list
      return data;
    } catch (err) {
      console.error('💥 Project update error:', err);
      throw err;
    }
  };

  // Delete Studio project
  const deleteProject = async (projectId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🗑️ Deleting Studio project:', projectId);
    setError(null);

    try {
      const { error } = await supabase
        .from('studio_projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Failed to delete project:', error);
        throw new Error('Failed to delete project');
      }

      console.log('✅ Project deleted successfully');
      await loadProjects(); // Refresh projects list
    } catch (err) {
      console.error('💥 Project deletion error:', err);
      throw err;
    }
  };

  // Save music generation
  const saveGeneration = async (generationData: {
    session_id: string;
    track_type: string;
    prompt: string;
    audio_url: string;
    duration: number;
    metadata: any;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🎵 Saving music generation to Supabase:', generationData.track_type);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('music_generation')
        .insert({
          ...generationData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to save generation:', error);
        throw new Error('Failed to save generation');
      }

      console.log('✅ Music generation saved successfully:', data.id);
      await loadGenerations(); // Refresh generations list
      return data;
    } catch (err) {
      console.error('💥 Generation saving error:', err);
      throw err;
    }
  };

  // Load projects and generations when user changes
  useEffect(() => {
    if (user) {
      loadProjects();
      loadGenerations();
    } else {
      setProjects([]);
      setGenerations([]);
    }
  }, [user]);

  return {
    projects,
    generations,
    loading,
    error,
    saveProject,
    updateProject,
    deleteProject,
    saveGeneration,
    loadProjects,
    loadGenerations
  };
};