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
  AlertTriangle,
  CheckCircle2
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
    <div className="tab-pane-fade space-y-8">
      {/* Section Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#4C4541]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/30 text-[#4C4541] text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <span>[ 03 / PASSES ] · RESERVATIONS</span>
          </div>
          <h2 className="font-condensed text-3xl sm:text-5xl font-bold tracking-tight text-[#4C4541] uppercase">
            My Campus Reservations
          </h2>
          <p className="font-editorial italic text-sm sm:text-base text-[#4C4541]/80 mt-1 max-w-2xl font-normal">
            Workshops, events, and makerspace machinery you are confirmed to attend.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Sub-tabs switch with brutalist pill */}
          <div className="flex items-center bg-white p-1 rounded-full border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] flex-1 sm:flex-initial">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold font-mono uppercase transition-all cursor-pointer text-center ${activeTab === 'events'
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'text-[#4C4541] hover:bg-[#F2C46A]/20'
                }`}
            >
              Events ({myRegistrations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('equipment')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold font-mono uppercase transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${activeTab === 'equipment'
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'text-[#4C4541] hover:bg-[#F2C46A]/20'
                }`}
            >
              <Wrench size={12} />
              <span>Machinery ({myBookings.length})</span>
            </button>
          </div>

          <button
            type="button"
            className={`p-2 sm:p-2.5 rounded-full border-2 border-[#4C4541] bg-white text-[#4C4541] hover:bg-[#F2C46A]/30 shadow-[1.5px_1.5px_0_#4C4541] transition-all cursor-pointer shrink-0 ${loading ? 'animate-spin' : ''
              }`}
            onClick={onRefresh}
            title="Refresh registrations"
            aria-label="Refresh registrations"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      {/* Tab 1: Event Registrations */}
      {activeTab === 'events' && (
        <>
          {myRegistrations.length === 0 ? (
            <div className="rounded-[24px] border-2 border-[#4C4541] bg-white p-10 sm:p-14 text-center shadow-[4px_4px_0_#4C4541]">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FCF0DA] border-2 border-[#4C4541] flex items-center justify-center text-[#4C4541] mb-4 shadow-[2px_2px_0_#4C4541]">
                <BookmarkCheck size={28} />
              </div>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#4C4541]">
                No Active Event Registrations
              </h3>
              <p className="text-xs sm:text-sm text-[#4C4541]/80 max-w-md mx-auto mt-2 leading-relaxed font-sans">
                You haven't signed up for any upcoming workshops yet. Explore the campus events catalog to reserve your spot!
              </p>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
                onClick={onExploreEvents}
              >
                <span>Explore Events</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRegistrations.map((evt) => (
                <article key={evt.id} className="group relative flex flex-col justify-between rounded-[22px] border-2 border-[#4C4541] bg-white p-5 sm:p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[6px_6px_0_#4C4541] transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#F2C46A] text-[#4C4541] border border-[#4C4541] flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>Spot Confirmed</span>
                      </span>
                      <span className="font-mono text-xs text-[#4C4541]/60">
                        PASS #{evt.id.substring(0, 6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#4C4541] mb-2 leading-none">
                      {evt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4C4541]/80 line-clamp-2 leading-relaxed mb-4 font-sans">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-[#4C4541] font-mono">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#4C4541]/70 flex-shrink-0" />
                        <span className="truncate">{evt.venue || 'College Makerspace'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#4C4541]/70 flex-shrink-0" />
                        <span>{formatDate(evt.startAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t-2 border-[#4C4541]/15">
                    {evt.registrationUrl ? (
                      <a
                        href={evt.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FCF0DA] hover:bg-[#F2C46A] text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
                      >
                        <span>Open External Link</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
                        onClick={() => onCancelRegistration(evt)}
                      >
                        Cancel Spot
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
            <div className="rounded-[24px] border-2 border-[#4C4541] bg-white p-10 sm:p-14 text-center shadow-[4px_4px_0_#4C4541]">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FCF0DA] border-2 border-[#4C4541] flex items-center justify-center text-[#4C4541] mb-4 shadow-[2px_2px_0_#4C4541]">
                <Wrench size={28} />
              </div>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#4C4541]">
                No Active Equipment Reservations
              </h3>
              <p className="text-xs sm:text-sm text-[#4C4541]/80 max-w-md mx-auto mt-2 leading-relaxed font-sans">
                You don't have any machinery or lab slots reserved. Check the equipment schedule to book a 3D printer, laser cutter, or electronics station.
              </p>
              {onExploreResources && (
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
                  onClick={onExploreResources}
                >
                  <Wrench size={15} />
                  <span>View Machinery & Schedule</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBookings.map((b) => {
                const res = resources.find((r) => r.id === b.resourceId);
                const startDate = b.start instanceof Date ? b.start : new Date(b.start);
                const endDate = b.end instanceof Date ? b.end : new Date(b.end);
                const durationMins = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

                return (
                  <article key={b.id} className="group relative flex flex-col justify-between rounded-[22px] border-2 border-[#4C4541] bg-white p-5 sm:p-6 shadow-[3px_3px_0_#4C4541] hover:-translate-y-1 hover:shadow-[6px_6px_0_#4C4541] transition-all duration-200">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#AEAC78] text-[#4C4541] border border-[#4C4541] flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Slot Reserved</span>
                        </span>
                        <span className="font-mono text-xs text-[#4C4541]/60">
                          SLOT #{b.id.substring(0, 6).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#4C4541] mb-2 leading-none">
                        {b.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4C4541]/80 line-clamp-2 leading-relaxed mb-4 font-sans">
                        {b.notes || (res?.description ? res.description : 'Makerspace scheduled session.')}
                      </p>

                      <div className="space-y-1.5 text-xs text-[#4C4541] font-mono">
                        <div className="flex items-center gap-2">
                          <Wrench size={14} className="text-[#4C4541]/70 flex-shrink-0" />
                          <span className="font-bold truncate">
                            {res?.name || 'Makerspace Equipment'} ({res?.location || 'Lab'})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#4C4541]/70 flex-shrink-0" />
                          <span>{startDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#4C4541]/70 text-[11px]">
                          <Clock size={13} className="flex-shrink-0" />
                          <span>
                            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({durationMins}m)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t-2 border-[#4C4541]/15">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
                        disabled={cancellingBookingId === b.id}
                        onClick={() => handleCancelMyBooking(b.id)}
                      >
                        {cancellingBookingId === b.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-rose-900 border-t-transparent rounded-full animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            <span>Cancel Reservation</span>
                          </>
                        )}
                      </button>
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
