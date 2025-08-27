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
import { Menu, X, Sparkles, Wrench } from "lucide-react";

export default function DrawingPage() {
  const isMobile = useIsMobile();
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const drawing = useDrawing();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar Toolbar */}
      <div className="hidden md:flex flex-col w-56 bg-card/50 border-r border-border/50 shadow-sm overflow-y-auto">


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

      {/* Mobile Floating Tools */}
      {isMobile && (
        <>
          {/* Floating Tool Button */}
          <div className="fixed top-4 right-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="bg-card/90 backdrop-blur-sm shadow-lg"
              data-testid="button-mobile-menu"
            >
              {showMobileControls ? <X className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
            </Button>
          </div>

          {/* Floating Quick Actions */}
          <div className="fixed bottom-4 left-4 right-4 z-40">
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={drawing.clearCanvas}
                className="bg-card/90 backdrop-blur-sm shadow-lg"
                data-testid="button-mobile-clear"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setShowSaveModal(true)}
                disabled={drawing.isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                data-testid="button-mobile-save"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {drawing.isSaving ? "Generating..." : "AI"}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {showMobileControls && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg shadow-xl max-h-[80vh] overflow-y-auto w-full max-w-sm">
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Tools</h3>
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
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Canvas Container */}
      <div className={`${isMobile ? 'fixed inset-0' : 'flex-1 flex flex-col relative'}`}>
        {/* Canvas Header - Desktop only */}
        {!isMobile && (
          <div className="flex items-center justify-center p-3 bg-background border-b border-border/30">
            <span className="text-xs text-muted-foreground">800 × 500 canvas</span>
          </div>
        )}

        {/* Drawing Canvas */}
        <div className={`${isMobile ? 'w-full h-full' : 'flex-1 bg-gradient-to-br from-background to-muted/20 overflow-hidden p-8'}`}>
          {isMobile ? (
            <DrawingCanvas
              brushSize={drawing.brushSize}
              brushOpacity={drawing.brushOpacity}
              currentColor={drawing.currentColor}
              onCanvasRef={drawing.setCanvasRef}
              onMousePosition={drawing.setMousePosition}
            />
          ) : (
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
          )}
        </div>
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
