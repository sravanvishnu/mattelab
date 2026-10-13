import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  Wrench,
  Building2,
  RefreshCw,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  subscribeToResourceBookings,
  createBooking,
  cancelBooking
} from '../services/bookings';
import BookingFormModal from './BookingFormModal';
import BookingDetailModal from './BookingDetailModal';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function ResourceCalendarView({
  resources = [],
  initialResourceId = null,
  onBackToResources
}) {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { showToast } = useToast();

  const calendarRef = useRef(null);

  // Selected resource
  const [selectedResourceId, setSelectedResourceId] = useState(
    initialResourceId || (resources.length > 0 ? resources[0].id : '')
  );

  // Visible date range (updated by FullCalendar datesSet)
  const [visibleRange, setVisibleRange] = useState({
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  // Bookings state from real-time listener
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancellingBooking, setIsCancellingBooking] = useState(false);

  // Responsive mobile state for calendar viewport
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      if (api) {
        api.changeView(isMobile ? 'timeGridDay' : 'timeGridWeek');
      }
    }
  }, [isMobile]);

  // Current active resource object
  const currentResource = resources.find((r) => r.id === selectedResourceId);

  // Synchronize when resources load or change
  useEffect(() => {
    if (!selectedResourceId && resources.length > 0) {
      setSelectedResourceId(resources[0].id);
    }
  }, [resources, selectedResourceId]);

  // Real-time Firestore Listener: Filtered by resource and visible date range
  useEffect(() => {
    if (!selectedResourceId || !visibleRange.start || !visibleRange.end) return;

    setLoadingBookings(true);

    const unsubscribe = subscribeToResourceBookings({
      resourceId: selectedResourceId,
      startDate: visibleRange.start,
      endDate: visibleRange.end,
      onUpdate: (data) => {
        setBookings(data);
        setLoadingBookings(false);
      },
      onError: (err) => {
        showToast('Failed to sync live bookings.', 'error');
        setLoadingBookings(false);
      }
    });

    return () => unsubscribe();
  }, [selectedResourceId, visibleRange.start, visibleRange.end]);

  // Handle FullCalendar visible range changes (Week navigation, Next, Prev, Today)
  const handleDatesSet = (dateInfo) => {
    setVisibleRange({
      start: dateInfo.start,
      end: dateInfo.end
    });
  };

  // Click on empty slot in week view
  const handleSelectSlot = (selectionInfo) => {
    setSelectedSlot({
      start: selectionInfo.start,
      end: selectionInfo.end
    });
    setIsFormModalOpen(true);
  };

  // Click on existing booking
  const handleEventClick = (clickInfo) => {
    const bookingId = clickInfo.event.id;
    const b = bookings.find((item) => item.id === bookingId);
    if (b) {
      setSelectedBooking(b);
      setIsDetailModalOpen(true);
    }
  };

  // Form submission with Firestore transaction overlap verification
  const handleCreateBooking = async (formData) => {
    if (!currentUser) {
      showToast('Please sign in to reserve equipment.', 'error');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      await createBooking({
        resourceId: formData.resourceId,
        userId: currentUser.uid,
        userName: userProfile?.name || currentUser.displayName || 'Student Maker',
        userEmail: currentUser.email || '',
        title: formData.title,
        notes: formData.notes,
        start: formData.start,
        end: formData.end
      });

      showToast('Reservation confirmed successfully! Real-time slot reserved.', 'success');
      setIsFormModalOpen(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Booking creation error:', err);
      showToast(err.message || 'Failed to complete reservation.', 'error');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!currentUser) return;

    setIsCancellingBooking(true);
    try {
      await cancelBooking(bookingId, currentUser.uid, isAdmin);
      showToast('Reservation cancelled. The slot is now available.', 'info');
      setIsDetailModalOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error('Cancel booking error:', err);
      showToast(err.message || 'Failed to cancel reservation.', 'error');
    } finally {
      setIsCancellingBooking(false);
    }
  };

  // Transform Firestore bookings to FullCalendar event format
  const calendarEvents = bookings.map((b) => {
    const isMine = currentUser && b.userId === currentUser.uid;

    return {
      id: b.id,
      title: isMine ? `★ ${b.title} (You)` : `${b.title} (${b.userName || 'Booked'})`,
      start: b.start,
      end: b.end,
      backgroundColor: isMine ? '#F2C46A' : '#AEAC78',
      borderColor: '#4C4541',
      textColor: '#4C4541',
      extendedProps: {
        userId: b.userId,
        isMine,
        notes: b.notes
      }
    };
  });

  return (
    <div className="space-y-6 tab-pane-fade">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-[24px] bg-white border-2 border-[#4C4541] shadow-[4px_4px_0_#4C4541]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2C46A] border border-[#4C4541] animate-pulse" />
            <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-[#4C4541]">
              [ LIVE SCHEDULE ] · EQUIPMENT & BENCH BOOKINGS
            </span>
          </div>
          <h2 className="font-condensed text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#4C4541] flex flex-wrap items-center gap-2.5">
            <span>Equipment Calendar</span>
            {currentResource && (
              <span className="px-3 py-0.5 rounded-full bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] text-xs font-mono font-bold shadow-[1.5px_1.5px_0_#4C4541]">
                {currentResource.name}
              </span>
            )}
          </h2>
          <p className="font-editorial italic text-xs sm:text-sm text-[#4C4541]/80 mt-1">
            Real-time week view. Click or drag across empty slots to reserve, or tap existing bookings to view details.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onBackToResources && (
            <button
              type="button"
              onClick={onBackToResources}
              className="px-4 py-2 rounded-full border-2 border-[#4C4541] bg-white hover:bg-[#F2C46A]/20 text-[#4C4541] text-xs font-bold font-mono uppercase shadow-[1.5px_1.5px_0_#4C4541] transition-all cursor-pointer"
            >
              List View
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setSelectedSlot(null);
              setIsFormModalOpen(true);
            }}
            className="px-5 py-2 rounded-full border-2 border-[#4C4541] bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold font-mono uppercase shadow-[2px_2px_0_#4C4541] transition-all active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book This Machine</span>
          </button>
        </div>
      </div>

      {/* Equipment Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold font-mono text-[#4C4541] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#4C4541]" /> Select:
        </span>
        {resources.map((res) => {
          const isSelected = res.id === selectedResourceId;
          const isMachine = res.type === 'machine';

          return (
            <button
              key={res.id}
              type="button"
              onClick={() => setSelectedResourceId(res.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-mono uppercase transition-all shrink-0 cursor-pointer border-2 border-[#4C4541] shadow-[1.5px_1.5px_0_#4C4541] ${isSelected
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
                }`}
            >
              {isMachine ? <Wrench className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
              <span>{res.name}</span>
              {res.status === 'inactive' && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 text-[10px]">
                  Maintenance
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Card Container */}
      <div className="p-4 sm:p-6 rounded-[28px] bg-white border-2 border-[#4C4541] shadow-[5px_5px_0_#4C4541] overflow-hidden relative">
        {/* Loading overlay indicator */}
        {loadingBookings && (
          <div className="absolute top-4 right-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF0DA] border-2 border-[#4C4541] text-xs font-mono font-bold text-[#4C4541] shadow-[2px_2px_0_#4C4541]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing Firestore...</span>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b-2 border-[#4C4541]/15 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#F2C46A] border-2 border-[#4C4541] shadow-[1px_1px_0_#4C4541]" />
              <span className="text-[#4C4541] font-bold">Your Bookings (Cancelable)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#AEAC78] border-2 border-[#4C4541] shadow-[1px_1px_0_#4C4541]" />
              <span className="text-[#4C4541] font-semibold">Other Makers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#FCF0DA] border-2 border-dashed border-[#4C4541]" />
              <span className="text-[#4C4541]/80">Available Slot</span>
            </div>
          </div>

          <div className="text-[11px] font-editorial italic text-[#4C4541]/80 hidden sm:block">
            Showing {isMobile ? 'day' : 'week'} view for <strong>{currentResource?.name || 'Selected Resource'}</strong>
          </div>
        </div>

        {/* FullCalendar Responsive View */}
        <div className="fullcalendar-dark-theme">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
            headerToolbar={
              isMobile
                ? {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridDay,dayGridMonth'
                  }
                : {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,dayGridMonth'
                  }
            }
            views={{
              timeGridDay: { buttonText: 'Day' },
              timeGridWeek: { buttonText: 'Week' },
              dayGridMonth: { buttonText: 'Month' }
            }}
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            slotDuration="00:30:00"
            selectable={true}
            selectMirror={true}
            nowIndicator={true}
            allDaySlot={false}
            weekends={true}
            events={calendarEvents}
            datesSet={handleDatesSet}
            select={handleSelectSlot}
            eventClick={handleEventClick}
            eventClassNames="cursor-pointer font-medium"
            height="auto"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            dayHeaderFormat={{
              weekday: 'short',
              month: 'numeric',
              day: 'numeric',
              omitCommas: true
            }}
          />
        </div>
      </div>

      {/* Booking Form Modal with React Hook Form + Zod */}
      <BookingFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSlot(null);
        }}
        onSubmit={handleCreateBooking}
        resources={resources}
        selectedResourceId={selectedResourceId}
        initialSlot={selectedSlot}
        isSubmitting={isSubmittingBooking}
      />

      {/* Booking Detail & Cancellation Modal */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        resource={currentResource}
        currentUserId={currentUser?.uid}
        isAdmin={isAdmin}
        onCancelBooking={handleCancelBooking}
        isCancelling={isCancellingBooking}
      />
    </div>
  );
}
