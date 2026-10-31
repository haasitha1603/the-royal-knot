import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SignaturePadProps {
  onSave?: (signatureDataUrl: string) => void;
  documentTitle?: string;
  signeeName?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  documentTitle = "Wedding Service Agreement",
  signeeName = "Authorised Signatory",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = '#2C2A29'; // Charcoal ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const mouseEvent = e as React.MouseEvent;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current state for undo
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev, currentState]);

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setHistory([]);
    setSavedTime(null);
  };

  const undoLast = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = history[history.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(prev => prev.slice(0, -1));
    if (history.length <= 1) {
      setHasSignature(false);
    }
  };

  const handleConfirmSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    const dataUrl = canvas.toDataURL('image/png');
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    setSavedTime(timestamp);
    if (onSave) {
      onSave(dataUrl);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gold-300/80 p-6 shadow-royal max-w-xl mx-auto">
      <div className="flex items-center justify-between pb-3 border-b border-gold-200/60 mb-4">
        <div>
          <h4 className="font-serif text-lg font-bold text-charcoal-800">{documentTitle}</h4>
          <p className="text-xs text-charcoal-500">Signatory: <span className="font-medium text-burgundy-700">{signeeName}</span></p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted Audit Record</span>
        </div>
      </div>

      <div className="relative rounded-xl border border-dashed border-gold-400/80 bg-ivory-50/50 overflow-hidden touch-none mb-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-44 cursor-crosshair"
        />

        {!hasSignature && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-charcoal-400 text-sm italic font-serif">
            Draw your signature here with finger, stylus, or cursor
          </div>
        )}

        {/* Baseline guide */}
        <div className="pointer-events-none absolute bottom-8 left-8 right-8 border-b border-gold-300/40" />
      </div>

      {savedTime ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Digital signature recorded on {savedTime} (IST)</span>
          </div>
          <button
            onClick={clearCanvas}
            className="text-xs font-semibold text-emerald-900 underline hover:text-emerald-700"
          >
            Re-sign
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={undoLast}
              disabled={history.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal-600 bg-ivory-200 hover:bg-gold-100 rounded-lg transition-colors disabled:opacity-40"
              title="Undo last stroke"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              disabled={!hasSignature}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-burgundy-700 bg-burgundy-50 hover:bg-burgundy-100 rounded-lg transition-colors disabled:opacity-40"
              title="Clear canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirmSignature}
            disabled={!hasSignature}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-burgundy-700 hover:bg-burgundy-800 rounded-lg shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirm Signature
          </button>
        </div>
      )}
    </div>
  );
};
