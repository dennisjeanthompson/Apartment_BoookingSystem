import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateApartmentForm from "@/components/create-apartment-form";
import DeleteApartmentButton from "@/components/delete-apartment-button";

export default async function AdminApartmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (!session.user.isAdmin) redirect("/apartments");

  const apartments = await prisma.apartment.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Apartments</h1>
      <CreateApartmentForm />

      <div className="space-y-3">
        {apartments.map((a) => (
          <article key={a.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{a.name}</h2>
                <p className="text-sm text-slate-600">{a.location}</p>
              </div>
              <DeleteApartmentButton apartmentId={a.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
