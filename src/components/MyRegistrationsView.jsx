import React from 'react';
import {
  BookmarkCheck,
  Calendar,
  MapPin,
  Clock,
  RotateCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function MyRegistrationsView({
  myRegistrations = [],
  loading = false,
  onRefresh,
  onCancelRegistration,
  onExploreEvents
}) {
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
      <div className="section-toolbar-row">
        <div>
          <h2 className="section-heading-lg">My Reserved Sessions</h2>
          <p className="text-muted text-sm">
            Workshops and events you are confirmed to attend.
          </p>
        </div>

        <button
          type="button"
          className={`btn-icon ${loading ? 'anim-spin' : ''}`}
          onClick={onRefresh}
          title="Refresh registrations"
          aria-label="Refresh registrations"
        >
          <RotateCw size={17} />
        </button>
      </div>

      {myRegistrations.length === 0 ? (
        <div className="empty-state-card mt-4">
          <div className="empty-state-icon">
            <BookmarkCheck size={36} />
          </div>
          <h3>No Active Registrations</h3>
          <p className="text-muted text-sm max-w-md">
            You haven't signed up for any upcoming workshops yet. Explore the campus events catalog to reserve your spot!
          </p>
          <button
            type="button"
            className="btn btn-primary mt-4 flex items-center gap-2"
            onClick={onExploreEvents}
          >
            <span>Explore Events</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="events-grid-responsive mt-4">
          {myRegistrations.map(evt => (
            <article key={evt.id} className="event-card-modern registered-card">
              <div className="event-card-header">
                <span className="badge-tag registered">
                  <ShieldCheck size={13} />
                  <span>Spot Confirmed</span>
                </span>
                <span className="text-muted text-xs">
                  ID: #{evt.id.substring(0, 6)}
                </span>
              </div>

              <h3 className="event-card-title">{evt.title}</h3>
              <p className="event-card-desc">{evt.description}</p>

              <div className="event-card-details">
                <div className="detail-item">
                  <MapPin size={15} className="detail-icon" />
                  <span>{evt.venue || 'College Makerspace'}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={15} className="detail-icon" />
                  <span>{formatDate(evt.startAt)}</span>
                </div>
              </div>

              <div className="event-card-footer">
                {evt.registrationUrl ? (
                  <a
                    href={evt.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-accent w-full flex items-center justify-center gap-2"
                  >
                    <span>Open External Link</span>
                    <ExternalLink size={15} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger-soft w-full"
                    onClick={() => onCancelRegistration(evt)}
                  >
                    Cancel Registration
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
