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
  Wrench
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
      {/* Redesigned Architectural Hero inspired by reference design */}
      <MatteLabHero
        ctaText={isOrganizer ? "Create Workshop Event" : "Propose Workshop / Event"}
        onCtaClick={onOpenCreateModal}
        onExploreEvents={() => setActiveTab('events')}
        onExploreResources={() => setActiveTab('resources')}
        onExploreRegistrations={() => setActiveTab('registrations')}
        onSelectTab={setActiveTab}
      />

      <div className="overview-inner-body max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Section 01: Welcome Editorial Canvas */}
        <section className="relative rounded-[24px] sm:rounded-[32px] border-2 border-[#4C4541] bg-[#FCF0DA] p-6 sm:p-10 lg:p-12 shadow-[4px_4px_0_#4C4541] mb-12 overflow-hidden">
          {/* Subtle architectural vertical lines watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex justify-between">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-[1px] bg-[#4C4541] h-full" />
            ))}
          </div>

          <div className="relative z-10">
            {/* Top Eyebrow Tag & Utility Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/40 text-[#4C4541] text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles size={13} className="text-[#4C4541]" />
                <span>CET MAKERSPACE · TINKERHUB &amp; IEDC</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#4C4541]/70">
                <span className="w-2 h-2 rounded-full bg-[#AEAC78] animate-pulse" />
                <span>SYSTEM ONLINE & SYNCED</span>
              </div>
            </div>

            {/* Editorial Headline */}
            <h2 className="font-condensed text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#4C4541] uppercase leading-[0.95]">
              WELCOME BACK, <span className="font-editorial italic font-normal lowercase tracking-normal text-[#4C4541]">{userName}.</span>
            </h2>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#4C4541]/85 max-w-3xl leading-relaxed font-sans">
              MatteLab is where ideas transform into hardware and software reality. Explore upcoming workshops, register for hackathons, reserve 3D printers, and collaborate with peer innovators.
            </p>

            {/* Action Buttons Row */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] active:translate-y-0.5 active:shadow-none cursor-pointer"
                onClick={() => setActiveTab('events')}
              >
                <span>Explore Events</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#FCF0DA] hover:bg-[#F2C46A]/30 text-[#4C4541] text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] active:translate-y-0.5 active:shadow-none cursor-pointer"
                onClick={() => setActiveTab('registrations')}
              >
                <BookmarkCheck size={16} />
                <span>My Registrations ({myRegistrations.length})</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#FCF0DA] hover:bg-[#AEAC78]/30 text-[#4C4541] text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] active:translate-y-0.5 active:shadow-none cursor-pointer"
                onClick={() => setActiveTab('resources')}
              >
                <Wrench size={15} />
                <span>{isAdmin ? 'Manage Resources' : 'Machinery & Spaces'} ({resources.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 02: Live Activity & Stat Metrics */}
        <section className="mb-12">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#4C4541]/20 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4C4541]/60 uppercase tracking-widest">[ 01 ]</span>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold tracking-tight text-[#4C4541] uppercase">
                WORKSPACE METRICS
              </h3>
            </div>
            <span className="font-mono text-[11px] text-[#4C4541]/70 uppercase tracking-widest">REAL-TIME SYNC</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Metric 1 */}
            <div
              className="group relative rounded-2xl border-2 border-[#4C4541] bg-white p-5 sm:p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('events')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">EVENTS</span>
                <div className="w-9 h-9 rounded-xl bg-[#4C4541] text-[#FCF0DA] flex items-center justify-center border border-[#4C4541]">
                  <Calendar size={18} />
                </div>
              </div>
              <div className="font-condensed text-5xl sm:text-6xl font-bold text-[#4C4541] leading-none">
                {events.length}
              </div>
              <p className="mt-2 text-xs font-medium text-[#4C4541]/80">
                Workshops & meetups ready
              </p>
            </div>

            {/* Metric 2 */}
            <div
              className="group relative rounded-2xl border-2 border-[#4C4541] bg-white p-5 sm:p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('registrations')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">RESERVATIONS</span>
                <div className="w-9 h-9 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center border border-[#4C4541]">
                  <BookmarkCheck size={18} />
                </div>
              </div>
              <div className="font-condensed text-5xl sm:text-6xl font-bold text-[#4C4541] leading-none">
                {myRegistrations.length}
              </div>
              <p className="mt-2 text-xs font-medium text-[#4C4541]/80">
                Your confirmed campus passes
              </p>
            </div>

            {/* Metric 3 */}
            <div
              className="group relative rounded-2xl border-2 border-[#4C4541] bg-white p-5 sm:p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('resources')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">MACHINERY</span>
                <div className="w-9 h-9 rounded-xl bg-[#AEAC78] text-[#4C4541] flex items-center justify-center border border-[#4C4541]">
                  <Wrench size={18} />
                </div>
              </div>
              <div className="font-condensed text-5xl sm:text-6xl font-bold text-[#4C4541] leading-none">
                {resources.length}
              </div>
              <p className="mt-2 text-xs font-medium text-[#4C4541]/80">
                Machines & prototyping stations
              </p>
            </div>

            {/* Metric 4 */}
            <div
              className="group relative rounded-2xl border-2 border-[#4C4541] bg-white p-5 sm:p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[5px_5px_0_#4C4541] transition-all duration-200 cursor-pointer"
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">ROLE</span>
                <div className="w-9 h-9 rounded-xl bg-[#FCF0DA] text-[#4C4541] flex items-center justify-center border border-[#4C4541]">
                  <Award size={18} />
                </div>
              </div>
              <div className="font-condensed text-4xl sm:text-5xl font-bold text-[#4C4541] leading-none uppercase truncate">
                {userProfile?.role || (isAdmin ? 'Admin' : 'Student')}
              </div>
              <p className="mt-2 text-xs font-medium text-[#4C4541]/80">
                College of Engineering Trikaripur
              </p>
            </div>
          </div>
        </section>

        {/* Section 03: Spotlight Next Event */}
        {nextEvent && (
          <section className="mb-12">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#4C4541]/20 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#4C4541]/60 uppercase tracking-widest">[ 02 ]</span>
                <h3 className="font-condensed text-2xl sm:text-3xl font-bold tracking-tight text-[#4C4541] uppercase">
                  NEXT UP ON CAMPUS
                </h3>
              </div>
              <span className="px-3 py-0.5 rounded-full bg-[#F2C46A] border border-[#4C4541] text-[#4C4541] text-[11px] font-mono font-bold uppercase">
                FEATURED
              </span>
            </div>

            <div className="relative rounded-[24px] sm:rounded-[28px] border-2 border-[#4C4541] bg-white p-6 sm:p-8 lg:p-10 shadow-[4px_4px_0_#4C4541] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/30 text-[#4C4541] text-xs font-mono font-bold mb-3 uppercase">
                  <span>UPCOMING WORKSHOP</span>
                </div>
                <h4 className="font-condensed text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4C4541] tracking-tight uppercase leading-none">
                  {nextEvent.title}
                </h4>
                <p className="mt-3 text-sm sm:text-base text-[#4C4541]/85 line-clamp-2 max-w-2xl font-sans">
                  {nextEvent.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FCF0DA] border border-[#4C4541] text-[#4C4541] text-xs font-mono font-semibold">
                    <MapPin size={14} />
                    <span>{nextEvent.venue || 'Makerspace Lab'}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FCF0DA] border border-[#4C4541] text-[#4C4541] text-xs font-mono font-semibold">
                    <Clock size={14} />
                    <span>{formatDate(nextEvent.startAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] active:translate-y-0.5 active:shadow-none transition-all duration-200 cursor-pointer"
                  onClick={() => setActiveTab('events')}
                >
                  <span>View Details & Register</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section 04: Campus Innovation Partnerships */}
        <section className="rounded-2xl border-2 border-[#4C4541] bg-[#FCF0DA] p-6 sm:p-8 shadow-[3px_3px_0_#4C4541]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center border border-[#4C4541] flex-shrink-0">
              <Compass size={22} />
            </div>
            <div>
              <h4 className="font-condensed text-xl sm:text-2xl font-bold text-[#4C4541] uppercase tracking-tight">
                Makerspace Partnerships & Innovation Labs
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-[#4C4541]/80 leading-relaxed font-sans">
                TinkerHub and IEDC partner regularly with MatteLab to host open hackathons, project incubation labs, and mentorship sessions. Stop by the lab during open hours to discuss projects or find teammates.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
