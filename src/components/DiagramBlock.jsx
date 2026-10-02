import React, { useState } from 'react';
import { Copy, Check, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiagramBlock({ diagramText, title = 'Architecture Diagram' }) {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(diagramText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.8));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
  const resetZoom = () => setZoomLevel(1);

  return (
    <>
      <div className="relative my-7 rounded-2xl overflow-hidden border border-border bg-[#0B0F19] text-stone-200 shadow-xl transition-all">
        
        {/* Diagram Header */}
        <div className="bg-[#111625] px-4 py-2.5 flex items-center justify-between border-b border-stone-800 select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Network className="w-4 h-4 text-amber-400" />
            <span>{title}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Zoom Controls */}
            <div className="flex items-center bg-stone-800/80 rounded-lg p-0.5 border border-stone-700/60 text-xs font-mono text-stone-300">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.7}
                className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetZoom}
                className="px-1.5 text-[11px] text-stone-400 hover:text-white cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 1.8}
                className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fullscreen Expand Button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs cursor-pointer"
              title="View Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Copy Diagram */}
            <button
              onClick={handleCopy}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Diagram Monospace Canvas */}
        <div className="overflow-x-auto p-5 sm:p-6 scrollbar-thin scrollbar-thumb-stone-700">
          <div 
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
            className="transition-transform duration-150 inline-block min-w-full"
          >
            <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-emerald-400/90 whitespace-pre">
              {diagramText}
            </pre>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal View (Topic 18) */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4 sm:p-8"
          >
            <div className="flex items-center justify-between bg-stone-900 border border-stone-700 px-6 py-3 rounded-2xl mb-4 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 font-mono">
                <Network className="w-5 h-5" />
                <span>{title} (Fullscreen Explorer)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs rounded-xl font-mono text-stone-200 border border-stone-600 flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Diagram'}</span>
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-xs font-bold text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Close Fullscreen</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0B0F19] border border-stone-800 rounded-3xl p-6 sm:p-10 flex items-center justify-center">
              <pre className="font-mono text-sm sm:text-base leading-relaxed text-emerald-400 select-text whitespace-pre">
                {diagramText}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
