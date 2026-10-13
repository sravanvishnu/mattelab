import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Wrench,
  User,
  Mail,
  FileText,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function BookingDetailModal({
  isOpen,
  onClose,
  booking = null,
  resource = null,
  currentUserId = null,
  isAdmin = false,
  onCancelBooking,
  isCancelling = false
}) {
  if (!isOpen || !booking) return null;

  const isOwner = currentUserId && booking.userId === currentUserId;
  const canCancel = isOwner || isAdmin;

  const startDate = booking.start instanceof Date ? booking.start : new Date(booking.start);
  const endDate = booking.end instanceof Date ? booking.end : new Date(booking.end);

  const formatDateTime = (date) => {
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  const durationHours = (durationMinutes / 60).toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#FCF0DA] border-2 border-[#4C4541] rounded-[28px] shadow-[8px_8px_0_#4C4541] overflow-hidden animate-in zoom-in-95 duration-200 text-[#4C4541]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#4C4541] bg-[#FCF0DA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] flex items-center justify-center shadow-[2px_2px_0_#4C4541]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-condensed text-xl font-bold uppercase tracking-wide text-[#4C4541]">
                Reservation Details
              </h3>
              <p className="font-editorial italic text-xs text-[#4C4541]/80">
                {resource?.name || 'Makerspace Resource'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-[#4C4541] bg-white text-[#4C4541] hover:bg-[#F2C46A] transition-all flex items-center justify-center shadow-[2px_2px_0_#4C4541] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title & Status */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#4C4541] shadow-[3px_3px_0_#4C4541] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-bold text-[#4C4541] tracking-tight">
                {booking.title}
              </h4>
              <span className="px-3 py-1 rounded-full bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] text-xs font-mono font-bold shadow-[1.5px_1.5px_0_#4C4541]">
                Confirmed
              </span>
            </div>

            {isOwner && (
              <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4C4541] bg-[#AEAC78] border border-[#4C4541] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0_#4C4541]">
                Your Booking
              </span>
            )}
          </div>

          {/* Time & Duration */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-[#4C4541]">
              <div className="flex items-center gap-2 text-[#4C4541]/75 font-mono">
                <Clock className="w-4 h-4 text-[#4C4541]" />
                <span>Reserved Interval</span>
              </div>
              <span className="font-bold text-[#4C4541]">
                {formatDateTime(startDate)} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-[#4C4541]">
              <div className="flex items-center gap-2 text-[#4C4541]/75 font-mono">
                <Clock className="w-4 h-4 text-[#4C4541]" />
                <span>Session Duration</span>
              </div>
              <span className="font-bold text-[#4C4541]">
                {durationMinutes} mins ({durationHours} hrs)
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-[#4C4541]">
              <div className="flex items-center gap-2 text-[#4C4541]/75 font-mono">
                <Wrench className="w-4 h-4 text-[#4C4541]" />
                <span>Equipment / Lab</span>
              </div>
              <span className="font-bold text-[#4C4541]">
                {resource?.name || 'Makerspace Equipment'} ({resource?.location || 'Lab'})
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#4C4541]/15 text-[#4C4541]">
              <div className="flex items-center gap-2 text-[#4C4541]/75 font-mono">
                <User className="w-4 h-4 text-[#4C4541]" />
                <span>Reserved By</span>
              </div>
              <span className="font-bold text-[#4C4541]">
                {booking.userName || 'Student Maker'} {isOwner ? '(You)' : ''}
              </span>
            </div>

            {booking.notes && (
              <div className="pt-2">
                <span className="text-[#4C4541] font-mono font-bold text-xs block mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Project Notes:
                </span>
                <p className="p-3 rounded-xl bg-white border-2 border-[#4C4541] text-[#4C4541] text-xs leading-relaxed shadow-[2px_2px_0_#4C4541]">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* Cancellation Notice for Owner / Admin */}
          {canCancel ? (
            <div className="p-3 rounded-2xl bg-red-100/80 border-2 border-red-500 text-xs text-red-950 flex items-start gap-2.5 shadow-[2px_2px_0_#4C4541]">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-700 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Cancel this Reservation?</p>
                <p className="text-[11px] text-red-800 mt-0.5 font-medium">
                  Cancelling will immediately release this time slot on the calendar for other makers.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-[#AEAC78]/25 border-2 border-[#4C4541] text-xs text-[#4C4541] flex items-center gap-2 shadow-[2px_2px_0_#4C4541]">
              <CheckCircle2 className="w-4 h-4 text-[#4C4541]" />
              <span className="font-medium">This session was booked by another maker.</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-[#4C4541]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border-2 border-[#4C4541] bg-white text-[#4C4541] hover:bg-[#F2C46A]/20 font-mono text-xs font-bold uppercase shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
            >
              Close
            </button>

            {canCancel && (
              <button
                type="button"
                onClick={() => onCancelBooking(booking.id)}
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-full border-2 border-[#4C4541] bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase shadow-[3px_3px_0_#4C4541] transition-all active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1.5"
              >
                {isCancelling ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel My Booking</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
