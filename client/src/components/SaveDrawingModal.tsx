import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Save } from "lucide-react";

interface SaveDrawingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, prompt?: string) => void;
  isSaving: boolean;
}

const presetPrompts = [
  "fluffy monster",
  "scary plush toy", 
  "made out of metal",
  "cyberpunk style",
  "cute kawaii version",
  "steampunk design",
  "underwater creature",
  "space robot",
  "fantasy dragon",
  "cartoon style"
];

export default function SaveDrawingModal({ 
  open, 
  onClose, 
  onSave, 
  isSaving 
}: SaveDrawingModalProps) {
  const [prompt, setPrompt] = useState("");

  const handleSave = () => {
    const finalTitle = `Drawing ${new Date().toLocaleDateString("en-US")} ${new Date().toLocaleTimeString("en-US")}`;
    onSave(finalTitle, prompt.trim() || undefined);
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  const handleClose = () => {
    if (!isSaving) {
      setPrompt("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Generate AI Version</DialogTitle>
          <DialogDescription>
            Choose a style transformation for your drawing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preset Prompts */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Choose a style:</p>
            <div className="grid grid-cols-2 gap-2">
              {presetPrompts.map((presetPrompt) => (
                <Button
                  key={presetPrompt}
                  variant={prompt === presetPrompt ? "default" : "outline"}
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => handlePresetClick(presetPrompt)}
                  disabled={isSaving}
                  data-testid={`button-preset-${presetPrompt.replace(/\s+/g, '-')}`}
                >
                  <span className="text-xs leading-tight">{presetPrompt}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Or write custom prompt:</p>
            <Textarea
              placeholder="e.g., 'magical unicorn with rainbow mane'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-20"
              disabled={isSaving}
              data-testid="textarea-ai-prompt"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSaving}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            data-testid="button-save-with-ai"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Version
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}