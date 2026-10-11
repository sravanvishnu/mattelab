import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  RotateCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  FileText,
  User,
  Wrench,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EVENT_GUIDELINES } from '../services/events';

export default function EventsView({
  events = [],
  pendingEvents = [],
  myProposals = [],
  registeredEventIds = new Set(),
  loading = false,
  onRefresh,
  onRegister,
  onCancelRegistration,
  onOpenCreateModal,
  onApproveEvent,
  onRejectEvent,
  onDeleteEvent
}) {
  const { currentUser, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'open' | 'registered' | 'proposals' | 'approvals'
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  // Reject modal state
  const [rejectDialog, setRejectDialog] = useState({
    isOpen: false,
    event: null,
    reason: '',
    submitting: false
  });

  const now = Date.now();

  // Active items based on filterMode
  const displayedEvents = useMemo(() => {
    let list = [];
    if (filterMode === 'approvals') {
      list = pendingEvents;
    } else if (filterMode === 'proposals') {
      list = myProposals;
    } else {
      list = events;
    }

    return list.filter(evt => {
      // Search matching
      const matchesSearch =
        evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.creatorName?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterMode === 'registered') {
        return registeredEventIds.has(evt.id);
      }
      if (filterMode === 'open') {
        const isClosed = evt.registrationDeadline && evt.registrationDeadline.toMillis() <= now;
        const isRegistered = registeredEventIds.has(evt.id);
        return !isClosed && !isRegistered;
      }

      return true;
    });
  }, [filterMode, events, pendingEvents, myProposals, searchQuery, registeredEventIds, now]);

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

  const openRejectDialog = (eventItem) => {
    setRejectDialog({
      isOpen: true,
      event: eventItem,
      reason: 'Proposal schedule conflicts or requires additional safety supervisor review.',
      submitting: false
    });
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectDialog.event) return;
    setRejectDialog(prev => ({ ...prev, submitting: true }));
    try {
      await onRejectEvent?.(rejectDialog.event, rejectDialog.reason);
      setRejectDialog({ isOpen: false, event: null, reason: '', submitting: false });
    } catch (err) {
      setRejectDialog(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="tab-pane-fade space-y-8">
      {/* Top Banner & Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-[#4C4541]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/30 text-[#4C4541] text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <span>[ 02 / CALENDAR ] · CAMPUS LABS</span>
          </div>
          <h2 className="font-condensed text-3xl sm:text-5xl font-bold tracking-tight text-[#4C4541] uppercase flex flex-wrap items-center gap-3">
            <span>Makerspace Events & Workshops</span>
            {pendingEvents.length > 0 && isAdmin && (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#F2C46A] text-[#4C4541] border border-[#4C4541] flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#4C4541]">
                <AlertCircle size={12} />
                <span>{pendingEvents.length} Pending Approval</span>
              </span>
            )}
          </h2>
          <p className="font-editorial italic text-sm sm:text-base text-[#4C4541]/80 mt-1 max-w-2xl font-normal">
            Hands-on prototyping sessions, engineering talks, and hardware hackathons at CET.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowGuidelinesModal(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FCF0DA] hover:bg-[#F2C46A]/30 text-[#4C4541] text-xs font-bold font-mono uppercase border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
          >
            <ShieldAlert size={14} className="text-[#4C4541]" />
            <span>Guidelines</span>
          </button>

          <button
            type="button"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all active:translate-y-0.5 active:shadow-none cursor-pointer"
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={15} />
            <span>{isAdmin ? 'New Event' : 'Propose Event'}</span>
          </button>
        </div>
      </div>

      {/* Filter / Sub-Nav Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input with brutalist frame */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2.5 rounded-full bg-white border-2 border-[#4C4541] text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/50 font-medium shadow-[2px_2px_0_#4C4541] focus:outline-none focus:bg-[#FCF0DA] transition-colors"
            placeholder="Search workshops, hosts, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#4C4541]/70 hover:text-[#4C4541]"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter chips container with horizontal touch-scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            type="button"
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-mono uppercase border-2 border-[#4C4541] transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${
              filterMode === 'all'
                ? 'bg-[#4C4541] text-[#FCF0DA]'
                : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
            }`}
            onClick={() => setFilterMode('all')}
          >
            All ({events.length})
          </button>

          <button
            type="button"
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-mono uppercase border-2 border-[#4C4541] transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${
              filterMode === 'open'
                ? 'bg-[#4C4541] text-[#FCF0DA]'
                : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
            }`}
            onClick={() => setFilterMode('open')}
          >
            Open for Signups
          </button>

          <button
            type="button"
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-mono uppercase border-2 border-[#4C4541] transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${
              filterMode === 'registered'
                ? 'bg-[#4C4541] text-[#FCF0DA]'
                : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
            }`}
            onClick={() => setFilterMode('registered')}
          >
            Registered ({registeredEventIds.size})
          </button>

          <button
            type="button"
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-mono uppercase border-2 border-[#4C4541] transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${
              filterMode === 'proposals'
                ? 'bg-[#4C4541] text-[#FCF0DA]'
                : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
            }`}
            onClick={() => setFilterMode('proposals')}
          >
            Submissions ({myProposals.length})
          </button>

          {isAdmin && (
            <button
              type="button"
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-mono uppercase border-2 border-[#4C4541] transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${
                filterMode === 'approvals'
                  ? 'bg-[#F2C46A] text-[#4C4541]'
                  : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
              }`}
              onClick={() => setFilterMode('approvals')}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} />
                <span>Approvals</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#4C4541] text-[#FCF0DA]">
                  {pendingEvents.length}
                </span>
              </div>
            </button>
          )}

          <button
            type="button"
            className={`p-2.5 rounded-full border-2 border-[#4C4541] bg-white text-[#4C4541] hover:bg-[#F2C46A]/30 shadow-[1.5px_1.5px_0_#4C4541] transition-all cursor-pointer ${
              loading ? 'animate-spin' : ''
            }`}
            onClick={onRefresh}
            title="Refresh events list"
            aria-label="Refresh events"
          >
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* Admin Approvals Queue Info Banner */}
      {filterMode === 'approvals' && (
        <div className="p-5 rounded-2xl bg-[#F2C46A]/25 border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] flex items-start gap-3">
          <ShieldAlert size={20} className="text-[#4C4541] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#4C4541]">
            <h4 className="font-bold text-sm uppercase font-mono tracking-wider">Administrator Approval Queue</h4>
            <p className="mt-1 leading-relaxed font-sans text-[#4C4541]/85">
              Review event proposals submitted by students and makers. Verify compliance with lab safety protocols, operating hours (08:30–20:00), and workbench equipment requirements. Approving an event will immediately publish it to the campus-wide calendar.
            </p>
          </div>
        </div>
      )}

      {/* My Submissions Info Banner */}
      {filterMode === 'proposals' && (
        <div className="p-5 rounded-2xl bg-[#AEAC78]/25 border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] flex items-start gap-3">
          <Info size={20} className="text-[#4C4541] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#4C4541]">
            <h4 className="font-bold text-sm uppercase font-mono tracking-wider">Your Event Proposals</h4>
            <p className="mt-1 leading-relaxed font-sans text-[#4C4541]/85">
              Track the approval status of workshops you have submitted. While pending, admins review your proposal against the MatteLab Guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {displayedEvents.length === 0 ? (
        <div className="rounded-[24px] border-2 border-[#4C4541] bg-white p-12 text-center shadow-[4px_4px_0_#4C4541]">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FCF0DA] border-2 border-[#4C4541] flex items-center justify-center text-[#4C4541] mb-4 shadow-[2px_2px_0_#4C4541]">
            <Calendar size={26} />
          </div>
          <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#4C4541]">
            {filterMode === 'approvals'
              ? 'No Pending Event Approvals'
              : filterMode === 'proposals'
              ? 'You have not proposed any events yet'
              : 'No events found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#4C4541]/80 max-w-md mx-auto mt-2 leading-relaxed font-sans">
            {filterMode === 'approvals'
              ? 'All student and organizer event proposals have been reviewed and published.'
              : filterMode === 'proposals'
              ? 'Have an idea for a robotics workshop, IoT build, or coding hack session? Propose an event now!'
              : searchQuery
              ? `No events matching "${searchQuery}". Try clearing search keywords.`
              : 'There are currently no upcoming events scheduled in this filter.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {searchQuery && (
              <button
                type="button"
                className="px-5 py-2.5 rounded-full bg-[#FCF0DA] hover:bg-[#F2C46A]/30 text-[#4C4541] border-2 border-[#4C4541] text-xs font-bold font-mono uppercase shadow-[2px_2px_0_#4C4541] cursor-pointer"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}

            {filterMode === 'proposals' && (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] cursor-pointer"
                onClick={onOpenCreateModal}
              >
                <PlusCircle size={15} />
                <span>Propose First Event</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map(evt => {
            const isRegistered = registeredEventIds.has(evt.id);
            const isExternal = Boolean(evt.registrationUrl);
            const isClosed = evt.registrationDeadline && evt.registrationDeadline.toMillis() <= now;
            const hasStarted = evt.startAt && evt.startAt.toMillis() <= now;
            const isPending = evt.status === 'pending';
            const isRejected = evt.status === 'rejected';
            const isPublished = evt.status === 'published';
            const isCreator = currentUser && evt.createdBy === currentUser.uid;

            return (
              <article
                key={evt.id}
                className="group relative flex flex-col justify-between rounded-[22px] border-2 border-[#4C4541] bg-white p-5 sm:p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[6px_6px_0_#4C4541] transition-all duration-200"
              >
                <div>
                  {/* Top Status & Category Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isPending ? (
                        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#F2C46A] text-[#4C4541] border border-[#4C4541] flex items-center gap-1">
                          <Clock size={11} />
                          <span>Pending Approval</span>
                        </span>
                      ) : isRejected ? (
                        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-[#4C4541] flex items-center gap-1">
                          <X size={11} />
                          <span>Declined</span>
                        </span>
                      ) : isRegistered ? (
                        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#AEAC78] text-[#4C4541] border border-[#4C4541] flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Registered</span>
                        </span>
                      ) : isClosed ? (
                        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-[#4C4541]">
                          Registration Closed
                        </span>
                      ) : hasStarted ? (
                        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-[#4C4541]">
                          In Progress
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#FCF0DA] text-[#4C4541] border border-[#4C4541]">
                          Open
                        </span>
                      )}

                      {evt.category && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-[#4C4541]/80 border border-[#4C4541]/30">
                          {evt.category}
                        </span>
                      )}
                    </div>

                    {evt.capacity && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#4C4541]/70">
                        <Users size={12} />
                        <span>Max {evt.capacity}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#4C4541] mb-2 line-clamp-1 leading-none">
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4C4541]/80 line-clamp-2 leading-relaxed mb-4 font-sans">
                    {evt.description}
                  </p>

                  {/* Host info badge for approvals / admin or creator */}
                  {(filterMode === 'approvals' || isAdmin || isCreator) && (
                    <div className="p-3 rounded-xl bg-[#FCF0DA] border border-[#4C4541]/30 mb-4 text-[11px] space-y-1 font-mono">
                      <div className="flex items-center justify-between text-[#4C4541]">
                        <span className="flex items-center gap-1.5 text-[#4C4541]/70">
                          <User size={13} />
                          <span>Host:</span>
                        </span>
                        <span className="font-bold text-[#4C4541]">
                          {evt.creatorName || 'Student Maker'}
                        </span>
                      </div>
                      {evt.creatorEmail && (
                        <div className="text-[#4C4541]/60 text-[10px] truncate">
                          {evt.creatorEmail}
                        </div>
                      )}
                      {evt.equipmentNeeded && (
                        <div className="flex items-center gap-1 text-[#4C4541] text-[10px] pt-1 border-t border-[#4C4541]/20">
                          <Wrench size={11} />
                          <span>Machinery: {evt.equipmentNeeded}</span>
                        </div>
                      )}
                      {evt.guidelinesAccepted && (
                        <div className="flex items-center gap-1 text-[#AEAC78] font-bold text-[10px]">
                          <ShieldCheck size={11} />
                          <span>Agreed to MatteLab Guidelines</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection Note for Declined Proposals */}
                  {isRejected && evt.rejectionReason && (
                    <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 mb-4 text-[11px] text-rose-900">
                      <p className="font-bold font-mono">Feedback from Admin:</p>
                      <p className="mt-0.5 text-rose-800 font-sans">{evt.rejectionReason}</p>
                    </div>
                  )}

                  {/* Details metadata: Location, Date, Deadline */}
                  <div className="space-y-1.5 text-xs text-[#4C4541] font-mono">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#4C4541]/70 flex-shrink-0" />
                      <span className="truncate">{evt.venue || 'Makerspace Lab'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#4C4541]/70 flex-shrink-0" />
                      <span>{formatDate(evt.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4C4541]/60 text-[11px]">
                      <Clock size={13} className="flex-shrink-0" />
                      <span>Closes: {formatDate(evt.registrationDeadline)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3.5 border-t-2 border-[#4C4541]/15 space-y-2">
                  {/* ADMIN APPROVAL ACTIONS FOR PENDING EVENTS */}
                  {isAdmin && isPending ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="w-full py-2.5 px-3 text-xs font-bold font-mono uppercase rounded-full bg-[#AEAC78] hover:bg-[#AEAC78]/80 text-[#4C4541] border border-[#4C4541] flex items-center justify-center gap-1.5 shadow-[1.5px_1.5px_0_#4C4541] transition-all cursor-pointer"
                        onClick={() => onApproveEvent?.(evt)}
                      >
                        <Check size={14} />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        className="w-full py-2.5 px-3 text-xs font-bold font-mono uppercase rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 border border-[#4C4541] flex items-center justify-center gap-1.5 shadow-[1.5px_1.5px_0_#4C4541] transition-all cursor-pointer"
                        onClick={() => openRejectDialog(evt)}
                      >
                        <X size={14} />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : isPending && isCreator ? (
                    /* STUDENT ACTION FOR THEIR OWN PENDING EVENT */
                    <div className="flex items-center justify-between text-xs text-[#4C4541]/70 font-mono">
                      <span className="italic text-[11px]">Awaiting Admin Approval</span>
                      <button
                        type="button"
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold underline cursor-pointer"
                        onClick={() => onDeleteEvent?.(evt)}
                      >
                        Withdraw
                      </button>
                    </div>
                  ) : isPublished ? (
                    /* STANDARD PUBLISHED ACTIONS */
                    isExternal ? (
                      <a
                        href={evt.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FCF0DA] hover:bg-[#F2C46A] text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
                      >
                        <span>Register Externally</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : isRegistered ? (
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
                        onClick={() => onCancelRegistration(evt)}
                      >
                        Cancel Registration
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] disabled:opacity-50 disabled:cursor-not-allowed text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        disabled={isClosed || hasStarted}
                        onClick={() => onRegister(evt)}
                      >
                        {isClosed ? 'Registration Closed' : hasStarted ? 'Event Started' : 'Register on MatteLab'}
                      </button>
                    )
                  ) : isRejected && isCreator ? (
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase border border-[#4C4541] cursor-pointer"
                      onClick={() => onDeleteEvent?.(evt)}
                    >
                      Dismiss Proposal
                    </button>
                  ) : null}

                  {/* Admin Delete fallback */}
                  {isAdmin && !isPending && (
                    <button
                      type="button"
                      className="w-full text-center text-[11px] font-mono text-[#4C4541]/60 hover:text-rose-700 transition-colors pt-1 cursor-pointer"
                      onClick={() => onDeleteEvent?.(evt)}
                    >
                      Delete Event Record
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* REJECT PROPOSAL DIALOG */}
      {rejectDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setRejectDialog({ isOpen: false, event: null, reason: '', submitting: false })}>
          <div className="max-w-md w-full rounded-[24px] border-2 border-[#4C4541] bg-[#FCF0DA] p-6 shadow-[6px_6px_0_#4C4541] text-[#4C4541]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#4C4541]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-800 border border-[#4C4541] flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="font-condensed text-xl font-bold uppercase">Decline Event Proposal</h3>
                  <p className="font-mono text-xs text-[#4C4541]/70 truncate max-w-[240px]">
                    "{rejectDialog.event?.title}"
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="w-7 h-7 rounded-full border border-[#4C4541] flex items-center justify-center text-sm font-bold hover:bg-[#F2C46A]"
                onClick={() => setRejectDialog({ isOpen: false, event: null, reason: '', submitting: false })}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="pt-4 space-y-4">
              <div>
                <label htmlFor="reject-reason" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1.5">
                  Reason for Declining (Visible to Host)
                </label>
                <textarea
                  id="reject-reason"
                  rows={3}
                  className="w-full rounded-2xl bg-white border-2 border-[#4C4541] p-3 text-xs text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none"
                  value={rejectDialog.reason}
                  onChange={e => setRejectDialog(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g. Schedule conflicts or requires lab safety supervisor confirmation..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-[#4C4541]/20">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full border-2 border-[#4C4541] bg-white text-xs font-bold font-mono uppercase shadow-[1.5px_1.5px_0_#4C4541]"
                  onClick={() => setRejectDialog({ isOpen: false, event: null, reason: '', submitting: false })}
                  disabled={rejectDialog.submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541]"
                  disabled={rejectDialog.submitting}
                >
                  {rejectDialog.submitting ? 'Declining...' : 'Confirm Decline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GUIDELINES INFO MODAL */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowGuidelinesModal(false)}>
          <div className="max-w-2xl w-full rounded-[28px] border-2 border-[#4C4541] bg-[#FCF0DA] p-6 sm:p-8 shadow-[8px_8px_0_#4C4541] text-[#4C4541]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#4C4541]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] flex items-center justify-center shadow-[1.5px_1.5px_0_#4C4541]">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase leading-none">MatteLab Community Guidelines</h3>
                  <p className="font-mono text-xs text-[#4C4541]/70 mt-0.5">
                    Standards for proposing workshops, build nights, and hackathons at CET Makerspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full border-2 border-[#4C4541] bg-white flex items-center justify-center text-base font-bold hover:bg-[#F2C46A]"
                onClick={() => setShowGuidelinesModal(false)}
              >
                ×
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {EVENT_GUIDELINES.map((rule, idx) => (
                  <div key={rule.id} className="p-4 rounded-2xl bg-white border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] space-y-1.5">
                    <div className="flex items-center gap-2 font-bold font-mono text-xs uppercase text-[#4C4541]">
                      <span className="w-5 h-5 rounded-full bg-[#F2C46A] border border-[#4C4541] text-[#4C4541] flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{rule.title}</span>
                    </div>
                    <p className="text-xs text-[#4C4541]/80 leading-relaxed pl-7 font-sans">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#AEAC78]/25 border-2 border-[#4C4541] flex items-start gap-3 text-xs text-[#4C4541]">
                <Info size={18} className="text-[#4C4541] flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">
                  Anyone in our college community is empowered to propose an event! Once submitted, lab administrators will review the proposal against safety and schedule availability before approving it for the public catalog.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#4C4541]/20 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full border-2 border-[#4C4541] bg-white text-xs font-bold font-mono uppercase shadow-[1.5px_1.5px_0_#4C4541] cursor-pointer"
                onClick={() => setShowGuidelinesModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] cursor-pointer"
                onClick={() => {
                  setShowGuidelinesModal(false);
                  onOpenCreateModal();
                }}
              >
                <PlusCircle size={15} />
                <span>Propose an Event Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
