import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DrawingCanvasProps {
  brushSize: number;
  brushOpacity: number;
  currentColor: string;
  onCanvasRef: (canvas: HTMLCanvasElement | null) => void;
  onMousePosition: (position: { x: number; y: number }) => void;
}

export default function DrawingCanvas({
  brushSize,
  brushOpacity,
  currentColor,
  onCanvasRef,
  onMousePosition,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 500 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateCanvasSize = () => {
      if (isMobile) {
        // On mobile, use full viewport
        setCanvasDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      } else {
        // On desktop, use fixed size
        setCanvasDimensions({ width: 800, height: 500 });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      onCanvasRef(canvas);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.imageSmoothingEnabled = true;
      }
    }
  }, [onCanvasRef]);

  const getPointFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    setIsDrawing(true);
    setLastPoint(point);
    onMousePosition(point);

    // Draw initial dot for brush start
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = currentColor;
      ctx.globalAlpha = brushOpacity;
      ctx.beginPath();
      ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    onMousePosition(point);

    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    // Set up brush properties for smooth, round strokes
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = brushOpacity;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;

    // Calculate distance between points for smoother drawing
    const distance = Math.sqrt(
      Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
    );

    // If points are close, draw a smooth line
    if (distance < brushSize * 2) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    } else {
      // For larger distances, interpolate points for smoother lines
      const steps = Math.ceil(distance / (brushSize / 2));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = lastPoint.x + (point.x - lastPoint.x) * t;
        const y = lastPoint.y + (point.y - lastPoint.y) * t;
        
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    setLastPoint(point);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      draw(e);
    } else {
      const point = getPointFromEvent(e);
      onMousePosition(point);
    }
  };

  return (
    <div className={`relative ${isMobile ? 'fixed inset-0' : ''}`}>
      {/* Canvas Border and Info - Desktop only */}
      {!isMobile && (
        <div className="absolute -top-8 left-0 right-0 flex justify-between items-center text-xs text-muted-foreground px-2">
          <span>Canvas</span>
          <span>{canvasDimensions.width} × {canvasDimensions.height} px</span>
        </div>
      )}
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className={`drawing-canvas cursor-crosshair bg-white transition-all duration-200 ${
          isMobile 
            ? 'w-full h-full block' 
            : 'rounded-lg max-w-full max-h-full shadow-xl border-4 border-slate-400 dark:border-slate-500 hover:shadow-2xl'
        }`}
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        data-testid="canvas-drawing"
        style={{ 
          touchAction: 'none',
          ...(isMobile ? {} : { boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.1)' })
        }}
      >
        Your browser does not support HTML5 Canvas.
      </canvas>
      
      {/* Corner Size Indicators - Desktop only */}
      {!isMobile && (
        <>
          <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
            Width: {canvasDimensions.width}px
          </div>
          <div className="absolute -right-16 bottom-0 text-xs text-muted-foreground transform rotate-90 origin-bottom-left">
            Height: {canvasDimensions.height}px
          </div>
        </>
      )}
    </div>
  );
}
