import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateBookingForm from "@/components/create-booking-form";

export default async function NewBookingPage({ params }: { params: Promise<{ apartmentId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { apartmentId } = await params;

  const apartment = await prisma.apartment.findUnique({ where: { id: apartmentId } });
  if (!apartment || apartment.deletedAt) notFound();

  return (
    <div className="mx-auto max-w-xl rounded-lg border bg-white p-6">
      <h1 className="mb-2 text-2xl font-bold">Book {apartment.name}</h1>
      <p className="mb-4 text-sm text-slate-600">{apartment.location}</p>
      <CreateBookingForm apartmentId={apartment.id} />
    </div>
  );
}
