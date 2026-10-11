import {
  collection,
  doc,
  runTransaction,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Creates a booking inside a Firestore transaction with overlap verification.
 * 
 * Overlap check:
 * A collision exists if: existing.start < new.end AND existing.end > new.start
 */
export async function createBooking({
  resourceId,
  userId,
  userName,
  userEmail,
  title,
  notes = '',
  start,
  end
}) {
  if (!resourceId || !userId || !start || !end) {
    throw new Error('Missing required booking parameters.');
  }

  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid start or end date.');
  }

  if (endDate <= startDate) {
    throw new Error('End time must be after start time.');
  }

  const startTs = Timestamp.fromDate(startDate);
  const endTs = Timestamp.fromDate(endDate);

  const resourceRef = doc(db, 'resources', resourceId);

  return await runTransaction(db, async (transaction) => {
    // 1. Check resource existence and active status
    const resourceSnap = await transaction.get(resourceRef);
    if (!resourceSnap.exists()) {
      throw new Error('Selected machinery/space does not exist.');
    }
    const resourceData = resourceSnap.data();
    if (resourceData.status === 'inactive') {
      throw new Error('This equipment is currently inactive or under maintenance.');
    }

    // 2. Query potential overlapping bookings for this resource
    // Active bookings with start < new.end
    const overlapQuery = query(
      collection(db, 'bookings'),
      where('resourceId', '==', resourceId),
      where('status', '==', 'confirmed'),
      where('start', '<', endTs)
    );

    const snapshot = await getDocs(overlapQuery);

    // Filter for true interval overlap: existing.start < new.end && existing.end > new.start
    const conflictingBooking = snapshot.docs.find((docSnap) => {
      const b = docSnap.data();
      if (!b.start || !b.end) return false;
      const bStartMs = b.start.toMillis ? b.start.toMillis() : new Date(b.start).getTime();
      const bEndMs = b.end.toMillis ? b.end.toMillis() : new Date(b.end).getTime();

      return bStartMs < endTs.toMillis() && bEndMs > startTs.toMillis();
    });

    if (conflictingBooking) {
      const conflictData = conflictingBooking.data();
      const conflictStart = conflictData.start?.toDate ? conflictData.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      const conflictEnd = conflictData.end?.toDate ? conflictData.end.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      throw new Error(
        `This time slot overlaps with an existing reservation (${conflictStart} - ${conflictEnd}). Please select a different time.`
      );
    }

    // 3. Concurrency lock on resource document
    transaction.update(resourceRef, {
      lastBookingAt: serverTimestamp()
    });

    // 4. Create the booking document
    const newBookingRef = doc(collection(db, 'bookings'));
    const bookingPayload = {
      resourceId,
      userId,
      userName: userName || 'Student Maker',
      userEmail: userEmail || '',
      title: title.trim(),
      notes: notes?.trim() || '',
      start: startTs,
      end: endTs,
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    transaction.set(newBookingRef, bookingPayload);

    return {
      id: newBookingRef.id,
      ...bookingPayload
    };
  });
}

/**
 * Real-time listener for bookings filtered by resource and visible calendar date range.
 * Avoids reading excess historical or far-future documents.
 */
export function subscribeToResourceBookings({
  resourceId,
  startDate,
  endDate,
  onUpdate,
  onError
}) {
  if (!resourceId || !startDate || !endDate) {
    return () => {};
  }

  // Add 1-day buffer on boundaries so all sessions touching the view are fetched
  const bufferedStart = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
  const bufferedEnd = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

  const startTs = Timestamp.fromDate(bufferedStart);
  const endTs = Timestamp.fromDate(bufferedEnd);

  const q = query(
    collection(db, 'bookings'),
    where('resourceId', '==', resourceId),
    where('status', '==', 'confirmed'),
    where('start', '>=', startTs),
    where('start', '<=', endTs)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const bookings = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          start: data.start?.toDate ? data.start.toDate() : new Date(data.start),
          end: data.end?.toDate ? data.end.toDate() : new Date(data.end)
        };
      });
      onUpdate(bookings);
    },
    (err) => {
      console.error('Error in bookings subscription:', err);
      onError?.(err);
    }
  );
}

/**
 * Cancel a booking (for the owner or admin).
 */
export async function cancelBooking(bookingId, userId, isAdmin = false) {
  if (!bookingId || !userId) {
    throw new Error('Missing booking ID or user authentication.');
  }

  const bookingRef = doc(db, 'bookings', bookingId);

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(bookingRef);
    if (!snap.exists()) {
      throw new Error('Booking reservation not found.');
    }

    const booking = snap.data();
    if (!isAdmin && booking.userId !== userId) {
      throw new Error('You are only authorized to cancel your own reservations.');
    }

    if (booking.status === 'cancelled') {
      throw new Error('This reservation is already cancelled.');
    }

    transaction.update(bookingRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      cancelledBy: userId
    });

    return true;
  });
}

/**
 * Real-time listener for all active bookings owned by the current user.
 */
export function subscribeToUserBookings(userId, onUpdate, onError) {
  if (!userId) return () => {};

  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    where('status', '==', 'confirmed')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const bookings = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          start: data.start?.toDate ? data.start.toDate() : new Date(data.start),
          end: data.end?.toDate ? data.end.toDate() : new Date(data.end)
        };
      });
      bookings.sort((a, b) => b.start.getTime() - a.start.getTime());
      onUpdate(bookings);
    },
    (err) => {
      console.error('Error fetching user bookings:', err);
      onError?.(err);
    }
  );
}
