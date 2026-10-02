import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Code2, CheckCircle2, Layers, Cpu, Database, Sparkles, 
  ShieldCheck, Workflow, ArrowRight, BookOpen, Heart, 
  Terminal, Flame, Zap, ChevronDown, Globe, HelpCircle, 
  Check, FileCode, Sliders, ExternalLink, Compass
} from 'lucide-react';
import Footer from '../components/Footer';

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F97316', '#EA580C', '#F59E0B', '#FDBA74']
    });
  };

  const corePillars = [
    {
      icon: Terminal,
      title: 'Word-for-Word Depth',
      desc: 'No summarized bullet points or condensed shortcuts. Every concept, code nuance, and architectural note is preserved in complete depth so you get true mastery.'
    },
    {
      icon: Cpu,
      title: 'Real Production .NET',
      desc: 'Focused on modern ASP.NET Core engineering: Kestrel server internals, DI container lifetimes, middleware execution orders, and RFC 7807 problem details.'
    },
    {
      icon: Globe,
      title: 'Radical Open Access',
      desc: '100% free and open for developers worldwide. No paywalls, no mandatory sign-ups, no artificial gating, and no tracking. Knowledge should be barrier-free.'
    },
    {
      icon: Layers,
      title: 'Continuous 1-Page Units',
      desc: 'Say goodbye to clicking through 80+ fragmented pages. Each unit is a single, beautifully organized chapter with a live topic outline and instant jump links.'
    }
  ];

  const curriculumHighlights = [
    {
      badge: 'Part 1 • 5 Units',
      title: 'ASP.NET Core MVC Architecture',
      desc: 'From Kestrel server bootup and Program.cs pipeline configuration to custom Tag Helpers, Model Binding validations, and direct ADO.NET database operations.',
      topics: [
        'Kestrel Web Server & Lifecycle',
        'Controller & IActionResult Hierarchy',
        'Razor Syntax & Custom Tag Helpers',
        'Data Annotations & Custom Validation',
        'Routing, State & ADO.NET CRUD'
      ]
    },
    {
      badge: 'Part 2 • 5 Units',
      title: 'RESTful Web APIs Engineering',
      desc: 'Comprehensive coverage of modern HTTP services, status code semantics, DTO mapping patterns, container service registration, and enterprise exception filters.',
      topics: [
        'REST Principles & ControllerBase',
        'CRUD Action Methods & Status Codes',
        'DTO Pattern & Over-posting Defense',
        'IoC & DI Lifetimes (Transient, Scoped, Singleton)',
        'Global Exception Middleware & Swagger'
      ]
    },
    {
      badge: 'Bonus • Deep Dives',
      title: 'Enterprise Technical Deep Dives',
      desc: 'The tough, highly-scrutinized interview topics explained clearly with thread pool mechanics and interface design contracts.',
      topics: [
        'Master Syllabus Reference & Index',
        'Why Task in Web API Action Methods?',
        'Why IActionResult as Return Type?'
      ]
    }
  ];

  const faqs = [
    {
      q: 'Is NetPrep really 100% free forever?',
      a: 'Yes, absolutely. NetPrep is built as an open, accessible public reference for any developer learning or preparing for ASP.NET Core technical roles. There are no subscriptions, paywalls, or gated tiers.'
    },
    {
      q: 'What versions of .NET and ASP.NET Core are covered?',
      a: 'The curriculum is built around modern ASP.NET Core (.NET 6, .NET 7, and .NET 8+ LTS), covering the top-level Program.cs pipeline, modern C# conventions, and modern Web API best practices.'
    },
    {
      q: 'Why is each unit formatted as a single page?',
      a: 'Developer feedback showed that clicking through 80+ separate pages interrupted reading flow and made scanning topics tedious. One continuous page per unit allows effortless reading, instant jump links, and smooth scrolling with an active Table of Contents.'
    },
    {
      q: 'Can this curriculum help with technical interview preparation?',
      a: 'Yes. Beyond syntax, every topic focuses on the "why" — thread pool mechanics with async/await, memory allocation across DI lifetimes, and HTTP protocol semantics — precisely the architectural questions interviewers ask.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text font-sans selection:bg-primary-100 selection:text-primary-dark">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center">
        
        {/* Soft Background Radial Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 border border-primary/20 text-primary-dark font-extrabold text-xs mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>OPEN LEARNING • ZERO COMPROMISES</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-text tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto"
        >
          Engineered for Developers Who Want <span className="text-primary">Real Depth</span>, Not Shortcuts.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed font-normal mb-10"
        >
          Most online tutorials are either too fragmented or too superficial. NetPrep provides an exhaustive, word-for-word reference guide for mastering <strong>ASP.NET Core MVC</strong> and <strong>RESTful APIs</strong> with production-grade code, architectural flowcharts, and zero fluff.
        </motion.p>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { value: '11', label: 'Complete Units', sub: 'MVC & RESTful APIs' },
            { value: '82', label: 'In-Depth Topics', sub: '100% Word-for-Word' },
            { value: '100%', label: 'Free & Open', sub: 'No Paywalls Ever' },
            { value: '0', label: 'Sign-in Barriers', sub: 'Start Learning Instantly' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary-300 shadow-xs hover:shadow transition-all text-center"
            >
              <span className="text-3xl sm:text-4xl font-black text-primary block tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-bold text-text block mt-1 uppercase tracking-wide">
                {stat.label}
              </span>
              <span className="text-[11px] text-text-muted block mt-0.5">
                {stat.sub}
              </span>
            </div>
          ))}
        </motion.div>

      </section>

      {/* ========================================================================= */}
      {/* 2. CORE PHILOSOPHY / PILLARS */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-primary block mb-2">Our Mission</span>
          <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
            How NetPrep is Different
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corePillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={i}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary-300 shadow-xs hover:shadow-md transition-all flex items-start gap-5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. CURRICULUM ARCHITECTURE HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-primary block mb-2">Full Curriculum Scope</span>
          <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
            Comprehensive Two-Track Syllabus
          </h2>
          <p className="text-sm text-text-muted mt-2 max-w-2xl mx-auto">
            Organized logically from foundational concepts through advanced enterprise architectural patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {curriculumHighlights.map((track, i) => (
            <div 
              key={i} 
              className="p-7 rounded-3xl bg-card border border-border hover:border-primary-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-bold text-primary inline-block mb-4">
                  {track.badge}
                </span>
                <h3 className="text-xl font-black text-text mb-2">
                  {track.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-6 font-medium">
                  {track.desc}
                </p>

                <div className="space-y-2.5 border-t border-border/80 pt-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text block mb-2">Key Topics Covered:</span>
                  {track.topics.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-text font-medium">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60">
                <Link
                  to={i === 0 ? '/learn/part1/p1u1' : i === 1 ? '/learn/part2/p2u1' : '/learn/bonus/bonus'}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface hover:bg-primary-50 text-text hover:text-primary border border-border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Explore Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-primary block mb-2">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div 
                key={i}
                className="rounded-2xl bg-card border border-border overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-text hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm sm:text-base text-text-muted leading-relaxed font-normal border-t border-border/60 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-primary via-orange-600 to-amber-600 text-white text-center shadow-xl relative overflow-hidden">
          
          {/* Subtle Decorative Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white font-extrabold text-xs inline-block mb-4 backdrop-blur-xs">
            START YOUR JOURNEY TODAY
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight">
            Master ASP.NET Core Without Barriers.
          </h2>

          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium">
            Jump directly into Unit 1 and start mastering runtime architecture, Kestrel, and middleware pipelines right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/learn/part1/p1u1"
              onClick={triggerConfetti}
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-dark hover:bg-surface-alt font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center"
            >
              Start Unit 1 Now →
            </Link>

            <Link
              to="/topics"
              className="w-full sm:w-auto px-8 py-4 bg-black/20 hover:bg-black/30 border border-white/30 text-white font-bold rounded-xl transition-all duration-200 text-center"
            >
              Explore Full Curriculum
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
