// Default Sample Library for Beat Addicts Studio
// Contains curated sample collections for immediate use in the Studio

export interface DefaultSample {
  id: string;
  name: string;
  type: string;
  audioUrl: string;
  duration: number;
  bpm: number;
  key: string;
  tags: string[];
  category: string;
  description: string;
}

export interface DefaultSamplePack {
  id: string;
  name: string;
  type: string;
  samples: DefaultSample[];
  totalSamples: number;
  bpm: number;
  key: string;
  description: string;
  category: string;
}

// High-quality free sample URLs from Freesound.org and other sources
// These are professionally curated samples suitable for music production

export const defaultKickSamples: DefaultSample[] = [
  {
    id: 'kick_808_1',
    name: '808 Kick Deep',
    type: 'kick',
    audioUrl: 'https://cdn.freesound.org/previews/316/316847_3263906-lq.mp3',
    duration: 1.8,
    bpm: 128,
    key: 'C',
    tags: ['808', 'kick', 'deep', 'sub', 'trap'],
    category: 'drums',
    description: 'Deep 808-style kick with sub-bass frequency content'
  },
  {
    id: 'kick_house_1',
    name: 'House Kick Punchy',
    type: 'kick',
    audioUrl: 'https://cdn.freesound.org/previews/244/244692_4169821-lq.mp3',
    duration: 1.2,
    bpm: 128,
    key: 'C',
    tags: ['house', 'kick', 'punchy', 'dance', '4x4'],
    category: 'drums',
    description: 'Punchy house kick perfect for four-on-the-floor patterns'
  },
  {
    id: 'kick_techno_1',
    name: 'Techno Kick Hard',
    type: 'kick',
    audioUrl: 'https://cdn.freesound.org/previews/191/191707_3283808-lq.mp3',
    duration: 1.0,
    bpm: 130,
    key: 'C',
    tags: ['techno', 'kick', 'hard', 'driving', 'industrial'],
    category: 'drums',
    description: 'Hard-hitting techno kick with industrial character'
  },
  {
    id: 'kick_acoustic_1',
    name: 'Acoustic Kick Natural',
    type: 'kick',
    audioUrl: 'https://cdn.freesound.org/previews/565/565090_11123451-lq.mp3',
    duration: 0.8,
    bpm: 120,
    key: 'C',
    tags: ['acoustic', 'kick', 'natural', 'organic', 'live'],
    category: 'drums',
    description: 'Natural acoustic kick drum with organic feel'
  }
];

export const defaultSnareSamples: DefaultSample[] = [
  {
    id: 'snare_trap_1',
    name: 'Trap Snare Crispy',
    type: 'snare',
    audioUrl: 'https://cdn.freesound.org/previews/387/387186_6951949-lq.mp3',
    duration: 0.6,
    bpm: 140,
    key: 'C',
    tags: ['trap', 'snare', 'crispy', 'crack', 'sharp'],
    category: 'drums',
    description: 'Crispy trap snare with sharp attack and tight decay'
  },
  {
    id: 'snare_acoustic_1',
    name: 'Acoustic Snare Classic',
    type: 'snare',
    audioUrl: 'https://cdn.freesound.org/previews/544/544734_11609048-lq.mp3',
    duration: 0.8,
    bpm: 120,
    key: 'C',
    tags: ['acoustic', 'snare', 'classic', 'live', 'natural'],
    category: 'drums',
    description: 'Classic acoustic snare drum with natural resonance'
  },
  {
    id: 'snare_electronic_1',
    name: 'Electronic Snare Synthetic',
    type: 'snare',
    audioUrl: 'https://cdn.freesound.org/previews/244/244751_4169821-lq.mp3',
    duration: 0.5,
    bpm: 128,
    key: 'C',
    tags: ['electronic', 'snare', 'synthetic', 'digital', 'edm'],
    category: 'drums',
    description: 'Synthetic electronic snare with digital character'
  },
  {
    id: 'snare_clap_1',
    name: 'Handclap Snare',
    type: 'snare',
    audioUrl: 'https://cdn.freesound.org/previews/316/316912_3263906-lq.mp3',
    duration: 0.4,
    bmp: 128,
    key: 'C',
    tags: ['clap', 'snare', 'handclap', 'percussive', 'human'],
    category: 'drums',
    description: 'Human handclap sample perfect as snare replacement'
  }
];

