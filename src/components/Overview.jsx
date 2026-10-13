import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  Award,
  Wrench,
  Cpu,
  Layers,
  Lightbulb,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  PlusCircle
} from 'lucide-react';

import MatteLabHero from './MatteLabHero';

export default function Overview({
  events = [],
  myRegistrations = [],
  resources = [],
  setActiveTab,
  onOpenCreateModal
}) {
  const { currentUser, userProfile, isOrganizer, isAdmin } = useAuth();
  const userName = userProfile?.name || currentUser?.displayName || 'Maker';

  // Find the soonest upcoming event
  const nextEvent = events.length > 0 ? events[0] : null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date TBA';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="tab-pane-fade">
      {/* Redesigned Architectural Hero */}
      <MatteLabHero
        ctaText={isOrganizer ? "Create Workshop Event" : "Propose Workshop / Event"}
        onCtaClick={onOpenCreateModal}
        onExploreEvents={() => setActiveTab('events')}
        onExploreResources={() => setActiveTab('resources')}
        onExploreRegistrations={() => setActiveTab('registrations')}
        onSelectTab={setActiveTab}
      />

      <div className="overview-inner-body max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Section 01: Welcome Editorial Canvas (Enlarged & Monumental) */}
        <section className="relative rounded-[28px] sm:rounded-[36px] border-2 border-[#4C4541] bg-[#FCF0DA] p-7 sm:p-11 lg:p-14 shadow-[5px_5px_0_#4C4541] mb-14 overflow-hidden">
          {/* Subtle architectural vertical lines watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex justify-between">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-[1px] bg-[#4C4541] h-full" />
            ))}
          </div>

          <div className="relative z-10">
            {/* Top Eyebrow Tag & Utility Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/40 text-[#4C4541] text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles size={14} className="text-[#4C4541]" />
                <span>[ 01 / LAB HUB ] · CETKR MAKERSPACE · TINKERHUB &amp; IEDC</span>
              </div>
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono text-[#4C4541]/80">
                <span className="w-2.5 h-2.5 rounded-full bg-[#AEAC78] border border-[#4C4541] animate-pulse" />
                <span className="font-bold tracking-wider">SYSTEM ONLINE &amp; SYNCED</span>
              </div>
            </div>

            {/* Monumental Editorial Headline */}
            <h2 className="font-condensed text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#4C4541] uppercase leading-[0.93]">
              WELCOME BACK, <span className="font-editorial italic font-normal lowercase tracking-normal text-[#4C4541]">{userName}.</span>
            </h2>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#4C4541]/85 max-w-3xl leading-relaxed font-sans">
              MatteLab is where ideas transform into hardware and software reality. Explore upcoming workshops, register for hackathons, reserve 3D printers, and collaborate with peer innovators across campus.
            </p>

            {/* Action Buttons Row */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs sm:text-sm font-mono font-bold tracking-wide uppercase transition-all duration-200 border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] active:translate-y-0.5 active:shadow-none cursor-pointer"
                onClick={() => setActiveTab('events')}
              >
                <span>Explore Events</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#FCF0DA] hover:bg-[#F2C46A]/30 text-[#4C4541] text-xs sm:text-sm font-mono font-bold tracking-wide uppercase transition-all duration-200 border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] active:translate-y-0.5 active:shadow-none cursor-pointer"
                onClick={() => setActiveTab('registrations')}
              >
                <BookmarkCheck size={15} />
                <span>My Passes ({myRegistrations.length})</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#FCF0DA] hover:bg-[#AEAC78]/30 text-[#4C4541] text-xs sm:text-sm font-mono font-bold tracking-wide uppercase transition-all duration-200 border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] active:translate-y-0.5 active:shadow-none cursor-pointer"
                onClick={() => setActiveTab('resources')}
              >
                <Wrench size={15} />
                <span>{isAdmin ? 'Manage Resources' : 'Equipment'} ({resources.length})</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#F2C46A] hover:bg-[#e0b45c] text-[#4C4541] text-xs sm:text-sm font-mono font-bold tracking-wide uppercase transition-all duration-200 border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] active:translate-y-0.5 active:shadow-none cursor-pointer ml-auto"
                onClick={onOpenCreateModal}
              >
                <PlusCircle size={15} />
                <span>{isAdmin ? 'Create Event' : 'Propose Idea'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 02: Live Activity & Stat Metrics (Enlarged Brutalist Counters) */}
        <section className="mb-14">
          <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#4C4541]/20 mb-7">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#4C4541]/60 uppercase tracking-widest">[ 02 ]</span>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold tracking-tight text-[#4C4541] uppercase">
                WORKSPACE METRICS
              </h3>
            </div>
            <span className="font-mono text-xs text-[#4C4541]/70 font-semibold uppercase tracking-widest">
              CAMPUS REAL-TIME FEED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('events')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">EVENTS</span>
                <div className="w-10 h-10 rounded-xl bg-[#4C4541] text-[#FCF0DA] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                  <Calendar size={18} />
                </div>
              </div>
              <div className="font-condensed text-4xl sm:text-5xl lg:text-6xl font-black text-[#4C4541] leading-none mb-2">
                {events.length}
              </div>
              <p className="text-xs font-semibold text-[#4C4541]/80">
                Workshops, hackathons &amp; meetups
              </p>
            </div>

            {/* Metric 2 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('registrations')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">RESERVATIONS</span>
                <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                  <BookmarkCheck size={18} />
                </div>
              </div>
              <div className="font-condensed text-4xl sm:text-5xl lg:text-6xl font-black text-[#4C4541] leading-none mb-2">
                {myRegistrations.length}
              </div>
              <p className="text-xs font-semibold text-[#4C4541]/80">
                Your confirmed campus passes
              </p>
            </div>

            {/* Metric 3 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('resources')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">MACHINERY</span>
                <div className="w-10 h-10 rounded-xl bg-[#AEAC78] text-[#4C4541] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                  <Wrench size={18} />
                </div>
              </div>
              <div className="font-condensed text-4xl sm:text-5xl lg:text-6xl font-black text-[#4C4541] leading-none mb-2">
                {resources.length}
              </div>
              <p className="text-xs font-semibold text-[#4C4541]/80">
                Machines &amp; prototyping stations
              </p>
            </div>

            {/* Metric 4 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">ROLE</span>
                <div className="w-10 h-10 rounded-xl bg-[#FCF0DA] text-[#4C4541] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                  <Award size={18} />
                </div>
              </div>
              <div className="font-condensed text-3xl sm:text-4xl lg:text-5xl font-black text-[#4C4541] leading-none mb-2 uppercase truncate">
                {userProfile?.role || (isAdmin ? 'Admin' : 'Student')}
              </div>
              <p className="text-xs font-semibold text-[#4C4541]/80">
                College of Engineering Trikaripur
              </p>
            </div>
          </div>
        </section>

        {/* Section 03: Spotlight Next Event OR Open Call */}
        <section className="mb-14">
          <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#4C4541]/20 mb-7">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#4C4541]/60 uppercase tracking-widest">[ 03 ]</span>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold tracking-tight text-[#4C4541] uppercase">
                {nextEvent ? 'NEXT UP ON CAMPUS' : 'CAMPUS EVENTS OPEN CALL'}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] text-xs font-mono font-bold uppercase shadow-[1.5px_1.5px_0_#4C4541]">
              {nextEvent ? 'FEATURED' : 'PROPOSALS OPEN'}
            </span>
          </div>

          {nextEvent ? (
            <div className="relative rounded-[28px] border-2 border-[#4C4541] bg-white p-7 sm:p-9 lg:p-11 shadow-[4px_4px_0_#4C4541] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/30 text-[#4C4541] text-xs font-mono font-bold mb-3 uppercase">
                  <Activity size={13} />
                  <span>UPCOMING WORKSHOP SESSION</span>
                </div>
                <h4 className="font-condensed text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4C4541] tracking-tight uppercase leading-[0.96]">
                  {nextEvent.title}
                </h4>
                <p className="mt-3 text-sm sm:text-base text-[#4C4541]/85 line-clamp-2 max-w-2xl font-sans leading-relaxed">
                  {nextEvent.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FCF0DA] border-2 border-[#4C4541] text-[#4C4541] text-xs font-mono font-bold shadow-[1.5px_1.5px_0_#4C4541]">
                    <MapPin size={14} />
                    <span>{nextEvent.venue || 'Makerspace Lab'}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FCF0DA] border-2 border-[#4C4541] text-[#4C4541] text-xs font-mono font-bold shadow-[1.5px_1.5px_0_#4C4541]">
                    <Clock size={14} />
                    <span>{formatDate(nextEvent.startAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] active:translate-y-0.5 active:shadow-none transition-all duration-200 cursor-pointer"
                  onClick={() => setActiveTab('events')}
                >
                  <span>View Details &amp; Register</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-[28px] border-2 border-[#4C4541] bg-white p-7 sm:p-9 lg:p-11 shadow-[4px_4px_0_#4C4541] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2C46A]/30 border border-[#4C4541]/40 text-[#4C4541] text-xs font-mono font-bold mb-3 uppercase">
                  <Lightbulb size={13} />
                  <span>COMMUNITY CALL FOR WORKSHOPS</span>
                </div>
                <h4 className="font-condensed text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4C4541] tracking-tight uppercase leading-[0.96]">
                  HAVE A PROJECT OR WORKSHOP IDEA? BRING IT TO MATTELAB.
                </h4>
                <p className="mt-3 text-sm sm:text-base text-[#4C4541]/85 max-w-2xl font-sans leading-relaxed">
                  Host a robotics sprint, 3D printing workshop, or open hackathon for your campus peers. We provide the prototyping benches, equipment, and community promotion.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] active:translate-y-0.5 active:shadow-none transition-all duration-200 cursor-pointer"
                  onClick={onOpenCreateModal}
                >
                  <PlusCircle size={16} />
                  <span>Propose Workshop</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 04: Lab Workbenches & Prototyping Facilities Showcase */}
        <section className="mb-14">
          <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#4C4541]/20 mb-7">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#4C4541]/60 uppercase tracking-widest">[ 04 ]</span>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold tracking-tight text-[#4C4541] uppercase">
                ACTIVE LAB FACILITIES &amp; WORKBENCHES
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('resources')}
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-[#4C4541] hover:text-[#F2C46A] transition-colors cursor-pointer"
            >
              <span>View All Machinery</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Facility 1 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer flex flex-col justify-between"
              onClick={() => setActiveTab('resources')}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                    <Layers size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#AEAC78]/30 border border-[#4C4541] text-[#4C4541]">
                    0.2MM FDM/SLA
                  </span>
                </div>
                <h4 className="font-condensed text-2xl font-bold uppercase text-[#4C4541] tracking-tight mb-2">
                  Rapid 3D Printing
                </h4>
                <p className="text-xs text-[#4C4541]/80 font-sans leading-relaxed">
                  Bambu Lab X1-Carbon &amp; Ender FDM print stations. Multi-color filament slicing, rapid prototype casings &amp; robotic gears.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#4C4541]/20 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#4C4541]/70">Schedule Slot</span>
                <ArrowRight size={14} className="text-[#4C4541] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Facility 2 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer flex flex-col justify-between"
              onClick={() => setActiveTab('resources')}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#AEAC78] text-[#4C4541] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                    <Cpu size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F2C46A]/30 border border-[#4C4541] text-[#4C4541]">
                    WIRELESS / IOT
                  </span>
                </div>
                <h4 className="font-condensed text-2xl font-bold uppercase text-[#4C4541] tracking-tight mb-2">
                  IoT &amp; Embedded Rigs
                </h4>
                <p className="text-xs text-[#4C4541]/80 font-sans leading-relaxed">
                  ESP32, Arduino, and Raspberry Pi workbenches. Wireless telemetry, bench power supplies, sensors &amp; logic analyzers.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#4C4541]/20 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#4C4541]/70">Explore Station</span>
                <ArrowRight size={14} className="text-[#4C4541] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Facility 3 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer flex flex-col justify-between"
              onClick={() => setActiveTab('resources')}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#4C4541] text-[#FCF0DA] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                    <Wrench size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#AEAC78]/30 border border-[#4C4541] text-[#4C4541]">
                    SMD &amp; REWORK
                  </span>
                </div>
                <h4 className="font-condensed text-2xl font-bold uppercase text-[#4C4541] tracking-tight mb-2">
                  PCB Soldering Lab
                </h4>
                <p className="text-xs text-[#4C4541]/80 font-sans leading-relaxed">
                  Precision digital soldering stations, hot air SMD rework, fume extraction, multimeters &amp; oscilloscopes for circuit repair.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#4C4541]/20 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#4C4541]/70">Reserve Bench</span>
                <ArrowRight size={14} className="text-[#4C4541] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Facility 4 */}
            <div
              className="group relative rounded-[22px] border-2 border-[#4C4541] bg-white p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer flex flex-col justify-between"
              onClick={() => setActiveTab('resources')}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FCF0DA] text-[#4C4541] flex items-center justify-center border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541]">
                    <Lightbulb size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F2C46A]/30 border border-[#4C4541] text-[#4C4541]">
                    FABLAB FLOOR
                  </span>
                </div>
                <h4 className="font-condensed text-2xl font-bold uppercase text-[#4C4541] tracking-tight mb-2">
                  Enclosure Slicing
                </h4>
                <p className="text-xs text-[#4C4541]/80 font-sans leading-relaxed">
                  Laser cutting and CNC routing for acrylic and wooden casings, mechanical framing, and campus hardware exhibition booths.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#4C4541]/20 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#4C4541]/70">View FabLab</span>
                <ArrowRight size={14} className="text-[#4C4541] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: The 3-Step Innovation Pipeline */}
        <section className="mb-14">
          <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#4C4541]/20 mb-7">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#4C4541]/60 uppercase tracking-widest">[ 05 ]</span>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold tracking-tight text-[#4C4541] uppercase">
                HOW TO BUILD AT MATTELAB
              </h3>
            </div>
            <span className="font-mono text-xs text-[#4C4541]/70 font-semibold uppercase tracking-widest">
              MAKER PIPELINE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-[24px] border-2 border-[#4C4541] bg-[#FCF0DA] p-7 shadow-[3px_3px_0_#4C4541]">
              <div className="font-mono text-xs font-black text-[#AEAC78] tracking-widest uppercase mb-2">
                STEP 01
              </div>
              <h4 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#4C4541] mb-2 leading-none">
                DISCOVER &amp; PROPOSE
              </h4>
              <p className="text-xs sm:text-sm text-[#4C4541]/85 font-sans leading-relaxed">
                Join upcoming workshops, enroll in campus hackathons, or pitch your own project workshop to our student administrator team.
              </p>
            </div>

            <div className="rounded-[24px] border-2 border-[#4C4541] bg-[#FCF0DA] p-7 shadow-[3px_3px_0_#4C4541]">
              <div className="font-mono text-xs font-black text-[#F2C46A] tracking-widest uppercase mb-2">
                STEP 02
              </div>
              <h4 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#4C4541] mb-2 leading-none">
                RESERVE BENCHES
              </h4>
              <p className="text-xs sm:text-sm text-[#4C4541]/85 font-sans leading-relaxed">
                Claim real-time time slots for 3D printers, IoT stations, or soldering irons using our interactive week calendar with live conflict prevention.
              </p>
            </div>

            <div className="rounded-[24px] border-2 border-[#4C4541] bg-[#FCF0DA] p-7 shadow-[3px_3px_0_#4C4541]">
              <div className="font-mono text-xs font-black text-[#4C4541] tracking-widest uppercase mb-2">
                STEP 03
              </div>
              <h4 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#4C4541] mb-2 leading-none">
                SOLDER &amp; SHIP
              </h4>
              <p className="text-xs sm:text-sm text-[#4C4541]/85 font-sans leading-relaxed">
                Fabricate prototypes hands-on with mentors from TinkerHub and IEDC, test firmware, and showcase your finished build to the campus community.
              </p>
            </div>
          </div>
        </section>

        {/* Section 06: Campus Innovation Partnerships & Lab Hours */}
        <section className="rounded-[24px] border-2 border-[#4C4541] bg-[#FCF0DA] p-6 sm:p-8 shadow-[3px_3px_0_#4C4541]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] flex-shrink-0">
                <Compass size={22} />
              </div>
              <div>
                <h4 className="font-condensed text-2xl sm:text-3xl font-bold text-[#4C4541] uppercase tracking-tight">
                  TinkerHub &amp; IEDC Makerspace Collaboration
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-[#4C4541]/85 leading-relaxed font-sans max-w-2xl">
                  College of Engineering Trikaripur (CETKR) makerspace facilities are open daily for verified students, hobbyists, and faculty innovators. Mentors are on deck to assist with hardware debugging and prototyping.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-white border-2 border-[#4C4541] text-xs font-mono font-bold text-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541] text-center">
                <span>HOURS: 08:30 – 20:00 IST</span>
              </div>
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="px-5 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer text-center"
              >
                Inquire Project
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

