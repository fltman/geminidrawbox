import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DrawingCanvas from "@/components/DrawingCanvas";
import ColorPicker from "@/components/ColorPicker";
import BrushControls from "@/components/BrushControls";
import DrawingActions from "@/components/DrawingActions";
import GeneratedImageModal from "@/components/GeneratedImageModal";
import SaveDrawingModal from "@/components/SaveDrawingModal";
import { useDrawing } from "@/hooks/useDrawing";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

export default function DrawingPage() {
  const isMobile = useIsMobile();
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const drawing = useDrawing();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar Toolbar */}
      <div className="hidden md:flex flex-col w-56 bg-card/50 border-r border-border/50 shadow-sm overflow-y-auto">
        {/* Toolbar Header */}
        <div className="p-4 border-b border-border/50">
          <h1 className="text-lg font-medium text-foreground">✨ AI Studio</h1>
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
                onClick={() => setShowSaveModal(true)}
                disabled={drawing.isSaving}
                className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                data-testid="button-mobile-save"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {drawing.isSaving ? "Sparar..." : "AI"}
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
        {/* Canvas Header - Minimized */}
        {!isMobile && (
          <div className="flex items-center justify-center p-3 bg-background border-b border-border/30">
            <span className="text-xs text-muted-foreground">800 × 500 canvas</span>
          </div>
        )}

        {/* Drawing Canvas */}
        <div className={`flex-1 bg-gradient-to-br from-background to-muted/20 overflow-hidden ${isMobile ? 'p-4' : 'p-8'}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl border border-border/20 overflow-hidden">
              <DrawingCanvas
                brushSize={drawing.brushSize}
                brushOpacity={drawing.brushOpacity}
                currentColor={drawing.currentColor}
                onCanvasRef={drawing.setCanvasRef}
                onMousePosition={drawing.setMousePosition}
              />
            </div>
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

        {/* Canvas Footer - Hidden for cleaner look */}
      </div>

      {/* Save Drawing Modal */}
      <SaveDrawingModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={(title: string, prompt?: string) => {
          drawing.saveDrawing(title, prompt);
          setShowSaveModal(false);
        }}
        isSaving={drawing.isSaving}
      />

      {/* Generated Image Modal */}
      <GeneratedImageModal
        open={drawing.showGeneratedImage}
        onClose={drawing.closeGeneratedImageModal}
        originalImageUrl={drawing.lastSavedDrawing?.originalImagePath}
        generatedImageUrl={drawing.lastSavedDrawing?.generatedImagePath}
        prompt={drawing.lastSavedDrawing?.prompt}
        title={drawing.lastSavedDrawing?.title}
        drawingId={drawing.lastSavedDrawing?.id}
      />
    </div>
  );
}
