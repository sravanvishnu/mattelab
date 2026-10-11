import React, { useState } from 'react';
import {
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Calendar,
  BookmarkCheck,
  Wrench,
  User as UserIcon,
  Sparkles
} from 'lucide-react';

/**
 * Modern Architectural Floating Island Header Model:
 * - Brand: Official bi-lingual MatteLab logo (/logo.png) with live status pill
 * - Center: Floating segmented glass dock with rich icons, active terracotta indicator, and badges
 * - Right: Organizer access badge + user avatar with glowing ring + terracotta gradient CTA button
 * - Position: Floating island overlay with backdrop blur and warm terracotta accents
 */
export default function Header({
  brand = "MATTELAB",
  subtitle = "CET Makerspace",
  items = [
    { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'events', label: 'EVENTS', icon: Calendar },
    { id: 'registrations', label: 'REGISTRATIONS', icon: BookmarkCheck },
    { id: 'resources', label: 'RESOURCES', icon: Wrench },
    { id: 'profile', label: 'PROFILE', icon: UserIcon }
  ],
  activeItem = 'overview',
  onSelect,
  ctaText = "Contact Us",
  onCtaClick,
  user = null,
  isOrganizer = false,
  isAdmin = false,
  language = "EN",
  onLanguageToggle,
  isOverlay = true,
  className = ""
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User display name & initial
  const displayName = user?.displayName || user?.name || "Student Maker";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Helper to map default icons if item doesn't specify one
  const getIconForItem = (id) => {
    switch (id) {
      case 'overview':
      case 'about':
        return LayoutDashboard;
      case 'events':
      case 'service':
        return Calendar;
      case 'registrations':
      case 'works':
        return BookmarkCheck;
      case 'resources':
      case 'blog':
        return Wrench;
      case 'profile':
        return UserIcon;
      default:
        return Sparkles;
    }
  };

  const headerPositionClasses = isOverlay
    ? "fixed top-3 sm:top-4 left-3 sm:left-6 right-3 sm:right-6 max-w-7xl mx-auto z-50"
    : "w-full max-w-7xl mx-auto sticky top-3 z-50 px-3 sm:px-6";

  return (
    <header className={`${headerPositionClasses} ${className} select-none transition-all duration-200`}>
      {/* Floating Island Shell */}
      <div className="h-[68px] rounded-2xl md:rounded-full bg-[#16181b]/92 backdrop-blur-xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(194,110,71,0.22)] px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Official Brand Identity & Makerspace Live Indicator */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <a
            href="#home"
            className="group flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(items[0]?.id || 'overview');
              }
            }}
          >
            {/* Official Bi-Lingual MatteLab Logo */}
            <div className="h-10 sm:h-11 flex items-center bg-[#fbf9f5] rounded-xl px-2.5 py-1 border border-[#c26e47]/30 shadow-xs">
              <img
                src="/logo.png"
                alt="MatteLab"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
          </a>

          {/* Makerspace Status Chip */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#c26e47] animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {subtitle || "CET MAKERSPACE"}
            </span>
          </div>
        </div>

        {/* Center: Segmented Floating Dock containing Navigation tabs */}
        {items && items.length > 0 && (
          <nav
            className="hidden md:flex items-center bg-[#202428]/85 backdrop-blur-md rounded-full p-1.5 border border-white/10 shadow-inner mx-auto"
            aria-label="Workspace Navigation"
          >
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {items.map((item) => {
                const isActive = activeItem === item.id;
                const ItemIcon = item.icon || getIconForItem(item.id);

                return (
                  <li key={item.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => onSelect?.(item.id)}
                      className={`text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer rounded-full px-3.5 py-1.5 flex items-center gap-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white shadow-md shadow-[#c26e47]/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <ItemIcon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>

                      {/* Registrations count badge */}
                      {item.badge !== undefined && item.badge !== null && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                          isActive
                            ? 'bg-white text-[#c26e47]'
                            : 'bg-[#d97736] text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Admin badge */}
                      {item.highlight && (
                        <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                          Admin
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Right: Organizer Badge + Profile + Terracotta CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 justify-end flex-shrink-0">
          {/* Organizer Access Chip */}
          {isOrganizer && (
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Organizer</span>
            </span>
          )}

          {/* User Profile Avatar with Glowing Terracotta Ring */}
          {user ? (
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#202428] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#c26e47]/40 hover:ring-[#c26e47] shadow-sm cursor-pointer overflow-hidden transition-all hover:scale-105"
              title={`${displayName} — View Profile`}
              onClick={() => onSelect?.('profile')}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-amber-200">{userInitial}</span>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onLanguageToggle}
              className="w-9 h-9 rounded-full bg-[#202428] hover:bg-[#2a3036] text-slate-200 flex items-center justify-center text-xs font-bold border border-white/10 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Switch Language"
              aria-label="Language Toggle"
            >
              {language}
            </button>
          )}

          {/* Terracotta-to-Ochre Gradient CTA Button */}
          <button
            type="button"
            onClick={onCtaClick}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#c26e47] to-[#d97736] hover:from-[#b05f3b] hover:to-[#c6682b] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-md shadow-[#c26e47]/25 hover:shadow-lg hover:shadow-[#c26e47]/35 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            {isOrganizer ? <PlusCircle size={15} /> : <LogOut size={14} className="rotate-180" />}
            <span>{ctaText}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center ml-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl bg-[#16181b]/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            {items.map((item) => {
              const isActive = activeItem === item.id;
              const ItemIcon = item.icon || getIconForItem(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ItemIcon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#d97736] text-white text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onCtaClick?.();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isOrganizer ? <PlusCircle size={16} /> : <LogOut size={15} className="rotate-180" />}
              <span>{ctaText}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
