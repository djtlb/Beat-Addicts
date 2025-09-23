import { aceStepClient, type GenerationParams } from './lib/aceStep';

async function generateDrumAndBassDemo() {
  console.log('🎵 Generating Drum & Bass Experimental Song Demo...');

  const params: GenerationParams = {
    tags: 'experimental drum and bass, atmospheric soundscapes, rolling basslines, mechanical rhythms, underground energy, liquid elements, time-stretching, chopping breaks, bass modulation, reverb processing, evolving soundscapes, meditative atmosphere, spatial depth, organic textures, minimal percussion, granular synthesis, long reverbs, modulation, spatial effects',
    lyrics: undefined, // No vocals for experimental
    duration: 240, // 4 minutes for experimental piece
    steps: 27,
    guidance_scale: 7.5,
    seed: Math.floor(Math.random() * 1000000), // Random seed for variety
    scheduler_type: 'euler',
    cfg_type: 'constant',
    use_random_seed: true,
    genre: 'dnb',
    production_style: 'experimental',
    structure: 'progressive'
  };

  try {
    console.log('🚀 Starting ACE-Step generation...');
    const result = await aceStepClient.generateMusic(params);

    console.log('✅ Generation completed!');
    console.log('📊 Results:');
    console.log(`   Duration: ${result.duration}s`);
    console.log(`   Generation Time: ${result.generation_time}s`);
    console.log(`   RTF: ${result.rtf}x`);
    console.log(`   Audio URL: ${result.audio_url}`);
    console.log(`   Genre: ${result.metadata.structure_analysis?.genre}`);
    console.log(`   Structure: ${result.metadata.structure_analysis?.structure.join(' → ')}`);

    // In a real app, this would play the audio
    console.log('\n🎧 To play this track, visit: http://localhost:8080');
    console.log('   Navigate to Generate page and the track will be ready!');

    return result;

  } catch (error) {
    console.error('❌ Generation failed:', error);
    throw error;
  }
}

// Auto-run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDrumAndBassDemo().catch(console.error);
}

export { generateDrumAndBassDemo };