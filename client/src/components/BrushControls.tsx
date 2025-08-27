interface BrushControlsProps {
  brushSize: number;
  brushOpacity: number;
  onBrushSizeChange: (size: number) => void;
  onBrushOpacityChange: (opacity: number) => void;
}

const brushSizes = [5, 10, 20, 35, 50];

export default function BrushControls({
  brushSize,
  onBrushSizeChange,
}: BrushControlsProps) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-2">
        {brushSizes.map((size) => (
          <button
            key={size}
            onClick={() => onBrushSizeChange(size)}
            className={`h-12 rounded-lg border-2 transition-all flex items-center justify-center ${
              brushSize === size 
                ? 'border-foreground bg-accent shadow-lg' 
                : 'border-border/50 hover:border-border'
            }`}
            data-testid={`button-brush-size-${size}`}
          >
            <div
              className="bg-foreground rounded-full"
              style={{
                width: `${Math.min(size / 2, 20)}px`,
                height: `${Math.min(size / 2, 20)}px`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}