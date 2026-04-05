import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (!session.user.isAdmin) redirect("/apartments");

  const [apartmentsCount, bookingsCount, recentBookings] = await Promise.all([
    prisma.apartment.count({ where: { deletedAt: null } }),
    prisma.booking.count({ where: { deletedAt: null } }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { apartment: true, user: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/apartments" className="rounded bg-blue-600 px-4 py-2 text-white">
          Manage Apartments
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">Apartments: {apartmentsCount}</div>
        <div className="rounded-lg border bg-white p-4">Bookings: {bookingsCount}</div>
      </div>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Recent Bookings</h2>
        <ul className="space-y-2 text-sm">
          {recentBookings.map((b) => (
            <li key={b.id} className="rounded border p-3">
              {b.user.name} booked {b.apartment.name} ({b.status})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
