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
    <div className="tab-pane-fade space-y-6">
      {/* Top Banner & Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>Makerspace Events & Workshops</span>
            {pendingEvents.length > 0 && isAdmin && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{pendingEvents.length} Pending Approval</span>
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hands-on prototyping sessions, engineering talks, and hardware hackathons at CET.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowGuidelinesModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert size={14} className="text-[#e08253]" />
            <span>Guidelines</span>
          </button>

          <button
            type="button"
            className="btn btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-[#c26e47] to-[#d97736] hover:from-[#b05f3b] hover:to-[#c6682b] text-white shadow-md shadow-[#c26e47]/25"
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={15} />
            <span>{isAdmin ? 'New Event' : 'Propose Event'}</span>
          </button>
        </div>
      </div>

      {/* Filter / Sub-Nav Bar */}
      <div className="events-action-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search workshops, organizers, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-chip-group overflow-x-auto pb-1">
          <button
            type="button"
            className={`filter-chip ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Events ({events.length})
          </button>

          <button
            type="button"
            className={`filter-chip ${filterMode === 'open' ? 'active' : ''}`}
            onClick={() => setFilterMode('open')}
          >
            Open for Signups
          </button>

          <button
            type="button"
            className={`filter-chip ${filterMode === 'registered' ? 'active' : ''}`}
            onClick={() => setFilterMode('registered')}
          >
            My Registered ({registeredEventIds.size})
          </button>

          {/* User's own proposals tab */}
          <button
            type="button"
            className={`filter-chip ${filterMode === 'proposals' ? 'active' : ''}`}
            onClick={() => setFilterMode('proposals')}
          >
            My Submissions ({myProposals.length})
          </button>

          {/* Admin Pending Approvals tab */}
          {isAdmin && (
            <button
              type="button"
              className={`filter-chip relative ${
                filterMode === 'approvals'
                  ? 'bg-amber-500/25 text-amber-200 border-amber-500/40 active'
                  : 'text-amber-300 hover:bg-amber-500/10'
              }`}
              onClick={() => setFilterMode('approvals')}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={14} className="text-amber-400" />
                <span>Approvals</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-200 border border-amber-500/30">
                  {pendingEvents.length}
                </span>
              </div>
            </button>
          )}
        </div>

        <div className="toolbar-right-btns">
          <button
            type="button"
            className={`btn-icon ${loading ? 'anim-spin' : ''}`}
            onClick={onRefresh}
            title="Refresh events list"
            aria-label="Refresh events"
          >
            <RotateCw size={17} />
          </button>
        </div>
      </div>

      {/* Admin Approvals Notice banner when tab is approvals */}
      {filterMode === 'approvals' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <ShieldAlert size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-100">
            <h4 className="font-bold text-amber-200 text-sm">Administrator Event Approval Queue</h4>
            <p className="mt-0.5 text-slate-300 leading-relaxed">
              Review event proposals submitted by students and makers. Verify compliance with lab safety protocols, operating hours (08:30–20:00), and workbench equipment requirements. Approving an event will immediately publish it to the campus-wide calendar.
            </p>
          </div>
        </div>
      )}

      {/* My Submissions notice banner when tab is proposals */}
      {filterMode === 'proposals' && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
          <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-100">
            <h4 className="font-bold text-blue-200 text-sm">Your Event Proposals</h4>
            <p className="mt-0.5 text-slate-300 leading-relaxed">
              Track the approval status of workshops you have submitted. While pending, admins review your proposal against the MatteLab Guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {displayedEvents.length === 0 ? (
        <div className="empty-state-card py-12 text-center bg-[#171b1f] border border-white/5 rounded-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mb-3">
            <Calendar size={28} />
          </div>
          <h3 className="text-lg font-bold text-white">
            {filterMode === 'approvals'
              ? 'No Pending Event Approvals'
              : filterMode === 'proposals'
              ? 'You have not proposed any events yet'
              : 'No events found'}
          </h3>
          <p className="text-muted text-xs max-w-md mx-auto mt-1 leading-relaxed">
            {filterMode === 'approvals'
              ? 'All student and organizer event proposals have been reviewed and published.'
              : filterMode === 'proposals'
              ? 'Have an idea for a robotics workshop, IoT build, or coding hack session? Propose an event now!'
              : searchQuery
              ? `No events matching "${searchQuery}". Try clearing search keywords.`
              : 'There are currently no upcoming events scheduled in this filter.'}
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                type="button"
                className="btn btn-secondary text-xs"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}

            {filterMode === 'proposals' && (
              <button
                type="button"
                className="btn btn-primary text-xs flex items-center gap-1.5 bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white"
                onClick={onOpenCreateModal}
              >
                <PlusCircle size={15} />
                <span>Propose First Event</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="events-grid-responsive grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className={`event-card-modern flex flex-col justify-between border ${
                  isPending
                    ? 'border-amber-500/30 bg-[#191d22]'
                    : isRejected
                    ? 'border-rose-500/30 bg-[#1c1819]'
                    : 'border-white/10 bg-[#16191d]'
                } rounded-2xl p-5 hover:border-[#c26e47]/40 transition-all`}
              >
                <div>
                  {/* Top Status & Category Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isPending ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Clock size={11} />
                          <span>Pending Approval</span>
                        </span>
                      ) : isRejected ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <X size={11} />
                          <span>Declined</span>
                        </span>
                      ) : isRegistered ? (
                        <span className="badge-tag registered flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Registered</span>
                        </span>
                      ) : isClosed ? (
                        <span className="badge-tag closed">Registration Closed</span>
                      ) : hasStarted ? (
                        <span className="badge-tag closed">In Progress</span>
                      ) : (
                        <span className="badge-tag open">Open</span>
                      )}

                      {evt.category && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                          {evt.category}
                        </span>
                      )}
                    </div>

                    {evt.capacity && (
                      <span className="capacity-badge flex items-center gap-1 text-[11px] text-slate-400">
                        <Users size={12} />
                        <span>Max {evt.capacity}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="event-card-title text-base font-bold text-white mb-1.5 line-clamp-1">
                    {evt.title}
                  </h3>
                  <p className="event-card-desc text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {evt.description}
                  </p>

                  {/* Creator info badge for approvals / admin or creator */}
                  {(filterMode === 'approvals' || isAdmin || isCreator) && (
                    <div className="p-2.5 rounded-lg bg-[#111417] border border-white/5 mb-3.5 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <User size={13} className="text-[#e08253]" />
                          <span>Host:</span>
                        </span>
                        <span className="font-semibold text-white">
                          {evt.creatorName || 'Student Maker'}
                        </span>
                      </div>
                      {evt.creatorEmail && (
                        <div className="text-slate-400 text-[10px] truncate">
                          {evt.creatorEmail}
                        </div>
                      )}
                      {evt.equipmentNeeded && (
                        <div className="flex items-center gap-1 text-amber-300 text-[10px] pt-1 border-t border-white/5">
                          <Wrench size={11} />
                          <span>Machinery: {evt.equipmentNeeded}</span>
                        </div>
                      )}
                      {evt.guidelinesAccepted && (
                        <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
                          <ShieldCheck size={11} />
                          <span>Agreed to MatteLab Guidelines</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection Note for Declined Proposals */}
                  {isRejected && evt.rejectionReason && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 mb-3 text-[11px] text-rose-200">
                      <p className="font-semibold text-rose-300">Feedback from Admin:</p>
                      <p className="mt-0.5 text-slate-300">{evt.rejectionReason}</p>
                    </div>
                  )}

                  {/* Details metadata: Location, Date, Deadline */}
                  <div className="event-card-details space-y-1.5 text-xs text-slate-300">
                    <div className="detail-item flex items-center gap-2">
                      <MapPin size={14} className="detail-icon text-[#e08253]" />
                      <span>{evt.venue || 'Makerspace Lab'}</span>
                    </div>
                    <div className="detail-item flex items-center gap-2">
                      <Calendar size={14} className="detail-icon text-[#e08253]" />
                      <span>{formatDate(evt.startAt)}</span>
                    </div>
                    <div className="detail-item deadline-item flex items-center gap-2 text-slate-400 text-[11px]">
                      <Clock size={14} className="detail-icon" />
                      <span>Closes: {formatDate(evt.registrationDeadline)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="event-card-footer mt-4 pt-3 border-t border-white/10 space-y-2">
                  {/* ADMIN APPROVAL ACTIONS FOR PENDING EVENTS */}
                  {isAdmin && isPending ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="btn w-full py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
                        onClick={() => onApproveEvent?.(evt)}
                      >
                        <Check size={14} />
                        <span>Approve & Publish</span>
                      </button>

                      <button
                        type="button"
                        className="btn w-full py-2 px-3 text-xs font-semibold rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        onClick={() => openRejectDialog(evt)}
                      >
                        <X size={14} />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : isPending && isCreator ? (
                    /* STUDENT ACTION FOR THEIR OWN PENDING EVENT */
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="italic text-[11px]">Awaiting Admin Approval</span>
                      <button
                        type="button"
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold underline"
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
                        className="btn btn-outline-accent w-full flex items-center justify-center gap-2 text-xs"
                      >
                        <span>Register Externally</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : isRegistered ? (
                      <button
                        type="button"
                        className="btn btn-danger-soft w-full text-xs"
                        onClick={() => onCancelRegistration(evt)}
                      >
                        Cancel Registration
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary w-full text-xs font-semibold bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white"
                        disabled={isClosed || hasStarted}
                        onClick={() => onRegister(evt)}
                      >
                        {isClosed ? 'Registration Closed' : hasStarted ? 'Event Started' : 'Register on MatteLab'}
                      </button>
                    )
                  ) : isRejected && isCreator ? (
                    <button
                      type="button"
                      className="btn btn-secondary w-full text-xs"
                      onClick={() => onDeleteEvent?.(evt)}
                    >
                      Dismiss Proposal
                    </button>
                  ) : null}

                  {/* Admin Delete fallback */}
                  {isAdmin && !isPending && (
                    <button
                      type="button"
                      className="w-full text-center text-[11px] text-slate-500 hover:text-rose-400 transition-colors pt-1"
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
        <div className="modal-backdrop" onClick={() => setRejectDialog({ isOpen: false, event: null, reason: '', submitting: false })}>
          <div className="modal-card max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="modal-title text-sm font-bold text-white">Decline Event Proposal</h3>
                  <p className="modal-subtitle text-xs text-slate-400">
                    "{rejectDialog.event?.title}"
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setRejectDialog({ isOpen: false, event: null, reason: '', submitting: false })}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="modal-form pt-3 space-y-4">
              <div className="form-group">
                <label htmlFor="reject-reason" className="text-xs font-semibold text-slate-300">
                  Reason for Declining (Visible to Host)
                </label>
                <textarea
                  id="reject-reason"
                  rows={3}
                  className="w-full rounded-xl bg-[#14171a] border border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  value={rejectDialog.reason}
                  onChange={e => setRejectDialog(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g. Venue capacity conflict or requires lab safety supervisor confirmation..."
                  required
                />
              </div>

              <div className="modal-actions flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  className="btn btn-secondary text-xs"
                  onClick={() => setRejectDialog({ isOpen: false, event: null, reason: '', submitting: false })}
                  disabled={rejectDialog.submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-xl"
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
        <div className="modal-backdrop" onClick={() => setShowGuidelinesModal(false)}>
          <div className="modal-card modal-card-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="modal-icon-badge primary bg-[#c26e47]/20 text-[#e08253] border border-[#c26e47]/30">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="modal-title text-base font-bold text-white">MatteLab Community Event Guidelines</h3>
                  <p className="modal-subtitle text-xs text-slate-400">
                    Standards for proposing workshops, build nights, and hackathons at CET Makerspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowGuidelinesModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {EVENT_GUIDELINES.map((rule, idx) => (
                  <div key={rule.id} className="p-3.5 rounded-xl bg-[#14171a] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      <span className="w-5 h-5 rounded-full bg-[#c26e47]/25 text-[#e08253] flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <span>{rule.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-7">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-3 text-xs text-blue-200">
                <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Anyone in our college community is empowered to propose an event! Once submitted, lab administrators will review the proposal against safety and schedule availability before approving it for the public catalog.
                </p>
              </div>
            </div>

            <div className="modal-actions p-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                className="btn btn-secondary text-xs"
                onClick={() => setShowGuidelinesModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-xs font-semibold bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white flex items-center gap-1.5"
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
