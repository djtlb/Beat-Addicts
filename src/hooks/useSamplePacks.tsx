import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface SamplePack {
  id: string;
  user_id: string;
  name: string;
  type: string;
  bpm: number;
  key: string;
  samples: any[];
  total_samples: number;
  created_at: string;
  updated_at: string;
}

interface StoredSample {
  id: string;
  user_id: string;
  name: string;
  type: string;
  audio_url: string;
  duration: number;
  bpm?: number;
  key?: string;
  tags: string[];
  pack_id?: string;
  created_at: string;
}

export const useSamplePacks = () => {
  const { user } = useAuth();
  const [samplePacks, setSamplePacks] = useState<SamplePack[]>([]);
  const [storedSamples, setStoredSamples] = useState<StoredSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('📦 Sample Packs Hook initialized for user:', user?.email);

  // Load user's sample packs
  const loadSamplePacks = async () => {
    if (!user) return;

    console.log('📦 Loading sample packs from Supabase...');
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('sample_packs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to load sample packs:', error);
        setError('Failed to load sample packs');
        return;
      }

      setSamplePacks(data || []);
      console.log('✅ Loaded', data?.length || 0, 'sample packs');
    } catch (err) {
      console.error('💥 Sample pack loading error:', err);
      setError('Failed to load sample packs');
    } finally {
      setLoading(false);
    }
  };

  // Load user's stored samples
  const loadStoredSamples = async () => {
    if (!user) return;

    console.log('🎵 Loading stored samples from Supabase...');
    
    try {
      const { data, error } = await supabase
        .from('stored_samples')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to load stored samples:', error);
        return;
      }

      setStoredSamples(data || []);
      console.log('✅ Loaded', data?.length || 0, 'stored samples');
    } catch (err) {
      console.error('💥 Stored samples loading error:', err);
    }
  };

  // Save sample pack
  const saveSamplePack = async (packData: {
    name: string;
    type: string;
    bpm: number;
    key: string;
    samples: any[];
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('💾 Saving sample pack to Supabase:', packData.name);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('sample_packs')
        .insert({
          ...packData,
          user_id: user.id,
          total_samples: packData.samples.length
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to save sample pack:', error);
        throw new Error('Failed to save sample pack');
      }

      console.log('✅ Sample pack saved successfully:', data.id);

      // Save individual samples
      for (const sample of packData.samples) {
        await saveSample({
          name: sample.name,
          type: sample.type,
          audio_url: sample.audioUrl,
          duration: sample.duration,
          bpm: sample.bpm,
          key: sample.key,
          tags: sample.tags,
          pack_id: data.id
        });
      }

      await loadSamplePacks();
      return data;
    } catch (err) {
      console.error('💥 Sample pack saving error:', err);
      throw err;
    }
  };

  // Save individual sample
  const saveSample = async (sampleData: {
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
      throw new Error('User not authenticated');
    }

    console.log('🎵 Saving sample to Supabase:', sampleData.name);

    try {
      const { data, error } = await supabase
        .from('stored_samples')
        .insert({
          ...sampleData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to save sample:', error);
        throw new Error('Failed to save sample');
      }

      console.log('✅ Sample saved successfully:', data.id);
      await loadStoredSamples();
      return data;
    } catch (err) {
      console.error('💥 Sample saving error:', err);
      throw err;
    }
  };

  // Delete sample pack
  const deleteSamplePack = async (packId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🗑️ Deleting sample pack:', packId);
    setError(null);

    try {
      const { error } = await supabase
        .from('sample_packs')
        .delete()
        .eq('id', packId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Failed to delete sample pack:', error);
        throw new Error('Failed to delete sample pack');
      }

      console.log('✅ Sample pack deleted successfully');
      await loadSamplePacks();
      await loadStoredSamples(); // Refresh samples as they might be linked
    } catch (err) {
      console.error('💥 Sample pack deletion error:', err);
      throw err;
    }
  };

  // Get samples by pack ID
  const getSamplesByPack = (packId: string) => {
    return storedSamples.filter(sample => sample.pack_id === packId);
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadSamplePacks();
      loadStoredSamples();
    } else {
      setSamplePacks([]);
      setStoredSamples([]);
    }
  }, [user]);

  return {
    samplePacks,
    storedSamples,
    loading,
    error,
    saveSamplePack,
    saveSample,
    deleteSamplePack,
    getSamplesByPack,
    loadSamplePacks,
    loadStoredSamples
  };
};