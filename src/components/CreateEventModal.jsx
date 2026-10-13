import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
  PlusCircle,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createEventProposal, EVENT_GUIDELINES } from '../services/events';

const eventSchema = z.object({
  title: z.string().trim().min(4, 'Title must be at least 4 characters').max(100, 'Title cannot exceed 100 characters'),
  category: z.string().min(1, 'Please select an event category'),
  description: z.string().trim().min(15, 'Please provide a descriptive overview (at least 15 characters)').max(2000, 'Description too long'),
  venue: z.string().trim().min(3, 'Venue is required (e.g. Makerspace Lab 2)').max(150),
  equipmentNeeded: z.string().optional(),
  startAt: z.string().min(1, 'Start date & time is required'),
  deadline: z.string().min(1, 'Registration deadline is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').max(500, 'Capacity cannot exceed 500'),
  registrationUrl: z.string().trim().optional().refine(val => {
    if (!val) return true;
    try {
      const url = new URL(val);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, { message: 'Must be a valid web URL starting with https://' }),
  guidelinesAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must review and agree to the MatteLab Event Guidelines.' })
  }),
  publishImmediately: z.boolean().optional()
}).refine(data => {
  const start = new Date(data.startAt).getTime();
  const now = Date.now();
  return start > now;
}, {
  message: 'Event start time must be in the future',
  path: ['startAt']
}).refine(data => {
  const start = new Date(data.startAt).getTime();
  const deadline = new Date(data.deadline).getTime();
  const now = Date.now();
  return deadline > now && deadline <= start;
}, {
  message: 'Registration deadline must be in the future and on or before event start',
  path: ['deadline']
});

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [showGuidelinesDetails, setShowGuidelinesDetails] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      category: 'Workshop',
      description: '',
      venue: 'Makerspace Lab 1',
      equipmentNeeded: '',
      startAt: '',
      deadline: '',
      capacity: 30,
      registrationUrl: '',
      guidelinesAccepted: false,
      publishImmediately: Boolean(isAdmin)
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    if (!currentUser) {
      showToast('Please sign in to submit an event.', 'error');
      return;
    }

    try {
      const result = await createEventProposal(data, currentUser, isAdmin);
      if (result.status === 'published') {
        showToast(`Event "${data.title}" has been published directly to the catalog!`, 'success');
      } else {
        showToast(`Event proposal "${data.title}" submitted! It is now pending admin review.`, 'success');
      }
      reset();
      onEventCreated?.();
      onClose();
    } catch (err) {
      console.error('Failed to submit event:', err);
      showToast(err.message || 'Failed to submit event proposal.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="max-w-2xl w-full max-h-[92vh] flex flex-col rounded-[28px] border-2 border-[#4C4541] bg-[#FCF0DA] p-5 sm:p-8 shadow-[8px_8px_0_#4C4541] text-[#4C4541]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#4C4541]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] flex items-center justify-center shadow-[1.5px_1.5px_0_#4C4541]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-condensed text-xl sm:text-2xl font-bold uppercase leading-none text-[#4C4541]">
                {isAdmin ? 'Create or Schedule Event' : 'Propose Community Event'}
              </h3>
              <p className="font-mono text-xs text-[#4C4541]/70 mt-0.5">
                {isAdmin
                  ? 'Publish an official workshop or schedule a lab event directly.'
                  : 'Submit a workshop or hack session proposal for admin review.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#4C4541] bg-white flex items-center justify-center text-sm font-bold hover:bg-[#F2C46A] transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Status Note Banner */}
          {!isAdmin ? (
            <div className="rounded-2xl p-4 bg-[#AEAC78]/25 border-2 border-[#4C4541] flex items-start gap-3 text-xs text-[#4C4541]">
              <Info size={18} className="text-[#4C4541] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold font-mono uppercase text-xs">Student & Member Proposal Workflow</p>
                <p className="text-[#4C4541]/85 mt-0.5 leading-relaxed font-sans">
                  Anyone can propose events! Your proposal will be submitted with status <span className="font-bold">Pending Review</span>. Once a MatteLab administrator reviews it against the lab safety guidelines, it will be published to the public campus schedule.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-3.5 bg-[#F2C46A]/30 border-2 border-[#4C4541] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4C4541]">
              <div className="flex items-center gap-2 font-mono font-bold">
                <ShieldCheck size={16} />
                <span>Admin Privileges Active: You can publish directly or queue for review</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-mono font-bold select-none">
                <input
                  type="checkbox"
                  {...register('publishImmediately')}
                  className="rounded border-[#4C4541] text-[#4C4541] focus:ring-[#4C4541]"
                />
                <span>Publish Immediately</span>
              </label>
            </div>
          )}

          {/* GUIDELINES ACCORDION / HIGHLIGHT CARD */}
          <div className="rounded-2xl border-2 border-[#4C4541] bg-white overflow-hidden shadow-[2px_2px_0_#4C4541]">
            <button
              type="button"
              onClick={() => setShowGuidelinesDetails(!showGuidelinesDetails)}
              className="w-full px-4 py-3 bg-[#FCF0DA] hover:bg-[#F2C46A]/25 flex items-center justify-between transition-colors text-left border-b border-[#4C4541]/20 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert size={15} className="text-[#4C4541]" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#4C4541]">
                  MatteLab Event Guidelines
                </span>
                <span className="text-[10px] font-bold font-mono bg-[#F2C46A] text-[#4C4541] px-2 py-0.5 rounded-full border border-[#4C4541]">
                  5 Core Rules
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#4C4541]/70">
                <span>{showGuidelinesDetails ? 'Collapse' : 'View Guidelines'}</span>
                {showGuidelinesDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            <div className="p-4 space-y-3 text-xs text-[#4C4541]">
              {showGuidelinesDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {EVENT_GUIDELINES.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className="p-3 rounded-xl bg-[#FCF0DA] border border-[#4C4541]/20 space-y-1"
                    >
                      <div className="flex items-center gap-2 font-bold font-mono text-xs uppercase text-[#4C4541]">
                        <span className="w-4 h-4 rounded-full bg-[#F2C46A] border border-[#4C4541] text-[#4C4541] flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{rule.title}</span>
                      </div>
                      <p className="text-[#4C4541]/80 text-[11px] leading-relaxed pl-6 font-sans">
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 text-[#4C4541]/80 text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <Check size={13} className="text-[#AEAC78]" /> Lab Safety
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Check size={13} className="text-[#AEAC78]" /> Campus Hours (08:30-20:00)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Check size={13} className="text-[#AEAC78]" /> Clean Bench Policy
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Check size={13} className="text-[#AEAC78]" /> 48h Advance Notice
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="md:col-span-2">
              <label htmlFor="evt-title" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">Event Title *</label>
              <input
                id="evt-title"
                type="text"
                placeholder="e.g. Autonomous Robotics & ROS Workshop"
                {...register('title')}
                className={`w-full rounded-2xl bg-white border-2 border-[#4C4541] px-3.5 py-2.5 text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA] ${errors.title ? 'border-rose-500' : ''}`}
              />
              {errors.title && <p className="text-rose-600 text-xs mt-1 font-mono">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="evt-category" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">Category *</label>
              <select
                id="evt-category"
                {...register('category')}
                className="w-full rounded-2xl bg-white border-2 border-[#4C4541] px-3.5 py-2.5 text-xs sm:text-sm text-[#4C4541] focus:outline-none focus:bg-[#FCF0DA]"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Hardware Lab">Hardware Lab</option>
                <option value="Tech Talk">Tech Talk / Seminar</option>
                <option value="Maker Meetup">Maker Meetup</option>
                <option value="Demo Day">Project Demo Day</option>
              </select>
              {errors.category && <p className="text-rose-600 text-xs mt-1 font-mono">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="evt-desc" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">Description & Prerequisites *</label>
            <textarea
              id="evt-desc"
              rows={3}
              placeholder="Outline what makers will build, prerequisites, required kits or laptops..."
              {...register('description')}
              className={`w-full rounded-2xl bg-white border-2 border-[#4C4541] p-3 text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA] ${errors.description ? 'border-rose-500' : ''}`}
            />
            {errors.description && <p className="text-rose-600 text-xs mt-1 font-mono">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="evt-venue" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">Venue / Lab *</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60" />
                <input
                  id="evt-venue"
                  type="text"
                  placeholder="e.g. Makerspace Hardware Lab / Main Seminar Hall"
                  {...register('venue')}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#4C4541] text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA] ${errors.venue ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.venue && <p className="text-rose-600 text-xs mt-1 font-mono">{errors.venue.message}</p>}
            </div>

            <div>
              <label htmlFor="evt-cap" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">Capacity *</label>
              <div className="relative">
                <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60" />
                <input
                  id="evt-cap"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="30"
                  {...register('capacity')}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#4C4541] text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA] ${errors.capacity ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.capacity && <p className="text-rose-600 text-xs mt-1 font-mono">{errors.capacity.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="evt-start" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">Start Date & Time *</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60" />
                <input
                  id="evt-start"
                  type="datetime-local"
                  {...register('startAt')}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#4C4541] text-xs text-[#4C4541] focus:outline-none focus:bg-[#FCF0DA] ${errors.startAt ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.startAt && <p className="text-rose-600 text-xs mt-1 font-mono">{errors.startAt.message}</p>}
            </div>

            <div>
              <label htmlFor="evt-deadline" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">Registration Deadline *</label>
              <div className="relative">
                <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60" />
                <input
                  id="evt-deadline"
                  type="datetime-local"
                  {...register('deadline')}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#4C4541] text-xs text-[#4C4541] focus:outline-none focus:bg-[#FCF0DA] ${errors.deadline ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.deadline && <p className="text-rose-600 text-xs mt-1 font-mono">{errors.deadline.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="evt-equipment" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">
                Equipment Needed <span className="text-[#4C4541]/60">(Optional)</span>
              </label>
              <div className="relative">
                <Wrench size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60" />
                <input
                  id="evt-equipment"
                  type="text"
                  placeholder="e.g. 3D Printers, Soldering Stations"
                  {...register('equipmentNeeded')}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#4C4541] text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="evt-url" className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">
                External Registration URL <span className="text-[#4C4541]/60">(Optional)</span>
              </label>
              <div className="relative">
                <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60" />
                <input
                  id="evt-url"
                  type="url"
                  placeholder="https://tinkerhub.org/... (leave blank for in-app)"
                  {...register('registrationUrl')}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#4C4541] text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA] ${errors.registrationUrl ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.registrationUrl && (
                <p className="text-rose-600 text-xs mt-1 font-mono">{errors.registrationUrl.message}</p>
              )}
            </div>
          </div>

          {/* GUIDELINES ACKNOWLEDGMENT CHECKBOX */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] cursor-pointer select-none">
              <input
                type="checkbox"
                id="guidelines-agree"
                {...register('guidelinesAccepted')}
                className="mt-1 rounded border-[#4C4541] text-[#4C4541] focus:ring-[#4C4541] w-4 h-4 cursor-pointer"
              />
              <div className="text-xs text-[#4C4541]">
                <span className="font-bold font-mono uppercase">
                  I agree to adhere to the MatteLab Community Event Guidelines *
                </span>
                <p className="text-[#4C4541]/80 mt-0.5 leading-relaxed font-sans">
                  I confirm this event complies with lab equipment safety rules, operating hours, and clean bench policies.
                </p>
                {errors.guidelinesAccepted && (
                  <p className="text-rose-600 font-bold font-mono mt-1 flex items-center gap-1">
                    <ShieldAlert size={14} />
                    {errors.guidelinesAccepted.message}
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t-2 border-[#4C4541]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border-2 border-[#4C4541] bg-white text-xs font-bold font-mono uppercase shadow-[1.5px_1.5px_0_#4C4541] cursor-pointer"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
              disabled={isSubmitting}
            >
              <PlusCircle size={15} />
              <span>
                {isSubmitting
                  ? 'Submitting...'
                  : isAdmin && watch('publishImmediately')
                    ? 'Publish Event'
                    : 'Submit Proposal'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
