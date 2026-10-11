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
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-lg max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="modal-icon-badge primary bg-[#c26e47]/20 text-[#e08253] border border-[#c26e47]/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="modal-title text-lg font-bold text-white">
                {isAdmin ? 'Create or Schedule Event' : 'Propose Community Event'}
              </h3>
              <p className="modal-subtitle text-xs text-slate-400">
                {isAdmin
                  ? 'Publish an official workshop or schedule a lab event directly.'
                  : 'Submit a workshop or hack session proposal for admin review.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn text-slate-400 hover:text-white"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form flex-1 overflow-y-auto space-y-5 py-4 px-1 pr-2">
          
          {/* Status Note Banner */}
          {!isAdmin ? (
            <div className="rounded-xl p-3.5 bg-blue-500/10 border border-blue-500/25 flex items-start gap-3 text-xs text-blue-200">
              <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-100">Student & Member Proposal Workflow</p>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  Anyone can propose events! Your proposal will be submitted with status <span className="font-semibold text-amber-300">Pending Review</span>. Once a MatteLab administrator reviews it against the lab safety guidelines, it will be published to the public campus schedule.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-200 font-medium">
                <ShieldCheck size={16} className="text-amber-400" />
                <span>Admin Privileges Active: You can publish directly or save for queue</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  {...register('publishImmediately')}
                  className="rounded border-slate-700 text-[#c26e47] focus:ring-[#c26e47]"
                />
                <span className="font-medium text-xs">Publish Immediately</span>
              </label>
            </div>
          )}

          {/* GUIDELINES ACCORDION / HIGHLIGHT CARD */}
          <div className="rounded-xl border border-[#c26e47]/30 bg-[#1a1e23] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowGuidelinesDetails(!showGuidelinesDetails)}
              className="w-full px-4 py-3 bg-[#20252b] hover:bg-[#252b33] flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={16} className="text-[#e08253]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  MatteLab Event Host Guidelines & Code
                </span>
                <span className="text-[10px] font-semibold bg-[#c26e47]/20 text-[#e08253] px-2 py-0.5 rounded-full border border-[#c26e47]/30">
                  5 Core Rules
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>{showGuidelinesDetails ? 'Collapse' : 'View Guidelines'}</span>
                {showGuidelinesDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {/* Quick summary or expanded details */}
            <div className="p-4 space-y-3 text-xs">
              {showGuidelinesDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {EVENT_GUIDELINES.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className="p-3 rounded-lg bg-[#14171a] border border-white/5 space-y-1 hover:border-[#c26e47]/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                        <span className="w-4 h-4 rounded-full bg-[#c26e47]/30 text-[#e08253] flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{rule.title}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed pl-6">
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Check size={13} className="text-emerald-400" /> Lab Safety & Equipment
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Check size={13} className="text-emerald-400" /> CET Campus Hours
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Check size={13} className="text-emerald-400" /> Clean Workbench Policy
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Check size={13} className="text-emerald-400" /> 48h Advance Notice
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 form-group">
              <label htmlFor="evt-title">Event Title *</label>
              <input
                id="evt-title"
                type="text"
                placeholder="e.g. Autonomous Robotics & ROS Workshop"
                {...register('title')}
                className={errors.title ? 'border-rose-500' : ''}
              />
              {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="evt-category">Category *</label>
              <select id="evt-category" {...register('category')}>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Hardware Lab">Hardware Lab</option>
                <option value="Tech Talk">Tech Talk / Seminar</option>
                <option value="Maker Meetup">Maker Meetup</option>
                <option value="Demo Day">Project Demo Day</option>
              </select>
              {errors.category && <p className="text-rose-400 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="evt-desc">Event Description & Prerequisites *</label>
            <textarea
              id="evt-desc"
              rows={3}
              placeholder="Outline what makers will build, prerequisites, required kits or laptops, and target outcomes..."
              {...register('description')}
              className={errors.description ? 'border-rose-500' : ''}
            />
            {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="evt-venue">Venue / Campus Location *</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon text-slate-400" />
                <input
                  id="evt-venue"
                  type="text"
                  placeholder="e.g. Makerspace Hardware Lab / Main Seminar Hall"
                  {...register('venue')}
                  className={errors.venue ? 'border-rose-500' : ''}
                />
              </div>
              {errors.venue && <p className="text-rose-400 text-xs mt-1">{errors.venue.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="evt-cap">Participant Capacity *</label>
              <div className="input-with-icon">
                <Users size={16} className="input-icon text-slate-400" />
                <input
                  id="evt-cap"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="30"
                  {...register('capacity')}
                  className={errors.capacity ? 'border-rose-500' : ''}
                />
              </div>
              {errors.capacity && <p className="text-rose-400 text-xs mt-1">{errors.capacity.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="evt-start">Event Date & Start Time *</label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon text-slate-400" />
                <input
                  id="evt-start"
                  type="datetime-local"
                  {...register('startAt')}
                  className={errors.startAt ? 'border-rose-500' : ''}
                />
              </div>
              {errors.startAt && <p className="text-rose-400 text-xs mt-1">{errors.startAt.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="evt-deadline">Registration Deadline *</label>
              <div className="input-with-icon">
                <Clock size={16} className="input-icon text-slate-400" />
                <input
                  id="evt-deadline"
                  type="datetime-local"
                  {...register('deadline')}
                  className={errors.deadline ? 'border-rose-500' : ''}
                />
              </div>
              {errors.deadline && <p className="text-rose-400 text-xs mt-1">{errors.deadline.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="evt-equipment">
                Machinery / Equipment Needed <span className="text-muted text-xs">(Optional)</span>
              </label>
              <div className="input-with-icon">
                <Wrench size={16} className="input-icon text-slate-400" />
                <input
                  id="evt-equipment"
                  type="text"
                  placeholder="e.g. 3D Printers, Soldering Irons, Oscilloscopes"
                  {...register('equipmentNeeded')}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="evt-url">
                External Link / Ticket URL <span className="text-muted text-xs">(Optional)</span>
              </label>
              <div className="input-with-icon">
                <LinkIcon size={16} className="input-icon text-slate-400" />
                <input
                  id="evt-url"
                  type="url"
                  placeholder="https://tinkerhub.org/... (leave blank for in-app)"
                  {...register('registrationUrl')}
                  className={errors.registrationUrl ? 'border-rose-500' : ''}
                />
              </div>
              {errors.registrationUrl && (
                <p className="text-rose-400 text-xs mt-1">{errors.registrationUrl.message}</p>
              )}
            </div>
          </div>

          {/* GUIDELINES ACKNOWLEDGMENT CHECKBOX */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#171b1f] border border-white/10 hover:border-[#c26e47]/40 cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                id="guidelines-agree"
                {...register('guidelinesAccepted')}
                className="mt-1 rounded border-slate-700 text-[#c26e47] focus:ring-[#c26e47] w-4 h-4 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-white">
                  I agree to adhere to the MatteLab Community Event Guidelines *
                </span>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  I confirm this event complies with lab equipment safety rules, operating hours, and clean bench policies. I understand that proposals must be approved by an administrator before appearing on the public calendar.
                </p>
                {errors.guidelinesAccepted && (
                  <p className="text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                    <ShieldAlert size={14} />
                    {errors.guidelinesAccepted.message}
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              className="btn btn-secondary px-5 py-2.5 text-xs font-semibold"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 bg-gradient-to-r from-[#c26e47] to-[#d97736] hover:from-[#b05f3b] hover:to-[#c6682b] text-white shadow-md shadow-[#c26e47]/25"
              disabled={isSubmitting}
            >
              <PlusCircle size={16} />
              <span>
                {isSubmitting
                  ? 'Submitting...'
                  : isAdmin && watch('publishImmediately')
                  ? 'Publish Event'
                  : 'Submit Proposal for Approval'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
