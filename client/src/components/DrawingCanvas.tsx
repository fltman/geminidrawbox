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
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      className="drawing-canvas rounded-lg max-w-full max-h-full cursor-crosshair bg-white shadow-lg"
      onMouseDown={startDrawing}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      data-testid="canvas-drawing"
      style={{ touchAction: 'none' }}
    >
      Din webbläsare stöder inte HTML5 Canvas.
    </canvas>
  );
}
