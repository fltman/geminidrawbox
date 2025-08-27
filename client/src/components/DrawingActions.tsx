import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Undo, Redo, Sparkles } from "lucide-react";
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
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">⚡ Actions</h3>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            data-testid="button-undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            data-testid="button-redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClear}
          data-testid="button-clear-canvas"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear
        </Button>
        
        {/* AI Generate Button */}
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          onClick={handleSaveClick}
          disabled={isSaving}
          data-testid="button-save-drawing"
        >
          {isSaving ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI
            </>
          )}
        </Button>
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