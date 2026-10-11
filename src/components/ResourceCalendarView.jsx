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
      backgroundColor: isMine ? '#c26e47' : '#2a2f35',
      borderColor: isMine ? '#e28743' : '#3f4650',
      textColor: isMine ? '#ffffff' : '#e2e8f0',
      extendedProps: {
        userId: b.userId,
        isMine,
        notes: b.notes
      }
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-[#181a1d] border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c26e47] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e28743]">
              LIVE SCHEDULE & EQUIPMENT BOOKINGS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-2.5">
            <span>Equipment Calendar</span>
            {currentResource && (
              <Badge
                variant="outline"
                className="bg-[#c26e47]/15 border-[#c26e47]/40 text-[#f3a86c] text-xs font-semibold"
              >
                {currentResource.name}
              </Badge>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time week view. Click or drag across empty slots to reserve, or click existing bookings to view details.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onBackToResources && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBackToResources}
              className="text-xs"
            >
              List View
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setSelectedSlot(null);
              setIsFormModalOpen(true);
            }}
            className="bg-gradient-to-r from-[#c26e47] to-[#d97736] hover:from-[#b05f3b] hover:to-[#c6682b] text-white text-xs font-bold shadow-md shadow-[#c26e47]/25 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book This Machine</span>
          </Button>
        </div>
      </div>

      {/* Equipment Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#e28743]" /> Select:
        </span>
        {resources.map((res) => {
          const isSelected = res.id === selectedResourceId;
          const isMachine = res.type === 'machine';

          return (
            <button
              key={res.id}
              type="button"
              onClick={() => setSelectedResourceId(res.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#c26e47] to-[#d97736] text-white shadow-md shadow-[#c26e47]/25 border border-transparent'
                  : 'bg-[#181a1d] text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              {isMachine ? <Wrench className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
              <span>{res.name}</span>
              {res.status === 'inactive' && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 text-[10px]">
                  Maintenance
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Card Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#181a1d] border border-white/10 shadow-xl overflow-hidden relative">
        {/* Loading overlay indicator */}
        {loadingBookings && (
          <div className="absolute top-4 right-6 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-[#e28743]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing Firestore...</span>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#c26e47] border border-[#e28743]" />
              <span className="text-white font-medium">Your Bookings (Cancelable)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#2a2f35] border border-[#3f4650]" />
              <span className="text-slate-400">Other Makers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-transparent border border-dashed border-white/20" />
              <span className="text-slate-400">Available Slot</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Showing week view for <strong>{currentResource?.name || 'Selected Resource'}</strong>
          </div>
        </div>

        {/* FullCalendar Week View */}
        <div className="fullcalendar-dark-theme">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,dayGridMonth'
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
