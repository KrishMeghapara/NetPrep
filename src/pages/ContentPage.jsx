import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Menu, X, BookOpen, ChevronDown, 
  Home, Lightbulb, CheckCircle2, Share2, Sparkles, 
  ThumbsUp, ThumbsDown, ArrowLeft, Search, PanelLeftClose, PanelLeft,
  Check, AlignLeft, Hash, ArrowUp, ArrowDown, Layers, Cpu, Database,
  Workflow, Sliders, ShieldCheck, FileCode, Eye, EyeOff, Maximize2,
  Minimize2, ListFilter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import courseData from '../data/content';
import CodeBlock from '../components/CodeBlock';
import DiagramBlock from '../components/DiagramBlock';

// Module icon mapping
const unitIcons = {
  p1u1: Cpu,
  p1u2: Layers,
  p1u3: FileCode,
  p1u4: CheckCircle2,
  p1u5: Database,
  p2u1: Workflow,
  p2u2: Database,
  p2u3: Workflow,
  p2u4: Sliders,
  p2u5: ShieldCheck,
  bonus: Sparkles,
};

// Circular Progress Ring Component (Topic 13)
function CircularProgressRing({ percentage, size = 32, strokeWidth = 3.5, showLabel = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          stroke="currentColor" 
          strokeWidth={strokeWidth} 
          className="text-border/70" 
          fill="transparent" 
        />
        <circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          stroke="#F97316" 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          fill="transparent" 
          className="transition-all duration-500 ease-out" 
        />
      </svg>
      {showLabel && (
        <span className="absolute text-[9px] font-mono font-black text-text">
          {percentage}%
        </span>
      )}
    </div>
  );
}