export const defaultHiHatSamples: DefaultSample[] = [
  {
    id: 'hihat_closed_1',
    name: 'Closed Hi-Hat Tight',
    type: 'hihat',
    audioUrl: 'https://cdn.freesound.org/previews/244/244756_4169821-lq.mp3',
    duration: 0.2,
    bpm: 128,
    key: 'C',
    tags: ['hihat', 'closed', 'tight', 'percussive', 'rhythm'],
    category: 'drums',
    description: 'Tight closed hi-hat for rhythmic patterns'
  },
  {
    id: 'hihat_open_1',
    name: 'Open Hi-Hat Decay',
    type: 'hihat',
    audioUrl: 'https://cdn.freesound.org/previews/316/316844_3263906-lq.mp3',
    duration: 1.2,
    bpm: 128,
    key: 'C',
    tags: ['hihat', 'open', 'decay', 'sizzle', 'bright'],
    category: 'drums',
    description: 'Open hi-hat with natural decay and sizzle'
  },
  {
    id: 'hihat_trap_1',
    name: 'Trap Hi-Hat Fast',
    type: 'hihat',
    audioUrl: 'https://cdn.freesound.org/previews/387/387183_6951949-lq.mp3',
    duration: 0.15,
    bpm: 140,
    key: 'C',
    tags: ['trap', 'hihat', 'fast', 'roll', 'modern'],
    category: 'drums',
    description: 'Modern trap hi-hat perfect for fast rolls'
  },
  {
    id: 'hihat_vintage_1',
    name: 'Vintage Hi-Hat Warm',
    type: 'hihat',
    audioUrl: 'https://cdn.freesound.org/previews/565/565088_11123451-lq.mp3',
    duration: 0.8,
    bpm: 120,
    key: 'C',
    tags: ['vintage', 'hihat', 'warm', 'analog', 'classic'],
    category: 'drums',
    description: 'Warm vintage hi-hat with analog character'
  }
];

export const defaultBassSamples: DefaultSample[] = [
  {
    id: 'bass_808_1',
    name: '808 Bass Sub',
    type: 'bass',
    audioUrl: 'https://cdn.freesound.org/previews/316/316854_3263906-lq.mp3',
    duration: 2.5,
    bpm: 128,
    key: 'C',
    tags: ['808', 'bass', 'sub', 'deep', 'fundamental'],
    category: 'bass',
    description: 'Deep 808 bass with sub-frequency content'
  },
  {
    id: 'bass_reese_1',
    name: 'Reese Bass Growl',
    type: 'bass',
    audioUrl: 'https://cdn.freesound.org/previews/244/244698_4169821-lq.mp3',
    duration: 3.0,
    bpm: 128,
    key: 'A',
    tags: ['reese', 'bass', 'growl', 'dnb', 'distorted'],
    category: 'bass',
    description: 'Growling Reese bass with distorted character'
  },
  {
    id: 'bass_wobble_1',
    name: 'Wobble Bass LFO',
    type: 'bass',
    audioUrl: 'https://cdn.freesound.org/previews/191/191693_3283808-lq.mp3',
    duration: 4.0,
    bpm: 140,
    key: 'E',
    tags: ['wobble', 'bass', 'lfo', 'dubstep', 'modulated'],
    category: 'bass',
    description: 'Modulated wobble bass with LFO movement'
  },
  {
    id: 'bass_sub_1',
    name: 'Sub Bass Pure',
    type: 'bass',
    audioUrl: 'https://cdn.freesound.org/previews/316/316856_3263906-lq.mp3',
    duration: 2.0,
    bpm: 128,
    key: 'C',
    tags: ['sub', 'bass', 'pure', 'sine', 'fundamental'],
    category: 'bass',
    description: 'Pure sub bass with fundamental frequency'
  }
];

