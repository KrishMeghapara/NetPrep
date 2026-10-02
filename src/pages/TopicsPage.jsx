import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Code2, ChevronRight, ChevronDown, 
  CheckCircle2, Layers, Cpu, Database, ShieldCheck, 
  Workflow, Sliders, KeyRound, Sparkles, Filter, Check, 
  ArrowRight, FileCode, Zap
} from 'lucide-react';
import courseData from '../data/content';
import Footer from '../components/Footer';

// Module icon mapping
const unitIcons = {
  p1u1: Cpu,
  p1u2: Layers,
  p1u3: FileCode,
  p1u4: CheckCircle2,
  p1u5: Database,
  p2u1: NetworkIcon,
  p2u2: Database,
  p2u3: Workflow,
  p2u4: Sliders,
  p2u5: ShieldCheck,
  bonus1: Sparkles,
};

function NetworkIcon(props) {
  return <Workflow {...props} />;
}

function TiltCard({ children, className = '' }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -5);
    setRotateY(((x - centerX) / centerX) * 5);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative ${className}`}
    >
      {isHovered && (
        <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/30 to-amber-500/30 opacity-75 blur-xs transition-opacity duration-300" />
      )}
      {children}
    </motion.div>
  );
}

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'part1', 'part2', 'bonus'
  const [expandedUnitId, setExpandedUnitId] = useState(null);

  // Load completed sections from localStorage
  const completedMap = useMemo(() => {
    try {
      const saved = localStorage.getItem('netprep_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, []);

  // Compute total stats
  const { totalSections, completedCount } = useMemo(() => {
    let total = 0;
    let completed = 0;
    courseData.parts.forEach(part => {
      part.units.forEach(unit => {
        unit.sections.forEach(section => {
          total++;
          if (completedMap[`${part.id}_${unit.id}_${section.id}`]) {
            completed++;
          }
        });
      });
    });
    return { totalSections: total, completedCount: completed };
  }, [completedMap]);

  const progressPercentage = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  // Filter parts & units based on tab and deep search query
  const filteredParts = useMemo(() => {
    return courseData.parts
      .filter(part => {
        if (selectedTab === 'all') return true;
        return part.id === selectedTab;
      })
      .map(part => {
        const matchingUnits = part.units.filter(unit => {
          const query = searchQuery.toLowerCase().trim();
          if (!query) return true;

          // Check unit title & subtitle
          const matchTitle = unit.title.toLowerCase().includes(query);
          const matchSubtitle = unit.subtitle && unit.subtitle.toLowerCase().includes(query);
          
          // Check if any section matches query
          const matchSection = unit.sections.some(s => 
            s.title.toLowerCase().includes(query) || s.id.includes(query)
          );

          return matchTitle || matchSubtitle || matchSection;
        });

        return {
          ...part,
          units: matchingUnits
        };
      })
      .filter(part => part.units.length > 0);
  }, [searchQuery, selectedTab]);

  const togglePreview = (uId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedUnitId(prev => (prev === uId ? null : uId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text font-sans overflow-x-hidden selection:bg-primary-100 selection:text-primary-dark">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 inset-x-0 h-[450px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-primary-100/50 via-amber-50/30 to-transparent blur-3xl rounded-full" />
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        
        {/* ========================================================================= */}
        {/* 1. CURRICULUM HEADER */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-dark font-bold text-xs uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Complete Syllabus
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text tracking-tight mb-4">
            Curriculum Explorer
          </h1>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed font-normal">
            11 structured modules (82 comprehensive lessons) covering the full spectrum of ASP.NET Core MVC, RESTful APIs, and Enterprise Architecture. Select any module to start reading or preview the detailed lesson roadmap.
          </p>

          {/* Overall Study Progress Bar */}
          <div className="mt-6 p-4 sm:p-5 bg-card rounded-2xl border border-border/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text">Your Reading Progress</span>
                <span className="text-xs font-semibold text-primary font-mono">{completedCount} of {totalSections} completed</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">Progress saved automatically in your browser.</p>
            </div>

            <div className="flex items-center gap-3 sm:w-64">
              <div className="flex-1 bg-surface h-2.5 rounded-full overflow-hidden border border-border">
                <div 
                  className="bg-gradient-to-r from-primary to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-text font-mono w-9 text-right">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SEARCH & FILTER CONTROLS */}
        {/* ========================================================================= */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-card/80 border border-border rounded-xl w-fit backdrop-blur-sm">
              {[
                { id: 'all', label: 'All Modules (11)' },
                { id: 'part1', label: 'Part 1: MVC (5)' },
                { id: 'part2', label: 'Part 2: Web APIs (5)' },
                { id: 'bonus', label: 'Bonus Deep-Dives (1)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedTab === tab.id
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-text-muted hover:text-text hover:bg-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-text-muted" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-xs"
                placeholder="Search topics (e.g. JWT, EF Core, Routing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-text-muted hover:text-text"
                >
                  Clear
                </button>
              )}
            </div>

          </div>

          {/* Quick topic keyword suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted pt-1">
            <span className="font-semibold text-text">Quick search:</span>
            {['Middleware', 'EF Core', 'LINQ', 'JWT Auth', 'Action Filters', 'ADO.NET', 'Tag Helpers', 'Task vs void'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => setSearchQuery(keyword)}
                className="px-2.5 py-1 bg-card hover:bg-primary-50 hover:text-primary rounded-md border border-border text-text-muted transition-colors cursor-pointer"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MODULES & UNITS GRID */}
        {/* ========================================================================= */}
        <div className="space-y-14">
          {filteredParts.map(part => (
            <section key={part.id}>
              
              {/* Part Section Header */}
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border/80">
                <div className="w-2 h-7 bg-primary rounded-full" />
                <div>
                  <h2 className="text-2xl font-black text-text tracking-tight">
                    {part.title}
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {part.units.length} Modules • {part.units.reduce((acc, u) => acc + u.sections.length, 0)} Total Lessons
                  </p>
                </div>
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {part.units.map((unit, unitIdx) => {
                  const Icon = unitIcons[unit.id] || BookOpen;
                  const targetUrl = `/learn/${part.id}/${unit.id}`;
                  const isExpanded = expandedUnitId === unit.id;
                  
                  // Compute completed lessons in this unit
                  const unitCompletedCount = unit.sections.filter(
                    s => completedMap[`${part.id}_${unit.id}_${s.id}`]
                  ).length;
                  const unitTotal = unit.sections.length;
                  const isAllDone = unitTotal > 0 && unitCompletedCount === unitTotal;

                  return (
                    <TiltCard key={unit.id} className="h-full">
                      <div className="group bg-card rounded-2xl border border-border hover:border-primary-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
                      {/* Card Content Top */}
                      <div className="p-6 sm:p-7">
                        
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {isAllDone && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold text-[11px] rounded-md flex items-center gap-1 border border-emerald-500/20">
                                <Check className="w-3 h-3" /> Finished
                              </span>
                            )}
                            <span className="text-xs font-mono font-bold text-text-muted px-2 py-0.5 bg-surface rounded-md border border-border">
                              {unitTotal} Lessons
                            </span>
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <Link to={targetUrl} className="block group-hover:text-primary-dark transition-colors">
                          <h3 className="text-lg font-black text-text leading-snug mb-2 group-hover:text-primary transition-colors">
                            {unit.title}
                          </h3>
                        </Link>
                        
                        {unit.subtitle && (
                          <p className="text-xs text-text-muted leading-relaxed font-medium mb-4">
                            {unit.subtitle}
                          </p>
                        )}

                        {/* Unit Progress Mini Bar */}
                        <div className="mt-2 mb-4">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted mb-1">
                            <span>Progress</span>
                            <span>{unitCompletedCount}/{unitTotal} read</span>
                          </div>
                          <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border/60">
                            <div 
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${(unitCompletedCount / unitTotal) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Expandable Lesson Peek */}
                        <div className="border-t border-border/70 pt-3">
                          <button
                            onClick={(e) => togglePreview(unit.id, e)}
                            className="w-full flex items-center justify-between text-xs font-bold text-text-muted hover:text-primary transition-colors py-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Lesson Breakdown' : `Preview All ${unitTotal} Lessons`}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2.5 space-y-1 overflow-hidden"
                              >
                                {unit.sections.map(section => {
                                  const isRead = completedMap[`${part.id}_${unit.id}_${section.id}`];
                                  return (
                                    <Link
                                      key={section.id}
                                      to={`/learn/${part.id}/${unit.id}#sec-${section.id}`}
                                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-text hover:bg-primary-50 hover:text-primary transition-all"
                                    >
                                      <span className="truncate pr-2">
                                        <span className="font-mono text-text-muted mr-1.5 opacity-80">{section.id}</span>
                                        {section.title}
                                      </span>
                                      {isRead ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0 opacity-50" />
                                      )}
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      </div>

                      {/* Card Bottom CTA */}
                      <Link
                        to={targetUrl}
                        className="px-6 py-3.5 bg-surface-alt hover:bg-primary border-t border-border hover:border-primary text-text hover:text-white font-bold text-xs flex items-center justify-between transition-all duration-200 group-hover:bg-primary group-hover:text-white"
                      >
                        <span>Start Learning Module</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </TiltCard>
                );
                })}
              </div>

            </section>
          ))}

          {/* Empty search state */}
          {filteredParts.length === 0 && (
            <div className="text-center py-20 bg-card rounded-3xl border border-border p-8 max-w-lg mx-auto">
              <Search className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
              <h3 className="text-xl font-bold text-text mb-2">No Matching Lessons Found</h3>
              <p className="text-sm text-text-muted mb-6">
                We couldn't find any modules or sections matching "<span className="font-semibold text-text">{searchQuery}</span>".
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </main>

      <Footer />

    </div>
  );
}
