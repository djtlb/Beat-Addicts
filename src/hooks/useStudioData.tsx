import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  initializeDefaultSamples,
  allDefaultSamples,
  defaultSamplePacks,
  type DefaultSample,
  type DefaultSamplePack
} from '../lib/defaultSamples';

interface StudioSamplePack {
  id: string;
  name: string;
  type: string;
  samples: StudioSample[];
  totalSamples: number;
  bpm: number;
  key: string;
  createdAt: string;
  source: 'default' | 'user' | 'generated';
}

interface StudioSample {
  id: string;
  name: string;
  type: string;
  audioUrl: string;
  duration: number;
  bpm: number;
  key: string;
  tags: string[];
  source: 'default' | 'user' | 'generated';
}

interface StudioProject {
  id: string;
  name: string;
  tempo: number;
  timeSignature: string;
  tracks: any[];
  beatPattern: any;
  songVision: string;
  generatedTracks: any[];
  createdAt: string;
  updatedAt: string;
}

export const useStudioData = () => {
  const { user } = useAuth();
  const [loadedSamplePacks, setLoadedSamplePacks] = useState<StudioSamplePack[]>([]);
  const [studioSamples, setStudioSamples] = useState<StudioSample[]>([]);
  const [studioProjects, setStudioProjects] = useState<StudioProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🎛️ Studio Data Hook initialized for user:', user?.email);

  // Initialize default samples and load studio data
  useEffect(() => {
    if (user) {
      loadStudioData();
    }
  }, [user]);

  const loadStudioData = async () => {
    console.log('📦 Loading Studio data and sample packs...');
    setIsLoading(true);
    setError(null);

    try {
      // Initialize default samples system
      initializeDefaultSamples();
      console.log('✅ Default samples initialized');

      // Load default sample packs into Studio format
      const defaultPacks: StudioSamplePack[] = defaultSamplePacks.map(pack => ({
        id: pack.id,
        name: pack.name,
        type: pack.type,
        samples: pack.samples.map(sample => ({
          id: sample.id,
          name: sample.name,
          type: sample.type,
          audioUrl: sample.audioUrl,
          duration: sample.duration,
          bpm: sample.bpm,
          key: sample.key,
          tags: sample.tags,
          source: 'default' as const
        })),
        totalSamples: pack.totalSamples,
        bpm: pack.bpm,
        key: pack.key,
        createdAt: new Date().toISOString(),
        source: 'default' as const
      }));

      // Load user sample packs from localStorage
      const userPacks = loadUserSamplePacks();

      // Combine default and user packs
      const allPacks = [...defaultPacks, ...userPacks];
      setLoadedSamplePacks(allPacks);

      // Load all samples
      const allSamples: StudioSample[] = [
        ...allDefaultSamples.map(sample => ({
          id: sample.id,
          name: sample.name,
          type: sample.type,
          audioUrl: sample.audioUrl,
          duration: sample.duration,
          bpm: sample.bpm,
          key: sample.key,
          tags: sample.tags,
          source: 'default' as const
        })),
        ...loadUserSamples()
      ];
      setStudioSamples(allSamples);

      // Load user projects
      setStudioProjects(loadUserProjects());

      console.log('✅ Studio data loaded:', {
        samplePacks: allPacks.length,
        samples: allSamples.length,
        projects: studioProjects.length
      });

    } catch (err) {
      console.error('❌ Failed to load Studio data:', err);
      setError('Failed to load Studio data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserSamplePacks = (): StudioSamplePack[] => {
    try {
      const savedPacks = localStorage.getItem('beatAddictsStudioPacks');
      if (savedPacks) {
        const packs = JSON.parse(savedPacks);
        console.log('📦 Loaded', packs.length, 'user sample packs from localStorage');
        return packs.map((pack: any) => ({
          ...pack,
          source: 'user' as const
        }));
      }
    } catch (error) {
      console.error('Failed to load user sample packs:', error);
    }
    return [];
  };

  const loadUserSamples = (): StudioSample[] => {
    try {
      const savedSamples = localStorage.getItem('beatAddictsStudioSamples');
      if (savedSamples) {
        const samples = JSON.parse(savedSamples);
        console.log('🎵 Loaded', samples.length, 'user samples from localStorage');
        return samples.map((sample: any) => ({
          ...sample,
          source: 'user' as const
        }));
      }
    } catch (error) {
      console.error('Failed to load user samples:', error);
    }
    return [];
  };

  const loadUserProjects = (): StudioProject[] => {
    try {
      const savedProjects = localStorage.getItem('beatAddictsStudioProjects');
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        console.log('💾 Loaded', projects.length, 'user projects from localStorage');
        return projects;
      }
    } catch (error) {
      console.error('Failed to load user projects:', error);
    }
    return [];
  };

  const saveSamplePack = async (packData: {
    name: string;
    type: string;
    samples: any[];
    bpm: number;
    key: string;
  }) => {
    console.log('💾 Saving sample pack to Studio:', packData.name);

    try {
      const newPack: StudioSamplePack = {
        id: `pack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: packData.name,
        type: packData.type,
        samples: packData.samples.map(sample => ({
          id: sample.id || `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: sample.name,
          type: sample.type,
          audioUrl: sample.audioUrl,
          duration: sample.duration,
          bpm: sample.bpm || packData.bpm,
          key: sample.key || packData.key,
          tags: sample.tags || [],
          source: 'user' as const
        })),
        totalSamples: packData.samples.length,
        bpm: packData.bpm,
        key: packData.key,
        createdAt: new Date().toISOString(),
        source: 'user' as const
      };

      // Save to localStorage
      const currentPacks = loadUserSamplePacks();
      const updatedPacks = [...currentPacks, newPack];
      localStorage.setItem('beatAddictsStudioPacks', JSON.stringify(updatedPacks));

      // Update state
      setLoadedSamplePacks(prev => [...prev, newPack]);

      console.log('✅ Sample pack saved successfully:', newPack.id);
      return newPack;

    } catch (error) {
      console.error('❌ Failed to save sample pack:', error);
      throw new Error('Failed to save sample pack');
    }
  };

  const saveProject = async (projectData: {
    name: string;
    tempo: number;
    timeSignature: string;
    tracks: any[];
    beatPattern: any;
    songVision: string;
    generatedTracks: any[];
  }) => {
    console.log('💾 Saving Studio project:', projectData.name);

    try {
      const newProject: StudioProject = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const currentProjects = loadUserProjects();
      const updatedProjects = [...currentProjects, newProject];
      localStorage.setItem('beatAddictsStudioProjects', JSON.stringify(updatedProjects));

      // Update state
      setStudioProjects(prev => [...prev, newProject]);

      console.log('✅ Studio project saved successfully:', newProject.id);
      return newProject;

    } catch (error) {
      console.error('❌ Failed to save Studio project:', error);
      throw new Error('Failed to save Studio project');
    }
  };

  const deleteSamplePack = async (packId: string) => {
    console.log('🗑️ Deleting sample pack:', packId);

    try {
      // Remove from localStorage
      const currentPacks = loadUserSamplePacks();
      const updatedPacks = currentPacks.filter(pack => pack.id !== packId);
      localStorage.setItem('beatAddictsStudioPacks', JSON.stringify(updatedPacks));

      // Update state
      setLoadedSamplePacks(prev => prev.filter(pack => pack.id !== packId));

      console.log('✅ Sample pack deleted successfully');

    } catch (error) {
      console.error('❌ Failed to delete sample pack:', error);
      throw new Error('Failed to delete sample pack');
    }
  };

  const getSamplePackById = (packId: string): StudioSamplePack | undefined => {
    return loadedSamplePacks.find(pack => pack.id === packId);
  };

  const getSamplesByPack = (packId: string): StudioSample[] => {
    const pack = getSamplePackById(packId);
    return pack ? pack.samples : [];
  };

  const searchSamples = (query: string): StudioSample[] => {
    if (!query.trim()) return studioSamples;

    const lowerQuery = query.toLowerCase();
    return studioSamples.filter(sample =>
      sample.name.toLowerCase().includes(lowerQuery) ||
      sample.type.toLowerCase().includes(lowerQuery) ||
      sample.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    // Data
    loadedSamplePacks,
    studioSamples,
    studioProjects,
    isLoading,
    error,

    // Methods
    loadStudioData,
    saveSamplePack,
    saveProject,
    deleteSamplePack,
    getSamplePackById,
    getSamplesByPack,
    searchSamples,

    // Stats
    stats: {
      totalPacks: loadedSamplePacks.length,
      totalSamples: studioSamples.length,
      totalProjects: studioProjects.length,
      defaultPacks: loadedSamplePacks.filter(p => p.source === 'default').length,
      userPacks: loadedSamplePacks.filter(p => p.source === 'user').length
    }
  };
};