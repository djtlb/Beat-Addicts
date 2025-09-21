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
  Guitar
} from 'lucide-react';

const StemSplitter = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stems, setStems] = useState(null);
  const [addDJDrop, setAddDJDrop] = useState(false);

  console.log('StemSplitter component rendered');

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
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleProcessStems = async () => {
    if (!uploadedFile) return;
    
    console.log('Starting stem separation');
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setStems({
        vocals: { name: 'Vocals.wav', size: '4.2 MB', duration: '3:24' },
        drums: { name: 'Drums.wav', size: '3.8 MB', duration: '3:24' },
        bass: { name: 'Bass.wav', size: '2.1 MB', duration: '3:24' },
        instruments: { name: 'Instruments.wav', size: '5.6 MB', duration: '3:24' },
        djDrop: addDJDrop ? { name: 'DJ_Drop.wav', size: '0.8 MB', duration: '0:05' } : null
      });
      setIsProcessing(false);
      console.log('Stem separation completed');
    }, 4000);
  };

  const stemTypes = [
    { key: 'vocals', label: 'Vocals', icon: Mic, color: 'from-pink-500 to-rose-500' },
    { key: 'drums', label: 'Drums', icon: Drum, color: 'from-red-500 to-orange-500' },
    { key: 'bass', label: 'Bass', icon: Music, color: 'from-blue-500 to-cyan-500' },
    { key: 'instruments', label: 'Instruments', icon: Guitar, color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">Stem Splitter + Auto DJ Drop</h1>
        <p className="text-muted-foreground text-lg">
          Separate your audio into individual stems and add professional DJ drops
        </p>
      </div>

      {/* Upload Section */}
      {!uploadedFile ? (
        <div
          className={`
            glass-card p-12 rounded-xl border-2 border-dashed transition-all cursor-pointer
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
              <h3 className="text-xl font-semibold mb-2">Upload Your Audio File</h3>
              <p className="text-muted-foreground">
                Drag and drop your audio file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports MP3, WAV, FLAC, M4A • Max 50MB
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
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FileAudio className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{uploadedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready to process
              </p>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="px-4 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Processing Options */}
      {uploadedFile && !isProcessing && !stems && (
        <div className="glass-card p-6 rounded-xl space-y-6">
          <h3 className="text-lg font-semibold">Processing Options</h3>
          
          {/* DJ Drop Toggle */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div>
              <h4 className="font-medium">Add Auto DJ Drop</h4>
              <p className="text-sm text-muted-foreground">
                Automatically add a professional DJ drop to your track
              </p>
            </div>
            <button
              onClick={() => setAddDJDrop(!addDJDrop)}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${addDJDrop ? 'bg-primary' : 'bg-muted'}
              `}
            >
              <div className={`
                absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                ${addDJDrop ? 'transform translate-x-6' : 'transform translate-x-0.5'}
              `} />
            </button>
          </div>

          {/* Process Button */}
          <button
            onClick={handleProcessStems}
            className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Scissors className="w-5 h-5" />
            <span>Split Into Stems</span>
          </button>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="glass-card p-8 rounded-xl">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Processing Your Audio</h3>
              <p className="text-muted-foreground">
                AI is separating your track into individual stems...
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Analyzing audio</span>
                <span>Separating elements</span>
                <span>Finalizing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {stems && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>Stems Ready</span>
            </h3>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download All (ZIP)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stemTypes.map((stemType) => {
              const stem = stems[stemType.key];
              const Icon = stemType.icon;
              
              return (
                <div key={stemType.key} className="glass-card p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stemType.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{stemType.label}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stem.size} • {stem.duration}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Mini waveform */}
                  <div className="mt-3 flex items-center justify-center space-x-1 h-8">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-gradient-to-t ${stemType.color} rounded-full`}
                        style={{
                          height: `${Math.random() * 24 + 4}px`,
                          opacity: 0.7
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DJ Drop */}
          {stems.djDrop && (
            <div className="glass-card p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">DJ Drop (Auto-Generated)</h4>
                  <p className="text-sm text-muted-foreground">
                    {stems.djDrop.size} • {stems.djDrop.duration}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StemSplitter;