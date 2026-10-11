import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  X,
  Calendar,
  Clock,
  Wrench,
  AlertCircle,
  FileText,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

/**
 * Zod Schema for Booking Form:
 * - Required fields: resourceId, title, startDate, startTime, endDate, endTime
 * - Start must not be in the past (with a 5 min tolerance)
 * - End must be strictly after start
 * - Duration limit: 15 min minimum, 4 hours (240 min) maximum
 */
const bookingSchema = z
  .object({
    resourceId: z.string().min(1, 'Please select a piece of equipment or lab space.'),
    title: z
      .string()
      .min(3, 'Purpose must be at least 3 characters.')
      .max(100, 'Purpose cannot exceed 100 characters.'),
    startDate: z.string().min(1, 'Start date is required.'),
    startTime: z.string().min(1, 'Start time is required.'),
    endDate: z.string().min(1, 'End date is required.'),
    endTime: z.string().min(1, 'End time is required.'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional()
  })
  .superRefine((data, ctx) => {
    const startStr = `${data.startDate}T${data.startTime}`;
    const endStr = `${data.endDate}T${data.endTime}`;
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const now = new Date();

    if (isNaN(startDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startTime'],
        message: 'Invalid start date or time.'
      });
      return;
    }

    if (isNaN(endDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Invalid end date or time.'
      });
      return;
    }

    // 1. Not in the past (allow 5-minute buffer for user filling form)
    if (startDate.getTime() < now.getTime() - 5 * 60 * 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startTime'],
        message: 'Reservation start time cannot be in the past.'
      });
    }

    // 2. End after start
    if (endDate.getTime() <= startDate.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'End time must be after the start time.'
      });
      return;
    }

    // 3. Duration Limits
    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    if (durationMinutes < 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Minimum booking duration is 15 minutes.'
      });
    }

    if (durationMinutes > 240) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Maximum duration is 4 hours (240 minutes) per session to allow fair equipment sharing.'
      });
    }
  });

export default function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  resources = [],
  selectedResourceId = '',
  initialSlot = null,
  isSubmitting = false
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      resourceId: selectedResourceId || '',
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      notes: ''
    }
  });

  const watchResourceId = watch('resourceId');
  const selectedResource = resources.find((r) => r.id === watchResourceId);

  // Helper to format Date to YYYY-MM-DD and HH:mm
  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatLocalTime = (d) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }

    const defaultResource = selectedResourceId || (resources.length > 0 ? resources[0].id : '');
    setValue('resourceId', defaultResource);

    if (initialSlot?.start && initialSlot?.end) {
      const slotStart = new Date(initialSlot.start);
      const slotEnd = new Date(initialSlot.end);

      setValue('startDate', formatLocalDate(slotStart));
      setValue('startTime', formatLocalTime(slotStart));
      setValue('endDate', formatLocalDate(slotEnd));
      setValue('endTime', formatLocalTime(slotEnd));
    } else {
      // Default to next nearest 30-min block for 1 hour
      const start = new Date();
      start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30, 0, 0);
      if (start.getTime() < Date.now()) {
        start.setMinutes(start.getMinutes() + 30);
      }
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour default

      setValue('startDate', formatLocalDate(start));
      setValue('startTime', formatLocalTime(start));
      setValue('endDate', formatLocalDate(end));
      setValue('endTime', formatLocalTime(end));
    }
  }, [isOpen, initialSlot, selectedResourceId, resources, setValue, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);

    onSubmit({
      resourceId: data.resourceId,
      title: data.title,
      notes: data.notes || '',
      start,
      end
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-[#181a1d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
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
                Reserve Equipment / Space
              </h3>
              <p className="text-xs text-slate-400">
                {selectedResource ? `${selectedResource.name} · ${selectedResource.location || 'Makerspace'}` : 'Select equipment and verify availability'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          {/* Equipment Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#e28743]" />
              <span>Target Equipment / Lab Space *</span>
            </label>
            <select
              {...register('resourceId')}
              className="w-full h-10 px-3 rounded-xl bg-[#121416] border border-white/10 text-slate-100 text-sm focus:border-[#c26e47] focus:ring-1 focus:ring-[#c26e47] outline-none transition-colors"
            >
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name} ({res.type === 'machine' ? 'Machine' : 'Space'} - {res.location || 'Lab'})
                </option>
              ))}
            </select>
            {errors.resourceId && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.resourceId.message}</span>
              </p>
            )}
          </div>

          {/* Booking Title / Project Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e28743]" />
              <span>Project / Booking Purpose *</span>
            </label>
            <Input
              {...register('title')}
              placeholder="e.g. 3D Print Quadcopter Frame / PCB Soldering"
              maxLength={100}
              className="bg-[#121416] border-white/10 text-sm"
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* Time & Date Range Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-[#121416]/60 border border-white/5">
            {/* Start Date & Time */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#e28743]" /> Start Time
              </span>
              <div>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#181a1d] border border-white/10 text-xs text-slate-200 outline-none focus:border-[#c26e47]"
                />
                {errors.startDate && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  step="900"
                  {...register('startTime')}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#181a1d] border border-white/10 text-xs text-slate-200 outline-none focus:border-[#c26e47]"
                />
                {errors.startTime && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.startTime.message}</p>
                )}
              </div>
            </div>

            {/* End Date & Time */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> End Time
              </span>
              <div>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#181a1d] border border-white/10 text-xs text-slate-200 outline-none focus:border-[#c26e47]"
                />
                {errors.endDate && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.endDate.message}</p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  step="900"
                  {...register('endTime')}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#181a1d] border border-white/10 text-xs text-slate-200 outline-none focus:border-[#c26e47]"
                />
                {errors.endTime && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.endTime.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes / Special Material Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Project Notes / Filament or Material (Optional)</span>
            </label>
            <Textarea
              {...register('notes')}
              rows={2}
              placeholder="e.g. PLA filament, nozzle 0.4mm, bringing my own acrylic sheet"
              className="bg-[#121416] border-white/10 text-xs"
            />
          </div>

          {/* Rules notice */}
          <div className="text-[11px] text-slate-400 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#e28743] shrink-0 mt-0.5" />
            <span>
              Bookings are verified transactionally. Duration must be between 15 mins and 4 hours. You can cancel your reservation any time before it starts.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#c26e47] to-[#d97736] hover:from-[#b05f3b] hover:to-[#c6682b] text-white text-xs font-semibold px-5"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Slot...</span>
                </div>
              ) : (
                <span>Confirm Reservation</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
