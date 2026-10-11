import React from 'react';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

/**
 * TopNav delegates to the master Header component with all the rich sidebar contents:
 * - Brand: MATTELAB (with horizontal center cut)
 * - Navigation pill: OVERVIEW, EVENTS, REGISTRATIONS (with counter badge), RESOURCES (with Admin highlight), PROFILE
 * - Right: Organizer status badge, User profile avatar, Blue pill CTA (Create Event for organizer, Sign Out for members)
 */
export default function TopNav({
  activeTab,
  onOpenCreateModal,
  onSelectTab,
  onPromptLogout,
  registeredCount = 0,
  pendingCount = 0
}) {
  const { currentUser, userProfile, isOrganizer, isAdmin } = useAuth();

  const navItems = [
    { id: 'overview', label: 'OVERVIEW' },
    {
      id: 'events',
      label: 'EVENTS',
      badge: isAdmin && pendingCount > 0 ? pendingCount : null
    },
    {
      id: 'registrations',
      label: 'REGISTRATIONS',
      badge: registeredCount > 0 ? registeredCount : null
    },
    {
      id: 'resources',
      label: isAdmin ? 'MANAGE RESOURCES' : 'RESOURCES',
      highlight: isAdmin
    },
    { id: 'profile', label: 'PROFILE' }
  ];

  return (
    <Header
      brand="MATTELAB"
      subtitle="CET Makerspace"
      items={navItems}
      activeItem={activeTab}
      onSelect={onSelectTab}
      user={currentUser ? { ...currentUser, ...userProfile } : null}
      isOrganizer={isOrganizer}
      isAdmin={isAdmin}
      ctaText={isAdmin ? "Create Event" : "Propose Event"}
      onCtaClick={onOpenCreateModal}
      isOverlay={true}
    />
  );
}
