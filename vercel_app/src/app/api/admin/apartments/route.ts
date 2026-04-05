import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const apartmentSchema = z.object({
  name: z.string().min(2).max(255),
  location: z.string().min(2).max(255),
  pricePerMonth: z.coerce.number().min(0),
  description: z.string().max(5000).optional().nullable(),
  image: z.string().max(3000).optional().nullable(),
  status: z.enum(["available", "booked", "unavailable"]),
  maxTenants: z.coerce.number().int().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = apartmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const apartment = await prisma.apartment.create({
    data: {
      ...parsed.data,
      amenity: {
        create: {
          wifi: false,
          parking: false,
          airConditioning: false,
          furnished: false,
          gym: false,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, apartmentId: apartment.id });
}
