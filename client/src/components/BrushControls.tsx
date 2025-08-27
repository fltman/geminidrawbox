import { Label } from "@/components/ui/label";

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
    <div className="p-6 border-b border-border">
      <h3 className="text-sm font-medium text-foreground mb-4">Pensel</h3>
      
      {/* Brush Size */}
      <div className="mb-6">
        <Label className="text-xs text-muted-foreground mb-2 block">Tjocklek</Label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            data-testid="input-brush-size"
          />
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <div
              className="brush-preview rounded-full bg-foreground transition-all"
              style={{
                width: `${Math.min(Math.max(brushSize / 5, 2), 20)}px`,
                height: `${Math.min(Math.max(brushSize / 5, 2), 20)}px`,
              }}
              data-testid="display-brush-preview"
            />
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1 block" data-testid="text-brush-size">
          {brushSize}px
        </span>
      </div>
      
      {/* Opacity */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Opacitet</Label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={brushOpacity}
          onChange={(e) => onBrushOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          data-testid="input-brush-opacity"
        />
        <span className="text-xs text-muted-foreground mt-1 block" data-testid="text-brush-opacity">
          {Math.round(brushOpacity * 100)}%
        </span>
      </div>
    </div>
  );
}