export default function ContentPage() {
  const { partId, unitId, sectionId } = useParams();
  const navigate = useNavigate();
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar
  const [isZenMode, setIsZenMode] = useState(false); // Topic 2: Zen Reading Mode
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // Topic 19: Mobile Bottom Sheet
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolledHeader, setIsScrolledHeader] = useState(false); // Topic 6: Morphing header
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'xl'
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSectionId, setCopiedSectionId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState('');

  // Ensure clean Light Theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('netprep_theme');
  }, []);

  // Stored completed sections & units
  const [completedSections, setCompletedSections] = useState(() => {
    try {
      const saved = localStorage.getItem('netprep_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Resolve active Part & Unit
  const currentPart = useMemo(() => {
    if (!partId) return courseData.parts[0];
    return courseData.parts.find(p => p.id === partId) || courseData.parts[0];
  }, [partId]);

  const currentUnit = useMemo(() => {
    if (!currentPart) return null;
    if (!unitId) return currentPart.units[0];
    return currentPart.units.find(u => u.id === unitId) || currentPart.units[0];
  }, [currentPart, unitId]);

  // Compute all units list for Previous / Next Unit navigation
  const allUnits = useMemo(() => {
    const list = [];
    courseData.parts.forEach(p => {
      p.units.forEach(u => {
        list.push({
          partId: p.id,
          partTitle: p.title,
          unit: u,
          url: `/learn/${p.id}/${u.id}`
        });
      });
    });
    return list;
  }, []);

  const currentUnitIndex = useMemo(() => {
    if (!currentPart || !currentUnit) return 0;
    return allUnits.findIndex(
      item => item.partId === currentPart.id && item.unit.id === currentUnit.id
    );
  }, [allUnits, currentPart, currentUnit]);

  const prevUnit = currentUnitIndex > 0 ? allUnits[currentUnitIndex - 1] : null;
  const nextUnit = currentUnitIndex >= 0 && currentUnitIndex < allUnits.length - 1 ? allUnits[currentUnitIndex + 1] : null;

  // Active unit progress (Topic 13)
  const unitStats = useMemo(() => {
    if (!currentUnit?.sections) return { total: 0, completed: 0, percentage: 0 };
    const total = currentUnit.sections.length;
    const completed = currentUnit.sections.filter(
      s => completedSections[`${currentPart.id}_${currentUnit.id}_${s.id}`]
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [currentUnit, currentPart, completedSections]);

  // Current active section object (Topic 6)
  const activeSectionObject = useMemo(() => {
    if (!currentUnit?.sections) return null;
    return currentUnit.sections.find(s => s.id === activeSectionId) || currentUnit.sections[0];
  }, [currentUnit, activeSectionId]);

  // Scroll to anchor on load or sectionId change
  useEffect(() => {
    const targetAnchor = sectionId ? `sec-${sectionId}` : window.location.hash.replace('#', '');
    if (targetAnchor) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetAnchor);
        if (el) {
          const yOffset = -90;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          setActiveSectionId(targetAnchor.replace('sec-', ''));
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentUnit?.id, sectionId]);

  // Keyboard shortcut listener (Zen mode toggle with 'z' or 'Escape')
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      } else if (e.key === 'z' || e.key === 'Z') {
        setIsZenMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode]);

  // Track scroll position to update reading progress & detect active section (Topic 6)
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setScrollProgress(Number(scroll) * 100);

      // Morphing header trigger (Topic 6)
      setIsScrolledHeader(totalScroll > 110);

      if (!currentUnit?.sections || currentUnit.sections.length === 0) return;

      let currentActive = currentUnit.sections[0].id;
      for (const s of currentUnit.sections) {
        const el = document.getElementById(`sec-${s.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 170) {
            currentActive = s.id;
          }
        }
      }
      setActiveSectionId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentUnit]);

  // Smooth scroll helper
  const scrollToSection = (secId, e) => {
    if (e) e.preventDefault();
    const el = document.getElementById(`sec-${secId}`);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSectionId(secId);
      window.history.replaceState(null, '', `#sec-${secId}`);
    }
  };

  // Jump to next topic in this unit (Topic 7)
  const jumpToNextTopic = () => {
    if (!currentUnit?.sections) return;
    const currentIndex = currentUnit.sections.findIndex(s => s.id === activeSectionId);
    if (currentIndex >= 0 && currentIndex < currentUnit.sections.length - 1) {
      const nextSec = currentUnit.sections[currentIndex + 1];
      scrollToSection(nextSec.id);
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  // Mark single section complete
  const toggleSectionCompleted = (secId) => {
    const key = `${currentPart.id}_${currentUnit.id}_${secId}`;
    const nextState = !completedSections[key];
    const updated = { ...completedSections, [key]: nextState };
    setCompletedSections(updated);
    try {
      localStorage.setItem('netprep_completed', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (nextState) {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#F97316', '#22C55E', '#F59E0B']
      });
    }
  };

  // Mark entire unit complete
  const markEntireUnitCompleted = () => {
    if (!currentUnit?.sections) return;
    const updated = { ...completedSections };
    currentUnit.sections.forEach(s => {
      updated[`${currentPart.id}_${currentUnit.id}_${s.id}`] = true;
    });
    setCompletedSections(updated);
    try {
      localStorage.setItem('netprep_completed', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#F97316', '#22C55E', '#3B82F6', '#EAB308']
    });
  };

  // Copy share links
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copySectionLink = (secId) => {
    const baseUrl = `${window.location.origin}/learn/${currentPart.id}/${currentUnit.id}#sec-${secId}`;
    navigator.clipboard.writeText(baseUrl);
    setCopiedSectionId(secId);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  // Font size classes
  const fontClasses = {
    normal: 'text-base sm:text-[17px] leading-[1.85]',
    large: 'text-lg sm:text-[19px] leading-[1.9]',
    xl: 'text-xl sm:text-[21px] leading-[1.95]'
  };

  // Markdown custom components
  const markdownComponents = useMemo(() => {
    return {
      h2({ children }) {
        return (
          <div className="mt-12 mb-5 pt-4 border-t border-border/80">
            <h3 className="text-xl sm:text-2xl font-black text-text tracking-tight flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-primary rounded-full inline-block flex-shrink-0" />
              <span>{children}</span>
            </h3>
          </div>
        );
      },
      h3({ children }) {
        return (
          <div className="mt-10 mb-4 pt-3 border-t border-border/60">
            <h4 className="text-lg sm:text-xl font-bold text-text tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block flex-shrink-0" />
              <span>{children}</span>
            </h4>
          </div>
        );
      },
      p({ children }) {
        return (
          <p className={`${fontClasses[fontSize]} text-[#383432] mb-6 font-normal leading-relaxed tracking-normal`}>
            {children}
          </p>
        );
      },
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const codeString = String(children).replace(/\n$/, '');
        const lang = match ? match[1].toLowerCase() : 'text';

        // Check if this is an ASCII architecture diagram (Topic 18)
        const isAsciiDiagram = (lang === 'text' || !match) && (
          codeString.includes('├──') || 
          codeString.includes('User Request') || 
          codeString.includes('<--->') || 
          codeString.includes('<------>') ||
          (codeString.includes('Connection') && codeString.includes('Command') && codeString.includes('DataReader')) ||
          codeString.includes('IActionResult') && codeString.includes('ObjectResult')
        );

        if (isAsciiDiagram) {
          let title = 'Architecture & Request Flow Diagram';
          if (codeString.includes('MyFirstApp') || codeString.includes('Areas/')) title = 'Project Layout Structure';
          else if (codeString.includes('Connection')) title = 'ADO.NET Pipeline Architecture';
          else if (codeString.includes('IActionResult')) title = 'IActionResult Type Hierarchy';
          return <DiagramBlock diagramText={codeString} title={title} />;
        }

        if (!inline) {
          return (
            <div className="my-7">
              <CodeBlock language={lang} code={codeString} />
            </div>
          );
        }
        return (
          <code className="px-1.5 py-0.5 rounded-md bg-primary-50/80 font-mono text-[0.88em] text-primary-dark font-semibold border border-primary/20" {...props}>
            {children}
          </code>
        );
      },
      table({ children }) {
        return (
          <div className="table-scroll-container my-7 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              {children}
            </table>
          </div>
        );
      },
      thead({ children }) {
        return <thead className="border-b border-border bg-surface-alt/80">{children}</thead>;
      },
      th({ children }) {
        return <th className="py-3.5 px-4 font-bold text-text text-xs uppercase tracking-wider">{children}</th>;
      },
      td({ children }) {
        return <td className="py-3.5 px-4 text-[#383432] align-top text-xs sm:text-sm font-normal leading-relaxed border-t border-border/50">{children}</td>;
      },
      tr({ children }) {
        return <tr className="hover:bg-primary-50/30 transition-colors">{children}</tr>;
      },
      ul({ children }) {
        return <ul className="space-y-3 mb-6 pl-1">{children}</ul>;
      },
      ol({ children }) {
        return <ol className="space-y-3 mb-6 pl-5 list-decimal text-primary">{children}</ol>;
      },
      li({ children }) {
        return (
          <li className={`flex items-start ${fontClasses[fontSize]} text-[#383432]`}>
            <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3.5 flex-shrink-0" />
            <span className="text-text">{children}</span>
          </li>
        );
      },
      blockquote({ children }) {
        return (
          <div className="bg-primary-50/90 border-l-4 border-primary rounded-r-2xl p-5 sm:p-6 mb-8 flex gap-4 shadow-xs border border-primary/20">
            <div className="p-2 rounded-xl bg-primary/10 text-primary h-fit">
              <Lightbulb className="w-5 h-5 flex-shrink-0" />
            </div>
            <div className="text-sm sm:text-base text-text leading-relaxed font-medium">
              <span className="font-bold text-primary-dark block mb-1">Important Concept</span>
              {children}
            </div>
          </div>
        );
      },
      a({ href, children }) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark underline font-bold transition-colors">
            {children}
          </a>
        );
      }
    };
  }, [fontSize]);

  if (!currentUnit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Unit Not Found</h2>
        <Link to="/topics" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
          Back to Curriculum Explorer
        </Link>
      </div>
    );
  }

  // Filtered sidebar tree if user searches in sidebar
  const filteredParts = courseData.parts.map(part => {
    const q = sidebarSearch.toLowerCase().trim();
    if (!q) return part;
    const matchingUnits = part.units.map(unit => {
      const matchUnitTitle = unit.title.toLowerCase().includes(q);
      const matchingSections = unit.sections.filter(s => 
        s.title.toLowerCase().includes(q) || s.id.includes(q)
      );
      if (matchUnitTitle) return unit;
      return { ...unit, sections: matchingSections };
    }).filter(unit => unit.sections.length > 0);

    return { ...part, units: matchingUnits };
  }).filter(part => part.units.length > 0);

  const CurrentUnitIcon = unitIcons[currentUnit.id] || BookOpen;

  return (
    <div className="min-h-screen bg-surface font-sans flex text-text overflow-x-hidden selection:bg-primary-100 selection:text-primary-dark">
      
      {/* ========================================================================= */}
      {/* 1. TOP STICKY READING PROGRESS BAR */}
      {/* ========================================================================= */}
      <div className={`fixed top-0 left-0 right-0 h-1 bg-border/40 z-50 transition-all duration-300 ${
        sidebarCollapsed || isZenMode ? 'lg:left-0' : 'lg:left-80'
      }`}>
        <div 
          className="h-full bg-gradient-to-r from-primary via-amber-500 to-primary-dark transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. UPGRADED SIDEBAR (Hidden in Zen Mode) */}
      {/* ========================================================================= */}
      <aside className={`fixed inset-y-0 left-0 bg-card border-r border-border transition-all duration-300 z-50 overflow-y-auto flex flex-col shadow-sm ${
        sidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'
      } ${
        sidebarCollapsed || isZenMode ? 'lg:-translate-x-full' : 'lg:w-80'
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border bg-surface-alt/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
                NP
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm text-text leading-tight">NetPrep</span>
                <span className="text-[10px] text-text-muted font-semibold tracking-wider uppercase">Course Guide</span>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setSidebarCollapsed(true)}
                className="hidden lg:flex p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface text-xs"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Search across Units & Topics */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search units or topics..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text placeholder:text-text-muted/70 transition-all"
            />
            {sidebarSearch && (
              <button 
                onClick={() => setSidebarSearch('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Modules List */}
        <div className="flex-1 p-3 space-y-6">
          {filteredParts.map(part => (
            <div key={part.id} className="space-y-1.5">
              
              {/* Part Label */}
              <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-text-muted flex items-center justify-between">
                <span>{part.title}</span>
                <span className="text-[10px] font-normal">{part.units.length} Units</span>
              </div>

              {/* Units under this Part */}
              <div className="space-y-1">
                {part.units.map(unit => {
                  const isCurrentUnit = unit.id === currentUnit.id && part.id === currentPart.id;
                  const UnitIcon = unitIcons[unit.id] || BookOpen;
                  const completedInUnit = unit.sections.filter(
                    s => completedSections[`${part.id}_${unit.id}_${s.id}`]
                  ).length;
                  const isUnitDone = unit.sections.length > 0 && completedInUnit === unit.sections.length;
                  const completionPercentage = unit.sections.length > 0 ? Math.round((completedInUnit / unit.sections.length) * 100) : 0;

                  return (
                    <div key={unit.id} className="rounded-xl overflow-hidden transition-all">
                      
                      {/* Unit Link Card */}
                      <Link
                        to={`/learn/${part.id}/${unit.id}`}
                        onClick={() => {
                          setSidebarOpen(false);
                          if (!isCurrentUnit) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                          isCurrentUnit 
                            ? 'bg-primary-50/90 text-primary-dark font-bold border border-primary/30 shadow-xs' 
                            : 'hover:bg-surface-alt text-text'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                            isCurrentUnit 
                              ? 'bg-primary text-white shadow-xs' 
                              : 'bg-card border border-border text-text-muted'
                          }`}>
                            <UnitIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate leading-tight">
                              {unit.title}
                            </span>
                            <span className="text-[10px] text-text-muted font-normal block truncate">
                              {unit.sections.length} Topics
                            </span>
                          </div>
                        </div>

                        {/* Completion Circular Progress Ring in Sidebar (Topic 13) */}
                        <div className="flex-shrink-0 pl-1">
                          {isUnitDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <CircularProgressRing percentage={completionPercentage} size={24} strokeWidth={2.5} showLabel={false} />
                          )}
                        </div>
                      </Link>

                      {/* If Current Unit: Show all sections as jump links */}
                      {isCurrentUnit && (
                        <div className="mt-1 pl-3.5 space-y-0.5 border-l-2 border-primary/30 ml-4 mb-2 py-1">
                          {unit.sections.map(section => {
                            const isSectionActive = activeSectionId === section.id;
                            const isDone = completedSections[`${part.id}_${unit.id}_${section.id}`];

                            return (
                              <button
                                key={section.id}
                                onClick={(e) => {
                                  scrollToSection(section.id, e);
                                  setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-all text-left cursor-pointer ${
                                  isSectionActive
                                    ? 'bg-primary text-white font-bold shadow-xs'
                                    : 'text-text-muted hover:text-text hover:bg-surface'
                                }`}
                              >
                                <span className="truncate pr-2">
                                  <span className={`font-mono mr-1.5 text-[11px] ${
                                    isSectionActive ? 'text-white/80' : 'text-text-muted'
                                  }`}>
                                    {section.id}
                                  </span>
                                  {section.title}
                                </span>
                                
                                {isDone ? (
                                  <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isSectionActive ? 'text-white' : 'text-emerald-600'
                                  }`} />
                                ) : (
                                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    isSectionActive ? 'bg-white' : 'bg-transparent'
                                  }`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border bg-surface-alt/40">
          <Link 
            to="/topics" 
            className="w-full py-2 px-3 rounded-xl bg-card border border-border hover:border-primary-300 text-xs font-bold text-text-muted hover:text-primary transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Curriculum Explorer
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 3. MAIN UNIT ARTICLE CANVAS */}
      {/* ========================================================================= */}
      <main className={`flex-1 transition-all duration-300 min-h-screen relative flex flex-col bg-surface ${
        sidebarCollapsed || isZenMode ? 'lg:ml-0' : 'lg:ml-80'
      }`}>
        
        {/* ========================================================================= */}
        {/* TOPIC 6: MORPHING STICKY TOP BAR                                          */}
        {/* ========================================================================= */}
        <div className="sticky top-0 z-30 h-14 bg-surface/90 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 flex items-center justify-between transition-all">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Show Sidebar button if collapsed or in zen mode */}
            {(sidebarCollapsed || isZenMode) && (
              <button
                onClick={() => { setSidebarCollapsed(false); setIsZenMode(false); }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-text hover:text-primary transition-all shadow-xs cursor-pointer"
                title="Open Navigation"
              >
                <PanelLeft className="w-4 h-4 text-primary" />
                <span>Show Sidebar</span>
              </button>
            )}

            {/* Mobile Menu trigger */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface text-xs font-bold flex items-center gap-1"
            >
              <Menu className="w-5 h-5 text-primary" />
              <span>Menu</span>
            </button>

            {/* Breadcrumb / Morphing Topic Indicator (Topic 6) */}
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                {isScrolledHeader && activeSectionObject ? (
                  <motion.div
                    key="morph-topic"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-center gap-2 text-xs font-bold truncate"
                  >
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-mono text-[11px]">
                      {activeSectionObject.id}
                    </span>
                    <span className="text-text truncate">
                      {activeSectionObject.title}
                    </span>
                  </motion.div>
                ) : (
                  <motion.nav 
                    key="standard-breadcrumb"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hidden sm:flex items-center space-x-1.5 text-xs text-text-muted font-medium truncate"
                  >
                    <Link to="/topics" className="hover:text-primary transition-colors">Curriculum</Link>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    <span>{currentPart.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-primary font-bold truncate">{currentUnit.title}</span>
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Reader Controls: Font size, Zen mode, Theme, Share */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Topic 13: Circular Progress Ring in Header */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-card border border-border shadow-xs">
              <CircularProgressRing percentage={unitStats.percentage} size={24} strokeWidth={2.5} showLabel={false} />
              <span className="text-[11px] font-mono font-bold text-text-muted">
                {unitStats.completed}/{unitStats.total}
              </span>
            </div>

            {/* Topic 2: Zen Mode Toggle Button */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isZenMode 
                  ? 'bg-primary text-white border-primary shadow-md' 
                  : 'bg-card border-border text-text-muted hover:text-primary'
              }`}
              title={isZenMode ? 'Exit Zen Mode (Esc)' : 'Enter Zen Reading Mode (Z)'}
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden xl:inline">{isZenMode ? 'Exit Zen' : 'Zen Mode'}</span>
            </button>

            {/* Font Size Toggle */}
            <div className="hidden sm:flex items-center bg-card rounded-lg border border-border p-0.5 text-xs font-bold">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded transition-colors ${fontSize === 'normal' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}
                title="Standard font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded text-sm transition-colors ${fontSize === 'large' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}
                title="Large font size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-1 rounded text-base transition-colors ${fontSize === 'xl' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}
                title="Extra large font size"
              >
                A++
              </button>
            </div>

            {/* Copy Unit Link Button */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-card border border-border hover:bg-surface text-text-muted hover:text-primary transition-all text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
              title="Copy shareable unit link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden md:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            {/* Mark Unit Completed Button */}
            <button
              onClick={markEntireUnitCompleted}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                unitStats.percentage === 100 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">{unitStats.percentage === 100 ? 'Unit Done ✓' : 'Complete Unit'}</span>
            </button>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* TOPIC 14: SPRING ANIMATED UNIT TRANSITION                                 */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUnit.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex gap-12 justify-center"
          >
            
            {/* Main Unit Body with Topic 3: 72ch Optimal Reading Measure */}
            <div className={`flex-1 transition-all ${isZenMode ? 'max-w-3xl mx-auto' : 'max-w-3xl'} w-full`}>
              
              {/* Unit Hero Banner */}
              <header className="mb-12 pb-8 border-b border-border/80">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-dark text-xs font-black rounded-lg uppercase tracking-wide">
                    {currentPart.title}
                  </span>
                  <span className="px-3 py-1 bg-card border border-border text-text-muted text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <CurrentUnitIcon className="w-3.5 h-3.5 text-primary" />
                    {currentUnit.sections.length} In-Depth Topics
                  </span>
                  {unitStats.percentage === 100 && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> Unit 100% Completed
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text tracking-tight leading-[1.14] mb-3">
                  {currentUnit.title}
                </h1>

                {currentUnit.subtitle && (
                  <p className="text-base sm:text-lg text-text-muted font-normal leading-relaxed">
                    {currentUnit.subtitle}
                  </p>
                )}

                {/* Quick Jump Topic Pills Bar */}
                <div className="mt-8 pt-6 border-t border-border/60">
                  <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-primary" />
                    <span>Jump Directly to Topic in this Unit:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentUnit.sections.map((sec) => {
                      const isSecDone = completedSections[`${currentPart.id}_${currentUnit.id}_${sec.id}`];
                      return (
                        <button
                          key={sec.id}
                          onClick={(e) => scrollToSection(sec.id, e)}
                          className="px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary-300 hover:bg-primary-50 text-xs font-medium text-text transition-all flex items-center gap-1.5 shadow-xs cursor-pointer group"
                        >
                          <span className="font-mono font-bold text-primary text-[11px]">{sec.id}</span>
                          <span className="group-hover:text-primary transition-colors">{sec.title}</span>
                          {isSecDone && <Check className="w-3 h-3 text-emerald-600 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </header>

              {/* Continuous Sections Stream */}
              <div className="space-y-16">
                {currentUnit.sections.map((section) => {
                  const isSectionDone = completedSections[`${currentPart.id}_${currentUnit.id}_${section.id}`];
                  const isSectionCopied = copiedSectionId === section.id;

                  return (
                    <motion.section 
                      key={section.id} 
                      id={`sec-${section.id}`} 
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                      className="scroll-mt-24 pb-14 border-b border-border/80 last:border-b-0 last:pb-0"
                    >
                      
                      {/* Section Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-border/60">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-primary text-white font-mono font-extrabold text-xs rounded-xl shadow-xs">
                            TOPIC {section.id}
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
                            {section.title}
                          </h2>
                        </div>
                        
                        {/* Section Quick Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copySectionLink(section.id)}
                            title="Copy direct link to this section"
                            className="px-2.5 py-1.5 rounded-lg bg-card border border-border hover:bg-surface-alt text-text-muted hover:text-primary transition-all text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            {isSectionCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                            <span className="text-[11px] hidden sm:inline">{isSectionCopied ? 'Copied' : 'Share'}</span>
                          </button>

                          <button
                            onClick={() => toggleSectionCompleted(section.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                              isSectionDone 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-card text-text-muted hover:text-text border border-border'
                            }`}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isSectionDone ? 'text-emerald-600' : 'opacity-40'}`} />
                            <span>{isSectionDone ? 'Done ✓' : 'Mark as Done'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Markdown Content (Topic 3: Optimal 72ch prose line length) */}
                      <article className="prose-netprep">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {section.content}
                        </ReactMarkdown>
                      </article>

                      {/* Subtle Back to Top jump */}
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="text-xs font-semibold text-text-muted hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <ArrowUp className="w-3 h-3" />
                          <span>Back to Unit Top</span>
                        </button>
                      </div>

                    </motion.section>
                  );
                })}
              </div>

              {/* Interactive Feedback Box */}
              <div className="my-14 p-6 sm:p-7 bg-card border border-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
                <div>
                  <h4 className="font-bold text-text text-sm sm:text-base">Found this unit helpful?</h4>
                  <p className="text-xs text-text-muted mt-0.5">Your reaction helps maintain quality and accurate explanations.</p>
                </div>
                
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {feedbackGiven ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5" /> Thank you for your feedback!
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setFeedbackGiven('up'); confetti({ particleCount: 40, spread: 50, origin: { y: 0.85 } }); }}
                        className="h-10 px-4 rounded-xl border border-border hover:bg-primary-50 hover:border-primary-200 text-text hover:text-primary transition-all inline-flex items-center gap-2 text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        <ThumbsUp className="w-4 h-4 text-emerald-600" />
                        <span>Helpful</span>
                      </button>
                      <button 
                        onClick={() => setFeedbackGiven('down')}
                        className="h-10 px-4 rounded-xl border border-border hover:bg-surface-alt text-text-muted hover:text-text transition-all inline-flex items-center gap-2 text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        <ThumbsDown className="w-4 h-4 text-rose-500" />
                        <span>Needs more detail</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Unit Navigation Cards */}
              <div className="pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevUnit ? (
                  <Link 
                    to={prevUnit.url}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex flex-col p-5 bg-card border border-border rounded-2xl hover:bg-primary-50/70 transition-all group shadow-xs hover:shadow"
                  >
                    <span className="text-xs font-bold text-text-muted mb-1.5 flex items-center group-hover:text-primary transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous Unit
                    </span>
                    <span className="text-base font-bold text-text group-hover:text-primary-dark transition-colors line-clamp-1">
                      {prevUnit.unit.title}
                    </span>
                    <span className="text-[11px] text-text-muted mt-1 font-mono">{prevUnit.partTitle}</span>
                  </Link>
                ) : <div />}
                
                {nextUnit && (
                  <Link 
                    to={nextUnit.url}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex flex-col p-5 bg-card border border-border rounded-2xl hover:bg-primary-50/70 transition-all text-right group shadow-xs hover:shadow"
                  >
                    <span className="text-xs font-bold text-text-muted mb-1.5 flex items-center justify-end group-hover:text-primary transition-colors">
                      Next Unit <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                    <span className="text-base font-bold text-text group-hover:text-primary-dark transition-colors line-clamp-1">
                      {nextUnit.unit.title}
                    </span>
                    <span className="text-[11px] text-text-muted mt-1 font-mono">{nextUnit.partTitle}</span>
                  </Link>
                )}
              </div>

            </div>

            {/* ========================================================================= */}
            {/* TOPIC 8: INTERACTIVE DOT-TIMELINE MINI MAP (TOC) - Hidden in Zen Mode     */}
            {/* ========================================================================= */}
            {!isZenMode && (
              <div className="hidden xl:block w-72 flex-shrink-0">
                <div className="sticky top-20 p-5 bg-card/85 backdrop-blur-md border border-border rounded-2xl shadow-xs">
                  
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/80">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-text">
                      <AlignLeft className="w-3.5 h-3.5 text-primary" />
                      <span>Unit Outline</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-primary">
                      {unitStats.completed}/{unitStats.total}
                    </span>
                  </div>

                  {/* Dot Timeline Navigation (Topic 8) */}
                  <nav className="relative pl-3 space-y-3 text-xs max-h-[58vh] overflow-y-auto pr-1">
                    
                    {/* Vertical connecting line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border/80 pointer-events-none" />

                    {currentUnit.sections.map((sec) => {
                      const isActive = activeSectionId === sec.id;
                      const isDone = completedSections[`${currentPart.id}_${currentUnit.id}_${sec.id}`];

                      return (
                        <button
                          key={sec.id}
                          onClick={(e) => scrollToSection(sec.id, e)}
                          className={`group flex items-start gap-2.5 w-full text-left transition-all cursor-pointer relative py-1`}
                        >
                          {/* Timeline Dot Indicator (Topic 8) */}
                          <div className="relative mt-1 flex-shrink-0 z-10">
                            {isActive ? (
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                              </span>
                            ) : isDone ? (
                              <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                <Check className="w-2 h-2" />
                              </div>
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                            )}
                          </div>

                          {/* Label */}
                          <div className={`min-w-0 transition-colors ${
                            isActive 
                              ? 'text-primary font-bold' 
                              : isDone
                                ? 'text-text/70'
                                : 'text-text-muted hover:text-text'
                          }`}>
                            <span className="font-mono text-[11px] mr-1.5 opacity-80">{sec.id}</span>
                            <span className="truncate">{sec.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>

                  {/* Progress Box in TOC */}
                  <div className="mt-6 pt-4 border-t border-border/80 text-[11px] text-text-muted space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span>Unit Progress</span>
                      <span className="font-bold text-text">{unitStats.percentage}%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden border border-border/50">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${unitStats.percentage}%` }}
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={markEntireUnitCompleted}
                        className="w-full py-2 px-3 rounded-xl bg-surface hover:bg-primary-50 hover:text-primary text-text font-bold text-xs border border-border transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Complete All Topics</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* TOPIC 7: FLOATING QUICK-ACTION DOCK (Bottom-Right)                        */}
        {/* ========================================================================= */}
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border px-3 py-2 rounded-2xl shadow-xl">
          
          {/* Scroll Progress percentage */}
          <div className="px-2 py-1 rounded-lg bg-surface text-[11px] font-mono font-bold text-primary border border-border/70">
            {Math.round(scrollProgress)}%
          </div>

          {/* Jump to Next Topic */}
          <button
            onClick={jumpToNextTopic}
            className="p-2 rounded-xl hover:bg-surface text-text-muted hover:text-primary transition-colors cursor-pointer"
            title="Jump to Next Topic in this Unit"
          >
            <ArrowDown className="w-4 h-4" />
          </button>

          {/* Smooth Back to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 rounded-xl hover:bg-surface text-text-muted hover:text-primary transition-colors cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          {/* Mobile bottom sheet trigger button (Topic 19) */}
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className="xl:hidden p-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
            title="View Topic Outline"
          >
            <ListFilter className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TOPIC 19: MOBILE BOTTOM SHEET DRAWER FOR TOPIC SELECTION                  */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isBottomSheetOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBottomSheetOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs xl:hidden"
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border rounded-t-3xl max-h-[80vh] flex flex-col p-6 shadow-2xl xl:hidden"
              >
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4" />

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div className="flex items-center gap-2 font-bold text-sm text-text">
                    <AlignLeft className="w-4 h-4 text-primary" />
                    <span>Topics in {currentUnit.title}</span>
                  </div>
                  <button 
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="p-1 rounded-lg text-text-muted hover:text-text"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Topics List */}
                <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                  {currentUnit.sections.map((sec) => {
                    const isActive = activeSectionId === sec.id;
                    const isDone = completedSections[`${currentPart.id}_${currentUnit.id}_${sec.id}`];

                    return (
                      <button
                        key={sec.id}
                        onClick={(e) => {
                          scrollToSection(sec.id, e);
                          setIsBottomSheetOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-primary text-white font-bold'
                            : 'bg-surface text-text'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className={`font-mono text-[11px] ${isActive ? 'text-white/80' : 'text-primary'}`}>
                            {sec.id}
                          </span>
                          <span className="truncate">{sec.title}</span>
                        </div>
                        {isDone && <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
