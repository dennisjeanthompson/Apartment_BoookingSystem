"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");

          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          setLoading(false);
          if (!res.ok) {
            const data = await res.json().catch(() => ({ error: "Registration failed" }));
            setError(data.error || "Registration failed");
            return;
          }

          router.push("/login");
        }}
      >
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full rounded border px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-50">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
