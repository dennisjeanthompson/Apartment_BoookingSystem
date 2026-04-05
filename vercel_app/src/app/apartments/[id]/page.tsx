import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/image";
import { formatPesos } from "@/lib/currency";

export default async function ApartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apartment = await prisma.apartment.findUnique({
    where: { id },
    include: { amenity: true },
  });

  if (!apartment || apartment.deletedAt) notFound();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="md:col-span-2 overflow-hidden rounded-lg border bg-white">
        <img src={resolveImageUrl(apartment.image)} alt={apartment.name} className="h-80 w-full object-cover" />
        <div className="space-y-3 p-5">
          <h1 className="text-3xl font-bold">{apartment.name}</h1>
          <p className="text-slate-600">{apartment.location}</p>
          <p>{apartment.description ?? "No description provided."}</p>

          <div>
            <h3 className="mb-2 font-semibold">Amenities</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>WiFi: {apartment.amenity?.wifi ? "Yes" : "No"}</li>
              <li>Parking: {apartment.amenity?.parking ? "Yes" : "No"}</li>
              <li>AC: {apartment.amenity?.airConditioning ? "Yes" : "No"}</li>
              <li>Furnished: {apartment.amenity?.furnished ? "Yes" : "No"}</li>
              <li>Gym: {apartment.amenity?.gym ? "Yes" : "No"}</li>
            </ul>
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-lg border bg-white p-5">
        <p className="text-2xl font-bold">{formatPesos(apartment.pricePerMonth.toString())}</p>
        <p className="mb-4 text-sm text-slate-600">per month</p>
        <p className="mb-6 text-sm">Max tenants: {apartment.maxTenants}</p>
        <Link href={`/bookings/new/${apartment.id}`} className="block rounded bg-green-600 px-4 py-2 text-center font-medium text-white">
          Book this apartment
        </Link>
      </aside>
    </div>
  );
}
