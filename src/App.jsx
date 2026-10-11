import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

import LoginView from './components/LoginView';
import TopNav from './components/TopNav';
import MobileNav from './components/MobileNav';
import Overview from './components/Overview';
import EventsView from './components/EventsView';
import MyRegistrationsView from './components/MyRegistrationsView';
import ProfileView from './components/ProfileView';
import CreateEventModal from './components/CreateEventModal';
import ConfirmModal from './components/ConfirmModal';
import AdminResourcesView from './components/AdminResourcesView';
import { getResources } from './services/resources';
import { fetchAllEvents, approveEvent, rejectEvent, deleteEvent } from './services/events';
import Mascot from './components/mascot/Mascot';
import personImg from './assets/mascot.png';
import Footer from './components/Footer';

export default function App() {
  const { currentUser, isAdmin, loading: authLoading, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [resources, setResources] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDanger: false,
    isLoading: false,
    onConfirm: () => { }
  });

  const loadResources = useCallback(async () => {
    if (!currentUser) return;
    setResourcesLoading(true);
    try {
      const data = await getResources();
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setResourcesLoading(false);
    }
  }, [currentUser]);

  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setDataLoading(true);

    try {
      const data = await fetchAllEvents(currentUser, isAdmin);
      setEvents(data.published);
      setPendingEvents(data.pending);
      setMyProposals(data.myProposals);
      setRegisteredEventIds(data.registeredEventIds);
    } catch (err) {
      console.error('Failed to load events:', err);
      showToast('Could not load events from database.', 'error');
    } finally {
      setDataLoading(false);
    }
  }, [currentUser, isAdmin, showToast]);

  useEffect(() => {
    if (currentUser) {
      loadData();
      loadResources();
    } else {
      setEvents([]);
      setPendingEvents([]);
      setMyProposals([]);
      setRegisteredEventIds(new Set());
      setResources([]);
    }
  }, [currentUser, loadData, loadResources]);

  // Register for internal event
  const handleRegister = async (eventItem) => {
    if (!currentUser) {
      showToast('Please sign in to register.', 'error');
      return;
    }

    try {
      const regRef = doc(db, 'events', eventItem.id, 'registrations', currentUser.uid);
      await setDoc(regRef, {
        userId: currentUser.uid,
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        registeredAt: serverTimestamp(),
        checkedIn: false
      });

      setRegisteredEventIds(prev => new Set([...prev, eventItem.id]));
      showToast(`Successfully registered for "${eventItem.title}"!`, 'success');
    } catch (err) {
      console.error('Registration failed:', err);
      showToast('Failed to register. Please check your network and permissions.', 'error');
    }
  };

  // Open confirmation before cancelling
  const promptCancelRegistration = (eventItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Registration?',
      message: `Are you sure you want to cancel your spot for "${eventItem.title}"? This will allow other students to claim this place.`,
      confirmText: 'Yes, Cancel Spot',
      isDanger: true,
      isLoading: false,
      onConfirm: async () => {
        try {
          const regRef = doc(db, 'events', eventItem.id, 'registrations', currentUser.uid);
          await deleteDoc(regRef);

          setRegisteredEventIds(prev => {
            const next = new Set(prev);
            next.delete(eventItem.id);
            return next;
          });

          showToast(`Cancelled registration for "${eventItem.title}".`, 'info');
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          console.error('Cancel failed:', err);
          showToast('Failed to cancel registration.', 'error');
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Admin Approve Event
  const handleApproveEvent = async (eventItem) => {
    if (!isAdmin) {
      showToast('Admin privileges required to approve events.', 'error');
      return;
    }
    try {
      await approveEvent(eventItem.id, currentUser);
      showToast(`Event "${eventItem.title}" approved and published!`, 'success');
      loadData();
    } catch (err) {
      console.error('Failed to approve event:', err);
      showToast('Failed to approve event. Check Firestore permissions.', 'error');
    }
  };

  // Admin Reject Event
  const handleRejectEvent = async (eventItem, reason) => {
    if (!isAdmin) {
      showToast('Admin privileges required to decline events.', 'error');
      return;
    }
    try {
      await rejectEvent(eventItem.id, currentUser, reason);
      showToast(`Event proposal "${eventItem.title}" declined.`, 'info');
      loadData();
    } catch (err) {
      console.error('Failed to decline event:', err);
      showToast('Failed to decline event.', 'error');
    }
  };

  // Delete/Withdraw Event
  const promptDeleteEvent = (eventItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Event Proposal?',
      message: `Are you sure you want to remove "${eventItem.title}"? This cannot be undone.`,
      confirmText: 'Delete Event',
      isDanger: true,
      isLoading: false,
      onConfirm: async () => {
        try {
          await deleteEvent(eventItem.id);
          showToast(`Event "${eventItem.title}" removed.`, 'info');
          loadData();
        } catch (err) {
          console.error('Failed to delete event:', err);
          showToast('Failed to delete event.', 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Prompt Logout
  const promptLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sign Out of MatteLab?',
      message: 'You can sign back in anytime with your college Google account.',
      confirmText: 'Sign Out',
      isDanger: false,
      isLoading: false,
      onConfirm: async () => {
        try {
          await logout();
          showToast('Signed out successfully.', 'info');
        } catch (err) {
          showToast('Failed to sign out.', 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Filter list of events user has registered for
  const myRegisteredEvents = events.filter(evt => registeredEventIds.has(evt.id));

  // Initial authentication loading state
  if (authLoading) {
    return (
      <div className="app-loading-screen">
        <div className="brand-loader">
          <div className="loader-logo-wrap">
            <img src="/logo.png" alt="MatteLab" className="loader-logo-img" />
          </div>
          <div className="text-center">
            <p className="loader-text">Loading MatteLab Workspace...</p>
            <p className="loader-subtext mt-1">College of Engineering Trikaripur · Makerspace</p>
          </div>
          <div className="loader-bar-track">
            <div className="loader-bar-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Login View
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF0DA] text-[#4C4541] overflow-x-hidden w-full max-w-full selection:bg-[#F2C46A] selection:text-[#4C4541]">
      {/* Top Header Overlay spanning full width */}
      <TopNav
        activeTab={activeTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onSelectTab={setActiveTab}
        onPromptLogout={promptLogout}
        registeredCount={registeredEventIds.size}
        pendingCount={pendingEvents.length}
      />

      {/* Main Full-Width Content Viewport with mobile bottom navigation clearance */}
      <div className="w-full flex-1 pt-[88px] sm:pt-[96px] pb-24 md:pb-12">
        {activeTab === 'overview' ? (
          <Overview
            events={events}
            myRegistrations={myRegisteredEvents}
            resources={resources}
            setActiveTab={setActiveTab}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {activeTab === 'events' && (
              <EventsView
                events={events}
                pendingEvents={pendingEvents}
                myProposals={myProposals}
                registeredEventIds={registeredEventIds}
                loading={dataLoading}
                onRefresh={loadData}
                onRegister={handleRegister}
                onCancelRegistration={promptCancelRegistration}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onApproveEvent={handleApproveEvent}
                onRejectEvent={handleRejectEvent}
                onDeleteEvent={promptDeleteEvent}
              />
            )}

            {activeTab === 'registrations' && (
              <MyRegistrationsView
                myRegistrations={myRegisteredEvents}
                resources={resources}
                loading={dataLoading}
                onRefresh={loadData}
                onCancelRegistration={promptCancelRegistration}
                onExploreEvents={() => setActiveTab('events')}
                onExploreResources={() => setActiveTab('resources')}
              />
            )}

            {activeTab === 'resources' && (
              <AdminResourcesView
                resources={resources}
                loading={resourcesLoading}
                onRefresh={loadResources}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                myRegistrationsCount={registeredEventIds.size}
                onPromptLogout={promptLogout}
              />
            )}
          </div>
        )}
      </div>

      {/* Editorial Campus Makerspace Footer (Rendered only on Home page) */}
      {activeTab === 'overview' && (
        <Footer
          brand="MatteLab"
          ctaText={isAdmin ? "Create Workshop" : "Propose Workshop"}
          headline="Got an idea? Let's build it together."
          punchyStatement="DREAM IT · SOLDER IT · BUILD IT"
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onSelectTab={setActiveTab}
        />
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPromptLogout={promptLogout}
        registeredCount={registeredEventIds.size}
      />

      {/* Event Creation Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={loadData}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDanger={confirmModal.isDanger}
        isLoading={confirmModal.isLoading}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Interactive MatteLab Mascot */}
      <Mascot
        db={db}
        image={personImg}
        onNavigate={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}
