import React from 'react';
import {
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Github,
  Instagram,
  ArrowUp
} from 'lucide-react';

/**
 * Editorial Studio Footer for MatteLab Makerspace:
 * - Left vertical social dock (circular honey-gold buttons: LinkedIn, X, GitHub, Instagram, Discord)
 * - Top-right tab: "Back to top ↑"
 * - Section 1: "Got an idea? Let's build it together." + sculpted CTA button + Alan Kay makerspace quote
 * - Section 2: "Explore Lab" navigation column (FabLab, 3D printers, IoT workbenches)
 * - Section 3: "Initiatives" navigation column (Workshops, Hackathons, IEDC Grants, TinkerHub CETKR)
 * - Section 4: Lab Coordinates & Contact (College of Engineering Trikaripur, Cheemeni, Kasaragod)
 * - Monumental typographic statement: "DREAM IT · SOLDER IT · BUILD IT"
 * - Sub-footer: MatteLab brand wordmark, college affiliation, IEDC support, and lab safety guidelines
 */
export default function Footer({
  brand = "MatteLab",
  ctaText = "Propose a Project",
  headline = "Got an idea? Let's build it together.",
  punchyStatement = "DREAM IT · SOLDER IT · BUILD IT",
  onOpenCreateModal,
  onSelectTab
}) {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const socialLinks = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: <span className="font-bold text-[11px] leading-none">in</span>
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      href: 'https://x.com',
      icon: <span className="font-bold text-[11px] leading-none">𝕏</span>
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com',
      icon: <Github size={13} strokeWidth={2.5} />
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: <Instagram size={13} strokeWidth={2.5} />
    },
    {
      id: 'discord',
      label: 'Discord',
      href: 'https://discord.com',
      icon: <span className="font-black text-[10px] leading-none">DC</span>
    }
  ];

  return (
    <footer className="w-full px-3 sm:px-6 lg:px-8 pb-24 sm:pb-8 pt-10 select-none">
      <div className="relative mx-auto max-w-[1400px]">
        {/* Top-Right Tab: Back to Top */}
        <div className="flex justify-end pr-4 sm:pr-8">
          <button
            type="button"
            onClick={scrollToTop}
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-t-2xl bg-[#4C4541] hover:bg-[#3d3734] text-[#FCF0DA] text-xs font-semibold tracking-wide border-t border-x border-white/10 transition-all duration-200 cursor-pointer shadow-lg -mb-[1px] z-10"
            title="Scroll back to top"
          >
            <span>Back to top</span>
            <span className="inline-block transition-transform duration-200 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>

        {/* Outer Card Container */}
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#4C4541] dark:bg-[#151312] border border-white/10 p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden text-[#FCF0DA]">
          {/* Main Content Layout with Left Social Bar + Multi-column Grid */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Left Vertical Social Dock (Acid-Lime circular buttons) */}
            <div className="flex lg:flex-col items-center gap-2.5 flex-shrink-0">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F2C46A] hover:bg-[#e0b45c] text-[#4C4541] font-bold flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_14px_rgba(242,196,106,0.4)] cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Inner Columns Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 lg:gap-10">
              {/* Column 1: Headline, Inspiring Quote & Sculpted CTA (Span 5 on XL) */}
              <div className="xl:col-span-5 flex flex-col justify-between">
                <div>
                  <h2 className="font-condensed text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-[1.08]">
                    {headline}
                  </h2>

                  {/* Campus Makerspace Ethos Quote */}
                  <blockquote className="mt-3 text-xs sm:text-sm text-[#FCF0DA]/80 font-editorial italic border-l-2 border-[#F2C46A] pl-3 leading-relaxed">
                    "The best way to predict the future is to invent it. Dream it, solder it, code it."
                    <span className="block not-italic text-[11px] text-stone-500 mt-1 font-semibold">
                      — Alan Kay · MatteLab Ethos
                    </span>
                  </blockquote>

                  <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                    {/* Sculpted Acid-Lime CTA Button */}
                    <button
                      type="button"
                      onClick={onOpenCreateModal}
                      className="group px-5 py-2.5 rounded-full bg-[#F2C46A] hover:bg-[#e0b45c] text-[#4C4541] font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-[#F2C46A]/30"
                    >
                      <span>{ctaText}</span>
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.2]"
                      />
                    </button>

                    {/* Makerspace Community Badge */}
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-[11px] text-[#F2C46A] tracking-wider uppercase">
                        OPEN HARDWARE COMMUNITY
                      </span>
                      <span className="text-[11px] text-neutral-400 font-medium mt-0.5">
                        TinkerHub &amp; IEDC · College of Engineering Trikaripur (CETKR)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Explore Lab (Span 2 on XL) */}
              <div className="xl:col-span-2">
                <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">
                  Explore Lab
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('overview')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      About MatteLab
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('resources')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      FabLab Machinery
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('resources')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      3D Printers & Lasers
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('resources')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      IoT Workbench
                    </button>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Project Incubation
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Safety & Guidelines
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Maker Showcase
                    </span>
                  </li>
                </ul>
              </div>

              {/* Column 3: Campus Initiatives (Span 2 on XL) */}
              <div className="xl:col-span-2">
                <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">
                  Initiatives
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
                  <li className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('events')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Workshops
                    </button>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#AEAC78] text-[#4C4541] text-[9px] font-black leading-tight">
                      NEW
                    </span>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('events')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Hackathons
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('registrations')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      My Registrations
                    </button>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      IEDC Startup Grants
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      TinkerHub CETKR Hub
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Open Source Hardware
                    </span>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('profile')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Student Mentors
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 4: Lab Coordinates & Contact (Span 3 on XL) */}
              <div className="xl:col-span-3 space-y-4">
                <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">
                  Visit MatteLab
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-neutral-400 flex-shrink-0" />
                    <span>+91 9446 000 123 / 0467 225 0377</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-neutral-400 flex-shrink-0" />
                    <span>mattelab@cetkr.ac.in</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-neutral-400 space-y-1">
                  <div className="flex items-start gap-1.5 text-neutral-300">
                    <MapPin size={13} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">MatteLab Makerspace (FabLab Floor)</p>
                      <p>College of Engineering Trikaripur</p>
                      <p>Cheemeni, Kasaragod</p>
                      <p>Kerala - 671313</p>
                    </div>
                  </div>
                </div>

                {/* What3Words / Maker Coordinates */}
                <div className="pt-1 text-[11px] font-mono text-neutral-500 flex items-center gap-1.5">
                  <span className="font-bold text-[#F2C46A]">///</span>
                  <span className="text-stone-300">dream.solder.create</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              THE MONUMENTAL TYPOGRAPHIC STATEMENT
              "DREAM IT · SOLDER IT · BUILD IT"
             ======================================================== */}
          <div className="my-8 sm:my-10 lg:my-12 select-none overflow-hidden">
            <div role="heading" aria-level="2" className="font-condensed text-[clamp(1.35rem,5.2vw,5.5rem)] font-black uppercase tracking-tight text-white/90 leading-tight break-words sm:whitespace-nowrap">
              {punchyStatement}
            </div>
          </div>

          {/* ========================================================
              SUB-FOOTER / LEGAL BAR
             ======================================================== */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 font-medium">
            {/* Left: Brand + College + IEDC Support */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-bold text-white tracking-tight flex items-center">
                {brand}<span className="text-[#F2C46A]">.</span>
              </span>
              <span>© MatteLab Makerspace 2026</span>
              <span className="text-neutral-600">|</span>
              <span>College of Engineering Trikaripur</span>
              <span className="text-neutral-600">|</span>
              <span className="text-stone-400">Supported by IEDC & Kerala Startup Mission</span>
            </div>

            {/* Right: Lab Standards & Open Source */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-center md:text-right">
              <span>Open to All Innovators</span>
              <span className="text-neutral-600">|</span>
              <span>Open Source Hardware</span>
              <span className="text-neutral-600">|</span>
              <span className="hover:text-neutral-200 cursor-pointer">
                Lab Safety & Equipment Guidelines
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
