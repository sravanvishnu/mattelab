import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import mattelabLogo from '../assets/mattelab.png';

/**
 * Editorial Studio Header with Morphing Motion:
 * - At page top (scrollY <= 15): Full-width edge-to-edge dark rectangular bar (sides-to-sides)
 * - On scroll (scrollY > 15): Smoothly contracts from the sides inward into a centered floating capsule dock (center)
 * - Layout: Left (Logo Wordmark) | Center (Nav items + active underline + lime badges) | Right (Sun utility + Lime CTA button)
 */
export default function Header({
  brand = "MatteLab",
  subtitle = "Makerspace",
  items = [
    { id: 'overview', label: 'Overview' },
    { id: 'events', label: 'Events' },
    { id: 'registrations', label: 'Registrations' },
    { id: 'resources', label: 'Resources' },
    { id: 'profile', label: 'Profile' }
  ],
  activeItem = 'overview',
  onSelect,
  ctaText = "Propose Event",
  onCtaClick,
  user = null,
  isOrganizer = false,
  isAdmin = false,
  className = ""
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Scroll listener for the transition from edge-to-edge sides to centered floating dock
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollPos > 15);
    };

    // Run once on mount to establish initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme switch utility
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('light-theme', !next);
      }
      return next;
    });
  };

  const displayName = user?.displayName || user?.name || "Student Maker";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Normalize brand label with modern studio dot notation (matches Shape.)
  const brandName = brand.endsWith('.') ? brand.slice(0, -1) : brand;

  return (
    <>
      {/* Morphing Header: Transition from full-width sides to centered floating capsule dock */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          isScrolled
            ? 'top-3 sm:top-4 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-5xl rounded-full bg-[#4C4541]/95 backdrop-blur-xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)] px-5 sm:px-7 h-[58px] sm:h-[62px]'
            : 'top-0 w-full max-w-full rounded-none bg-[#FCF0DA]/95 backdrop-blur-md border-b border-[#4C4541]/15 shadow-none px-6 sm:px-10 lg:px-12 h-[66px] sm:h-[70px]'
        } ${className}`}
      >
        {/* ========================================================
            SECTION 1: LEFT - Logo
            - Before transition (!isScrolled): Seamless transparent MatteLab logo (NO sub-container)
            - After transition (isScrolled): Typographic wordmark MatteLab. (matches Shape.)
           ======================================================== */}
        <div className="flex items-center gap-2 m-0 p-0 flex-shrink-0">
          <a
            href="#overview"
            className="group flex items-center focus:outline-none"
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(items[0]?.id || 'overview');
              }
            }}
          >
            <div className="relative flex items-center">
              {/* State 1: Before Transition -> Seamless MatteLab Transparent Logo (NO BOX) */}
              <div
                className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  !isScrolled
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none absolute left-0'
                }`}
              >
                <img
                  src={mattelabLogo}
                  alt="MatteLab"
                  className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>

              {/* State 2: After Transition -> Modern Editorial Wordmark (Shape style) */}
              <div
                className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none absolute left-0'
                }`}
              >
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center">
                  {brandName}
                  <span className="text-white group-hover:text-[#F2C46A] transition-colors">.</span>
                </span>
              </div>
            </div>
          </a>

          {!isScrolled && subtitle && (
            <span className="hidden xl:inline-block text-[11px] font-medium text-stone-500 tracking-wider border-l border-stone-300 pl-2.5 ml-1 transition-opacity duration-300">
              {subtitle}
            </span>
          )}
        </div>

        {/* ========================================================
            SECTION 2: CENTER - Inline Navigation List
            - Evenly spaced links
            - Active-state underline indicator
            - Anchored circular acid-lime badge
           ======================================================== */}
        {items && items.length > 0 && (
          <nav className="hidden md:flex items-center mx-auto" aria-label="Main Navigation">
            <ul className="flex items-center gap-6 lg:gap-8 list-none m-0 p-0">
              {items.map((item) => {
                const isActive = activeItem === item.id;

                return (
                  <li key={item.id} className="relative flex items-center">
                    <button
                      type="button"
                      onClick={() => onSelect?.(item.id)}
                      className={`group relative py-1 text-[13px] sm:text-sm font-medium tracking-normal transition-colors duration-200 cursor-pointer flex items-center ${
                        isActive
                          ? (isScrolled ? 'text-white' : 'text-slate-950 font-semibold')
                          : (isScrolled ? 'text-[#9ca3af] hover:text-white' : 'text-stone-600 hover:text-slate-950')
                      }`}
                    >
                      <span>{item.label}</span>

                      {/* Anchored Circular Counter / Badge */}
                      {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                        <span
                          className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#F2C46A] text-[#4C4541] text-[10px] font-black leading-none inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                          title={`${item.badge} notifications`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Admin Highlight Indicator */}
                      {item.highlight && (
                        <span className="ml-1.5 text-[9px] font-bold uppercase text-[#4C4541] bg-[#AEAC78]/30 px-1.5 py-0.5 rounded-full border border-[#AEAC78]/50">
                          Admin
                        </span>
                      )}

                      {/* Active-state Razor Underline Indicator */}
                      {isActive && (
                        <span
                          className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
                            isScrolled ? 'bg-white' : 'bg-slate-950'
                          }`}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* ========================================================
            SECTION 3: RIGHT - Utility Control Cluster
            - Rotating wireframe Sun theme switch icon
            - User avatar profile ring
            - Acid-lime sculpted pill CTA button with trailing arrow
           ======================================================== */}
        <div className="flex items-center gap-3 sm:gap-4 justify-end flex-shrink-0">
          {/* Organizer Status Pill (Desktop only) */}
          {isOrganizer && (
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
              <ShieldCheck size={13} className="text-amber-400" />
              <span>Organizer</span>
            </span>
          )}

          {/* Utility Icon Action Button: Rotating Sun theme switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="group p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors duration-200 cursor-pointer flex items-center justify-center focus:outline-none"
            title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle Theme Mode"
          >
            {isDarkMode ? (
              <Sun
                size={18}
                className={`transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-45 group-active:rotate-90 stroke-[1.8] ${
                  isScrolled ? 'text-white' : 'text-stone-800'
                }`}
              />
            ) : (
              <Moon
                size={18}
                className={`transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-45 group-active:rotate-90 stroke-[1.8] ${
                  isScrolled ? 'text-neutral-200' : 'text-stone-700'
                }`}
              />
            )}
          </button>

          {/* User Profile Avatar */}
          {user ? (
            <button
              type="button"
              onClick={() => onSelect?.('profile')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm cursor-pointer overflow-hidden transition-all duration-200 hover:scale-105 ${
                isScrolled
                  ? 'bg-neutral-800 text-white ring-1 ring-white/20 hover:ring-white'
                  : 'bg-stone-200 text-stone-900 ring-1 ring-stone-300 hover:ring-stone-500'
              }`}
              title={`${displayName} — View Profile`}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </button>
          ) : null}

          {/* Acid-Lime Pill CTA Button with Trailing Arrow */}
          <button
            type="button"
            onClick={onCtaClick}
            className="group px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#F2C46A] hover:bg-[#e0b45c] text-[#4C4541] text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-[#F2C46A]/30 whitespace-nowrap"
          >
            <span>{ctaText}</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] stroke-[2.2]"
            />
          </button>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center ml-0.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-slate-300 hover:text-white hover:bg-white/10'
                  : 'text-stone-700 hover:text-slate-950 hover:bg-black/5'
              }`}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Drawer when open */}
      {mobileMenuOpen && (
        <div
          className={`fixed z-40 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md rounded-3xl bg-[#4C4541]/96 backdrop-blur-2xl border border-white/12 p-3.5 shadow-2xl space-y-2 animate-in slide-in-from-top-2 duration-200 transition-all ${
            isScrolled ? 'top-20' : 'top-[76px]'
          }`}
        >
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F2C46A] text-[#4C4541] text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onCtaClick?.();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-[#F2C46A] hover:bg-[#e0b45c] text-[#4C4541] text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowUpRight size={14} className="stroke-[2.2]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

