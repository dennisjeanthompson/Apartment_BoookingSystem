"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="mt-2 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" });
        setLoading(false);
        router.refresh();
      }}
    >
      {loading ? "Cancelling..." : "Cancel"}
    </button>
  );
}
