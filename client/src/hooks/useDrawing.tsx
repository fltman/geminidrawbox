import { useState, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DrawingState {
  currentColor: string;
  brushSize: number;
  brushOpacity: number;
  mousePosition: { x: number; y: number };
  strokeCount: number;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

export function useDrawing() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);

  const [state, setState] = useState<DrawingState>({
    currentColor: "#2563eb",
    brushSize: 5,
    brushOpacity: 1,
    mousePosition: { x: 0, y: 0 },
    strokeCount: 0,
    canUndo: false,
    canRedo: false,
    isSaving: false,
  });

  const saveDrawingMutation = useMutation({
    mutationFn: async (imageData: { title: string; imagePath: string }) => {
      return await apiRequest("POST", "/api/drawings", imageData);
    },
    onSuccess: () => {
      toast({
        title: "Ritning sparad!",
        description: "Din ritning har sparats på servern.",
      });
    },
    onError: (error) => {
      console.error("Save error:", error);
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara ritningen. Försök igen.",
        variant: "destructive",
      });
    },
  });

  const getUploadUrlMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/drawings/upload");
      return await response.json();
    },
  });

  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
    if (canvas) {
      // Save initial state
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
      }
    }
  }, []);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.current.push(imageData);
    
    // Limit undo stack size
    if (undoStack.current.length > 50) {
      undoStack.current.shift();
    }
    
    // Clear redo stack when new action is performed
    redoStack.current = [];
    
    setState(prev => ({
      ...prev,
      canUndo: undoStack.current.length > 1,
      canRedo: false,
      strokeCount: prev.strokeCount + 1,
    }));
  }, []);

  const setCurrentColor = useCallback((color: string) => {
    setState(prev => ({ ...prev, currentColor: color }));
  }, []);

  const setBrushSize = useCallback((size: number) => {
    setState(prev => ({ ...prev, brushSize: size }));
  }, []);

  const setBrushOpacity = useCallback((opacity: number) => {
    setState(prev => ({ ...prev, brushOpacity: opacity }));
  }, []);

  const setMousePosition = useCallback((position: { x: number; y: number }) => {
    setState(prev => ({ ...prev, mousePosition: position }));
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, [saveState]);

  const undo = useCallback(() => {
    if (undoStack.current.length <= 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    // Move current state to redo stack
    const currentState = undoStack.current.pop();
    if (currentState) {
      redoStack.current.push(currentState);
    }

    // Restore previous state
    const previousState = undoStack.current[undoStack.current.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    }

    setState(prev => ({
      ...prev,
      canUndo: undoStack.current.length > 1,
      canRedo: redoStack.current.length > 0,
    }));
  }, []);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const nextState = redoStack.current.pop();
    if (nextState) {
      undoStack.current.push(nextState);
      ctx.putImageData(nextState, 0, 0);
    }

    setState(prev => ({
      ...prev,
      canUndo: undoStack.current.length > 1,
      canRedo: redoStack.current.length > 0,
    }));
  }, []);

  const saveDrawing = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setState(prev => ({ ...prev, isSaving: true }));

    try {
      // Get upload URL
      const { uploadURL } = await getUploadUrlMutation.mutateAsync();

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });

      // Upload image
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": "image/png",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Save drawing metadata
      const title = `Ritning ${new Date().toLocaleDateString("sv-SE")} ${new Date().toLocaleTimeString("sv-SE")}`;
      await saveDrawingMutation.mutateAsync({
        title,
        imagePath: uploadURL,
      });

    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara ritningen. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [getUploadUrlMutation, saveDrawingMutation, toast]);

  return {
    ...state,
    setCanvasRef,
    setCurrentColor,
    setBrushSize,
    setBrushOpacity,
    setMousePosition,
    clearCanvas,
    undo,
    redo,
    saveDrawing,
    saveState,
  };
}
