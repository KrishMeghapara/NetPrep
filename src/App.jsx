import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import TopicsPage from './pages/TopicsPage';
import ContentPage from './pages/ContentPage';
import AboutPage from './pages/AboutPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NetPrep ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8F0] text-[#292524] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg max-w-md w-full">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              !
            </div>
            <h2 className="text-2xl font-black mb-2">Something went wrong</h2>
            <p className="text-sm text-stone-500 mb-6">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
                className="px-5 py-2.5 bg-[#F97316] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { motion, AnimatePresence } from 'framer-motion';

function AppLayout() {
  const location = useLocation();
  const isLearnPage = location.pathname.startsWith('/learn');
  const routeKey = isLearnPage ? 'learn-shell' : location.pathname;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-surface text-text">
      {!isLearnPage && <Navbar />}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-grow flex flex-col w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/learn" element={<Navigate to="/learn/part1/p1u1" replace />} />
              <Route path="/learn/:partId/:unitId" element={<ContentPage />} />
              <Route path="/learn/:partId/:unitId/:sectionId" element={<ContentPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
