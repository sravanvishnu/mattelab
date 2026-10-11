import React, { useState, useEffect } from 'react';
import {
  BookmarkCheck,
  Calendar,
  MapPin,
  Clock,
  RotateCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Wrench,
  Ban,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { subscribeToUserBookings, cancelBooking } from '../services/bookings';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function MyRegistrationsView({
  myRegistrations = [],
  resources = [],
  loading = false,
  onRefresh,
  onCancelRegistration,
  onExploreEvents,
  onExploreResources
}) {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'equipment'
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  // Subscribe to current user's live equipment bookings
  useEffect(() => {
    if (!currentUser) return;

    setLoadingBookings(true);
    const unsubscribe = subscribeToUserBookings(
      currentUser.uid,
      (data) => {
        setMyBookings(data);
        setLoadingBookings(false);
      },
      (err) => {
        console.error('Error fetching bookings:', err);
        setLoadingBookings(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

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

  const handleCancelMyBooking = async (bookingId) => {
    if (!currentUser) return;

    setCancellingBookingId(bookingId);
    try {
      await cancelBooking(bookingId, currentUser.uid, isAdmin);
      showToast('Equipment reservation cancelled successfully.', 'info');
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      showToast(err.message || 'Failed to cancel reservation.', 'error');
    } finally {
      setCancellingBookingId(null);
    }
  };

  return (
    <div className="tab-pane-fade space-y-6">
      {/* Section Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 font-heading">
            My Campus Reservations
          </h2>
          <p className="text-muted text-sm mt-0.5">
            Workshops, events, and makerspace machinery you are confirmed to attend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tabs switch */}
          <div className="flex items-center bg-[#181a1d] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Events ({myRegistrations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('equipment')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'equipment'
                  ? 'bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Equipment Bookings ({myBookings.length})</span>
            </button>
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
      </div>

      {/* Tab 1: Event Registrations */}
      {activeTab === 'events' && (
        <>
          {myRegistrations.length === 0 ? (
            <div className="empty-state-card mt-4">
              <div className="empty-state-icon">
                <BookmarkCheck size={36} />
              </div>
              <h3>No Active Event Registrations</h3>
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
              {myRegistrations.map((evt) => (
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
        </>
      )}

      {/* Tab 2: Equipment & Lab Reservations */}
      {activeTab === 'equipment' && (
        <>
          {myBookings.length === 0 ? (
            <div className="empty-state-card mt-4">
              <div className="empty-state-icon">
                <Wrench size={36} />
              </div>
              <h3>No Active Equipment Reservations</h3>
              <p className="text-muted text-sm max-w-md">
                You don't have any machinery or lab slots reserved. Check the equipment schedule to book a 3D printer, laser cutter, or electronics station.
              </p>
              {onExploreResources && (
                <button
                  type="button"
                  className="btn btn-primary mt-4 flex items-center gap-2"
                  onClick={onExploreResources}
                >
                  <Wrench size={16} />
                  <span>View Equipment & Schedule</span>
                </button>
              )}
            </div>
          ) : (
            <div className="events-grid-responsive mt-4">
              {myBookings.map((b) => {
                const res = resources.find((r) => r.id === b.resourceId);
                const startDate = b.start instanceof Date ? b.start : new Date(b.start);
                const endDate = b.end instanceof Date ? b.end : new Date(b.end);

                const durationMins = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

                return (
                  <article key={b.id} className="event-card-modern registered-card border-[#c26e47]/30">
                    <div className="event-card-header">
                      <span className="badge-tag registered bg-[#c26e47]/15 border-[#c26e47]/40 text-[#f3a86c]">
                        <CheckCircle2 size={13} />
                        <span>Slot Reserved</span>
                      </span>
                      <span className="text-muted text-xs">
                        ID: #{b.id.substring(0, 6)}
                      </span>
                    </div>

                    <h3 className="event-card-title">{b.title}</h3>
                    <p className="event-card-desc">
                      {b.notes || (res?.description ? res.description : 'Makerspace scheduled session.')}
                    </p>

                    <div className="event-card-details">
                      <div className="detail-item">
                        <Wrench size={15} className="detail-icon text-[#e28743]" />
                        <span className="font-semibold text-slate-200">
                          {res?.name || 'Makerspace Equipment'} ({res?.location || 'Lab'})
                        </span>
                      </div>
                      <div className="detail-item">
                        <Calendar size={15} className="detail-icon text-[#e28743]" />
                        <span>{startDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="detail-item">
                        <Clock size={15} className="detail-icon text-amber-400" />
                        <span>
                          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({durationMins}m)
                        </span>
                      </div>
                    </div>

                    <div className="event-card-footer">
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full text-xs bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center gap-1.5 cursor-pointer"
                        disabled={cancellingBookingId === b.id}
                        onClick={() => handleCancelMyBooking(b.id)}
                      >
                        {cancellingBookingId === b.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <Ban size={15} />
                            <span>Cancel My Booking</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
