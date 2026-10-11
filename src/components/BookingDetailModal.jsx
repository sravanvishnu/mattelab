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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#181a1d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#1e2125]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c26e47]/15 border border-[#c26e47]/30 text-[#e28743] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Reservation Details
              </h3>
              <p className="text-xs text-slate-400">
                {resource?.name || 'Makerspace Resource'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title & Status */}
          <div className="p-4 rounded-2xl bg-[#121416]/70 border border-white/5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">
                {booking.title}
              </h4>
              <Badge
                variant="outline"
                className="bg-[#c26e47]/15 border-[#c26e47]/40 text-[#f3a86c] text-[11px] font-bold"
              >
                Confirmed
              </Badge>
            </div>

            {isOwner && (
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Your Booking
              </span>
            )}
          </div>

          {/* Time & Duration */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-white/5 text-slate-300">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-[#e28743]" />
                <span>Reserved Interval</span>
              </div>
              <span className="font-semibold text-white">
                {formatDateTime(startDate)} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5 text-slate-300">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Session Duration</span>
              </div>
              <span className="font-semibold text-white">
                {durationMinutes} mins ({durationHours} hrs)
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5 text-slate-300">
              <div className="flex items-center gap-2 text-slate-400">
                <Wrench className="w-4 h-4 text-[#e28743]" />
                <span>Equipment / Lab</span>
              </div>
              <span className="font-semibold text-white">
                {resource?.name || 'Makerspace Equipment'} ({resource?.location || 'Lab'})
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5 text-slate-300">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="w-4 h-4 text-slate-400" />
                <span>Reserved By</span>
              </div>
              <span className="font-semibold text-white">
                {booking.userName || 'Student Maker'} {isOwner ? '(You)' : ''}
              </span>
            </div>

            {booking.notes && (
              <div className="pt-2">
                <span className="text-slate-400 font-medium block mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Project Notes:
                </span>
                <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 text-xs leading-relaxed">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* Cancellation Notice for Owner / Admin */}
          {canCancel ? (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Cancel this Reservation?</p>
                <p className="text-[11px] text-red-300/80 mt-0.5">
                  Cancelling will immediately release this time slot on the calendar for other makers.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>This session was booked by another maker.</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>

            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancelBooking(booking.id)}
                disabled={isCancelling}
                className="text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
              >
                {isCancelling ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel My Booking</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
