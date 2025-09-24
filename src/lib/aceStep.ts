// Minimal stub for ACE-Step functionality.
// This module exports the same types and an `aceStepClient` instance so the
// rest of the codebase doesn't need to be updated when ACE-Step is removed.

export interface GenerationParams {
  tags: string;
  lyrics?: string;
  duration?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
  scheduler_type?: string;
  cfg_type?: string;
  use_random_seed?: boolean;
  genre?: string;
  structure?: string;
  production_style?: string;
}

export interface ACEStepResponse {
  audio_url: string;
  duration: number;
  generation_time: number;
  rtf: number;
  metadata: {
    tags: string;
    lyrics?: string;
    params?: GenerationParams;
    structure_analysis?: Record<string, unknown>;
  };
}

class ACEStepClientStub {
  async generateMusic(params: Partial<GenerationParams> & { tags?: string } = {}): Promise<ACEStepResponse> {
    const duration = params.duration ?? 30; // Shorter demo duration
    const tags = params.tags ?? "demo-song";

    // Generate a simple demo song
    const audioUrl = "demo-audio-url"; // Placeholder for now

    return {
      audio_url: audioUrl,
      duration,
      generation_time: 2.5, // Simulate generation time
      rtf: 12,
      metadata: {
        tags,
        lyrics: params.lyrics,
        params: params as GenerationParams,
        structure_analysis: {
          genre: params.genre || "demo",
          demo: true,
          generated_at: new Date().toISOString(),
        },
      };
    };
  }

  async generateRadioReadySong(opts: {
    genre: "pop" | "hip-hop" | "rock" | "country";
    theme: string;
    includeVocals?: boolean;
    lyrics?: string;
  }): Promise<ACEStepResponse> {
    return this.generateMusic({
      tags: `${opts.theme}, ${opts.genre}, radio-ready`,
      lyrics: opts.includeVocals ? opts.lyrics || "" : undefined,
      duration: 180,
    });
  }

  async generatePopRadioAnthem(theme: string, includeVocals = true, lyrics?: string) {
    return this.generateRadioReadySong({ genre: "pop", theme, includeVocals, lyrics });
  }

  async generateHipHopRadioSingle(theme: string, includeVocals = true, lyrics?: string) {
    return this.generateRadioReadySong({ genre: "hip-hop", theme, includeVocals, lyrics });
  }

  async generateRockRadioSingle(theme: string, includeVocals = true, lyrics?: string) {
    return this.generateRadioReadySong({ genre: "rock", theme, includeVocals, lyrics });
  }

  async generateCountryRadioSong(theme: string, includeVocals = true, lyrics?: string) {
    return this.generateRadioReadySong({ genre: "country", theme, includeVocals, lyrics });
  }

  async lyricToFlow(lyrics: string, _style: string) {
    return this.generateMusic({ tags: 'lyrics-to-flow', lyrics, duration: Math.min(lyrics.length / 8 + 60, 240) });
  }

  async stemSeparation(_audioFile: File) {
    return { vocals: "", drums: "", bass: "", instruments: "" };
  }

  getRadioReadyPresets() {
    return {} as Record<string, unknown>;
  }

  getRadioReadyStructures() {
    return {} as Record<string, unknown>;
  }

  // private async generateDemoSong(duration: number, genre: string): Promise<string> {
  private async generateDemoSong(duration: number, genre: string) {
    // Create a simple demo song using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    // Generate a simple melody based on genre
    const notes = this.getGenreNotes(genre);
    const bpm = 120;
    const beatLength = 60 / bpm;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const beat = Math.floor(t / beatLength) % notes.length;
      const note = notes[beat];

      // Simple oscillator for melody
      const frequency = note.frequency;
      const signal = Math.sin(2 * Math.PI * frequency * t) * 0.3;

      // Add some harmonics
      const harmonic1 = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.1;
      const harmonic2 = Math.sin(2 * Math.PI * frequency * 3 * t) * 0.05;

      // Add kick drum on beat 1
      const kick = (beat % 4 === 0 && (t % beatLength) < 0.1) ?
        Math.sin(2 * Math.PI * 60 * t) * Math.exp(-(t % beatLength) * 30) * 0.4 : 0;

      // Add snare on beat 3
      const snare = (beat % 4 === 2 && (t % beatLength) < 0.05) ?
        (Math.random() - 0.5) * Math.exp(-(t % beatLength) * 50) * 0.3 : 0;

      const totalSignal = signal + harmonic1 + harmonic2 + kick + snare;

      // Apply fade in/out
      const fadeTime = 2;
      const fade = t < fadeTime ? t / fadeTime : (t > duration - fadeTime ? (duration - t) / fadeTime : 1);

      leftChannel[i] = totalSignal * fade * 0.8;
      rightChannel[i] = totalSignal * fade * 0.8 * (1 + Math.sin(t * 0.5) * 0.1); // Slight stereo
    }

    // Convert to WAV and create blob URL
    const wavBlob = this.audioBufferToWav(buffer);
    return URL.createObjectURL(wavBlob);
  }

  private getGenreNotes(genre: string) {
    // Simple note sequences for different genres
    const noteSequences = {
      pop: [
        { frequency: 261.63, name: 'C4' }, // C
        { frequency: 293.66, name: 'D4' }, // D
        { frequency: 329.63, name: 'E4' }, // E
        { frequency: 349.23, name: 'F4' }, // F
        { frequency: 392.00, name: 'G4' }, // G
        { frequency: 440.00, name: 'A4' }, // A
        { frequency: 493.88, name: 'B4' }, // B
        { frequency: 523.25, name: 'C5' }, // C5
      ],
      hiphop: [
        { frequency: 146.83, name: 'D3' }, // D3
        { frequency: 164.81, name: 'E3' }, // E3
        { frequency: 174.61, name: 'F3' }, // F3
        { frequency: 196.00, name: 'G3' }, // G3
        { frequency: 220.00, name: 'A3' }, // A3
        { frequency: 246.94, name: 'B3' }, // B3
        { frequency: 261.63, name: 'C4' }, // C4
        { frequency: 293.66, name: 'D4' }, // D4
      ],
      rock: [
        { frequency: 82.41, name: 'E2' }, // E2
        { frequency: 110.00, name: 'A2' }, // A2
        { frequency: 146.83, name: 'D3' }, // D3
        { frequency: 196.00, name: 'G3' }, // G3
        { frequency: 246.94, name: 'B3' }, // B3
        { frequency: 329.63, name: 'E4' }, // E4
        { frequency: 392.00, name: 'G4' }, // G4
        { frequency: 493.88, name: 'B4' }, // B4
      ],
      demo: [
        { frequency: 261.63, name: 'C4' }, // C4
        { frequency: 329.63, name: 'E4' }, // E4
        { frequency: 392.00, name: 'G4' }, // G4
        { frequency: 523.25, name: 'C5' }, // C5
        { frequency: 659.25, name: 'E5' }, // E5
        { frequency: 783.99, name: 'G5' }, // G5
        { frequency: 1046.50, name: 'C6' }, // C6
        { frequency: 1318.51, name: 'E6' }, // E6
      ]
    };

    return noteSequences[genre as keyof typeof noteSequences] || noteSequences.demo;
  }

  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0;
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  }
}

export const aceStepClient = new ACEStepClientStub();
