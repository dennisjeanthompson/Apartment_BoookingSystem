import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({
  apartmentId: z.string().min(1),
  checkInDate: z.iso.datetime(),
  checkOutDate: z.iso.datetime(),
  notes: z.string().max(1000).optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const checkInDate = new Date(parsed.data.checkInDate);
  const checkOutDate = new Date(parsed.data.checkOutDate);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 422 });
  }

  const apartment = await prisma.apartment.findUnique({ where: { id: parsed.data.apartmentId } });
  if (!apartment) {
    return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      apartmentId: apartment.id,
      status: { not: "cancelled" },
      AND: [
        { checkInDate: { lt: checkOutDate } },
        { checkOutDate: { gt: checkInDate } },
      ],
    },
  });

  if (conflict) {
    return NextResponse.json({ error: "Apartment is not available for selected dates" }, { status: 409 });
  }

  const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = (Number(apartment.pricePerMonth) / 30) * nights;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      apartmentId: apartment.id,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending",
      notes: parsed.data.notes,
      payments: {
        create: {
          amount: totalPrice,
          paymentStatus: "pending",
        },
      },
    },
  });

  return NextResponse.json({ ok: true, bookingId: booking.id });
}
