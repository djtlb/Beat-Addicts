import { aceStepClient } from '../lib/aceStep';

// Generate and save sample tracks for demo purposes
export const generateSampleTracks = async () => {
  const samples = [
    {
      name: 'demo-edm',
      genre: 'edm',
      prompt: 'festival anthem with massive drops, uplifting synths, emotional breakdowns, crowd-pleasing energy',
      duration: 60
    },
    {
      name: 'demo-house',
      genre: 'house',
      prompt: 'deep house groove with warm bassline, soulful elements, dancefloor energy',
      duration: 60
    },
    {
      name: 'demo-trap',
      genre: 'trap',
      prompt: 'hard-hitting trap with 808 bass, crisp snares, melodic elements',
      duration: 60
    },
    {
      name: 'demo-dnb',
      genre: 'dnb',
      prompt: 'drum and bass with rolling basslines, mechanical rhythms, underground energy',
      duration: 60
    }
  ];

  const sampleUrls: { [key: string]: string } = {};

  for (const sample of samples) {
    try {
      console.log(`Generating sample: ${sample.name}`);

      const result = await aceStepClient.generateMusic({
        tags: sample.prompt,
        duration: sample.duration,
        steps: 20, // Faster generation for samples
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000),
        scheduler_type: 'euler',
        cfg_type: 'constant',
        use_random_seed: true,
        genre: sample.genre,
        production_style: 'professional',
        structure: 'structured'
      });

      sampleUrls[sample.name] = result.audio_url;
      console.log(`✅ Generated ${sample.name}: ${result.audio_url}`);

    } catch (error) {
      console.error(`❌ Failed to generate ${sample.name}:`, error);
    }
  }

  return sampleUrls;
};

// Pre-generated sample data for immediate use
export const sampleTracks = [
  {
    id: 'sample-edm',
    title: 'EDM Festival Anthem',
    genre: 'EDM',
    duration: '1:00',
    description: 'Massive drops, uplifting synths, crowd energy',
    audioUrl: '', // Will be populated by generateSampleTracks
    tags: ['electronic', 'festival', 'anthem', 'drops', 'energy']
  },
  {
    id: 'sample-house',
    title: 'Deep House Groove',
    genre: 'House',
    duration: '1:00',
    description: 'Warm bassline, soulful elements, dancefloor ready',
    audioUrl: '',
    tags: ['house', 'deep', 'groove', 'bassline', 'soulful']
  },
  {
    id: 'sample-trap',
    title: 'Hard Trap Banger',
    genre: 'Trap',
    duration: '1:00',
    description: '808 bass, crisp snares, melodic elements',
    audioUrl: '',
    tags: ['trap', '808', 'hard-hitting', 'melodic', 'modern']
  },
  {
    id: 'sample-dnb',
    title: 'Drum & Bass Roller',
    genre: 'DnB',
    duration: '1:00',
    description: 'Rolling basslines, mechanical rhythms, underground',
    audioUrl: '',
    tags: ['drum and bass', 'rolling', 'mechanical', 'underground']
  }
];

export const getSampleTrack = (genre: string) => {
  return sampleTracks.find(track =>
    track.genre.toLowerCase() === genre.toLowerCase() ||
    track.tags.some(tag => tag.toLowerCase().includes(genre.toLowerCase()))
  );
};