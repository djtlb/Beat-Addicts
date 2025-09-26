import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Scissors, 
  Download, 
  Play, 
  Volume2, 
  FileAudio,
  Loader2,
  CheckCircle,
  Mic,
  Music,
  Drum,
  Guitar,
  Crown,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { aceStepClient } from '../lib/aceStep';
import AudioPlayer from '../components/AudioPlayer';

const StemSplitter = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stems, setStems] = useState(null);
  const [addDJDrop, setAddDJDrop] = useState(false);
  const { 
    hasAccess, 
    subscription, 
    isAdmin, 
    canDownload, 
    canUseCommercial,
    getRemainingGenerations 
  } = useAuth();

  console.log('StemSplitter component rendered with subscription check:', { 
    tier: subscription?.subscription_tier, 
    isAdmin: isAdmin(),
    canDownload: canDownload(),
    remaining: getRemainingGenerations('stems')
  });

  // Check if user can process based on limits
  const canProcess = () => {
    const remaining = getRemainingGenerations('stems');
    return remaining === -1 || remaining > 0;
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        setUploadedFile(file);
        console.log('File dropped:', file.name);
      } else {
        alert('Please upload an audio file');
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setUploadedFile(file);
        console.log('File selected:', file.name);
      } else {
        alert('Please select an audio file');
      }
    }
  };

  const handleProcessStems = async () => {
    if (!uploadedFile) {
      alert('Please upload an audio file first');
      return;
    }
    
    // Check subscription limits
    if (!canProcess()) {
      alert('Daily stem separation limit reached. Upgrade to Pro for unlimited processing!');
      return;
    }

    // Check DJ drop feature access
    if (addDJDrop && !hasAccess('pro') && !isAdmin()) {
      alert('DJ Drop generation requires Pro subscription!');
      setAddDJDrop(false);
      return;
    }
    
    console.log('Starting AI stem separation with subscription validation');
    setIsProcessing(true);
    
    try {
      const result = await aceStepClient.stemSeparation(uploadedFile);
      
      setStems({
        vocals: { 
          name: 'Vocals.wav', 
          size: '4.2 MB', 
          duration: '3:24',
          audioUrl: result.vocals
        },
        drums: { 
          name: 'Drums.wav', 
          size: '3.8 MB', 
          duration: '3:24',
          audioUrl: result.drums
        },
        bass: { 
          name: 'Bass.wav', 
          size: '2.1 MB', 
          duration: '3:24',
          audioUrl: result.bass
        },
        instruments: { 
          name: 'Instruments.wav', 
          size: '5.6 MB', 
          duration: '3:24',
          audioUrl: result.instruments
        },
        djDrop: addDJDrop && (hasAccess('pro') || isAdmin()) ? { 
          name: 'DJ_Drop.wav', 
          size: '0.8 MB', 
          duration: '0:05',
          audioUrl: await aceStepClient.generateMusic({
            tags: 'DJ drop, air horn, vocal sample, club ready',
            duration: 5,
            steps: 20,
            guidance_scale: 8.0,
            seed: Math.floor(Math.random() * 1000000),
            scheduler_type: 'euler',
            cfg_type: 'constant',
            use_random_seed: true
          }).then(r => r.audio_url)
        } : null,
        canDownload: canDownload(),
        hasCommercialRights: canUseCommercial()
      });
      
      // Update generation count for users with limits
      if (getRemainingGenerations('stems') !== -1) {
        const today = new Date().toDateString();
        const count = parseInt(localStorage.getItem(`stems_generations_${today}`) || '0') + 1;
        localStorage.setItem(`stems_generations_${today}`, count.toString());
      }
      
      console.log('AI stem separation completed successfully');
    } catch (error) {
      console.error('Stem separation failed:', error);
      alert('Stem separation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const stemTypes = [
    { key: 'vocals', label: 'Vocals', icon: Mic, color: 'from-pink-500 to-rose-500' },
    { key: 'drums', label: 'Drums', icon: Drum, color: 'from-red-500 to-orange-500' },
    { key: 'bass', label: 'Bass', icon: Music, color: 'from-blue-500 to-cyan-500' },
    { key: 'instruments', label: 'Instruments', icon: Guitar, color: 'from-green-500 to-emerald-500' }
  ];

  const downloadAllStems = () => {
    if (!stems || !stems.canDownload) {
      alert('Download requires Pro subscription!');
      return;
    }
    
    // Download each stem individually
    stemTypes.forEach(stemType => {
      const stem = stems[stemType.key];
      if (stem?.audioUrl) {
        const a = document.createElement('a');
        a.href = stem.audioUrl;
        a.download = stem.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
    
    // Download DJ drop if it exists
    if (stems.djDrop?.audioUrl) {
      const a = document.createElement('a');
      a.href = stems.djDrop.audioUrl;
      a.download = stems.djDrop.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const splitsRemaining = getRemainingGenerations('stems');
  const splitsLeft = splitsRemaining === -1 ? '∞' : splitsRemaining.toString();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with subscription info */}
      <div className="text-center">
        <h1 className="text-3xl font-raver underground-text-glow mb-4">QUANTUM STEM SPLITTER + AI DJ DROPS</h1>
        <p className="text-muted-foreground text-lg font-underground">
          Separate your audio into individual stems and add professional DJ drops with AI
        </p>
        <p className="text-sm text-muted-foreground mt-2 font-underground">
          Powered by advanced AI for professional audio processing
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mt-4">
          <span className="flex items-center space-x-2">
            <Scissors className="w-4 h-4 text-emerald-400" />
            <span>Splits Left: {splitsLeft}</span>
          </span>
          <span className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span>Plan: {isAdmin() ? 'Admin' : subscription?.subscription_tier || 'Free'}</span>
          </span>
        </div>
        
        {/* Subscription Warning for Free Users */}
        {!hasAccess('pro') && !isAdmin() && splitsRemaining <= 1 && (
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl max-w-md mx-auto">
            <div className="flex items-center space-x-2 text-yellow-300">
              <AlertCircle className="w-5 h-5" />
              <span className="font-raver">
                {splitsRemaining === 0 ? 'Daily limit reached!' : 'Last split today!'}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1 font-underground">
              Upgrade to Pro for unlimited stem separation
            </p>
          </div>
        )}
      </div>

      {/* Upload Section */}
      {!uploadedFile ? (
        <div
          className={`
            studio-glass-card p-12 rounded-xl border-2 border-dashed transition-all cursor-pointer
            ${isDragOver 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('audio-upload').click()}
        >
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-raver underground-text-glow mb-2">UPLOAD YOUR AUDIO FILE</h3>
              <p className="text-muted-foreground font-underground">
                Drag and drop your audio file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-2 font-producer">
                Supports MP3, WAV, FLAC, M4A • Max 50MB • Best results with mixed tracks
              </p>
            </div>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="studio-glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FileAudio className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-raver text-white">{uploadedFile.name}</h3>
              <p className="text-sm text-muted-foreground font-underground">
                {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready for AI processing
              </p>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="px-4 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors font-dj"
            >
              REMOVE
            </button>
          </div>
        </div>
      )}

      {/* Processing Options */}
      {uploadedFile && !isProcessing && !stems && (
        <div className="studio-glass-card p-6 rounded-xl space-y-6">
          <h3 className="text-lg font-raver text-white underground-text-glow">AI PROCESSING OPTIONS</h3>
          
          {/* DJ Drop Toggle - Pro Feature */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div>
              <h4 className="font-raver text-white flex items-center space-x-2">
                <span>ADD AUTO DJ DROP</span>
                {!hasAccess('pro') && !isAdmin() && <Crown className="w-4 h-4 text-yellow-400" />}
              </h4>
              <p className="text-sm text-muted-foreground font-underground">
                Generate a professional DJ drop using AI 
                {!hasAccess('pro') && !isAdmin() && (
                  <span className="text-yellow-400 ml-1">(Pro feature)</span>
                )}
              </p>
            </div>
            <button
              onClick={() => {
                if (!hasAccess('pro') && !isAdmin()) {
                  alert('DJ Drop generation requires Pro subscription!');
                  return;
                }
                setAddDJDrop(!addDJDrop);
              }}
              disabled={!hasAccess('pro') && !isAdmin()}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${!hasAccess('pro') && !isAdmin() ? 'opacity-50 cursor-not-allowed' : ''}
                ${addDJDrop && (hasAccess('pro') || isAdmin()) ? 'bg-primary' : 'bg-muted'}
              `}
            >
              <div className={`
                absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                ${addDJDrop && (hasAccess('pro') || isAdmin()) ? 'transform translate-x-6' : 'transform translate-x-0.5'}
              `} />
            </button>
          </div>

          {/* Process Button with Subscription Check */}
          <button
            onClick={handleProcessStems}
            disabled={!canProcess()}
            className={`
              w-full py-4 px-6 rounded-lg font-raver text-xl flex items-center justify-center space-x-2 transition-colors
              ${canProcess()
                ? 'raver-button underground-glow-intense hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {canProcess() ? (
              <>
                <Scissors className="w-5 h-5" />
                <span>SPLIT INTO STEMS WITH AI</span>
              </>
            ) : (
              <>
                <Crown className="w-5 h-5" />
                <span>DAILY LIMIT REACHED - UPGRADE FOR UNLIMITED</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="studio-glass-card p-8 rounded-xl">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-raver underground-text-glow mb-2">AI IS PROCESSING YOUR AUDIO</h3>
              <p className="text-muted-foreground font-underground">
                AI is separating your track into individual stems using advanced source separation...
                {addDJDrop && (hasAccess('pro') || isAdmin()) && (
                  <span className="block mt-1 text-yellow-400">Also generating professional DJ drop...</span>
                )}
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-producer">
                <span>Analyzing audio</span>
                <span>Separating elements</span>
                <span>Finalizing stems</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results with Download Restrictions */}
      {stems && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-raver text-white underground-text-glow flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>STEMS READY</span>
            </h3>
            {stems.canDownload ? (
              <button 
                onClick={downloadAllStems}
                className="px-4 py-2 raver-button font-raver flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD ALL</span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-raver flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>UPGRADE TO DOWNLOAD</span>
              </div>
            )}
          </div>

          {/* Download Rights Notice */}
          {!stems.canDownload && (
            <div className="studio-glass-card p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h4 className="font-raver text-yellow-400">DOWNLOAD RESTRICTIONS</h4>
              </div>
              <div className="text-sm text-gray-300 space-y-1 font-underground">
                <p>• Streaming only for free accounts</p>
                <p>• Upgrade to Pro for full download access</p>
                <p>• Commercial rights included with Pro subscription</p>
                <p>• DJ drops require Pro subscription</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stemTypes.map((stemType) => {
              const stem = stems[stemType.key];
              const Icon = stemType.icon;
              
              return (
                <div key={stemType.key} className="studio-glass-card p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stemType.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-raver text-white">{stemType.label}</h4>
                      <p className="text-sm text-muted-foreground font-underground">
                        {stem.size} • {stem.duration}
                      </p>
                    </div>
                    {stems.canDownload ? (
                      <button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = stem.audioUrl;
                          a.download = stem.name;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="p-2 opacity-50 cursor-not-allowed">
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Audio Player for each stem */}
                  <AudioPlayer
                    audioUrl={stem.audioUrl}
                    title={stem.name}
                    duration={stem.duration}
                    showWaveform={false}
                  />
                </div>
              );
            })}
          </div>

          {/* DJ Drop - Pro Feature */}
          {stems.djDrop && (
            <div className="studio-glass-card p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-raver text-white">DJ DROP (AI GENERATED)</h4>
                  <p className="text-sm text-muted-foreground font-underground">
                    {stems.djDrop.size} • {stems.djDrop.duration} • Professional club ready
                  </p>
                </div>
                {stems.canDownload ? (
                  <button 
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = stems.djDrop.audioUrl;
                      a.download = stems.djDrop.name;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-2 opacity-50 cursor-not-allowed">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </div>
              
              <AudioPlayer
                audioUrl={stems.djDrop.audioUrl}
                title={stems.djDrop.name}
                duration={stems.djDrop.duration}
                showWaveform={false}
              />

              {!stems.canDownload && (
                <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg text-xs text-yellow-300 flex items-center space-x-1 font-underground">
                  <Crown className="w-3 h-3" />
                  <span>Pro feature: DJ drops require Pro subscription for download</span>
                </div>
              )}
            </div>
          )}

          {/* Commercial Rights Notice */}
          {!stems.hasCommercialRights && (
            <div className="studio-glass-card p-4 rounded-lg border border-red-500/30 bg-red-500/10">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-red-400" />
                <h4 className="font-raver text-red-400">USAGE RIGHTS NOTICE</h4>
              </div>
              <div className="text-sm text-gray-300 space-y-1 font-underground">
                <p>• Stems are for personal use only</p>
                <p>• No commercial distribution or monetization</p>
                <p>• Pro subscription required for commercial rights</p>
                <p>• Full ownership rights while subscription is active</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StemSplitter;