export const defaultSynthSamples: DefaultSample[] = [
  {
    id: 'synth_lead_1',
    name: 'Lead Synth Bright',
    type: 'lead',
    audioUrl: 'https://cdn.freesound.org/previews/387/387190_6951949-lq.mp3',
    duration: 4.0,
    bpm: 128,
    key: 'C',
    tags: ['lead', 'synth', 'bright', 'cutting', 'melodic'],
    category: 'synths',
    description: 'Bright lead synth perfect for melodies'
  },
  {
    id: 'synth_pad_1',
    name: 'Pad Synth Warm',
    type: 'pad',
    audioUrl: 'https://cdn.freesound.org/previews/244/244705_4169821-lq.mp3',
    duration: 8.0,
    bpm: 120,
    key: 'Am',
    tags: ['pad', 'synth', 'warm', 'atmospheric', 'chord'],
    category: 'synths',
    description: 'Warm atmospheric pad for background harmony'
  },
  {
    id: 'synth_arp_1',
    name: 'Arpeggio Synth Fast',
    type: 'arp',
    audioUrl: 'https://cdn.freesound.org/previews/191/191701_3283808-lq.mp3',
    duration: 4.0,
    bpm: 130,
    key: 'Cm',
    tags: ['arp', 'synth', 'fast', 'sequence', 'rhythmic'],
    category: 'synths',
    description: 'Fast arpeggiated synth sequence'
  },
  {
    id: 'synth_pluck_1',
    name: 'Pluck Synth Sharp',
    type: 'pluck',
    audioUrl: 'https://cdn.freesound.org/previews/565/565094_11123451-lq.mp3',
    duration: 1.5,
    bpm: 128,
    key: 'G',
    tags: ['pluck', 'synth', 'sharp', 'staccato', 'percussive'],
    category: 'synths',
    description: 'Sharp plucked synth with staccato attack'
  }
];

export const defaultVocalSamples: DefaultSample[] = [
  {
    id: 'vocal_chop_1',
    name: 'Vocal Chop Soul',
    type: 'vocal',
    audioUrl: 'https://cdn.freesound.org/previews/316/316862_3263906-lq.mp3',
    duration: 2.0,
    bpm: 120,
    key: 'C',
    tags: ['vocal', 'chop', 'soul', 'human', 'melodic'],
    category: 'vocals',
    description: 'Soulful vocal chop perfect for sampling'
  },
  {
    id: 'vocal_phrase_1',
    name: 'Vocal Phrase Hey',
    type: 'vocal',
    audioUrl: 'https://cdn.freesound.org/previews/244/244712_4169821-lq.mp3',
    duration: 1.0,
    bpm: 128,
    key: 'C',
    tags: ['vocal', 'phrase', 'hey', 'exclamation', 'energy'],
    category: 'vocals',
    description: 'Energetic vocal phrase for drops and builds'
  },
  {
    id: 'vocal_harmony_1',
    name: 'Vocal Harmony Ah',
    type: 'vocal',
    audioUrl: 'https://cdn.freesound.org/previews/387/387195_6951949-lq.mp3',
    duration: 4.0,
    bpm: 110,
    key: 'Am',
    tags: ['vocal', 'harmony', 'ah', 'choir', 'ethereal'],
    category: 'vocals',
    description: 'Ethereal vocal harmony with choir-like quality'
  }
];

export const defaultFXSamples: DefaultSample[] = [
  {
    id: 'fx_riser_1',
    name: 'White Noise Riser',
    type: 'fx',
    audioUrl: 'https://cdn.freesound.org/previews/316/316858_3263906-lq.mp3',
    duration: 4.0,
    bpm: 128,
    key: 'C',
    tags: ['fx', 'riser', 'white-noise', 'build', 'tension'],
    category: 'fx',
    description: 'White noise riser for building tension'
  },
  {
    id: 'fx_impact_1',
    name: 'Impact Hit Heavy',
    type: 'fx',
    audioUrl: 'https://cdn.freesound.org/previews/244/244720_4169821-lq.mp3',
    duration: 2.0,
    bpm: 128,
    key: 'C',
    tags: ['fx', 'impact', 'hit', 'heavy', 'dramatic'],
    category: 'fx',
    description: 'Heavy impact hit for dramatic moments'
  },
  {
    id: 'fx_sweep_1',
    name: 'Filter Sweep Down',
    type: 'fx',
    audioUrl: 'https://cdn.freesound.org/previews/191/191705_3283808-lq.mp3',
    duration: 2.0,
    bpm: 128,
    key: 'C',
    tags: ['fx', 'sweep', 'filter', 'down', 'transition'],
    category: 'fx',
    description: 'Downward filter sweep for transitions'
  }
];

