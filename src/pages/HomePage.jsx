import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  BookOpen, Code2, CheckCircle2, ArrowRight, ChevronRight, 
  Sparkles, Play, Database, Flame, 
  Cpu, Zap, HelpCircle, Eye, EyeOff, Layers, Terminal
} from 'lucide-react';
import Footer from '../components/Footer';

export default function HomePage() {
  // Interactive Code Playground State
  const [activeTab, setActiveTab] = useState('api');
  const [isSending, setIsSending] = useState(false);
  const [responseReceived, setResponseReceived] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  // Pipeline Simulator State
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineMode, setPipelineMode] = useState('success');
  const [pipelineStatus, setPipelineStatus] = useState(null);

  const runPipeline = () => {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    setPipelineStep(0);
    setPipelineStatus('1. Request entered Kestrel server...');

    const maxSteps = pipelineMode === 'unauthorized' ? 5 : 6;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < maxSteps) {
        setPipelineStep(step);
        if (step === 1) setPipelineStatus('2. Enforcing HTTPS encryption...');
        else if (step === 2) setPipelineStatus('3. Matching endpoint route pattern...');
        else if (step === 3) setPipelineStatus('4. Validating JWT / user claims...');
        else if (step === 4) {
          if (pipelineMode === 'unauthorized') {
            setPipelineStatus('❌ 401 Unauthorized: Permission check failed!');
          } else {
            setPipelineStatus('5. Authorized! User has valid permissions.');
          }
        }
      } else {
        clearInterval(interval);
        setIsPipelineRunning(false);
        if (pipelineMode === 'unauthorized') {
          setPipelineStatus('⚡ Short-Circuited: Sent 401 response back immediately.');
        } else {
          setPipelineStep(5);
          setPipelineStatus('✅ 200 OK: Controller executed and returned JSON.');
          confetti({ particleCount: 45, spread: 55, origin: { y: 0.8 } });
        }
      }
    }, 450);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F97316', '#EA580C', '#F59E0B', '#FDBA74']
    });
  };

  const handleSimulateRequest = () => {
    setIsSending(true);
    setResponseReceived(false);
    setTimeout(() => {
      setIsSending(false);
      setResponseReceived(true);
      triggerConfetti();
    }, 500);
  };

  const codeSnippets = {
    api: {
      filename: 'Program.cs (Minimal API)',
      endpoint: '/api/v1/products',
      code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// GET endpoint returning real dataset
app.MapGet("/api/v1/products", () => Results.Ok(new [] {
    new { Id = 1, Name = "Enterprise Cloud Gateway", Framework = ".NET 8", Status = "Active" },
    new { Id = 2, Name = "Auth & Identity Service", Framework = ".NET 8", Status = "Active" }
}));

app.Run();`,
      response: `[
  { "id": 1, "name": "Enterprise Cloud Gateway", "framework": ".NET 8", "status": "Active" },
  { "id": 2, "name": "Auth & Identity Service", "framework": ".NET 8", "status": "Active" }
]`
    },
    controller: {
      filename: 'ProductsController.cs (MVC)',
      endpoint: '/api/products/1',
      code: `[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase 
{
    private readonly AppDbContext _db;
    public ProductsController(AppDbContext db) => _db = db;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id) 
    {
        var product = await _db.Products.FindAsync(id);
        return product == null ? NotFound() : Ok(product);
    }
}`,
      response: `{
  "id": 1,
  "name": "Enterprise Cloud Gateway",
  "category": "Cloud Services",
  "isAvailable": true,
  "createdAt": "2026-01-15T08:30:00Z"
}`
    },
    ef: {
      filename: 'AppDbContext.cs (EF Core)',
      endpoint: 'database/schema',
      code: `public class AppDbContext : DbContext 
{
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) {}

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder mb) {
        mb.Entity<Product>().HasIndex(p => p.Sku).IsUnique();
        mb.Entity<Product>().Property(p => p.Name).HasMaxLength(150).IsRequired();
    }
}`,
      response: `// EF Core Migration Applied:
