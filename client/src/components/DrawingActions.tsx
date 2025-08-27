import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Undo, Redo, Save, Sparkles } from "lucide-react";
import SaveDrawingModal from "./SaveDrawingModal";

interface DrawingActionsProps {
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: (title: string, prompt?: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

export default function DrawingActions({
  onClear,
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
  isSaving,
}: DrawingActionsProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleSaveConfirm = (title: string, prompt?: string) => {
    onSave(title, prompt);
    setShowSaveModal(false);
  };

  return (
    <>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-foreground mb-4">Åtgärder</h3>
        
        {/* Action Buttons */}
        <div className="space-y-3 flex-1">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={onClear}
            data-testid="button-clear-canvas"
          >
            <Eraser className="w-4 h-4" />
            Rensa rityta
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={onUndo}
            disabled={!canUndo}
            data-testid="button-undo"
          >
            <Undo className="w-4 h-4" />
            Ångra
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={onRedo}
            disabled={!canRedo}
            data-testid="button-redo"
          >
            <Redo className="w-4 h-4" />
            Gör om
          </Button>
        </div>
        
        {/* AI Generate Button - Primary Action */}
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <Button
            className="w-full gap-3 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={handleSaveClick}
            disabled={isSaving}
            data-testid="button-save-drawing"
          >
            <Sparkles className="w-5 h-5" />
            {isSaving ? "Sparar..." : "Spara & Generera AI"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Spara din ritning och välj AI-tolkning
          </p>
          
          {/* Quick Save Option */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const quickTitle = `Ritning ${new Date().toLocaleDateString("sv-SE")} ${new Date().toLocaleTimeString("sv-SE")}`;
              onSave(quickTitle);
            }}
            disabled={isSaving}
            data-testid="button-quick-save"
          >
            <Save className="w-4 h-4 mr-2" />
            Bara spara (utan AI)
          </Button>
        </div>
      </div>

      <SaveDrawingModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveConfirm}
        isSaving={isSaving}
      />
    </>
  );
}
