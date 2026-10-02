import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, WrapText, ZoomIn, ZoomOut, FileCode2, Terminal, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Clean oneDark theme with completely transparent pre and code backgrounds to eliminate patchy boxes
const cleanOneDark = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    backgroundColor: 'transparent',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
    backgroundColor: 'transparent',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
};

const CodeBlock = ({ code, language, filename }) => {
  const [copied, setCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: 12px, 1: 13.5px, 2: 15px
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    let timeoutId;
    if (copied) {
      timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  const getMappedLanguage = (lang) => {
    const langMap = {
      csharp: 'csharp',
      'c#': 'csharp',
      cs: 'csharp',
      cshtml: 'markup',
      razor: 'markup',
      bash: 'bash',
      sh: 'bash',
      shell: 'bash',
      json: 'json',
      javascript: 'javascript',
      js: 'javascript',
      html: 'markup',
      xml: 'markup',
      sql: 'sql',
      text: 'text'
    };
    return langMap[lang?.toLowerCase()] || 'text';
  };

  const mappedLanguage = getMappedLanguage(language);

  const getLanguageLabel = (lang) => {
    const labels = {
      csharp: 'C#',
      cshtml: 'Razor / CSHTML',
      bash: 'Terminal / Bash',
      json: 'JSON Configuration',
      sql: 'SQL Query',
      text: 'Output / Text'
    };
    return labels[mappedLanguage] || (lang ? lang.toUpperCase() : 'CODE');
  };

  const getLanguageIcon = (lang) => {
    if (lang === 'bash') return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    if (lang === 'json') return <FileCode2 className="w-3.5 h-3.5 text-amber-400" />;
    return <Code2 className="w-3.5 h-3.5 text-primary" />;
  };

  const fontSizes = ['text-[12px]', 'text-[13.5px]', 'text-[15px]'];
  const lineHeights = ['leading-[1.65]', 'leading-[1.75]', 'leading-[1.85]'];

  // Check if horizontal scroll is available to show fade cue (Topic 10)
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowScrollHint(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [code, isWrapped]);

  return (
    <div className="relative my-7 rounded-2xl overflow-hidden border border-stone-800 bg-[#0B0F19] shadow-xl transition-all duration-200 group">
      
      {/* ========================================================================= */}
      {/* 1. TOP MAC-STYLE CHROME HEADER (Topic 11) */}
      {/* ========================================================================= */}
      <div className="bg-[#111625] px-4 py-2.5 flex items-center justify-between border-b border-stone-800 select-none">
        
        {/* Left: Traffic light dots & filename/language */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]/90 border border-[#DC2626] inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]/90 border border-[#D97706] inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#10B981]/90 border border-[#059669] inline-block shadow-xs" />
          </div>

          <div className="flex items-center gap-2 pl-1.5 border-l border-stone-700/60 text-xs text-stone-300 font-mono">
            {getLanguageIcon(mappedLanguage)}
            <span className="font-semibold text-stone-200">
              {filename || getLanguageLabel(mappedLanguage)}
            </span>
          </div>
        </div>

        {/* Right: Code controls (Topic 17) & Copy button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Word Wrap Toggle */}
          <button
            onClick={() => setIsWrapped(!isWrapped)}
            title={isWrapped ? 'Disable Word Wrap' : 'Enable Word Wrap'}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
              isWrapped 
                ? 'bg-primary/20 text-primary border border-primary/40' 
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <WrapText className="w-3 h-3" />
            <span className="hidden sm:inline">{isWrapped ? 'Wrapped' : 'Wrap'}</span>
          </button>

          {/* Font Size Zoom Toggles */}
          <div className="hidden sm:flex items-center bg-stone-800/80 rounded-md p-0.5 border border-stone-700/50 text-[11px] font-mono text-stone-400">
            <button
              onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
              disabled={fontSizeLevel === 0}
              className="px-1.5 py-0.5 hover:text-stone-200 disabled:opacity-30 cursor-pointer"
              title="Smaller font"
            >
              A-
            </button>
            <span className="px-1 text-[10px] text-stone-500">•</span>
            <button
              onClick={() => setFontSizeLevel(Math.min(2, fontSizeLevel + 1))}
              disabled={fontSizeLevel === 2}
              className="px-1.5 py-0.5 hover:text-stone-200 disabled:opacity-30 cursor-pointer"
              title="Larger font"
            >
              A+
            </button>
          </div>

          {/* Copy Button with Animated Checkmark (Topic 11) */}
          <button
            onClick={handleCopy}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700'
            }`}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="flex items-center gap-1 text-emerald-400"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SYNTAX HIGHLIGHTER WITH UNIFIED BACKGROUND & LINE NUMBERS (Topic 16) */}
      {/* ========================================================================= */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className={`relative ${isWrapped ? 'overflow-x-hidden' : 'overflow-x-auto'} scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent`}
      >
        <SyntaxHighlighter
          language={mappedLanguage}
          style={cleanOneDark}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={isWrapped}
          codeTagProps={{
            style: {
              background: 'transparent',
              backgroundColor: 'transparent',
              fontFamily: 'inherit',
            }
          }}
          lineProps={{
            style: {
              background: 'transparent',
              backgroundColor: 'transparent',
              display: 'flex',
            }
          }}
          customStyle={{
            margin: 0,
            padding: '1.15rem 1.25rem',
            background: '#0B0F19', // Pure, uniform background matching the container!
            backgroundColor: '#0B0F19',
            lineHeight: '1.75',
            borderRadius: 0,
            border: 'none',
          }}
          lineNumberStyle={{
            color: '#4B5563', // Clean, subtle line numbers
            paddingRight: '1.25rem',
            minWidth: '2.5rem',
            userSelect: 'none',
            fontStyle: 'normal',
            textAlign: 'right',
            opacity: 0.7,
            backgroundColor: 'transparent',
          }}
          className={`${fontSizes[fontSizeLevel]} ${lineHeights[fontSizeLevel]} font-mono`}
        >
          {code}
        </SyntaxHighlighter>

        {/* Right Fade Shadow to indicate scrollability (Topic 10) */}
        {showScrollHint && !isWrapped && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0B0F19] to-transparent opacity-80" />
        )}
      </div>

    </div>
  );
};

export default CodeBlock;
