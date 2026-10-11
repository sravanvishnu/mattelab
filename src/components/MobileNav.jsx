import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookmarkCheck,
  User,
  LogOut,
  Wrench
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
    { id: 'resources', label: 'Resources', icon: Wrench },
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
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="mobile-nav-icon-wrapper">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.9} />
              {item.badge && (
                <span className="mobile-dot-badge">{item.badge}</span>
              )}
            </div>
            <span className="mobile-nav-label">{item.label}</span>
            {isActive && <span className="mobile-active-pip" aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
}
