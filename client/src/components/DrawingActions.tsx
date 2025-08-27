import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Undo, Redo, Save } from "lucide-react";
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
        
        {/* Save Button */}
        <div className="mt-6 pt-6 border-t border-border">
          <Button
            className="w-full gap-3 shadow-lg"
            onClick={handleSaveClick}
            disabled={isSaving}
            data-testid="button-save-drawing"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Sparar..." : "Spara bild"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Bilden sparas på servern
          </p>
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
