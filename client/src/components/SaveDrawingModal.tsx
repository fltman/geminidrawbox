import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  "rolig fluffig monster med stora ögon",
  "färgglad regnbågsfågel som flyger",
  "magisk skog med lysande träd på natten",
  "cyber robot warrior i futuristisk stil",
  "söt kattunge som flyger i rymden",
  "drömlik undervattenvärld med koraller",
  "steampunk luftskepp med koppardetaljer",
  "mystisk drake som sprutar eld",
  "kawaii panda som äter bamboo",
  "fantasiprinsessa i glittrande klänning"
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
      <DialogContent className="w-[95vw] max-w-md">
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
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="use-ai"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="h-5 w-5 text-primary border-border rounded focus:ring-primary focus:ring-2"
                data-testid="checkbox-use-ai"
              />
              <Label htmlFor="use-ai" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Skapa AI-version med Gemini
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-8">
              AI:n kommer att skapa en ny tolkning av din ritning baserat på din beskrivning
            </p>
          </div>

          {/* AI Prompt Section */}
          {useAI && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <Label htmlFor="prompt" className="font-medium">Beskrivning för AI-generering</Label>
              </div>
              
              {/* Preset Prompts */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Välj en fördefinierad stil:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presetPrompts.map((presetPrompt) => (
                    <Button
                      key={presetPrompt}
                      variant={prompt === presetPrompt ? "default" : "outline"}
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3"
                      onClick={() => handlePresetClick(presetPrompt)}
                      data-testid={`button-preset-${presetPrompt.replace(/\s+/g, '-')}`}
                    >
                      <span className="text-xs leading-tight">{presetPrompt}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="prompt" className="text-sm text-muted-foreground">Eller skriv din egen beskrivning:</Label>
                <Textarea
                  id="prompt"
                  placeholder="Exempel: 'en magisk enhörning med regnbågsman och glittriga vingar'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-20 mt-2"
                  data-testid="textarea-ai-prompt"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  💡 <strong>Tips:</strong> Beskriv färger, känslor och detaljer för bästa resultat!
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
            data-testid="button-cancel-save"
            className="flex-1"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || (useAI && !prompt.trim())}
            data-testid="button-confirm-save"
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {useAI ? "Skapar AI-bild..." : "Sparar..."}
              </>
            ) : (
              <>
                {useAI ? (
                  <Sparkles className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {useAI ? "Spara & Generera AI" : "Bara spara"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}