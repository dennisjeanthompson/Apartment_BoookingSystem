"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteApartmentButton({ apartmentId }: { apartmentId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <button
      className="rounded bg-red-600 px-3 py-1.5 text-white disabled:opacity-50"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/admin/apartments/${apartmentId}`, { method: "DELETE" });
        setLoading(false);
        router.refresh();
      }}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
