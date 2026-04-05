"use client";
import { useEffect } from "react";

export default function ClientErrorSuppressor() {
  useEffect(() => {
    function onUnhandledRejection(e: PromiseRejectionEvent) {
      const reason = (e && (e.reason as any)) || null;
      // Ignore media AbortError caused by rapid play()/pause() calls
      if (
        reason &&
        (reason.name === "AbortError" || reason?.message?.includes?.("play() request was interrupted"))
      ) {
        e.preventDefault();
      }
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection as any);
    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection as any);
  }, []);

  return null;
}
