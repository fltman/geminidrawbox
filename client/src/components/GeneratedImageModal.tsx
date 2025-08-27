import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, X } from "lucide-react";

interface GeneratedImageModalProps {
  open: boolean;
  onClose: () => void;
  originalImageUrl?: string;
  generatedImageUrl?: string;
  prompt?: string;
  title?: string;
  drawingId?: string;
}

export default function GeneratedImageModal({ 
  open, 
  onClose,
  originalImageUrl,
  generatedImageUrl,
  prompt,
  title,
  drawingId
}: GeneratedImageModalProps) {
  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDebugDownload = async () => {
    if (!drawingId || !prompt) return;
    
    try {
      const response = await fetch(`/api/drawings/${drawingId}/debug-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gemini-debug-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download debug response:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI-genererad bild klar!
          </DialogTitle>
          <DialogDescription>
            {title && `"${title}" - `}
            Din ritning har omvandlats med AI-magi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Prompt Display */}
          {prompt && (
            <div className="p-3 bg-secondary/50 rounded-lg">
              <Badge variant="outline" className="mb-2">
                AI-prompt
              </Badge>
              <p className="text-sm text-foreground">{prompt}</p>
            </div>
          )}

          {/* Image Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Drawing */}
            {originalImageUrl && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Original ritning</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(originalImageUrl, 'original-drawing.png')}
                    data-testid="button-download-original"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative bg-white rounded-lg border overflow-hidden">
                  <img
                    src={originalImageUrl}
                    alt="Original ritning"
                    className="w-full h-auto max-h-80 object-contain"
                    data-testid="img-original-drawing"
                  />
                </div>
              </div>
            )}

            {/* Generated Image */}
            {generatedImageUrl && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI-genererad
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(generatedImageUrl, 'ai-generated.png')}
                    data-testid="button-download-generated"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative bg-white rounded-lg border overflow-hidden">
                  <img
                    src={generatedImageUrl}
                    alt="AI-genererad bild"
                    className="w-full h-auto max-h-80 object-contain"
                    data-testid="img-generated"
                  />
                </div>
              </div>
            )}
          </div>

          {!generatedImageUrl && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="text-6xl animate-bounce">🎨</div>
                <div className="text-4xl animate-pulse mt-2">✨</div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">AI is painting your masterpiece...</p>
                <p className="text-sm text-muted-foreground animate-pulse">Adding magical touches 🪄</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          {drawingId && prompt && (
            <Button 
              onClick={handleDebugDownload} 
              variant="outline" 
              size="sm"
              data-testid="button-debug-download"
            >
              Debug Response
            </Button>
          )}
          <Button onClick={onClose} data-testid="button-close-generated" className="ml-auto">
            <X className="w-4 h-4 mr-2" />
            Stäng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}