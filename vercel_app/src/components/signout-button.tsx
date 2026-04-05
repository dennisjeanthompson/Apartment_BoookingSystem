"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="cursor-pointer rounded bg-slate-900 px-3 py-1.5 text-white"
    >
      Logout
    </button>
  );
}
