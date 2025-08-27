import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DrawingCanvas from "@/components/DrawingCanvas";
import ColorPicker from "@/components/ColorPicker";
import BrushControls from "@/components/BrushControls";
import DrawingActions from "@/components/DrawingActions";
import GeneratedImageModal from "@/components/GeneratedImageModal";
import { useDrawing } from "@/hooks/useDrawing";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function DrawingPage() {
  const isMobile = useIsMobile();
  const [showMobileControls, setShowMobileControls] = useState(false);
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
                onClick={() => setShowMobileControls(!showMobileControls)}
                data-testid="button-mobile-menu"
              >
                {showMobileControls ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
            {showMobileControls && (
              <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg max-h-96 overflow-y-auto z-40">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Verktyg</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowMobileControls(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
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

                  {/* Mobile Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={drawing.undo}
                      disabled={!drawing.canUndo}
                      className="flex-1"
                      data-testid="button-mobile-undo"
                    >
                      Ångra
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={drawing.redo}
                      disabled={!drawing.canRedo}
                      className="flex-1"
                      data-testid="button-mobile-redo"
                    >
                      Gör om
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Canvas Container */}
      <div className={`flex-1 flex flex-col ${isMobile ? 'pt-32' : ''} relative`}>
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
        <div className={`flex-1 bg-muted/30 overflow-auto ${isMobile ? 'p-4' : 'p-12'}`}>
          <div className="w-full h-full flex items-center justify-center min-h-[800px]">
            <DrawingCanvas
              brushSize={drawing.brushSize}
              brushOpacity={drawing.brushOpacity}
              currentColor={drawing.currentColor}
              onCanvasRef={drawing.setCanvasRef}
              onMousePosition={drawing.setMousePosition}
            />
          </div>

          {/* Mobile stroke counter */}
          {isMobile && (
            <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-muted-foreground shadow-sm">
              <span data-testid="text-mobile-stroke-count">
                {drawing.strokeCount} drag
              </span>
            </div>
          )}
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

      {/* Generated Image Modal */}
      <GeneratedImageModal
        open={drawing.showGeneratedImage}
        onClose={drawing.closeGeneratedImageModal}
        originalImageUrl={drawing.lastSavedDrawing?.originalImagePath}
        generatedImageUrl={drawing.lastSavedDrawing?.generatedImagePath}
        prompt={drawing.lastSavedDrawing?.prompt}
        title={drawing.lastSavedDrawing?.title}
      />
    </div>
  );
}
