import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Sparkles, Cpu, Layers, Wrench, Compass } from 'lucide-react';

/**
 * Exact Hero component matching the user reference screenshot:
 * - Background: Clean seamless #e5e8ec canvas
 * - Centerpiece: The iconic vibrant cobalt blue 3D folded geometric sculpture (#3555f8)
 *   with realistic lighting, interactive mouse parallax tilt, and smooth floating motion
 * - Minimalist studio typography matching Goons Design
 */
export default function GoonsHero({
  onCtaClick,
  onExploreEvents,
  onExploreResources,
  ctaText = "Contact Us"
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 28;
      const y = (e.clientY / innerHeight - 0.5) * 28;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-full min-h-[82vh] lg:min-h-[88vh] bg-[#f7f4ee] text-slate-900 overflow-hidden flex flex-col items-center justify-center px-6 pt-16 pb-20 select-none">
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c26e47]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Sub-label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebe6db] border border-slate-300 text-slate-800 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#c26e47] animate-pulse"></span>
          <span>College of Engineering Trikaripur · Makerspace Hub</span>
        </div>

        {/* Studio Heading */}
        <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-slate-950 uppercase leading-[0.98] max-w-4xl">
          Crafting Code, <br className="hidden sm:inline" />
          Hardware & Future
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-600 max-w-xl font-medium leading-relaxed">
          The central innovation studio at CET. Transforming raw ideas into 3D prototypes, IoT hardware, and groundbreaking software.
        </p>

        {/* Iconic Floating 3D Terracotta & Bronze Geometric Sculpture */}
        <div className="relative my-8 sm:my-12 flex items-center justify-center">
          <div
            className="transition-transform duration-300 ease-out cursor-pointer"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`
            }}
          >
            {/* 3D Folded Faceted Terracotta & Bronze Origami Prism */}
            <svg
              className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_32px_45px_rgba(194,110,71,0.38)] filter transition-all hover:scale-105 duration-500"
              viewBox="0 0 340 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Light reflection gradients across terracotta & bronze facets */}
                <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5a36c" />
                  <stop offset="100%" stopColor="#c26e47" />
                </linearGradient>
                <linearGradient id="facetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c26e47" />
                  <stop offset="100%" stopColor="#944622" />
                </linearGradient>
                <linearGradient id="facetRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97736" />
                  <stop offset="100%" stopColor="#ad5228" />
                </linearGradient>
                <linearGradient id="facetBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6b2e15" />
                  <stop offset="100%" stopColor="#3d1708" />
                </linearGradient>
                <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbc79a" />
                  <stop offset="100%" stopColor="#e88d55" />
                </linearGradient>
              </defs>

              {/* Back ambient cast shadow */}
              <ellipse cx="170" cy="305" rx="110" ry="22" fill="#000000" fillOpacity="0.14" filter="blur(8px)" />

              {/* 3D Polyhedral Prism Facets */}
              {/* Top crest highlight */}
              <polygon points="170,30 245,120 170,165 95,120" fill="url(#facetTop)" />
              
              {/* Upper left facet */}
              <polygon points="170,30 95,120 50,195 125,210" fill="url(#facetHighlight)" fillOpacity="0.9" />

              {/* Upper right facet */}
              <polygon points="170,30 245,120 290,195 215,210" fill="url(#facetRight)" />

              {/* Center diamond core */}
              <polygon points="170,165 245,120 215,210 170,265" fill="url(#facetLeft)" />
              <polygon points="170,165 95,120 125,210 170,265" fill="url(#facetTop)" />

              {/* Lower left underside */}
              <polygon points="125,210 170,265 170,300 80,240" fill="url(#facetBottom)" />

              {/* Lower right underside */}
              <polygon points="215,210 170,265 170,300 260,240" fill="url(#facetBottom)" fillOpacity="0.95" />

              {/* Outer folded wing facets */}
              <polygon points="50,195 95,120 40,110 20,170" fill="url(#facetLeft)" fillOpacity="0.8" />
              <polygon points="290,195 245,120 300,110 320,170" fill="url(#facetHighlight)" fillOpacity="0.85" />
            </svg>
          </div>
        </div>

        {/* Clean Pill Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onCtaClick}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c26e47] to-[#d97736] hover:from-[#b05f3b] hover:to-[#c6682b] text-white text-xs sm:text-sm font-semibold tracking-normal shadow-md hover:shadow-lg shadow-[#c26e47]/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>{ctaText}</span>
            <ArrowUpRight size={16} />
          </button>

          {onExploreEvents && (
            <button
              type="button"
              onClick={onExploreEvents}
              className="px-8 py-3.5 rounded-full bg-[#dadee3] hover:bg-slate-300 text-slate-900 text-xs sm:text-sm font-semibold tracking-normal border border-slate-300/80 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Explore Workshops
            </button>
          )}

          {onExploreResources && (
            <button
              type="button"
              onClick={onExploreResources}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold tracking-normal border border-slate-300/80 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Lab Machinery
            </button>
          )}
        </div>

        {/* Quick Feature Badges */}
        <div className="mt-14 pt-8 border-t border-slate-300/60 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-300/60 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">01 / FABLAB</span>
            <span className="text-xs sm:text-sm font-bold text-slate-950 mt-1 block">3D Printing & CNC</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-300/60 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">02 / EMBEDDED</span>
            <span className="text-xs sm:text-sm font-bold text-slate-950 mt-1 block">IoT & Microcontrollers</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-300/60 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">03 / SOFTWARE</span>
            <span className="text-xs sm:text-sm font-bold text-slate-950 mt-1 block">AI & Web Engineering</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-300/60 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">04 / COMMUNITY</span>
            <span className="text-xs sm:text-sm font-bold text-slate-950 mt-1 block">TinkerHub · IEDC CET</span>
          </div>
        </div>
      </div>
    </section>
  );
}
