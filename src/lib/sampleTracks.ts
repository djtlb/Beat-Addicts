import { aceStepClient } from "../lib/aceStep";

// Generate and save sample tracks for demo purposes
export const generateSampleTracks = async () => {
  const samples = [
    {
      name: "demo-pop-radio",
      genre: "pop",
      theme: "Love in the spotlight",
      type: "anthem",
    },
    {
      name: "demo-hip-hop-radio",
      genre: "hip-hop",
      theme: "Rising from the streets",
      type: "single",
    },
    {
      name: "demo-rock-radio",
      genre: "rock",
      theme: "Breaking free",
      type: "single",
    },
    {
      name: "demo-country-radio",
      genre: "country",
      theme: "Small town dreams",
      type: "song",
    },
  ];

  const sampleUrls: { [key: string]: string } = {};

  for (const sample of samples) {
    try {
      console.log(`Generating radio-ready sample: ${sample.name}`);

      let result;
      switch (sample.genre) {
        case "pop":
          result = await aceStepClient.generatePopRadioAnthem(sample.theme, true);
          break;
        case "hip-hop":
          result = await aceStepClient.generateHipHopRadioSingle(sample.theme, true);
          break;
        case "rock":
          result = await aceStepClient.generateRockRadioSingle(sample.theme, true);
          break;
        case "country":
          result = await aceStepClient.generateCountryRadioSong(sample.theme, true);
          break;
        default:
          result = await aceStepClient.generatePopRadioAnthem(sample.theme, true);
      }

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
    id: "sample-pop-radio",
    title: "Pop Radio Anthem",
    genre: "Pop",
    duration: "3:30",
    description:
      "Catchy radio-ready pop with massive hooks and commercial production",
    audioUrl: "", // Will be populated by generateSampleTracks
    tags: ["pop", "radio-ready", "anthem", "commercial", "catchy"],
  },
  {
    id: "sample-hip-hop-radio",
    title: "Hip-Hop Radio Single",
    genre: "Hip-Hop",
    duration: "3:15",
    description:
      "Urban contemporary hit with strong vocals and radio-clean lyrics",
    audioUrl: "",
    tags: ["hip-hop", "radio-ready", "urban", "contemporary", "vocals"],
  },
  {
    id: "sample-rock-radio",
    title: "Rock Radio Single",
    genre: "Rock",
    duration: "4:00",
    description: "Modern rock with powerful guitars and memorable riffs",
    audioUrl: "",
    tags: ["rock", "radio-ready", "powerful", "guitars", "memorable"],
  },
  {
    id: "sample-country-radio",
    title: "Country Radio Song",
    genre: "Country",
    duration: "3:30",
    description:
      "Storytelling country with acoustic elements and emotional delivery",
    audioUrl: "",
    tags: ["country", "radio-ready", "storytelling", "acoustic", "emotional"],
  },
];

export const getSampleTrack = (genre: string) => {
  return sampleTracks.find(
    (track) =>
      track.genre.toLowerCase() === genre.toLowerCase() ||
      track.tags.some((tag) => tag.toLowerCase().includes(genre.toLowerCase()))
  );
};
