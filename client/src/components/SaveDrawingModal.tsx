import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";

interface SaveDrawingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, prompt?: string) => void;
  isSaving: boolean;
}

const presetPrompts = [
  "rolig fluffig monster",
  "färgglad regnbågsfågel",
  "magisk skog på natten",
  "cyber robot warrior",
  "söt kattunge i rymden",
  "drömlik undervattenvärld",
  "steampunk luftskepp",
  "mystisk drake"
];

export default function SaveDrawingModal({ 
  open, 
  onClose, 
  onSave, 
  isSaving 
}: SaveDrawingModalProps) {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [useAI, setUseAI] = useState(false);

  const handleSave = () => {
    const finalTitle = title.trim() || `Ritning ${new Date().toLocaleDateString("sv-SE")} ${new Date().toLocaleTimeString("sv-SE")}`;
    onSave(finalTitle, useAI ? prompt.trim() : undefined);
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    setUseAI(true);
  };

  const handleClose = () => {
    if (!isSaving) {
      setTitle("");
      setPrompt("");
      setUseAI(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Spara ritning</DialogTitle>
          <DialogDescription>
            Ge din ritning ett namn och välj om du vill generera en AI-version.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              placeholder="Ge din ritning ett namn..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-drawing-title"
            />
          </div>

          {/* AI Generation Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="use-ai"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
              data-testid="checkbox-use-ai"
            />
            <Label htmlFor="use-ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generera AI-version med Gemini
            </Label>
          </div>

          {/* AI Prompt Section */}
          {useAI && (
            <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
              <Label htmlFor="prompt">Beskrivning för AI-generering</Label>
              
              {/* Preset Prompts */}
              <div className="flex flex-wrap gap-2 mb-3">
                {presetPrompts.map((presetPrompt) => (
                  <Badge
                    key={presetPrompt}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handlePresetClick(presetPrompt)}
                    data-testid={`badge-preset-${presetPrompt.replace(/\s+/g, '-')}`}
                  >
                    {presetPrompt}
                  </Badge>
                ))}
              </div>

              {/* Custom Prompt */}
              <Textarea
                id="prompt"
                placeholder="Beskriv hur du vill att AI:n ska tolka din ritning..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20"
                data-testid="textarea-ai-prompt"
              />
              
              <p className="text-xs text-muted-foreground">
                AI:n kommer att använda din ritning som bas och skapa en ny interpretation baserat på din beskrivning.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
            data-testid="button-cancel-save"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || (useAI && !prompt.trim())}
            data-testid="button-confirm-save"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {useAI ? "Sparar & Genererar..." : "Sparar..."}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {useAI ? "Spara & Generera" : "Spara"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}