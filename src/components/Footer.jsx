import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1917] text-white pt-14 pb-8 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          
          {/* Left Column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="bg-primary/20 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">NetPrep</span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              The comprehensive, open-access learning platform for ASP.NET Core MVC & RESTful APIs. Clean theory, production blueprints, and real-world code.
            </p>
          </div>

          {/* Middle Column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200 mb-4">Curriculum</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-stone-400 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/topics" className="text-stone-400 hover:text-primary transition-colors">All 11 Modules (82 Lessons)</Link>
              </li>
              <li>
                <Link to="/learn/part1/p1u1" className="text-stone-400 hover:text-primary transition-colors">Unit 1: Introduction to .NET Core</Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-primary transition-colors">About NetPrep</Link>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200 mb-4">Open Learning</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              No paywalls, no login barriers, and no artificial gating. Designed to help developers at all stages master ASP.NET Core concepts thoroughly and build real confidence.
            </p>
          </div>
          
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#292524] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400">
          <p className="text-stone-500">
            &copy; {currentYear} NetPrep. Free & open-source learning resource.
          </p>
          <p className="flex items-center gap-1 text-stone-400">
            <span>Made By</span>
            <a
              href="https://www.linkedin.com/in/krishmeghapara/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:text-primary-light transition-colors underline underline-offset-4 ml-1 flex items-center gap-1"
            >
              <span>KM</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
