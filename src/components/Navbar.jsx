import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Code2, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Curriculum & Topics', path: '/topics' },
    { name: 'About NetPrep', path: '/about' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface/85 backdrop-blur-md border-b border-border/80 shadow-sm py-3.5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary/10 text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
              <Code2 className="w-5 h-5 transition-transform group-hover:rotate-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-text tracking-tight flex items-center gap-1">
                NetPrep
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              </span>
              <span className="text-[10px] font-semibold text-text-muted -mt-1 tracking-wider uppercase">
                .NET Learning Guide
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-card/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/70 shadow-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-text-muted hover:text-text hover:bg-surface-alt'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/learn/part1/p1u1"
              className="text-xs font-bold text-text-muted hover:text-primary transition-colors flex items-center gap-0.5"
            >
              <span>Quick Start</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/topics"
              className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-98 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Learning</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text hover:bg-primary-50 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-b border-border shadow-xl px-5 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-base font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary-50 hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/topics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 text-center bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore All 82 Lessons</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
