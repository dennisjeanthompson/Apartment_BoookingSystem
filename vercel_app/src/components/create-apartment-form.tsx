"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateApartmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = new FormData(e.currentTarget);
        const payload = {
          name: String(form.get("name") || ""),
          location: String(form.get("location") || ""),
          pricePerMonth: Number(form.get("pricePerMonth") || 0),
          description: String(form.get("description") || ""),
          image: String(form.get("image") || ""),
          status: String(form.get("status") || "available"),
          maxTenants: Number(form.get("maxTenants") || 1),
        };

        const res = await fetch("/api/admin/apartments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setLoading(false);
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Create failed" }));
          setError(data.error || "Create failed");
          return;
        }

        (e.currentTarget as HTMLFormElement).reset();
        router.refresh();
      }}
    >
      <input name="name" placeholder="Name" className="rounded border px-3 py-2" required />
      <input name="location" placeholder="Location" className="rounded border px-3 py-2" required />
      <input name="pricePerMonth" type="number" step="0.01" placeholder="Price per month" className="rounded border px-3 py-2" required />
      <input name="maxTenants" type="number" placeholder="Max tenants" className="rounded border px-3 py-2" required />
      <input name="image" placeholder="Image URL" className="rounded border px-3 py-2 md:col-span-2" />
      <textarea name="description" placeholder="Description" className="rounded border px-3 py-2 md:col-span-2" />
      <select name="status" className="rounded border px-3 py-2">
        <option value="available">available</option>
        <option value="booked">booked</option>
        <option value="unavailable">unavailable</option>
      </select>
      <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
        {loading ? "Saving..." : "Create Apartment"}
      </button>
      {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
    </form>
  );
}
