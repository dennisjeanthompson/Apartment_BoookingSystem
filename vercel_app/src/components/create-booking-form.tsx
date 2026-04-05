"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBookingForm({ apartmentId }: { apartmentId: string }) {
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apartmentId,
            checkInDate: new Date(checkInDate).toISOString(),
            checkOutDate: new Date(checkOutDate).toISOString(),
            notes,
          }),
        });

        setLoading(false);

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Booking failed" }));
          setError(data.error || "Booking failed");
          return;
        }

        router.push("/bookings");
        router.refresh();
      }}
    >
      <div>
        <label className="mb-1 block text-sm">Check-in</label>
        <input type="date" className="w-full rounded border px-3 py-2" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Check-out</label>
        <input type="date" className="w-full rounded border px-3 py-2" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Notes</label>
        <textarea className="w-full rounded border px-3 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
        {loading ? "Submitting..." : "Confirm Booking"}
      </button>
    </form>
  );
}
