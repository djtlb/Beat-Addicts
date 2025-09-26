import React, { useState, useRef } from 'react';
import { 
  Music, 
  Package, 
  Target, 
  Move, 
  MousePointer2,
  ArrowUpDown,
  ArrowLeftRight,
  RotateCw,
  Grab
} from 'lucide-react';

interface DragItem {
  id: string;
  type: 'sample' | 'pack' | 'track' | 'element';
  data: any;
}

interface DragDropStudioProps {
  children: React.ReactNode;
  onDrop?: (item: DragItem, target: string, position?: { x: number; y: number }) => void;
  className?: string;
}

export const DragDropStudio: React.FC<DragDropStudioProps> = ({
  children,
  onDrop,
  className = ''
}) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  console.log('🎛️ DragDropStudio initialized');

  const handleDragStart = (item: DragItem, e: React.DragEvent) => {
    console.log('🚀 Drag started:', item);
    setDraggedItem(item);
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Set drag data
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    console.log('🛑 Drag ended');
    setDraggedItem(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    try {
      const itemData = e.dataTransfer.getData('application/json');
      if (itemData) {
        const item = JSON.parse(itemData) as DragItem;
        const position = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        
        console.log('📍 Drop completed:', { item, targetId, position });
        onDrop?.(item, targetId, position);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
    
    handleDragEnd();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div 
      className={`drag-drop-studio ${className}`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, 'studio-canvas')}
    >
      {children}
    </div>
  );
};

interface DraggableItemProps {
  item: DragItem;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  children,
  className = '',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) return;
    
    console.log('🎯 Draggable item start:', item.id);
    setIsDragging(true);
    
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    console.log('✅ Draggable item end:', item.id);
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        ${!disabled ? 'drag-source cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'} 
        ${isDragging ? 'dragging opacity-70 transform rotate-2 scale-105' : ''} 
        ${className}
      `}
      style={{
        transition: 'all 0.2s ease',
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
        opacity: isDragging ? 0.7 : 1
      }}
    >
      {!disabled && (
        <div className="absolute top-1 right-1 z-10">
          <Grab className="w-3 h-3 text-gray-400" />
        </div>
      )}
      {children}
    </div>
  );
};

interface DropZoneProps {
  id: string;
  children: React.ReactNode;
  onDrop: (item: DragItem, position?: { x: number; y: number }) => void;
  className?: string;
  acceptTypes?: string[];
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  id,
  children,
  onDrop,
  className = '',
  acceptTypes = [],
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    
    // Check if we're actually leaving the drop zone
    if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const itemData = e.dataTransfer.getData('application/json');
      if (itemData) {
        const item = JSON.parse(itemData) as DragItem;
        
        // Check if item type is accepted
        if (acceptTypes.length > 0 && !acceptTypes.includes(item.type)) {
          console.log('❌ Item type not accepted:', item.type);
          return;
        }
        
        const rect = dropRef.current?.getBoundingClientRect();
        const position = rect ? {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        } : undefined;
        
        console.log('🎯 Drop zone received item:', { item, id, position });
        onDrop(item, position);
      }
    } catch (error) {
      console.error('Drop zone error:', error);
    }
  };

  return (
    <div
      ref={dropRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        drop-zone 
        ${isDragOver ? 'drag-over' : ''} 
        ${disabled ? 'opacity-50 pointer-events-none' : ''} 
        ${className}
      `}
      style={{
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: isDragOver ? 'scale(1.02)' : 'none',
        backgroundColor: isDragOver ? 'hsla(330, 100%, 60%, 0.1)' : 'transparent',
        border: isDragOver ? '2px dashed hsl(330, 100%, 60%)' : 'transparent',
        borderRadius: '8px'
      }}
    >
      {children}
      
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-raver text-sm animate-pulse">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>DROP HERE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Studio-specific drag tools
export const StudioDragTools: React.FC = () => {
  return (
    <div className="underground-glass p-4 rounded-xl">
      <h4 className="font-raver text-white text-sm mb-3">DRAG & DROP TOOLS</h4>
      <div className="grid grid-cols-2 gap-3 text-xs font-underground">
        <div className="flex items-center space-x-2 text-cyan-400">
          <MousePointer2 className="w-3 h-3" />
          <span>Click & Drag</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400">
          <ArrowUpDown className="w-3 h-3" />
          <span>Vertical Move</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-400">
          <ArrowLeftRight className="w-3 h-3" />
          <span>Horizontal Move</span>
        </div>
        <div className="flex items-center space-x-2 text-pink-400">
          <RotateCw className="w-3 h-3" />
          <span>Rotate & Scale</span>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="text-yellow-400 font-raver text-xs mb-1">INSTRUCTIONS</div>
        <div className="text-yellow-300 text-xs">
          • Drag samples to tracks
          • Drag elements to sequencer
          • Hold Shift for precision
          • Right-click for options
        </div>
      </div>
    </div>
  );
};

export default DragDropStudio;