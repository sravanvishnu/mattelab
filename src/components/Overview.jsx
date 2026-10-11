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

import HeroSection from './HeroSection';
import GoonsHero from './GoonsHero';

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
      {/* Recovered Goons 3D Geometric Hero matching the user reference screenshot */}
      <GoonsHero
        ctaText={isOrganizer ? "Create Workshop Event" : "Propose Workshop / Event"}
        onCtaClick={onOpenCreateModal}
        onExploreEvents={() => setActiveTab('events')}
        onExploreResources={() => setActiveTab('resources')}
      />

      <div className="overview-inner-body max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <section className="welcome-banner">
          <div className="welcome-content">
            <div className="eyebrow-chip">
              <Sparkles size={13} className="text-accent" />
              <span>COLLEGE MAKERSPACE & INNOVATION</span>
            </div>
            <h2 className="welcome-title">Welcome back, {userName}.</h2>
          <p className="welcome-desc">
            MatteLab is where ideas transform into hardware and software reality. Explore upcoming workshops, register for hackathons, and collaborate with peer innovators.
          </p>
          <div className="welcome-actions">
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={() => setActiveTab('events')}
            >
              <span>Explore Events</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="btn btn-glass flex items-center gap-2"
              onClick={() => setActiveTab('registrations')}
            >
              <span>My Registrations ({myRegistrations.length})</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => setActiveTab('resources')}
            >
              <Wrench size={15} />
              <span>{isAdmin ? 'Manage Resources' : 'Lab Machinery & Spaces'} ({resources.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Activity & Stat Metrics */}
      <section className="section-block">
        <div className="section-header-compact">
          <h3 className="section-title-sm">Live Activity Metrics</h3>
          <span className="text-muted text-xs">Real-time workspace sync</span>
        </div>

        <div className="stats-metric-grid">
          <div className="stat-metric-card" onClick={() => setActiveTab('events')}>
            <div className="stat-card-icon-wrap primary">
              <Calendar size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Upcoming Events</span>
              <h3 className="stat-card-number">{events.length}</h3>
              <p className="stat-card-sub">Workshops & meetups ready</p>
            </div>
          </div>

          <div className="stat-metric-card" onClick={() => setActiveTab('registrations')}>
            <div className="stat-card-icon-wrap accent">
              <BookmarkCheck size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">My Registrations</span>
              <h3 className="stat-card-number">{myRegistrations.length}</h3>
              <p className="stat-card-sub">Reserved spots on campus</p>
            </div>
          </div>

          <div className="stat-metric-card" onClick={() => setActiveTab('resources')}>
            <div className="stat-card-icon-wrap primary">
              <Wrench size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Makerspace Resources</span>
              <h3 className="stat-card-number">{resources.length}</h3>
              <p className="stat-card-sub">Machines & lab stations</p>
            </div>
          </div>

          <div className="stat-metric-card" onClick={() => setActiveTab('profile')}>
            <div className="stat-card-icon-wrap warning">
              <Award size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Maker Role</span>
              <h3 className="stat-card-number capitalize">{userProfile?.role || (isAdmin ? 'Admin' : 'Student')}</h3>
              <p className="stat-card-sub">College of Engineering Trikaripur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Next Event */}
      {nextEvent && (
        <section className="section-block">
          <div className="section-header-compact">
            <h3 className="section-title-sm">Next Up on Campus</h3>
            <span className="badge-pill-live">Featured</span>
          </div>

          <div className="spotlight-card">
            <div className="spotlight-body">
              <span className="status-tag live">Upcoming Soon</span>
              <h3 className="spotlight-title">{nextEvent.title}</h3>
              <p className="spotlight-desc">{nextEvent.description}</p>

              <div className="event-meta-row">
                <div className="meta-pill">
                  <MapPin size={15} />
                  <span>{nextEvent.venue || 'Makerspace Lab'}</span>
                </div>
                <div className="meta-pill">
                  <Clock size={15} />
                  <span>{formatDate(nextEvent.startAt)}</span>
                </div>
              </div>
            </div>

            <div className="spotlight-action">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveTab('events')}
              >
                View Event Details →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Launch Panel */}
      <section className="panel-card mt-6">
        <div className="panel-header">
          <Compass size={20} className="text-accent" />
          <div>
            <h4>Get Involved in Makerspace Initiatives</h4>
            <p className="text-muted text-sm">
              TinkerHub and IEDC partner regularly with MatteLab to host open hackathons, project incubation labs, and mentorship sessions.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
  );
}
