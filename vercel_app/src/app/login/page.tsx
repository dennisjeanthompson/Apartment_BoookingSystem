"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = "/apartments";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
          });
          setLoading(false);

          if (result?.error) {
            setError("Invalid email or password");
            return;
          }

          router.push(result?.url || callbackUrl);
        }}
      >
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
        <button disabled={loading} className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
