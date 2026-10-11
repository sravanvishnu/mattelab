import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookmarkCheck,
  User,
  LogOut,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onPromptLogout,
  registeredCount = 0
}) {
  const { isOrganizer, isAdmin, userProfile } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Explore Events', icon: Calendar },
    {
      id: 'registrations',
      label: 'My Registrations',
      icon: BookmarkCheck,
      badge: registeredCount > 0 ? registeredCount : null
    },
    {
      id: 'resources',
      label: isAdmin ? 'Manage Resources' : 'Lab Resources',
      icon: Wrench,
      highlight: isAdmin
    },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="bg-[#fbf9f5] rounded-xl px-2.5 py-1 border border-[#c26e47]/30 shadow-xs flex items-center justify-center">
          <img src="/logo.png" alt="MatteLab" className="h-7 w-auto object-contain" />
        </div>
        <div className="brand-text">
          <h2>MatteLab</h2>
          <p>College Of Engineering Trikaripur</p>
        </div>
      </div>

      <div className="sidebar-action-box">
        <button
          type="button"
          className="btn btn-create-event"
          onClick={onOpenCreateModal}
        >
          <PlusCircle size={17} />
          <span>{isOrganizer ? "Create Event" : "Propose Event"}</span>
        </button>
      </div>

      <div className="nav-group">
        <p className="nav-group-title">WORKSPACE</p>
        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={19} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-pill-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        {isOrganizer && (
          <div className="organizer-badge-card">
            <ShieldCheck size={16} className="text-accent" />
            <div>
              <p className="org-title">Organizer Access</p>
              <p className="org-sub">Event Publishing Active</p>
            </div>
          </div>
        )}

        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={onPromptLogout}
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>

        <div className="sidebar-credits">
          <p>MatteLab · TinkerHub · IEDC</p>
        </div>
      </div>
    </aside>
  );
}