export const defaultPercussionSamples: DefaultSample[] = [
  {
    id: 'perc_shaker_1',
    name: 'Shaker Rhythm',
    type: 'percussion',
    audioUrl: 'https://cdn.freesound.org/previews/565/565092_11123451-lq.mp3',
    duration: 0.5,
    bpm: 120,
    key: 'C',
    tags: ['percussion', 'shaker', 'rhythm', 'latin', 'groove'],
    category: 'percussion',
    description: 'Rhythmic shaker for groove enhancement'
  },
  {
    id: 'perc_conga_1',
    name: 'Conga Hit Low',
    type: 'percussion',
    audioUrl: 'https://cdn.freesound.org/previews/316/316848_3263906-lq.mp3',
    duration: 1.0,
    bpm: 120,
    key: 'C',
    tags: ['percussion', 'conga', 'low', 'latin', 'organic'],
    category: 'percussion',
    description: 'Low conga hit with organic feel'
  },
  {
    id: 'perc_tambourine_1',
    name: 'Tambourine Jingle',
    type: 'percussion',
    audioUrl: 'https://cdn.freesound.org/previews/244/244715_4169821-lq.mp3',
    duration: 0.8,
    bpm: 120,
    key: 'C',
    tags: ['percussion', 'tambourine', 'jingle', 'bright', 'metallic'],
    category: 'percussion',
    description: 'Bright tambourine with metallic jingle'
  }
];

// Default Sample Packs - Pre-organized collections
export const defaultSamplePacks: DefaultSamplePack[] = [
  {
    id: 'trap_essentials',
    name: 'Trap Essentials',
    type: 'trap',
    samples: [
      ...defaultKickSamples.filter(s => s.tags.includes('trap')),
      ...defaultSnareSamples.filter(s => s.tags.includes('trap')),
      ...defaultHiHatSamples.filter(s => s.tags.includes('trap')),
      ...defaultBassSamples.filter(s => s.tags.includes('808')),
    ],
    totalSamples: 0,
    bpm: 140,
    key: 'C',
    description: 'Essential trap sounds including 808s, crispy snares, and fast hi-hats',
    category: 'genre-packs'
  },
  {
    id: 'house_foundation',
    name: 'House Foundation',
    type: 'house',
    samples: [
      ...defaultKickSamples.filter(s => s.tags.includes('house')),
      ...defaultSnareSamples.filter(s => s.tags.includes('clap')),
      ...defaultHiHatSamples.filter(s => s.tags.includes('closed')),
      ...defaultBassSamples.filter(s => s.bpm <= 130),
    ],
    totalSamples: 0,
    bpm: 128,
    key: 'C',
    description: 'Foundation sounds for house music production',
    category: 'genre-packs'
  },
  {
    id: 'techno_arsenal',
    name: 'Techno Arsenal',
    type: 'techno',
    samples: [
      ...defaultKickSamples.filter(s => s.tags.includes('techno')),
      ...defaultSnareSamples.filter(s => s.tags.includes('electronic')),
      ...defaultHiHatSamples.filter(s => s.tags.includes('tight')),
      ...defaultSynthSamples.filter(s => s.tags.includes('arp')),
    ],
    totalSamples: 0,
    bpm: 130,
    key: 'Am',
    description: 'Hard-hitting techno arsenal with industrial character',
    category: 'genre-packs'
  },
  {
    id: 'vocal_collection',
    name: 'Vocal Collection',
    type: 'vocal',
    samples: [...defaultVocalSamples],
    totalSamples: 0,
    bpm: 120,
    key: 'C',
    description: 'Curated collection of vocal chops, phrases, and harmonies',
    category: 'instrument-packs'
  },
  {
    id: 'synth_library',
    name: 'Synth Library',
    type: 'synth',
    samples: [...defaultSynthSamples],
    totalSamples: 0,
    bpm: 128,
    key: 'C',
    description: 'Comprehensive synth library with leads, pads, and arpeggios',
    category: 'instrument-packs'
  },
  {
    id: 'fx_toolkit',
    name: 'FX Toolkit',
    type: 'fx',
    samples: [...defaultFXSamples],
    totalSamples: 0,
    bpm: 128,
    key: 'C',
    description: 'Essential FX toolkit with risers, impacts, and sweeps',
    category: 'utility-packs'
  },
  {
    id: 'percussion_world',
    name: 'World Percussion',
    type: 'percussion',
    samples: [...defaultPercussionSamples],
    totalSamples: 0,
    bpm: 120,
    key: 'C',
    description: 'World percussion instruments for rhythm enhancement',
    category: 'instrument-packs'
  }
];

