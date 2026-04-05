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

async function guardAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.isAdmin);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = apartmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const { id } = await params;
  await prisma.apartment.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.apartment.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
