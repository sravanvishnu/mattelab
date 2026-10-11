import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

/**
 * Reports whether the MatteLab makerspace is "free", "busy" or "closed" right now.
 *
 * Uses the `bookings` collection with:
 *   start (Timestamp), end (Timestamp), status (string, "cancelled" is ignored)
 *
 * Operating hours: 08:30 (8.5) to 20:00 (20.0).
 */
export function useLabStatus(db, { openHour = 8.5, closeHour = 20 } = {}) {
  const [bookings, setBookings] = useState([]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!db) return;

    try {
      const q = query(
        collection(db, "bookings"),
        where("end", ">", Timestamp.now()),
        orderBy("end"),
        limit(30)
      );

      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list = snap.docs
            .map((d) => d.data())
            .filter((b) => b && b.status !== "cancelled" && b.start && b.end)
            .map((b) => {
              const startDate = b.start.toDate ? b.start.toDate() : new Date(b.start);
              const endDate = b.end.toDate ? b.end.toDate() : new Date(b.end);
              return { start: startDate, end: endDate };
            });
          setBookings(list);
        },
        (err) => {
          // Graceful fallback if unauthenticated or network disconnected
          console.warn("Mascot lab status listener warning:", err?.message || err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("useLabStatus query setup:", err);
    }
  }, [db]);

  // Re-evaluate every minute so "free" flips to "busy" smoothly
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const hour = now.getHours() + now.getMinutes() / 60;
    if (hour < openHour || hour >= closeHour) return { state: "closed" };

    const busy = bookings.some((b) => b.start <= now && b.end > now);
    if (busy) return { state: "busy" };

    const next = bookings
      .filter((b) => b.start > now)
      .sort((a, b) => a.start - b.start)[0];

    return { state: "free", freeUntil: next ? next.start : null };
  }, [bookings, now, openHour, closeHour]);
}
