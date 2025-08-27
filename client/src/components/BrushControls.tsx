interface BrushControlsProps {
  brushSize: number;
  brushOpacity: number;
  onBrushSizeChange: (size: number) => void;
  onBrushOpacityChange: (opacity: number) => void;
}

export default function BrushControls({
  brushSize,
  brushOpacity,
  onBrushSizeChange,
  onBrushOpacityChange,
}: BrushControlsProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">🖌️ Brush</h3>
      
      {/* Brush Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Size</span>
          <span className="text-xs font-mono">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          data-testid="input-brush-size"
        />
      </div>
      
      {/* Opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Opacity</span>
          <span className="text-xs font-mono">{Math.round(brushOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={brushOpacity}
          onChange={(e) => onBrushOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          data-testid="input-brush-opacity"
        />
      </div>
    </div>
  );
}