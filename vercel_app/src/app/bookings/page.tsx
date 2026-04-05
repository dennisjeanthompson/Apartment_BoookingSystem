import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPesos } from "@/lib/currency";
import CancelBookingButton from "@/components/cancel-booking-button";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { apartment: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {bookings.length === 0 ? <p>No bookings yet.</p> : null}
      {bookings.map((booking) => (
        <article key={booking.id} className="rounded-lg border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">{booking.apartment.name}</h2>
              <p className="text-sm text-slate-600">
                {booking.checkInDate.toISOString().slice(0, 10)} to {booking.checkOutDate.toISOString().slice(0, 10)}
              </p>
              <p className="text-sm">Status: {booking.status}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatPesos(booking.totalPrice.toString())}</p>
              {booking.status !== "cancelled" ? <CancelBookingButton bookingId={booking.id} /> : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
