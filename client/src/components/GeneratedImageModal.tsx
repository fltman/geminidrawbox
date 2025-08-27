import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface GeneratedImageModalProps {
  open: boolean;
  onClose: () => void;
  originalImageUrl?: string;
  generatedImageUrl?: string;
  title?: string;
  prompt?: string;
  drawingId?: string;
}

export default function GeneratedImageModal({
  open,
  onClose,
  generatedImageUrl,
  drawingId,
  prompt
}: GeneratedImageModalProps) {

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDebugDownload = async () => {
    if (!drawingId || !prompt) return;
    
    try {
      const response = await fetch(`/api/drawings/${drawingId}/debug?prompt=${encodeURIComponent(prompt)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `debug-response-${drawingId}.json`;
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
      <DialogContent className="w-[95vw] max-w-5xl max-h-[95vh] overflow-hidden p-6 border-0">
        
        {/* Large Funny Progress Indicator */}
        {!generatedImageUrl && (
          <div className="text-center py-20">
            <div className="relative mb-12">
              <div className="text-9xl animate-bounce">🎨</div>
              <div className="absolute -top-4 -right-4 text-6xl animate-ping">✨</div>
              <div className="absolute -bottom-4 -left-4 text-5xl animate-pulse">🪄</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-spin">🌟</div>
            </div>
            
            <div className="space-y-6">
              <div className="text-3xl font-bold animate-pulse bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Magic in Progress...
              </div>
              
              <div className="flex justify-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
              </div>
              
              <div className="text-xl text-muted-foreground animate-pulse">
                Creating something amazing... 🚀
              </div>
            </div>
          </div>
        )}

        {/* Full Screen AI Image Display */}
        {generatedImageUrl && (
          <div className="relative w-full h-full flex flex-col items-center">
            <img
              src={generatedImageUrl}
              alt="AI Generated Masterpiece"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              data-testid="img-generated"
            />
            
            {/* Download Button Overlay */}
            <div className="absolute top-6 right-6">
              <Button
                onClick={() => handleDownload(generatedImageUrl, 'ai-masterpiece.png')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg backdrop-blur-sm"
                size="lg"
                data-testid="button-download-generated"
              >
                <Download className="w-5 h-5 mr-2" />
                Save
              </Button>
            </div>

            {/* Close Button */}
            <div className="mt-8">
              <Button 
                onClick={onClose} 
                variant="outline" 
                size="lg" 
                className="px-8"
                data-testid="button-close-generated"
              >
                <X className="w-5 h-5 mr-2" />
                Close
              </Button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}