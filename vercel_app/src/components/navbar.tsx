import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/signout-button";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/apartments" className="text-xl font-semibold">
          Apartment Booking
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/apartments">Browse</Link>
          {session?.user ? (
            <>
              <Link href="/bookings">My Bookings</Link>
              {session.user.isAdmin ? <Link href="/admin">Admin</Link> : null}
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
