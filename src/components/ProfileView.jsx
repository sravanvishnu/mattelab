import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Building,
  LogOut,
  CalendarCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function ProfileView({
  myRegistrationsCount = 0,
  onPromptLogout
}) {
  const { currentUser, userProfile, isOrganizer } = useAuth();

  const name = userProfile?.name || currentUser?.displayName || 'Student Maker';
  const email = userProfile?.email || currentUser?.email || 'N/A';
  const role = userProfile?.role || (isOrganizer ? 'organizer' : 'student');
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="tab-pane-fade">
      <div className="profile-container-card">
        {/* Profile Card Header */}
        <div className="profile-header-banner">
          <div className="profile-avatar-large">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={name}
                className="avatar-img-large"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <div className="profile-header-info">
            <div className="flex items-center gap-2">
              <h2 className="profile-name">{name}</h2>
              <span className={`pill-role ${role === 'organizer' ? 'org' : 'student'}`}>
                {role === 'organizer' ? 'Organizer' : 'Student'}
              </span>
            </div>
            <p className="profile-email">{email}</p>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="profile-details-grid">
          <div className="profile-data-row">
            <div className="flex items-center gap-3 text-muted">
              <User size={18} />
              <span>Full Name</span>
            </div>
            <span className="profile-val">{name}</span>
          </div>

          <div className="profile-data-row">
            <div className="flex items-center gap-3 text-muted">
              <Mail size={18} />
              <span>Registered Email</span>
            </div>
            <span className="profile-val">{email}</span>
          </div>

          <div className="profile-data-row">
            <div className="flex items-center gap-3 text-muted">
              <Shield size={18} />
              <span>System Permission</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="profile-val capitalize">{role}</span>
              {isOrganizer && (
                <span className="badge-tag open text-xs">Event Creator</span>
              )}
            </div>
          </div>

          <div className="profile-data-row">
            <div className="flex items-center gap-3 text-muted">
              <Building size={18} />
              <span>Institution</span>
            </div>
            <span className="profile-val">College Of Engineering, Trikaripur</span>
          </div>

          <div className="profile-data-row">
            <div className="flex items-center gap-3 text-muted">
              <CalendarCheck size={18} />
              <span>Active Registrations</span>
            </div>
            <span className="profile-val">{myRegistrationsCount} Events</span>
          </div>

          <div className="profile-data-row">
            <div className="flex items-center gap-3 text-muted">
              <Sparkles size={18} />
              <span>Makerspace UID</span>
            </div>
            <span className="profile-val font-mono text-xs">{currentUser?.uid || '—'}</span>
          </div>
        </div>

        {/* Profile Footer Actions */}
        <div className="profile-footer-actions">
          <button
            type="button"
            className="btn btn-danger-soft flex items-center gap-2"
            onClick={onPromptLogout}
          >
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
