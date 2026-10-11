import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  X,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Wrench,
  BookmarkCheck,
  Send,
  Compass
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

/**
 * Brutalist-Editorial Hero Landing Page
 * Directly matching the reference design:
 * 1. Fullscreen viewport with 10 evenly spaced vertical grid lines (#4C4541/15)
 * 2. Perimeter Utility Anchors:
 *    - Top-Left: Stacked minimalist label ("ENGINEERING & CREATIVE TECH / MATTELAB 2026")
 *    - Top-Right: Fixed rounded rectangular pill button ("MENU")
 *    - Right Margin Rail: Sticky vertical tab badge ("STATUS: AVAILABLE" / "M.")
 *    - Bottom-Left: Floating pill housing theme toggle & curtain replay trigger
 *    - Bottom-Right: Floating interactive smiley/maker badge
 * 3. Central Hero Area:
 *    - Typographic lockup blending ultra-bold condensed sans ("HARDWARE", "MATTELAB", "TINKER", "DIGITAL") and
 *      high-contrast italic serif ("prototyping", "innovation", "solder", "fabrication") + bottom ("LABORATORY", "ENGINEERING", "CREATE", "WORKBENCH")
 *    - Upper-Right Quad: Upper-case editorial micro-copy detailing makerspace workbenches and tools
 *    - Central Graphic Layer: Large abstract hand-drawn vector smiley/doodle motif with parallax
 * 4. Stepped Curtain Entrance:
 *    - 10 staggered vertical slices unmasking from top-to-bottom with a 40ms stagger curve
 * 5. Column Hover Slices & 2.5D mouse tilt physics
 *
 * Color Scheme:
 * - #FCF0DA (Warm Off-White Canvas)
 * - #AEAC78 (Olive Sage Accent)
 * - #F2C46A (Warm Honey Gold)
 * - #4C4541 (Deep Espresso Charcoal)
 */
