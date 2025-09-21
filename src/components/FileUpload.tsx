import React, { useState, useCallback } from 'react';
import { Upload, FileAudio, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = 'audio/*',
  maxSize = 50,
  className = '',
  placeholder = 'Drag and drop your audio file here, or click to browse'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  console.log('FileUpload rendered:', { acceptedTypes, maxSize });

  const validateFile = useCallback((file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    
    if (acceptedTypes !== '*' && !file.type.match(acceptedTypes.replace('*', '.*'))) {
      return 'Invalid file type';
    }
    
    return null;
  }, [maxSize, acceptedTypes]);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setSelectedFile(file);
    onFileSelect(file);
    console.log('File selected:', file.name, file.size);
  }, [validateFile, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
  };

  if (selectedFile) {
    return (
      <div className={`glass-card p-6 rounded-xl ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FileAudio className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{selectedFile.name}</h3>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`
          glass-card p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-border hover:border-primary/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium mb-2">{placeholder}</p>
            <p className="text-sm text-muted-foreground">
              Supports {acceptedTypes.replace('*', 'all formats')} • Max {maxSize}MB
            </p>
          </div>
        </div>
        
        <input
          id="file-upload"
          type="file"
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;