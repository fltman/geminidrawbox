import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DrawingCanvas from "@/components/DrawingCanvas";
import ColorPicker from "@/components/ColorPicker";
import BrushControls from "@/components/BrushControls";
import DrawingActions from "@/components/DrawingActions";
import { useDrawing } from "@/hooks/useDrawing";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function DrawingPage() {
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const drawing = useDrawing();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar Toolbar */}
      <div className="hidden md:flex flex-col w-80 bg-card border-r border-border shadow-sm">
        {/* Toolbar Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground mb-2">Digital Rityta</h1>
          <p className="text-sm text-muted-foreground">Välj verktyg och börja rita</p>
        </div>

        {/* Brush Controls */}
        <BrushControls
          brushSize={drawing.brushSize}
          brushOpacity={drawing.brushOpacity}
          onBrushSizeChange={drawing.setBrushSize}
          onBrushOpacityChange={drawing.setBrushOpacity}
        />

        {/* Color Picker */}
        <ColorPicker
          currentColor={drawing.currentColor}
          onColorChange={drawing.setCurrentColor}
        />

        {/* Drawing Actions */}
        <DrawingActions
          onClear={drawing.clearCanvas}
          onUndo={drawing.undo}
          onRedo={drawing.redo}
          onSave={drawing.saveDrawing}
          canUndo={drawing.canUndo}
          canRedo={drawing.canRedo}
          isSaving={drawing.isSaving}
        />
      </div>

      {/* Mobile Toolbar */}
      {isMobile && (
        <>
          <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-lg font-semibold">Digital Rityta</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                data-testid="button-mobile-menu"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>

            {/* Mobile Quick Tools */}
            <div className="flex items-center gap-2 px-4 pb-4 overflow-x-auto">
              <input
                type="color"
                value={drawing.currentColor}
                onChange={(e) => drawing.setCurrentColor(e.target.value)}
                className="w-10 h-10 rounded border-2 border-border cursor-pointer flex-shrink-0"
                data-testid="input-mobile-color"
              />
              <input
                type="range"
                min="1"
                max="50"
                value={drawing.brushSize}
                onChange={(e) => drawing.setBrushSize(Number(e.target.value))}
                className="flex-1 min-w-20"
                data-testid="input-mobile-brush-size"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={drawing.clearCanvas}
                className="flex-shrink-0"
                data-testid="button-mobile-clear"
              >
                Rensa
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const title = `Ritning ${new Date().toLocaleDateString("sv-SE")} ${new Date().toLocaleTimeString("sv-SE")}`;
                  drawing.saveDrawing(title);
                }}
                disabled={drawing.isSaving}
                className="flex-shrink-0"
                data-testid="button-mobile-save"
              >
                {drawing.isSaving ? "Sparar..." : "Spara"}
              </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
              <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg max-h-96 overflow-y-auto">
                <div className="p-4 space-y-4">
                  <BrushControls
                    brushSize={drawing.brushSize}
                    brushOpacity={drawing.brushOpacity}
                    onBrushSizeChange={drawing.setBrushSize}
                    onBrushOpacityChange={drawing.setBrushOpacity}
                  />
                  <ColorPicker
                    currentColor={drawing.currentColor}
                    onColorChange={drawing.setCurrentColor}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Canvas Container */}
      <div className={`flex-1 flex flex-col ${isMobile ? 'mt-32' : ''}`}>
        {/* Canvas Header */}
        {!isMobile && (
          <div className="flex items-center justify-between p-6 bg-card border-b border-border">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="text-sm font-medium text-green-600">Redo att rita</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">1200 × 800 px</span>
            </div>
          </div>
        )}

        {/* Drawing Canvas */}
        <div className="flex-1 p-6 bg-muted/30 overflow-auto">
          <div className="max-w-full max-h-full flex items-center justify-center">
            <DrawingCanvas
              brushSize={drawing.brushSize}
              brushOpacity={drawing.brushOpacity}
              currentColor={drawing.currentColor}
              onCanvasRef={drawing.setCanvasRef}
              onMousePosition={drawing.setMousePosition}
            />
          </div>
        </div>

        {/* Canvas Footer */}
        {!isMobile && (
          <div className="flex items-center justify-between p-4 bg-card border-t border-border text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              <span data-testid="text-mouse-position">
                X: {drawing.mousePosition.x}, Y: {drawing.mousePosition.y}
              </span>
              <span data-testid="text-brush-info">
                Pensel: {drawing.brushSize}px, {drawing.currentColor}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span data-testid="text-stroke-count">
                Penseldrag: {drawing.strokeCount}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
