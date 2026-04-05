import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const canManage = session.user.isAdmin || booking.userId === session.user.id;
  if (!canManage) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.booking.update({ where: { id }, data: { status: "cancelled" } });
  return NextResponse.json({ ok: true });
}