// ✓ Table 'Products' created (Primary Key: Id)
// ✓ Index 'IX_Products_Sku' (Unique) applied
// ✓ Foreign Key relationship configured with 'Categories'`
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans overflow-x-hidden selection:bg-primary-100 selection:text-primary-dark">
      
      {/* Background Ambient Mesh Glow */}
      <div className="absolute top-0 inset-x-0 h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-primary-100/60 via-amber-50/40 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200/20 blur-2xl rounded-full" />
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Shimmer Announcement Pill */}
        <div className="flex justify-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-primary-200 shadow-xs text-xs sm:text-sm font-medium text-text hover:border-primary transition-all duration-300 group cursor-pointer"
            onClick={triggerConfetti}
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold text-primary">Open .NET Learning Guide</span>
            <span className="text-text-muted">•</span>
            <span className="text-text-muted group-hover:text-text transition-colors">Complete ASP.NET Core & Web API Blueprint</span>
            <Sparkles className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
          </motion.div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-center lg:text-left"
          >
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-text tracking-tight leading-[1.08] mb-6">
              Master .NET. <br />
              <span className="bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Build & Excel.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-text-muted mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              A comprehensive, zero-fluff guide to modern ASP.NET Core. Designed for anyone preparing for technical interviews, exams, or building production backends — covering <span className="font-semibold text-text">MVC architecture</span>, <span className="font-semibold text-text">RESTful Web APIs</span>, <span className="font-semibold text-text">EF Core</span>, and <span className="font-semibold text-text">JWT security</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10">
              <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                <Link 
                  to="/topics" 
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore All Topics</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                <Link 
                  to="/learn/part1/p1u1" 
                  className="w-full sm:w-auto px-7 py-4 bg-card hover:bg-surface border border-border hover:border-primary-300 text-text rounded-xl font-semibold text-base transition-all duration-200 shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Start with Unit 1</span>
                </Link>
              </motion.div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-border/80 flex flex-wrap gap-y-3 gap-x-6 justify-center lg:justify-start text-xs font-medium text-text-muted">
              <span className="flex items-center gap-1.5 text-text">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free & Open Access
              </span>
              <span className="flex items-center gap-1.5 text-text">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No Registration Required
              </span>
              <span className="flex items-center gap-1.5 text-text">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 82 Complete Lessons
              </span>
            </div>
          </motion.div>

          {/* Right Column: Interactive Live Code Playground */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 w-full max-w-xl mx-auto"
          >
            <div className="relative rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden font-mono">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1E293B] border-b border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                
                {/* Code Tabs */}
                <div className="flex bg-[#0F172A] rounded-lg p-0.5 border border-slate-700/50">
                  <button
                    onClick={() => setActiveTab('api')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      activeTab === 'api' ? 'bg-primary text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Minimal API
                  </button>
                  <button
                    onClick={() => setActiveTab('controller')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      activeTab === 'controller' ? 'bg-primary text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Controller
                  </button>
                  <button
                    onClick={() => setActiveTab('ef')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      activeTab === 'ef' ? 'bg-primary text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    EF Core
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 hidden sm:block">
                  C# 12 • .NET 8
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto min-h-[220px]">
                <div className="text-slate-500 text-[11px] mb-2 font-sans select-none flex justify-between">
                  <span>// {codeSnippets[activeTab].filename}</span>
                  <span className="text-emerald-400 font-mono">Kestrel Server Active</span>
                </div>
                <pre className="text-slate-200 font-mono leading-relaxed whitespace-pre">
                  {codeSnippets[activeTab].code}
                </pre>
              </div>

              {/* Interactive Request Simulator Bar */}
              <div className="p-3 bg-[#1E293B]/80 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">GET</span>
                  <span className="text-slate-400 text-xs hidden sm:inline">{codeSnippets[activeTab].endpoint}</span>
                </div>

                <button
                  onClick={handleSimulateRequest}
                  disabled={isSending}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-dark active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-all duration-150 cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                  <span>{isSending ? 'Dispatching...' : 'Test Request'}</span>
                </button>
              </div>

              {/* Live JSON Response Preview */}
              <AnimatePresence>
                {responseReceived && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#020617] p-3.5 border-t border-slate-800 text-[11px] font-mono"
                  >
                    <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[10px]">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        ● 200 OK (HTTP Response)
                      </span>
                      <span>Content-Type: application/json</span>
                    </div>
                    <pre className="text-amber-300/90 overflow-x-auto max-h-28">
                      {codeSnippets[activeTab].response}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS & ARCHITECTURAL PILLARS */}
      {/* ========================================================================= */}
      <section className="border-y border-border bg-card/60 backdrop-blur-sm py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-x-0 lg:divide-x divide-border">
            <div className="flex flex-col items-center p-2">
              <span className="text-4xl sm:text-5xl font-black text-primary tracking-tight">11</span>
              <span className="text-sm font-semibold text-text mt-1">Structured Modules</span>
              <span className="text-xs text-text-muted">MVC + Web APIs + Bonus</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <span className="text-4xl sm:text-5xl font-black text-text tracking-tight">82</span>
              <span className="text-sm font-semibold text-text mt-1">In-Depth Lessons</span>
              <span className="text-xs text-text-muted">Full Theory & Syntax</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <span className="text-4xl sm:text-5xl font-black text-primary tracking-tight">200+</span>
              <span className="text-sm font-semibold text-text mt-1">Code Blueprints</span>
              <span className="text-xs text-text-muted">C#, EF Core, AJAX & SQL</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <span className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight">100%</span>
              <span className="text-sm font-semibold text-text mt-1">Open & Free</span>
              <span className="text-xs text-text-muted">Accessible to All</span>
            </div>
          </div>

          {/* Core Technical Pillars Covered */}
          <div className="mt-8 pt-6 border-t border-border/60 text-center">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Core Architectural Topics Covered in Depth
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-text/80">
              {[
                'Middleware Pipeline',
                'Dependency Injection',
                'Entity Framework Core',
                'LINQ Queries',
                'RESTful API Design',
                'JWT Security & Auth',
                'Async / Await Concurrency',
                'ADO.NET & Stored Procedures',
                'Razor View Engine',
                'FluentValidation'
              ].map((topic, idx) => (
                <span key={idx} className="px-3.5 py-1.5 bg-surface rounded-lg border border-border/80 text-text font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STEP-BY-STEP MASTERY ROADMAP */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-dark font-bold text-xs uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" /> Learning Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-4">
            Your Complete .NET Mastery Roadmap
          </h2>
          <p className="text-text-muted text-base sm:text-lg">
            Follow this progressive journey to build strong foundations, understand how the runtime works under the hood, and tackle technical interviews with ease.
          </p>
        </div>

        {/* Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Runtime Architecture & Life Cycle',
              desc: 'Understand Program.cs, Kestrel, appsettings.json, and the 8-stage ASP.NET Core request pipeline.',
              tag: 'Part 1 • Unit 1 & 2',
              link: '/learn/part1/p1u1'
            },
            {
              step: '02',
              title: 'MVC Controllers, Razor & Helpers',
              desc: 'Master Model-View-Controller, Razor syntax, Tag Helpers, Partial Views, and ViewModel architecture.',
              tag: 'Part 1 • Unit 3 & 4',
              link: '/topics'
            },
            {
              step: '03',
              title: 'Routing, Session & ADO.NET CRUD',
              desc: 'Learn route constraints, Session state, and writing raw ADO.NET SqlCommands & Stored Procedures.',
              tag: 'Part 1 • Unit 5',
              link: '/topics'
            },
            {
              step: '04',
              title: 'RESTful Web APIs & EF Core',
              desc: 'Design production REST endpoints with status codes, EF Core DbContext, Migrations, and LINQ operations.',
              tag: 'Part 2 • Unit 1 & 2',
              link: '/topics'
            },
            {
              step: '05',
              title: 'Security, JWT & Global Middleware',
              desc: 'Token-based authentication, Role-Based Access Control (RBAC), and custom global error handling.',
              tag: 'Part 2 • Unit 5',
              link: '/topics'
            },
            {
              step: '06',
              title: 'Critical Concepts & Interview Questions',
              desc: 'Master key architectural questions: Why Task in Web API, IActionResult vs ActionResult<T>, and Dependency Lifetimes.',
              tag: 'Bonus Section',
              link: '/topics'
            }
          ].map((item, idx) => (
            <Link 
              key={idx}
              to={item.link}
              className="group relative bg-card p-6 sm:p-7 rounded-2xl border border-border hover:border-primary-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-primary-200 group-hover:text-primary transition-colors font-mono">
                    {item.step}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-surface text-text-muted text-xs font-semibold border border-border">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text group-hover:text-primary-dark transition-colors mb-2.5">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                <span>Explore lessons</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CONCEPT HIGHLIGHTS: INTERACTIVE EXPLANATION */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-surface-alt/70 rounded-3xl border border-border my-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
            Core Concept Deep-Dives
          </h2>
          <p className="text-text-muted text-base">
            Understand the architectural reasons behind common patterns before facing technical interview rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Interactive Question & Answer Flip */}
          <div className="lg:col-span-7 bg-card p-7 sm:p-8 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" /> Core Technical Question
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-text mb-3">
                "Why must Web API actions return Task instead of void for asynchronous operations?"
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-5">
                A classic question testing your understanding of thread pool concurrency, non-blocking I/O, and server resource allocation.
              </p>

              {/* Reveal Answer Box */}
              <AnimatePresence>
                {showAnswer ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-primary-50 border border-primary-200 rounded-xl text-sm leading-relaxed text-text mb-4"
                  >
                    <p className="font-semibold text-primary-dark mb-1">💡 The Architectural Answer:</p>
                    <p className="text-text/90">
                      ASP.NET Core relies on a limited <strong>Thread Pool</strong>. When a synchronous method queries a database, the thread sits idle blocked for hundreds of milliseconds. With <code>Task</code> + <code>await</code>, the thread is returned immediately to the pool to handle other requests while I/O completes in the background — enabling your application to scale to thousands of concurrent requests.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-fit px-4 py-2 bg-surface hover:bg-primary-50 border border-border hover:border-primary-200 text-text font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              {showAnswer ? <EyeOff className="w-3.5 h-3.5 text-primary" /> : <Eye className="w-3.5 h-3.5 text-primary" />}
              <span>{showAnswer ? 'Hide Explanation' : 'Click to View Full Technical Explanation'}</span>
            </button>
          </div>

          {/* Card 2: Interactive Animated Middleware Pipeline Simulator */}
          <div className="lg:col-span-5 bg-card p-6 sm:p-7 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <Cpu className="w-4 h-4" /> Live Interactive Simulator
                </div>
                
                {/* Scenario Toggle */}
                <div className="flex bg-surface rounded-lg p-0.5 border border-border text-[11px] font-mono">
                  <button
                    onClick={() => { setPipelineMode('success'); setPipelineStep(-1); setPipelineStatus(null); }}
                    className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                      pipelineMode === 'success' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    Valid (200)
                  </button>
                  <button
                    onClick={() => { setPipelineMode('unauthorized'); setPipelineStep(-1); setPipelineStatus(null); }}
                    className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                      pipelineMode === 'unauthorized' ? 'bg-rose-500 text-white font-bold' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    Auth Fail (401)
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-text mb-1">
                Middleware Execution Pipeline
              </h3>
              <p className="text-text-muted text-xs mb-4">
                Watch an HTTP request travel step-by-step through Kestrel into your controllers.
              </p>

              {/* Animated Pipeline Steps */}
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { name: 'app.UseExceptionHandler()', role: 'Catches crashes' },
                  { name: 'app.UseHttpsRedirection()', role: 'Enforces SSL' },
                  { name: 'app.UseRouting()', role: 'Matches route' },
                  { name: 'app.UseAuthentication()', role: 'Validates JWT' },
                  { name: 'app.UseAuthorization()', role: 'Checks claims' },
                  { name: 'app.MapControllers()', role: 'Executes Action' }
                ].map((step, i) => {
                  const isCurrent = pipelineStep === i;
                  const isPassed = pipelineStep > i;
                  const isBlocked = pipelineMode === 'unauthorized' && i === 4 && pipelineStep >= 4;

                  return (
                    <motion.div
                      key={i}
                      animate={{
                        scale: isCurrent ? 1.015 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`px-3 py-2 rounded-xl flex items-center justify-between border transition-all ${
                        isBlocked
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : isCurrent
                            ? 'bg-primary-50/90 border-primary text-primary-dark font-bold shadow-xs'
                            : isPassed
                              ? 'bg-emerald-50/50 border-emerald-300 text-emerald-800'
                              : 'bg-surface border-border text-text'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {isCurrent ? (
                          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                          </span>
                        ) : isPassed && !isBlocked ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        ) : isBlocked ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-border flex-shrink-0" />
                        )}
                        <span className="truncate">{step.name}</span>
                      </div>

                      <span className="text-[10px] font-bold text-text-muted flex-shrink-0">
                        {isBlocked ? 'SHORT-CIRCUIT' : isCurrent ? 'EXECUTING' : isPassed ? 'next()' : step.role}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Status Output Box */}
              {pipelineStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-2.5 rounded-xl text-xs font-mono font-medium border ${
                    pipelineStatus.includes('❌') || pipelineStatus.includes('Short-Circuited')
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : pipelineStatus.includes('✅')
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-primary-50 border-primary-200 text-primary-dark'
                  }`}
                >
                  {pipelineStatus}
                </motion.div>
              )}
            </div>

            {/* Run Button */}
            <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2">
              <motion.button
                onClick={runPipeline}
                disabled={isPipelineRunning}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 ${isPipelineRunning ? 'animate-spin' : ''}`} />
                <span>{isPipelineRunning ? 'Simulating Pipeline Flow...' : 'Send Request Through Pipeline ▶'}</span>
              </motion.button>
              <Link to="/learn/part1/p1u1#sec-1.7" className="text-center text-[11px] font-bold text-primary hover:underline">
                Read Unit 1.7: Middleware Pipeline →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FULL CURRICULUM OVERVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Curriculum Overview</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mt-1">
              What's Inside NetPrep
            </h2>
          </div>
          <Link to="/topics" className="mt-4 sm:mt-0 text-sm font-bold text-primary hover:underline flex items-center gap-1">
            Browse All 82 Lessons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Part 1 Card */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-xs hover:border-primary-200 transition-all">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg mb-4">
              Part 1 • 5 Modules
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">ASP.NET Core MVC Architecture</h3>
            <p className="text-text-muted text-sm mb-6 leading-relaxed">
              Complete full-stack foundation: Request life cycle, controller action selectors, filters, Razor helpers, data validation, and raw ADO.NET CRUD.
            </p>
            <div className="space-y-3 border-t border-border pt-6">
              {[
                'Unit 1 — Introduction to ASP.NET Core & Middleware',
                'Unit 2 — Controllers, IActionResult & Action Filters',
                'Unit 3 — Razor Syntax, Partial Views & Tag Helpers',
                'Unit 4 — Data Annotations, Validations & Model Binding',
                'Unit 5 — Routing Constraints, Session & ADO.NET'
              ].map((unit, i) => (
                <div key={i} className="flex items-center text-sm font-medium text-text">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                  <span>{unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2 Card */}
          <div className="bg-card p-8 rounded-3xl border border-border shadow-xs hover:border-primary-200 transition-all">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-dark text-xs font-bold rounded-lg mb-4">
              Part 2 • 5 Modules
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">RESTful APIs & Modern Backend</h3>
            <p className="text-text-muted text-sm mb-6 leading-relaxed">
              Modern backend engineering: HTTP verbs, status codes, Entity Framework Core ORM, LINQ operators, API versioning, jQuery AJAX, and JWT Auth.
            </p>
            <div className="space-y-3 border-t border-border pt-6">
              {[
                'Unit 1 — Web API Architecture & REST Principles',
                'Unit 2 — Entity Framework Core, DbContext & LINQ',
                'Unit 3 — Route Ordering, API Versioning & FluentValidations',
                'Unit 4 — jQuery DOM, AJAX & Consuming Web APIs',
                'Unit 5 — JWT Authentication, RBAC & Global Error Handling'
              ].map((unit, i) => (
                <div key={i} className="flex items-center text-sm font-medium text-text">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                  <span>{unit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-14 text-white overflow-hidden shadow-xl shadow-primary/20">
          
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-semibold text-xs mb-6">
              <Zap className="w-3.5 h-3.5" /> Immediate Access
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Start Learning ASP.NET Core Today.
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed font-normal">
              No registration forms, no subscriptions, and no barriers. Jump straight into Unit 1 or explore the full curriculum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/learn/part1/p1u1"
                onClick={triggerConfetti}
                className="px-8 py-4 bg-white text-primary-dark hover:bg-surface-alt font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center"
              >
                Start Unit 1 Now →
              </Link>
              <Link 
                to="/topics"
                className="px-8 py-4 bg-black/20 hover:bg-black/30 border border-white/30 text-white font-bold rounded-xl transition-all duration-200 text-center"
              >
                Browse All Topics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
