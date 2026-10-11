import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * MatteLab Community & Makerspace Event Guidelines
 */
export const EVENT_GUIDELINES = [
  {
    id: 'safety',
    title: 'Makerspace Safety & Equipment Protocol',
    desc: 'High-power machinery (3D printers, laser cutters, CNCs, soldering stations) must adhere to lab safety rules with appropriate PPE and supervisor presence.'
  },
  {
    id: 'academic',
    title: 'Maker & Technical Purpose',
    desc: 'Workshops must foster hands-on engineering, creative fabrication, open source, or technical skill sharing. No commercial or unverified external promotions.'
  },
  {
    id: 'timing',
    title: 'Lab Operating Hours & Lead Time',
    desc: 'Events must be held between 08:30 AM and 08:00 PM on CET campus. Proposals must be submitted at least 48 hours in advance for admin review.'
  },
  {
    id: 'capacity',
    title: 'Capacity & Inclusivity',
    desc: 'Participant limits must respect bench and room safety limits (up to 500 max). Sessions must be open and accessible to students across all branches.'
  },
  {
    id: 'cleanliness',
    title: 'Clean Workbench Responsibility',
    desc: 'The event organizer takes full responsibility for clearing worktables, properly storing electronic components, and disposing of scrap materials.'
  }
];

/**
 * Create a new event proposal (for students/users: status is 'pending'; for admins: 'published' by default)
 */
export async function createEventProposal(formData, currentUser, isAdmin = false) {
  if (!currentUser) {
    throw new Error('Authentication required to submit events.');
  }

  if (!formData.guidelinesAccepted) {
    throw new Error('You must accept the MatteLab Event Guidelines before submitting.');
  }

  const startDate = new Date(formData.startAt);
  const deadlineDate = new Date(formData.deadline);
  const now = new Date();

  if (startDate <= now) {
    throw new Error('Event date and time must be in the future.');
  }

  if (deadlineDate <= now || deadlineDate > startDate) {
    throw new Error('Registration deadline must be in the future and prior to the event start.');
  }

  const capacity = parseInt(formData.capacity, 10);
  if (isNaN(capacity) || capacity < 1 || capacity > 500) {
    throw new Error('Capacity must be between 1 and 500 participants.');
  }

  // Admins can choose to publish immediately or submit as pending
  const targetStatus = isAdmin && formData.publishImmediately !== false ? 'published' : 'pending';

  const eventPayload = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    category: formData.category || 'Workshop',
    venue: formData.venue.trim(),
    equipmentNeeded: formData.equipmentNeeded?.trim() || '',
    startAt: Timestamp.fromDate(startDate),
    registrationDeadline: Timestamp.fromDate(deadlineDate),
    capacity,
    registrationUrl: formData.registrationUrl?.trim() || null,
    status: targetStatus,
    guidelinesAccepted: true,
    createdBy: currentUser.uid,
    creatorName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Maker',
    creatorEmail: currentUser.email || '',
    createdAt: serverTimestamp(),
    approvedBy: targetStatus === 'published' && isAdmin ? currentUser.uid : null,
    approvedAt: targetStatus === 'published' && isAdmin ? serverTimestamp() : null,
    rejectedBy: null,
    rejectedAt: null,
    rejectionReason: null
  };

  const docRef = await addDoc(collection(db, 'events'), eventPayload);
  return { id: docRef.id, status: targetStatus };
}

/**
 * Admin action: Approve an event and make it publicly visible
 */
export async function approveEvent(eventId, adminUser) {
  if (!adminUser) throw new Error('Admin credentials required.');
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, {
    status: 'published',
    approvedBy: adminUser.uid,
    approvedByName: adminUser.displayName || adminUser.email || 'Admin',
    approvedAt: serverTimestamp(),
    rejectedBy: null,
    rejectedAt: null,
    rejectionReason: null
  });
}

/**
 * Admin action: Reject an event with an optional reason
 */
export async function rejectEvent(eventId, adminUser, reason = '') {
  if (!adminUser) throw new Error('Admin credentials required.');
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, {
    status: 'rejected',
    rejectedBy: adminUser.uid,
    rejectedByName: adminUser.displayName || adminUser.email || 'Admin',
    rejectedAt: serverTimestamp(),
    rejectionReason: reason.trim() || 'Proposal does not align with current lab schedule or guidelines.'
  });
}

/**
 * Delete an event (Admins or creator if pending)
 */
export async function deleteEvent(eventId) {
  const eventRef = doc(db, 'events', eventId);
  await deleteDoc(eventRef);
}

/**
 * Fetch all events categorized by status and user association
 */
export async function fetchAllEvents(currentUser, isAdmin = false) {
  const eventsQuery = query(collection(db, 'events'), orderBy('startAt', 'asc'));
  const snapshot = await getDocs(eventsQuery);
  const now = Date.now();

  const published = [];
  const pending = [];
  const rejected = [];
  const myProposals = [];
  const userRegistered = new Set();

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const eventId = docSnap.id;
    const item = { id: eventId, ...data };

    // Published future events for catalog
    if (data.status === 'published' && data.startAt && data.startAt.toMillis() >= now) {
      published.push(item);
    }

    // Pending events (for admin approval queue)
    if (data.status === 'pending') {
      pending.push(item);
    }

    // Rejected events (for history/creator feedback)
    if (data.status === 'rejected') {
      rejected.push(item);
    }

    // Events submitted by current user
    if (currentUser && data.createdBy === currentUser.uid) {
      myProposals.push(item);
    }

    // Check user registration on published events
    if (currentUser && data.status === 'published') {
      try {
        const regRef = doc(db, 'events', eventId, 'registrations', currentUser.uid);
        const regSnap = await getDoc(regRef);
        if (regSnap.exists()) {
          userRegistered.add(eventId);
        }
      } catch (err) {
        // silently handle missing registration subcollection
      }
    }
  }

  return {
    published,
    pending,
    rejected,
    myProposals,
    registeredEventIds: userRegistered
  };
}