export default function MatteLabHero({
  onCtaClick,
  onExploreEvents,
  onExploreResources,
  onExploreRegistrations,
  onSelectTab,
  ctaText = "Propose Project"
}) {
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  // Stepped curtain entrance animation state
  const [curtainRevealed, setCurtainRevealed] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkDisplay, setIsDarkDisplay] = useState(false);

  // Lockup Typography Preset Switcher
  const [presetIndex, setPresetIndex] = useState(0);
  const typographyPresets = [
    {
      sansTop: 'HARDWARE',
      serifMid: 'prototyping',
      sansBottom: 'LABORATORY',
      label: 'Makerspace Core'
    },
    {
      sansTop: 'MATTELAB',
      serifMid: 'innovation',
      sansBottom: 'ENGINEERING',
      label: 'CET Innovation'
    },
    {
      sansTop: 'TINKER',
      serifMid: 'solder',
      sansBottom: 'CREATE',
      label: 'Maker Ethos'
    },
    {
      sansTop: 'DIGITAL',
      serifMid: 'fabrication',
      sansBottom: 'WORKBENCH',
      label: 'FabLab Benches'
    }
  ];

  const currentPreset = typographyPresets[presetIndex];

  // Mouse Parallax & Tilt physics
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
    rawY: 200
  });

  const heroContainerRef = useRef(null);

  // Stepped Curtain Entrance: auto-reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurtainRevealed(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const replayCurtain = () => {
    setCurtainRevealed(false);
    setTimeout(() => {
      setCurtainRevealed(true);
      showToast?.('Stepped column curtain replayed', 'info');
    }, 120);
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    if (!heroContainerRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const normX = clientX / rect.width - 0.5;
    const normY = clientY / rect.height - 0.5;

    // Determine which vertical column is currently hovered (10 columns)
    const colIndex = Math.floor((clientX / rect.width) * 10);
    setActiveColumn(Math.max(0, Math.min(9, colIndex)));

    setMousePos({
      x: normX,
      y: normY,
      tiltX: -normY * 12,
      tiltY: normX * 12,
      rawY: clientY
    });
  };

  const handleMouseLeave = () => {
    setActiveColumn(null);
    setMousePos({ x: 0, y: 0, tiltX: 0, tiltY: 0, rawY: 200 });
  };

  // 10 columns for the grid
  const columns = Array.from({ length: 10 });

  return (
    <section
      ref={heroContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[90vh] min-h-[640px] max-h-[1050px] overflow-hidden select-none transition-colors duration-500 ${
        isDarkDisplay ? 'bg-[#3b3632] text-[#FCF0DA]' : 'bg-[#FCF0DA] text-[#4C4541]'
      }`}
      style={{
        backgroundColor: isDarkDisplay ? '#3c3633' : '#FCF0DA',
        color: isDarkDisplay ? '#FCF0DA' : '#4C4541'
      }}
    >
      {/* =========================================================================
          1. MULTI-COLUMN GRID SYSTEM (10 Evenly Spaced Columns)
          Hovering columns triggers subtle vertical highlight and tick mark physics
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-10 z-0">
        {columns.map((_, idx) => {
          const isHovered = activeColumn === idx;
          return (
            <div
              key={idx}
              className={`relative h-full border-r transition-colors duration-200 ${
                isDarkDisplay
                  ? 'border-[#FCF0DA]/10'
                  : 'border-[#4C4541]/15'
              } ${
                isHovered
                  ? isDarkDisplay
                    ? 'bg-[#FCF0DA]/[0.03]'
                    : 'bg-[#AEAC78]/[0.10]'
                  : ''
              }`}
            >
              {/* Baseline tick mark indicator moving to cursor position on hovered column */}
              {isHovered && (
                <div
                  className="absolute left-0 w-2.5 h-[2px] transition-all duration-75 ease-out shadow-sm"
                  style={{
                    top: `${mousePos.rawY}px`,
                    backgroundColor: isDarkDisplay ? '#F2C46A' : '#4C4541'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          2. STEPPED CURTAIN ENTRANCE ANIMATION (Matching Reference Image 1)
          Each of the 10 grid columns slides out with a 40ms stagger curve to reveal the layout
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-10 z-50 overflow-hidden">
        {columns.map((_, idx) => (
          <div
            key={idx}
            className="w-full h-full bg-[#4C4541] transform transition-transform"
            style={{
              transitionDuration: '820ms',
              transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
              transitionDelay: `${idx * 42}ms`,
              transform: curtainRevealed ? 'translateY(-101%)' : 'translateY(0%)'
            }}
          />
        ))}
      </div>

      {/* =========================================================================
          3. PERIMETER UTILITY ANCHOR SYSTEM
         ========================================================================= */}

      {/* ANCHOR A: Top-Left Minimal Stacked Typographic Label */}
      <div className="absolute top-6 sm:top-9 left-6 sm:left-10 z-30 flex flex-col font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase leading-tight select-none">
        <span>ENGINEERING &amp;</span>
        <span>CREATIVE TECH</span>
        <span className="text-[#AEAC78]">MATTELAB / 2026</span>
        <span className="text-[9px] font-normal tracking-wider opacity-60 mt-1">
          CET MAKERSPACE HUB
        </span>
      </div>

      {/* ANCHOR B: Top-Right Fixed Rounded Rectangular Pill Button ("MENU") */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="absolute top-5 sm:top-8 right-6 sm:right-10 z-30 px-6 sm:px-7 py-2 sm:py-2.5 rounded-2xl border-2 border-[#4C4541] bg-white text-[#4C4541] hover:bg-[#F2C46A] hover:border-[#4C4541] font-condensed text-xl sm:text-2xl tracking-wider transition-all duration-300 shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
        style={{
          borderColor: isDarkDisplay ? '#FCF0DA' : '#4C4541',
          backgroundColor: isDarkDisplay ? '#4C4541' : '#ffffff',
          color: isDarkDisplay ? '#FCF0DA' : '#4C4541'
        }}
      >
        <span>MENU</span>
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            isMenuOpen ? 'bg-red-500' : 'bg-[#AEAC78]'
          }`}
        />
      </button>

      {/* ANCHOR C: Right Margin Rail (Sticky Vertical Tab Badge) */}
      <div
        onClick={() => onExploreEvents?.()}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white border-l-2 border-y-2 border-[#4C4541] rounded-l-2xl py-6 px-3 flex-col items-center gap-3 shadow-md hover:bg-[#F2C46A] transition-colors cursor-pointer select-none group"
        title="MatteLab Status: Open & Available"
      >
        <span className="font-condensed font-black text-xl text-[#4C4541] leading-none">
          M.
        </span>
        <div className="w-4 h-[1px] bg-[#4C4541]/30" />
        <span
          className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#4C4541] select-none whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)'
          }}
        >
          STATUS: AVAILABLE
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1" />
      </div>

      {/* ANCHOR D: Bottom-Left Subtle Floating Pill (Theme & Replay Controls) */}
      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 z-30 inline-flex items-center gap-2 p-1.5 rounded-full bg-[#4C4541]/8 hover:bg-[#4C4541]/14 backdrop-blur-md border border-[#4C4541]/20 transition-all shadow-sm">
        <button
          type="button"
          onClick={() => setIsDarkDisplay((prev) => !prev)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#4C4541] hover:bg-white transition-colors cursor-pointer"
          title={isDarkDisplay ? "Switch to Canvas Cream" : "Switch to Espresso Charcoal"}
          style={{ color: isDarkDisplay ? '#FCF0DA' : '#4C4541' }}
        >
          {isDarkDisplay ? <Sun size={13} /> : <Moon size={13} />}
        </button>

        <button
          type="button"
          onClick={replayCurtain}
          className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#4C4541] hover:bg-white rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
          style={{ color: isDarkDisplay ? '#FCF0DA' : '#4C4541' }}
          title="Replay Stepped Column Curtain Reveal"
        >
          <Sparkles size={11} className="text-[#AEAC78]" />
          <span>REPLAY</span>
        </button>

        {/* Lockup Phrase Switcher */}
        <button
          type="button"
          onClick={() => setPresetIndex((p) => (p + 1) % typographyPresets.length)}
          className="hidden sm:inline-flex px-2 py-0.5 text-[9px] font-mono font-bold text-[#4C4541]/80 hover:text-[#4C4541] border-l border-[#4C4541]/20 pl-2 transition-colors cursor-pointer"
          style={{ color: isDarkDisplay ? '#FCF0DA' : '#4C4541' }}
          title="Switch Lockup Headline Variant"
        >
          <span>TYPE: {currentPreset.label} ↻</span>
        </button>
      </div>

      {/* ANCHOR E: Bottom-Right Interactive Smiley / Maker Badge */}
      <button
        type="button"
        onClick={() => onExploreEvents?.()}
        className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#AEAC78] hover:bg-[#F2C46A] border-2 border-[#4C4541] flex items-center justify-center text-[#4C4541] shadow-md hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        title="Explore MatteLab Makerspace Workshops"
      >
        <span className="text-xl sm:text-2xl leading-none">☻</span>
      </button>

      {/* =========================================================================
          4. UPPER-RIGHT QUAD EDITORIAL MICRO-COPY BLOCK
          Compact 4-line block detailing services/capabilities in clean mono/grotesque
         ========================================================================= */}
      <div className="absolute top-20 sm:top-24 right-8 sm:right-16 lg:right-28 max-w-[270px] sm:max-w-[340px] z-20 text-right select-none pointer-events-none sm:pointer-events-auto">
        <h4 className="font-mono text-[10px] sm:text-xs font-bold text-[#4C4541] tracking-wider uppercase mb-1"
          style={{ color: isDarkDisplay ? '#F2C46A' : '#4C4541' }}
        >
          LAB WORKBENCHES &amp; TOOLS
        </h4>
        <p className="font-mono text-[9px] sm:text-[11px] text-[#4C4541]/75 leading-relaxed tracking-tight uppercase"
          style={{ color: isDarkDisplay ? 'rgba(252, 240, 218, 0.8)' : 'rgba(76, 69, 65, 0.75)' }}
        >
          RAPID 3D PRINTING &amp; FDM SLICING.
          EMBEDDED IOT &amp; ARDUINO/ESP32.
          PCB SOLDERING &amp; OPEN HARDWARE.
        </p>
      </div>

      {/* =========================================================================
          5. CENTRAL GRAPHIC LAYER: Large Abstract Hand-Drawn Melting Smiley Vector
          Placed behind the typography with mouse-follow parallax & distortion
         ========================================================================= */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 32}px, ${mousePos.y * 32}px, 0) scale(${
            1 + Math.abs(mousePos.x) * 0.04
          }) rotate(${mousePos.x * 5}deg)`
        }}
      >
        <svg
          className="w-[320px] sm:w-[480px] md:w-[620px] lg:w-[740px] h-auto opacity-70 transition-opacity"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Melting Contour Path (Exact match to hand-drawn organic face in reference) */}
          <path
            d="M 170,110
               C 280,60 420,95 470,180
               C 515,260 480,360 485,420
               C 490,465 475,510 430,525
               C 380,540 330,490 280,500
               C 220,512 180,550 135,510
               C 90,470 115,395 105,330
               C 95,250 85,165 170,110 Z"
            stroke="#AEAC78"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Left Elongated Doodle Eye */}
          <ellipse
            cx="245"
            cy="270"
            rx="18"
            ry="45"
            fill="#AEAC78"
            className="transition-transform duration-200"
          />

          {/* Right Elongated Doodle Eye */}
          <ellipse
            cx="360"
            cy="285"
            rx="18"
            ry="45"
            fill="#AEAC78"
            className="transition-transform duration-200"
          />

          {/* Melting Smiley Fluid Mouth & Cheek Wave */}
          <path
            d="M 185,390
               C 230,470 365,480 430,410
               C 445,390 470,415 460,450
               C 455,480 470,520 475,550"
            stroke="#AEAC78"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* =========================================================================
          6. CENTRAL TYPOGRAPHIC LOCKUP (Ultra-Bold Condensed Sans + Italic Serif)
          Hardware & Prototyping Laboratory Branding
         ========================================================================= */}
      <div
        className="relative z-20 h-full w-full flex flex-col items-center justify-center text-center px-4 transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.tiltX}deg) rotateY(${mousePos.tiltY}deg)`
        }}
      >
        <div className="flex flex-col items-center justify-center max-w-[1300px] mx-auto mt-4 sm:mt-6">
          {/* Row 1: Upper Ultra-bold Condensed Sans + Italic Serif */}
          <div className="flex items-baseline justify-center flex-wrap gap-x-2 sm:gap-x-5 lg:gap-x-8">
            <span
              className="font-condensed font-black tracking-tight leading-[0.88] text-[72px] sm:text-[115px] md:text-[150px] lg:text-[195px] xl:text-[235px] uppercase transition-colors"
              style={{
                color: isDarkDisplay ? '#FCF0DA' : '#4C4541',
                letterSpacing: '-0.02em'
              }}
            >
              {currentPreset.sansTop}
            </span>

            <span
              className="font-editorial italic font-normal leading-none text-[38px] sm:text-[65px] md:text-[85px] lg:text-[115px] xl:text-[145px] transition-colors -translate-y-1 sm:-translate-y-3"
              style={{
                color: isDarkDisplay ? '#F2C46A' : '#4C4541'
              }}
            >
              {currentPreset.serifMid}
            </span>
          </div>

          {/* Row 2: Lower Ultra-bold Condensed Sans */}
          <div className="flex items-center justify-center -mt-2 sm:-mt-6 md:-mt-10 lg:-mt-14">
            <span
              className="font-condensed font-black tracking-tight leading-[0.88] text-[72px] sm:text-[115px] md:text-[150px] lg:text-[195px] xl:text-[235px] uppercase transition-colors"
              style={{
                color: isDarkDisplay ? '#FCF0DA' : '#4C4541',
                letterSpacing: '-0.02em'
              }}
            >
              {currentPreset.sansBottom}
            </span>
          </div>

          {/* Interactive Action Hub Pill */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 z-30">
            <button
              type="button"
              onClick={onCtaClick}
              className="px-7 py-3 rounded-2xl bg-[#4C4541] hover:bg-[#393431] text-[#FCF0DA] font-condensed text-lg sm:text-xl tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              style={{
                backgroundColor: isDarkDisplay ? '#F2C46A' : '#4C4541',
                color: isDarkDisplay ? '#4C4541' : '#FCF0DA'
              }}
            >
              <span>{ctaText}</span>
              <ArrowUpRight size={18} />
            </button>

            {onExploreEvents && (
              <button
                type="button"
                onClick={onExploreEvents}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-[#FCF0DA] text-[#4C4541] border-2 border-[#4C4541] font-condensed text-lg sm:text-xl tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                style={{
                  borderColor: isDarkDisplay ? '#FCF0DA' : '#4C4541',
                  backgroundColor: isDarkDisplay ? 'transparent' : '#ffffff',
                  color: isDarkDisplay ? '#FCF0DA' : '#4C4541'
                }}
              >
                Workshops
              </button>
            )}

            {onExploreResources && (
              <button
                type="button"
                onClick={onExploreResources}
                className="px-6 py-3 rounded-2xl bg-[#AEAC78]/25 hover:bg-[#AEAC78]/40 text-[#4C4541] border border-[#AEAC78] font-condensed text-lg sm:text-xl tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer"
                style={{
                  color: isDarkDisplay ? '#FCF0DA' : '#4C4541'
                }}
              >
                Equipment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          7. BRUTALIST EDITORIAL FLYOUT MENU (Triggered by Top-Right "MENU" Button)
         ========================================================================= */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#4C4541]/95 backdrop-blur-2xl text-[#FCF0DA] flex flex-col justify-between p-8 sm:p-14 lg:p-20 animate-in fade-in duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Header Bar inside Drawer */}
          <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <span className="font-mono text-xs font-bold tracking-widest text-[#AEAC78] uppercase">
              MATTELAB ARCHITECTURAL NAVIGATION
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-xl border border-white/20 text-[#FCF0DA] hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
            >
              <span>CLOSE</span>
              <X size={16} />
            </button>
          </div>

          {/* Menu Items List */}
          <div
            className="flex flex-col space-y-4 sm:space-y-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              {
                id: 'events',
                num: '01',
                title: 'CAMPUS WORKSHOPS & HACKATHONS',
                action: onExploreEvents
              },
              {
                id: 'resources',
                num: '02',
                title: 'FABLAB MACHINERY & 3D BENCHES',
                action: onExploreResources
              },
              {
                id: 'registrations',
                num: '03',
                title: 'MY RESERVED SEATS & SESSIONS',
                action: onExploreRegistrations
              },
              {
                id: 'propose',
                num: '04',
                title: 'PROPOSE WORKSHOP / PROJECT INQUIRY',
                action: onCtaClick
              }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.action?.();
                  setIsMenuOpen(false);
                }}
                className="group text-left flex items-baseline gap-4 sm:gap-6 py-2 border-b border-white/10 hover:border-[#F2C46A] transition-all cursor-pointer"
              >
                <span className="font-mono text-xs sm:text-sm font-bold text-[#AEAC78] group-hover:text-[#F2C46A] transition-colors">
                  {item.num}
                </span>
                <span className="font-condensed font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide group-hover:text-[#F2C46A] group-hover:translate-x-3 transition-all">
                  {item.title}
                </span>
                <ArrowUpRight
                  size={28}
                  className="ml-auto opacity-0 group-hover:opacity-100 text-[#F2C46A] transition-opacity"
                />
              </button>
            ))}
          </div>

          {/* Drawer Footer Coordinates */}
          <div
            className="flex flex-wrap items-center justify-between text-xs font-mono text-stone-400 border-t border-white/10 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <span>College of Engineering Trikaripur · Makerspace FabLab</span>
            <span className="text-[#F2C46A]">mattelab@cetkr.ac.in</span>
          </div>
        </div>
      )}
    </section>
  );
}
