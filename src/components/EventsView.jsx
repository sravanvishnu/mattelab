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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EventsView({
  events = [],
  registeredEventIds = new Set(),
  loading = false,
  onRefresh,
  onRegister,
  onCancelRegistration,
  onOpenCreateModal
}) {
  const { isOrganizer } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'open' | 'registered'

  const now = Date.now();

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Search matching
      const matchesSearch =
        evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const isRegistered = registeredEventIds.has(evt.id);
      const isClosed = evt.registrationDeadline && evt.registrationDeadline.toMillis() <= now;

      if (filterMode === 'registered') return isRegistered;
      if (filterMode === 'open') return !isClosed && !isRegistered;
      return true;
    });
  }, [events, searchQuery, filterMode, registeredEventIds, now]);

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
      {/* Search & Action Toolbar */}
      <div className="events-action-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search workshops, venues, topics..."
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

        <div className="filter-chip-group">
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

          {isOrganizer && (
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={onOpenCreateModal}
            >
              <PlusCircle size={16} />
              <span>New Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">
            <Calendar size={36} />
          </div>
          <h3>No events found</h3>
          <p className="text-muted text-sm max-w-md">
            {searchQuery
              ? `No events matching "${searchQuery}". Try adjusting your keywords or clearing the filter.`
              : 'There are currently no upcoming events scheduled in this category.'}
          </p>
          {searchQuery ? (
            <button
              type="button"
              className="btn btn-secondary mt-3"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          ) : isOrganizer ? (
            <button
              type="button"
              className="btn btn-primary mt-3 flex items-center gap-2"
              onClick={onOpenCreateModal}
            >
              <PlusCircle size={16} />
              <span>Create First Event</span>
            </button>
          ) : null}
        </div>
      ) : (
        <div className="events-grid-responsive">
          {filteredEvents.map(evt => {
            const isRegistered = registeredEventIds.has(evt.id);
            const isExternal = Boolean(evt.registrationUrl);
            const isClosed = evt.registrationDeadline && evt.registrationDeadline.toMillis() <= now;
            const hasStarted = evt.startAt && evt.startAt.toMillis() <= now;

            return (
              <article key={evt.id} className="event-card-modern">
                <div className="event-card-header">
                  {isRegistered ? (
                    <span className="badge-tag registered">
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

                  {evt.capacity && (
                    <span className="capacity-badge">
                      <Users size={12} />
                      <span>Max {evt.capacity}</span>
                    </span>
                  )}
                </div>

                <h3 className="event-card-title">{evt.title}</h3>
                <p className="event-card-desc">{evt.description}</p>

                <div className="event-card-details">
                  <div className="detail-item">
                    <MapPin size={15} className="detail-icon" />
                    <span>{evt.venue || 'Makerspace Lab'}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={15} className="detail-icon" />
                    <span>{formatDate(evt.startAt)}</span>
                  </div>
                  <div className="detail-item deadline-item">
                    <Clock size={15} className="detail-icon" />
                    <span>Closes: {formatDate(evt.registrationDeadline)}</span>
                  </div>
                </div>

                <div className="event-card-footer">
                  {isExternal ? (
                    <a
                      href={evt.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-accent w-full flex items-center justify-center gap-2"
                    >
                      <span>Register Externally</span>
                      <ExternalLink size={15} />
                    </a>
                  ) : isRegistered ? (
                    <button
                      type="button"
                      className="btn btn-danger-soft w-full"
                      onClick={() => onCancelRegistration(evt)}
                    >
                      Cancel Registration
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary w-full"
                      disabled={isClosed || hasStarted}
                      onClick={() => onRegister(evt)}
                    >
                      {isClosed ? 'Registration Closed' : hasStarted ? 'Event Started' : 'Register on MatteLab'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
