import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookmarkCheck,
  User,
  LogOut
} from 'lucide-react';

export default function MobileNav({
  activeTab,
  setActiveTab,
  onPromptLogout,
  registeredCount = 0
}) {
  const navItems = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    {
      id: 'registrations',
      label: 'My Events',
      icon: BookmarkCheck,
      badge: registeredCount > 0 ? registeredCount : null
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="mobile-nav-icon-wrapper">
              <Icon size={20} />
              {item.badge && (
                <span className="mobile-dot-badge">{item.badge}</span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        className="mobile-nav-btn logout-btn"
        onClick={onPromptLogout}
        aria-label="Sign Out"
      >
        <div className="mobile-nav-icon-wrapper">
          <LogOut size={20} />
        </div>
        <span>Sign Out</span>
      </button>
    </nav>
  );
}
