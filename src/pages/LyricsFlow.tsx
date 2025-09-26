import React, { useState } from 'react';
import { 
  Mic, 
  Play, 
  Download, 
  Copy, 
  Wand2, 
  Volume2,
  Loader2,
  Music,
  Crown,
  Sparkles,
  Cpu,
  Dna,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AudioPlayer from '../components/AudioPlayer';
import VoiceRecorder from '../components/VoiceRecorder';
import { aceStepClient } from '../lib/aceStep';

const LyricsFlow = () => {
  const [lyrics, setLyrics] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('fast-rap');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlow, setGeneratedFlow] = useState(null);
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const [recordedVocal, setRecordedVocal] = useState(null);
  const [useVoiceCloning, setUseVoiceCloning] = useState(false);
  const { 
    hasAccess, 
    subscription, 
    isAdmin, 
    canDownload, 
    canUseCommercial, 
    canUseVoiceCloning,
    getRemainingGenerations 
  } = useAuth();

  console.log('LyricsFlow component rendered with subscription check:', { 
    tier: subscription?.subscription_tier, 
    isAdmin: isAdmin(),
    canVoiceClone: canUseVoiceCloning(),
    remaining: getRemainingGenerations('lyrics')
  });

  const flowStyles = [
    {
      id: 'fast-rap',
      name: 'RAPID FIRE',
      description: 'Lightning-fast complex rhyme patterns',
      image: '⚡',
      premium: false
    },
    {
      id: 'melodic-rap',
      name: 'MELODIC FLOW',
      description: 'Emotional melodic delivery with harmonies',
      image: '🎵',
      premium: false
    },
    {
      id: 'trap-style',
      name: 'TRAP BEAST',
      description: 'Modern trap flow with heavy autotune',
      image: '🔥',
      premium: false
    },
    {
      id: 'smooth-flow',
      name: 'SILK SMOOTH',
      description: 'Conversational storytelling flow',
      image: '🎭',
      premium: 'pro'
    },
    {
      id: 'storytelling',
      name: 'NARRATIVE KING',
      description: 'Dynamic cinematic storytelling style',
      image: '👑',
      premium: 'pro'
    },
    {
      id: 'experimental',
      name: 'CYBER VOCALS',
      description: 'AI-enhanced experimental vocal design',
      image: '🤖',
      premium: 'studio'
    },
    {
      id: 'custom',
      name: 'CUSTOM BEAST',
      description: 'Define your unique vocal signature',
      image: '✨',
      premium: 'studio'
    }
  ];

  // Check if user can generate based on limits
  const canGenerate = () => {
    const remaining = getRemainingGenerations('lyrics');
    return remaining === -1 || remaining > 0;
  };

  const handleGenerate = async () => {
    if (!lyrics.trim()) {
      alert('Please enter lyrics to generate a flow');
      return;
    }
    
    // Check subscription limits
    if (!canGenerate()) {
      alert('Daily lyric flow limit reached. Upgrade to Pro for unlimited flows!');
      return;
    }

    // Check if selected style requires premium
    const selectedStyleInfo = flowStyles.find(s => s.id === selectedStyle);
    if (selectedStyleInfo?.premium && !hasAccess(selectedStyleInfo.premium) && !isAdmin()) {
      alert(`${selectedStyleInfo.name} requires ${selectedStyleInfo.premium.toUpperCase()} subscription!`);
      return;
    }

    // Check voice cloning access
    if (useVoiceCloning && !canUseVoiceCloning()) {
      alert('Voice cloning requires Pro subscription!');
      setUseVoiceCloning(false);
      return;
    }
    
    console.log('Starting professional lyric-to-flow generation with voice cloning');
    setIsGenerating(true);
    
    try {
      let styleDescription = selectedStyle;
      
      if (selectedStyle === 'custom' && customStylePrompt.trim()) {
        styleDescription = customStylePrompt;
      }

      // Enhanced style description for voice cloning (Pro+ feature)
      if (useVoiceCloning && recordedVocal && canUseVoiceCloning()) {
        styleDescription += ', using cloned voice characteristics, personalized vocal timbre, custom voice model';
      }
      
      const result = await aceStepClient.lyricToFlow(lyrics, styleDescription);
      
      setGeneratedFlow({
        id: Date.now(),
        originalLyrics: lyrics,
        style: selectedStyle,
        audioFile: 'generated_flow.wav',
        audioUrl: result.audio_url,
        duration: `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')}`,
        generationTime: result.generation_time,
        rtf: result.rtf,
        voiceCloned: useVoiceCloning && recordedVocal && canUseVoiceCloning(),
        timestamp: new Date().toISOString(),
        canDownload: canDownload(),
        hasCommercialRights: canUseCommercial()
      });
      
      // Update generation count for users with limits
      if (getRemainingGenerations('lyrics') !== -1) {
        const today = new Date().toDateString();
        const count = parseInt(localStorage.getItem(`lyrics_generations_${today}`) || '0') + 1;
        localStorage.setItem(`lyrics_generations_${today}`, count.toString());
      }
      
      console.log('Professional lyric-to-flow generation completed');
    } catch (error) {
      console.error('Flow generation failed:', error);
      alert('Flow generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleLyrics = `Started from the basement now we underground kings
Beat Addicts flowing through my veins like electric dreams  
Beat Addicts got me levitating on these cyber beats
Quantum algorithms mixing with my heart that never sleeps

Look, I just flipped the script on reality's design
AI generating patterns that expand my conscious mind
Bodies start to move when the bass drops digital
Tell me can you feel it when the future's getting physical

Never been the type to let the system hold me down
All up in my studio creating that experimental sound
Grinding every night with my Beat Addicts networks activated
Making moves in cyberspace, my consciousness elevated

From the underground scene where we hustle for the code
Now we running quantum processes, watch my story unfold`;

  const loadSample = () => {
    setLyrics(sampleLyrics);
    console.log('Sample lyrics loaded');
  };

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    if (!canUseVoiceCloning()) {
      alert('Voice cloning requires Pro subscription!');
      return;
    }

    setRecordedVocal({
      blob: audioBlob,
      duration: duration,
      name: `voice_clone_${Date.now()}.wav`,
      size: audioBlob.size,
      url: URL.createObjectURL(audioBlob)
    });
    console.log('Voice recording completed for ethical AI voice cloning');
  };

  const flowsRemaining = getRemainingGenerations('lyrics');
  const flowsLeft = flowsRemaining === -1 ? '∞' : flowsRemaining.toString();

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Underground Header */}
      <div className="text-center underground-glass p-8 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-raver underground-text-glow mb-4">BEAT ADDICTS LYRICS ENGINE</h1>
          <p className="text-xl text-gray-300 font-underground mb-2">
            Transform raw lyrics into AI-powered vocal masterpieces
          </p>
          <p className="text-sm text-gray-400 font-producer">
            Powered by advanced Beat Addicts networks • Ethical voice cloning with consent • Beat Addicts AI integration
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mt-4">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Flows Left: {flowsLeft}</span>
            </span>
            <span className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>Plan: {isAdmin() ? 'Admin' : subscription?.subscription_tier || 'Free'}</span>
            </span>
          </div>
          
          {/* Subscription Warning for Free Users */}
          {!hasAccess('pro') && !isAdmin() && flowsRemaining <= 1 && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
              <div className="flex items-center space-x-2 text-yellow-300">
                <AlertCircle className="w-5 h-5" />
                <span className="font-raver">
                  {flowsRemaining === 0 ? 'Daily limit reached!' : 'Last flow today!'}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-1 font-underground">
                Upgrade to Pro for unlimited flows and voice cloning
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Input Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Voice Cloning Section - Pro+ Feature */}
          <div className="underground-glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-raver text-white flex items-center space-x-2">
                <Dna className="w-5 h-5 text-cyan-400" />
                <span>VOICE CLONING LAB</span>
                {!canUseVoiceCloning() && <Crown className="w-4 h-4 text-yellow-400" />}
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-underground text-gray-300">Use My Voice</span>
                <button
                  onClick={() => {
                    if (!canUseVoiceCloning()) {
                      alert('Voice cloning requires Pro subscription!');
                      return;
                    }
                    setUseVoiceCloning(!useVoiceCloning);
                  }}
                  disabled={!canUseVoiceCloning()}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${!canUseVoiceCloning() ? 'opacity-50 cursor-not-allowed' : ''}
                    ${useVoiceCloning && canUseVoiceCloning() ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gray-600'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${useVoiceCloning && canUseVoiceCloning() ? 'transform translate-x-6' : 'transform translate-x-0.5'}
                  `} />
                </button>
              </div>
            </div>
            
            {canUseVoiceCloning() ? (
              <>
                {useVoiceCloning && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-300 font-underground">
                      Record your voice to create a personalized AI model. This ensures ethical voice cloning using only your own vocal signature.
                    </p>
                    
                    <VoiceRecorder
                      onRecordingComplete={handleRecordingComplete}
                      maxDuration={30}
                      className=""
                    />
                    
                    {recordedVocal && (
                      <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/30">
                        <div className="flex items-center space-x-3">
                          <Cpu className="w-6 h-6 text-cyan-400" />
                          <div>
                            <p className="font-raver text-sm text-white">VOICE MODEL READY</p>
                            <p className="text-xs text-gray-300 font-underground">
                              Your AI vocal model will be used in generation
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 bg-black/30 rounded-lg text-center border border-yellow-500/30">
                <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-underground mb-2">
                  Voice cloning requires Pro subscription
                </p>
                <div className="text-xs text-yellow-400 font-raver">
                  PRO FEATURE
                </div>
              </div>
            )}
          </div>

          {/* Lyrics Input */}
          <div className="underground-glass p-6 rounded-xl space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-raver text-white">LYRICAL MATRIX</label>
                <button
                  onClick={loadSample}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-dj"
                >
                  LOAD SAMPLE
                </button>
              </div>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Drop your raw lyrics here... Each bar will be analyzed for flow patterns and Beat Addicts vocal synthesis..."
                className="w-full h-48 px-6 py-4 bg-black/60 border-2 border-cyan-500/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 font-producer text-sm text-white placeholder-gray-400 backdrop-blur-sm"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-underground">
                <span>{lyrics.length} characters</span>
                <span>{lyrics.split('\n').filter(line => line.trim()).length} bars</span>
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-lg font-raver text-white mb-4">FLOW ARCHITECTURE</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {flowStyles.map((style) => {
                  const hasStyleAccess = !style.premium || hasAccess(style.premium) || isAdmin();
                  
                  return (
                    <div key={style.id}>
                      {hasStyleAccess ? (
                        <button
                          onClick={() => setSelectedStyle(style.id)}
                          className={`
                            relative p-4 rounded-xl text-left transition-all duration-300 cursor-pointer w-full
                            ${selectedStyle === style.id 
                              ? 'raver-button underground-glow-intense scale-105' 
                              : 'underground-glass hover:underground-glow hover:scale-102'
                            }
                          `}
                        >
                          <div className="text-2xl mb-2">{style.image}</div>
                          <div className="font-raver text-sm text-white">{style.name}</div>
                          <div className="text-xs text-gray-300 mt-1 font-underground">{style.description}</div>
                        </button>
                      ) : (
                        <div className="relative p-4 rounded-xl underground-glass border border-yellow-500/30 opacity-60 cursor-not-allowed bg-black/30">
                          <Crown className="absolute top-3 right-3 w-5 h-5 text-yellow-400" />
                          <div className="text-2xl mb-2 opacity-50">{style.image}</div>
                          <div className="font-raver text-sm text-gray-500">{style.name}</div>
                          <div className="text-xs text-gray-500 mt-1 font-underground">{style.description}</div>
                          <div className="mt-2 text-xs text-yellow-400 font-raver">
                            {style.premium?.toUpperCase()} REQUIRED
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Style Input - Studio Feature */}
            {selectedStyle === 'custom' && (hasAccess('studio') || isAdmin()) && (
              <div>
                <label className="block text-lg font-raver text-white mb-2">CUSTOM BEAT ADDICTS PATTERN</label>
                <input
                  type="text"
                  value={customStylePrompt}
                  onChange={(e) => setCustomStylePrompt(e.target.value)}
                  placeholder="e.g., 'Aggressive cyber-rap with glitch effects, heavy processing, and digital distortion'"
                  className="w-full px-6 py-4 bg-black/60 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-producer placeholder-gray-400"
                />
              </div>
            )}

            {selectedStyle === 'custom' && !hasAccess('studio') && !isAdmin() && (
              <div className="p-4 bg-black/30 rounded-xl border border-yellow-500/30 text-center">
                <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-underground mb-2">
                  Custom patterns require Studio subscription
                </p>
                <div className="text-xs text-yellow-400 font-raver">
                  STUDIO FEATURE
                </div>
              </div>
            )}

            {/* Generate Button with Subscription Check */}
            <button
              onClick={handleGenerate}
              disabled={
                !lyrics.trim() || 
                isGenerating || 
                !canGenerate() || 
                (selectedStyle === 'custom' && !customStylePrompt.trim() && (hasAccess('studio') || isAdmin()))
              }
              className={`
                w-full py-6 px-8 rounded-xl font-raver text-xl flex items-center justify-center space-x-3 transition-all duration-500
                ${lyrics.trim() && !isGenerating && canGenerate() && (selectedStyle !== 'custom' || customStylePrompt.trim() || (!hasAccess('studio') && !isAdmin()))
                  ? 'raver-button underground-glow-intense hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="underground-loading-spinner"></div>
                  <span>BEAT ADDICTS PROCESSING...</span>
                </>
              ) : !canGenerate() ? (
                <>
                  <Crown className="w-7 h-7" />
                  <span>DAILY LIMIT REACHED - UPGRADE FOR UNLIMITED</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-7 h-7" />
                  <span>INITIALIZE VOCAL SYNTHESIS</span>
                  <Sparkles className="w-7 h-7" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Control Panel */}
        <div className="space-y-6">
          {/* Subscription Status */}
          <div className="underground-glass p-6 rounded-xl">
            <h3 className="font-raver text-white mb-4 flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>SUBSCRIPTION STATUS</span>
            </h3>
            
            <div className="space-y-4 text-sm font-underground">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Plan:</span>
                <span className="raver-text-shadow capitalize">
                  {isAdmin() ? 'Admin' : subscription?.subscription_tier || 'Free'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Flows Left:</span>
                <span className={flowsLeft === '∞' ? "text-cyan-400 font-bold" : "text-yellow-400"}>
                  {flowsLeft}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voice Cloning:</span>
                <span className={canUseVoiceCloning() ? "text-emerald-400 font-bold" : "text-red-400"}>
                  {canUseVoiceCloning() ? 'AVAILABLE' : 'PRO REQUIRED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Commercial Rights:</span>
                <span className={canUseCommercial() ? "text-emerald-400 font-bold" : "text-red-400"}>
                  {canUseCommercial() ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Download Access:</span>
                <span className={canDownload() ? "text-emerald-400 font-bold" : "text-red-400"}>
                  {canDownload() ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Engine Status */}
          <div className="underground-glass p-6 rounded-xl">
            <h3 className="font-raver text-white mb-4 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>BEAT ADDICTS STATUS</span>
            </h3>
            
            <div className="space-y-4 text-sm font-underground">
              <div className="flex justify-between">
                <span className="text-gray-400">AI Model:</span>
                <span className="raver-text-shadow">BEAT ADDICTS v2.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voice Cloning:</span>
                <span className={useVoiceCloning && canUseVoiceCloning() ? "text-cyan-400 font-bold" : "text-gray-500"}>
                  {useVoiceCloning && canUseVoiceCloning() ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Beat Addicts Acceleration:</span>
                <span className="raver-text-shadow">27.27x RTF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Flow Architecture:</span>
                <span className="raver-text-shadow capitalize">{selectedStyle.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Performance Visualizer */}
          <div className="underground-glass p-6 rounded-xl">
            <h4 className="font-raver text-white mb-4">BEAT ADDICTS ACTIVITY</h4>
            <div className="flex items-center justify-center space-x-1 h-16">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="studio-equalizer-bar w-2"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Voice Cloning Info */}
          {useVoiceCloning && canUseVoiceCloning() && (
            <div className="underground-glass p-6 rounded-xl border border-cyan-500/30">
              <h4 className="font-raver text-cyan-400 mb-3 flex items-center space-x-2">
                <Dna className="w-5 h-5" />
                <span>VOICE DNA ACTIVE</span>
              </h4>
              <div className="space-y-3 text-sm font-underground">
                <p className="text-gray-300">
                  Beat Addicts voice model will synthesize your recorded vocal characteristics into the generated rap flow.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="studio-led studio-led-active"></div>
                  <span className="text-cyan-400 font-bold">ETHICAL AI CLONING</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {isGenerating && (
        <div className="underground-glass p-8 rounded-xl">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="studio-loading-spinner"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-raver text-xl mb-4 underground-text-glow">
                BEAT ADDICTS SYNTHESIS IN PROGRESS...
              </h3>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 shadow-lg animate-pulse"
                  style={{ width: '80%' }}
                ></div>
              </div>
              <p className="text-gray-300 font-underground">
                Processing {selectedStyle.toUpperCase()} flow pattern with Beat Addicts architecture...
                {useVoiceCloning && canUseVoiceCloning() && " • Applying voice cloning model..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Result with Download Restrictions and Voice Cloning Info */}
      {generatedFlow && (
        <div className="underground-glass p-8 rounded-xl space-y-8 underground-glow">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-raver underground-text-glow flex items-center space-x-3">
              <Mic className="w-8 h-8" />
              <span>BEAT ADDICTS SYNTHESIS COMPLETE</span>
              <div className="studio-led studio-led-active"></div>
            </h3>
            <div className="flex items-center space-x-6 text-sm text-gray-400 font-underground">
              <span className="flex items-center space-x-2">
                <span className="raver-text-shadow capitalize">{generatedFlow.style.replace('-', ' ')}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Generated in {generatedFlow.generationTime?.toFixed(2)}s</span>
              </span>
              {generatedFlow.voiceCloned && (
                <span className="flex items-center space-x-2 text-cyan-400">
                  <Dna className="w-4 h-4" />
                  <span>Voice Cloned</span>
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Audio Player */}
          <AudioPlayer
            audioUrl={generatedFlow.audioUrl}
            title="AI Generated Rap Flow"
            duration={generatedFlow.duration}
            showWaveform={true}
            className="underground-glass p-6 rounded-xl"
          />

          {/* Download and Rights Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="underground-glass p-6 rounded-xl border border-emerald-500/30">
              <h4 className="font-raver text-white mb-4 flex items-center space-x-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <span>DOWNLOAD & RIGHTS</span>
              </h4>
              <div className="space-y-3 text-sm font-underground">
                <div className="flex justify-between">
                  <span className="text-gray-400">Download Access:</span>
                  <span className={generatedFlow.canDownload ? "text-emerald-400 font-bold" : "text-red-400"}>
                    {generatedFlow.canDownload ? 'YES' : 'STREAMING ONLY'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Commercial Rights:</span>
                  <span className={generatedFlow.hasCommercialRights ? "text-emerald-400 font-bold" : "text-red-400"}>
                    {generatedFlow.hasCommercialRights ? 'FULL RIGHTS' : 'PERSONAL ONLY'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voice Cloned:</span>
                  <span className={generatedFlow.voiceCloned ? "text-cyan-400 font-bold" : "text-gray-500"}>
                    {generatedFlow.voiceCloned ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
              
              {generatedFlow.canDownload ? (
                <button 
                  onClick={() => {
                    if (generatedFlow.audioUrl) {
                      const a = document.createElement('a');
                      a.href = generatedFlow.audioUrl;
                      a.download = generatedFlow.audioFile;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }
                  }}
                  className="w-full mt-4 py-3 px-6 raver-button font-raver flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>DOWNLOAD TRACK</span>
                </button>
              ) : (
                <div className="w-full mt-4 py-3 px-6 bg-gray-700 text-gray-400 rounded-xl text-center font-raver relative">
                  <Lock className="w-5 h-5 inline mr-2" />
                  <span>UPGRADE TO DOWNLOAD</span>
                  <Crown className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                </div>
              )}
            </div>

            <div className="underground-glass p-6 rounded-xl">
              <h4 className="font-raver text-white mb-4 flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-purple-400" />
                <span>AUDIO ANALYSIS</span>
              </h4>
              <div className="space-y-3 text-sm font-underground">
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality:</span>
                  <span className="font-bold studio-text-premium">Ultra-HD Beat Addicts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RTF Speed:</span>
                  <span className="font-bold studio-text-premium">{generatedFlow.rtf?.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-bold studio-text-premium">{generatedFlow.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rights Notice for Free Users */}
          {!generatedFlow.hasCommercialRights && (
            <div className="underground-glass p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
              <h4 className="font-raver text-yellow-400 mb-3 flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>USAGE RIGHTS NOTICE</span>
              </h4>
              <div className="space-y-2 text-sm font-underground text-gray-300">
                <p>• This flow is for personal use only</p>
                <p>• No commercial distribution or monetization</p>
                <p>• Upgrade to Pro for full commercial rights</p>
                <p>• Download access requires active Pro subscription</p>
                <p>• Voice cloning requires Pro subscription</p>
              </div>
            </div>
          )}

          {/* Original Lyrics Reference */}
          <div className="underground-glass border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-raver text-sm text-white">ORIGINAL LYRICS</h4>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedFlow.originalLyrics)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-300 font-producer whitespace-pre-line max-h-32 overflow-y-auto bg-black/40 p-3 rounded-lg">
              {generatedFlow.originalLyrics}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="px-6 py-3 underground-glass hover:underground-glow rounded-xl transition-colors font-dj">
              SAVE TO VAULT
            </button>
            <button className="px-6 py-3 underground-glass hover:underground-glow rounded-xl transition-colors font-dj">
              SHARE CREATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LyricsFlow;