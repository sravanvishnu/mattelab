import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Link as LinkIcon, PlusCircle, Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const { currentUser, isOrganizer } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [startAt, setStartAt] = useState('');
  const [deadline, setDeadline] = useState('');
  const [capacity, setCapacity] = useState('30');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !isOrganizer) {
      showToast('You do not have organizer privileges.', 'error');
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const trimmedVenue = venue.trim();
    const parsedCapacity = parseInt(capacity, 10);
    const trimmedUrl = registrationUrl.trim();

    if (!trimmedTitle || !trimmedDesc || !trimmedVenue || !startAt || !deadline) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const startDate = new Date(startAt);
    const deadlineDate = new Date(deadline);
    const now = new Date();

    if (startDate <= now) {
      showToast('Event start time must be in the future.', 'error');
      return;
    }

    if (deadlineDate <= now || deadlineDate > startDate) {
      showToast('Registration deadline must be before the event starts.', 'error');
      return;
    }

    if (isNaN(parsedCapacity) || parsedCapacity < 1 || parsedCapacity > 500) {
      showToast('Capacity must be between 1 and 500 participants.', 'error');
      return;
    }

    if (trimmedUrl) {
      try {
        const parsed = new URL(trimmedUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          throw new Error('Invalid protocol');
        }
      } catch {
        showToast('Please provide a valid web URL starting with https://', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'events'), {
        title: trimmedTitle,
        description: trimmedDesc,
        venue: trimmedVenue,
        startAt: Timestamp.fromDate(startDate),
        registrationDeadline: Timestamp.fromDate(deadlineDate),
        capacity: parsedCapacity,
        registrationUrl: trimmedUrl || null,
        status: 'published',
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      });

      showToast(`Event "${trimmedTitle}" published successfully!`, 'success');
      onEventCreated?.();
      onClose();
    } catch (err) {
      console.error('Failed to create event:', err);
      showToast('Failed to create event. Check Firestore permissions.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon-badge primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="modal-title">Create New Event</h3>
              <p className="modal-subtitle">Publish a workshop, talk, or makerspace session</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="evt-title">Event Title *</label>
            <input
              id="evt-title"
              type="text"
              placeholder="e.g. IoT Hardware Prototyping Workshop"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="evt-desc">Description *</label>
            <textarea
              id="evt-desc"
              rows={3}
              placeholder="Provide event details, prerequisites, prerequisites, and what makers will build..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={2000}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="evt-venue">Venue / Location *</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input
                  id="evt-venue"
                  type="text"
                  placeholder="e.g. Makerspace Lab 2 / Seminar Hall"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  maxLength={150}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="evt-cap">Max Participants *</label>
              <div className="input-with-icon">
                <Users size={16} className="input-icon" />
                <input
                  id="evt-cap"
                  type="number"
                  min="1"
                  max="500"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="evt-start">Event Date & Time *</label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="evt-start"
                  type="datetime-local"
                  value={startAt}
                  onChange={e => setStartAt(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="evt-deadline">Registration Deadline *</label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="evt-deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="evt-url">
              External Registration URL <span className="text-muted text-xs">(Optional)</span>
            </label>
            <div className="input-with-icon">
              <LinkIcon size={16} className="input-icon" />
              <input
                id="evt-url"
                type="url"
                placeholder="https://tinkerhub.org/... (leave empty for in-app registration)"
                value={registrationUrl}
                onChange={e => setRegistrationUrl(e.target.value)}
                maxLength={2048}
              />
            </div>
            <p className="form-help-text">
              If provided, students will be redirected to this link rather than registering inside MatteLab.
            </p>
          </div>

          <div className="modal-actions pt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={submitting}
            >
              <PlusCircle size={16} />
              {submitting ? 'Creating Event...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
