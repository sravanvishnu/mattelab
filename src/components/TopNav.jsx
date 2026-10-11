import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, ShieldCheck } from 'lucide-react';

const TAB_TITLES = {
  overview: {
    title: 'Workspace Overview',
    subtitle: 'Your space to learn, build, innovate and create.'
  },
  events: {
    title: 'Upcoming Events & Workshops',
    subtitle: 'Explore hands-on makerspace sessions, bootcamps and talks.'
  },
  registrations: {
    title: 'My Registrations',
    subtitle: 'Workshops and activities you have reserved a spot for.'
  },
  profile: {
    title: 'My Profile',
    subtitle: 'Manage your college maker credentials and activity.'
  }
};

export default function TopNav({ activeTab, onOpenCreateModal }) {
  const { currentUser, userProfile, isOrganizer } = useAuth();
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.overview;

  const displayName = userProfile?.name || currentUser?.displayName || 'Student Maker';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="app-topbar">
      <div className="topbar-content">
        <div className="topbar-headings">
          <h1 className="topbar-title">{currentTabInfo.title}</h1>
          <p className="topbar-subtitle">{currentTabInfo.subtitle}</p>
        </div>

        <div className="topbar-actions">
          {isOrganizer && (
            <button
              type="button"
              className="btn btn-primary topbar-create-btn"
              onClick={onOpenCreateModal}
            >
              <PlusCircle size={16} />
              <span>Create Event</span>
            </button>
          )}

          <div className="topbar-user-badge">
            <div className="user-avatar" title={displayName}>
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="user-avatar-img"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div className="user-meta-text">
              <span className="user-name-snippet">{displayName}</span>
              <span className="user-role-snippet">
                {isOrganizer ? 'Organizer' : 'Student'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
