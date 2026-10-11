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
import Sidebar from './components/Sidebar';
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

export default function App() {
  const { currentUser, loading: authLoading, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
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
    onConfirm: () => {}
  });

  const loadResources = useCallback(async () => {
    if (!currentUser) return;
    setResourcesLoading(true);
    try {
      const data = await getResources();
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
      // Don't toast error if user is simply not permitted or collection empty
    } finally {
      setResourcesLoading(false);
    }
  }, [currentUser]);

  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setDataLoading(true);

    try {
      const eventsQuery = query(
        collection(db, 'events'),
        orderBy('startAt', 'asc')
      );
      const snapshot = await getDocs(eventsQuery);
      const now = Date.now();

      const upcoming = [];
      const userRegistered = new Set();

      // Check registration for each event
      for (const eventDoc of snapshot.docs) {
        const data = eventDoc.data();
        const eventId = eventDoc.id;

        // Only include published future events
        if (data.status === 'published' && data.startAt && data.startAt.toMillis() >= now) {
          upcoming.push({ id: eventId, ...data });
        }

        // Check if current user is registered
        try {
          const regRef = doc(db, 'events', eventId, 'registrations', currentUser.uid);
          const regSnap = await getDoc(regRef);
          if (regSnap.exists()) {
            userRegistered.add(eventId);
          }
        } catch (regErr) {
          console.warn('Could not check registration for', eventId, regErr);
        }
      }

      setEvents(upcoming);
      setRegisteredEventIds(userRegistered);
    } catch (err) {
      console.error('Failed to load events:', err);
      showToast('Could not load events from database.', 'error');
    } finally {
      setDataLoading(false);
    }
  }, [currentUser, showToast]);

  useEffect(() => {
    if (currentUser) {
      loadData();
      loadResources();
    } else {
      setEvents([]);
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
          <div className="loader-logo">M</div>
          <p className="loader-text">Loading MatteLab Workspace...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Login View
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onPromptLogout={promptLogout}
        registeredCount={registeredEventIds.size}
      />

      {/* Main Content Area */}
      <div className="app-main-viewport">
        <TopNav
          activeTab={activeTab}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        <main className="app-content-body">
          {activeTab === 'overview' && (
            <Overview
              events={events}
              myRegistrations={myRegisteredEvents}
              resources={resources}
              setActiveTab={setActiveTab}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'events' && (
            <EventsView
              events={events}
              registeredEventIds={registeredEventIds}
              loading={dataLoading}
              onRefresh={loadData}
              onRegister={handleRegister}
              onCancelRegistration={promptCancelRegistration}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'registrations' && (
            <MyRegistrationsView
              myRegistrations={myRegisteredEvents}
              loading={dataLoading}
              onRefresh={loadData}
              onCancelRegistration={promptCancelRegistration}
              onExploreEvents={() => setActiveTab('events')}
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
        </main>
      </div>

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
    </div>
  );
}