// Calculate total samples for each pack
defaultSamplePacks.forEach(pack => {
  pack.totalSamples = pack.samples.length;
});

// Export all samples as a single collection
export const allDefaultSamples: DefaultSample[] = [
  ...defaultKickSamples,
  ...defaultSnareSamples,
  ...defaultHiHatSamples,
  ...defaultBassSamples,
  ...defaultSynthSamples,
  ...defaultVocalSamples,
  ...defaultFXSamples,
  ...defaultPercussionSamples
];

// Sample categories for organization
export const sampleCategories = [
  { id: 'drums', name: 'Drums', icon: 'Drum', count: defaultKickSamples.length + defaultSnareSamples.length + defaultHiHatSamples.length },
  { id: 'bass', name: 'Bass', icon: 'Music', count: defaultBassSamples.length },
  { id: 'synths', name: 'Synths', icon: 'Piano', count: defaultSynthSamples.length },
  { id: 'vocals', name: 'Vocals', icon: 'Mic', count: defaultVocalSamples.length },
  { id: 'fx', name: 'FX', icon: 'Waves', count: defaultFXSamples.length },
  { id: 'percussion', name: 'Percussion', icon: 'Target', count: defaultPercussionSamples.length }
];

// Initialize default samples in localStorage
export const initializeDefaultSamples = () => {
  try {
    const existingPacks = localStorage.getItem('beatAddictsStudioPacks');
    if (!existingPacks) {
      localStorage.setItem('beatAddictsStudioPacks', JSON.stringify(defaultSamplePacks));
      console.log('🎵 Initialized default sample packs in Studio:', defaultSamplePacks.length, 'packs');
    } else {
      // Add any new default packs that don't exist
      const currentPacks = JSON.parse(existingPacks);
      const newPacks = defaultSamplePacks.filter(
        defaultPack => !currentPacks.some((pack: any) => pack.id === defaultPack.id)
      );
      
      if (newPacks.length > 0) {
        const updatedPacks = [...currentPacks, ...newPacks];
        localStorage.setItem('beatAddictsStudioPacks', JSON.stringify(updatedPacks));
        console.log('🎵 Added new default sample packs:', newPacks.length, 'packs');
      }
    }
  } catch (error) {
    console.error('Failed to initialize default samples:', error);
  }
};

// Get samples by category
export const getSamplesByCategory = (category: string): DefaultSample[] => {
  return allDefaultSamples.filter(sample => sample.category === category);
};

// Get samples by type
export const getSamplesByType = (type: string): DefaultSample[] => {
  return allDefaultSamples.filter(sample => sample.type === type);
};

// Search samples by tags
export const searchSamples = (query: string): DefaultSample[] => {
  const searchTerm = query.toLowerCase();
  return allDefaultSamples.filter(sample => 
    sample.name.toLowerCase().includes(searchTerm) ||
    sample.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    sample.description.toLowerCase().includes(searchTerm)
  );
};

console.log('🎵 Default Sample Library loaded:', allDefaultSamples.length, 'samples across', defaultSamplePacks.length, 'packs');