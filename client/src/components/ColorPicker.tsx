import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  const [hexInput, setHexInput] = useState(currentColor);

  const handleColorChange = (color: string) => {
    onColorChange(color);
    setHexInput(color);
  };

  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onColorChange(value);
    }
  };

  return (
    <div className="p-6 border-b border-border">
      <h3 className="text-sm font-medium text-foreground mb-4">Färg</h3>
      
      {/* Current Color */}
      <div className="mb-4 p-3 bg-secondary rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-8 h-8 rounded border-2 border-border shadow-inner"
            style={{ backgroundColor: currentColor }}
            data-testid="display-current-color"
          />
          <span className="text-sm font-medium" data-testid="text-current-color-hex">
            {currentColor}
          </span>
        </div>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full h-8 rounded border border-border cursor-pointer"
          data-testid="input-color-picker"
        />
      </div>
      
      {/* Color Swatches */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {colorSwatches.map((color) => (
          <button
            key={color}
            className="color-swatch w-8 h-8 rounded border-2 border-border shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
            data-testid={`button-color-swatch-${color.replace('#', '')}`}
          />
        ))}
      </div>
      
      {/* Hex Input */}
      <Input
        type="text"
        placeholder="#000000"
        value={hexInput}
        onChange={(e) => handleHexInputChange(e.target.value)}
        className="text-sm"
        data-testid="input-hex-color"
      />
    </div>
  );
}
