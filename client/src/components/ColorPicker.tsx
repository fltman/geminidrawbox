interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const colorSwatches = [
  "#000000", "#ffffff", "#ef4444", "#22c55e",
  "#3b82f6", "#a855f7", "#f59e0b", "#14b8a6",
  "#f97316", "#8b5cf6", "#64748b", "#dc2626"
];

export default function ColorPicker({ currentColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">🎨 Colors</h3>
      
      {/* Color Grid */}
      <div className="grid grid-cols-6 gap-2">
        {colorSwatches.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
              currentColor === color ? 'border-foreground shadow-lg' : 'border-border/50'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            data-testid={`button-color-swatch-${color.replace('#', '')}`}
          />
        ))}
      </div>
      
      {/* Custom Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Custom</span>
          <span className="text-xs font-mono">{currentColor}</span>
        </div>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full h-8 rounded-md border border-border cursor-pointer"
          data-testid="input-color-picker"
        />
      </div>
    </div>
  );
}