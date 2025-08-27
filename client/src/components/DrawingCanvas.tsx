import { useRef, useEffect, useState } from "react";

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
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    onMousePosition(point);

    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = brushOpacity;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

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
    <div className="relative">
      {/* Canvas Border and Info */}
      <div className="absolute -top-8 left-0 right-0 flex justify-between items-center text-xs text-muted-foreground px-2 hidden sm:flex">
        <span>Ritruta</span>
        <span>800 × 500 px</span>
      </div>
      
      {/* Canvas with Enhanced Border */}
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="drawing-canvas rounded-lg max-w-full max-h-full cursor-crosshair bg-white shadow-xl border-4 border-slate-400 dark:border-slate-500 transition-all duration-200 hover:shadow-2xl"
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
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        Din webbläsare stöder inte HTML5 Canvas.
      </canvas>
      
      {/* Corner Size Indicators - Hidden on mobile */}
      <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground hidden sm:block">
        Bredd: 800px
      </div>
      <div className="absolute -right-16 bottom-0 text-xs text-muted-foreground transform rotate-90 origin-bottom-left hidden sm:block">
        Höjd: 500px
      </div>
    </div>
  );
}
