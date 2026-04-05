import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPesos } from "@/lib/currency";
import { resolveImageUrl } from "@/lib/image";

type Props = {
  searchParams: Promise<{
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
};

function buildQuery(sp: { q?: string; minPrice?: string; maxPrice?: string; page?: string }, page: number) {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.minPrice) params.set("minPrice", sp.minPrice);
  if (sp.maxPrice) params.set("maxPrice", sp.maxPrice);
  params.set("page", String(page));
  return params.toString();
}

export default async function ApartmentsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page || 1));
  const pageSize = 9;

  const where = {
    deletedAt: null,
    status: "available",
    ...(sp.q
      ? {
          OR: [
            { name: { contains: sp.q, mode: "insensitive" as const } },
            { location: { contains: sp.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(sp.minPrice ? { pricePerMonth: { gte: Number(sp.minPrice) } } : {}),
    ...(sp.maxPrice
      ? {
          pricePerMonth: {
            ...(sp.minPrice ? { gte: Number(sp.minPrice) } : {}),
            lte: Number(sp.maxPrice),
          },
        }
      : {}),
  };

  const [apartments, total] = await Promise.all([
    prisma.apartment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.apartment.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Apartment Listings</h1>
      <form className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-4 md:grid-cols-4">
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Search by name or location" className="rounded border px-3 py-2" />
        <input name="minPrice" defaultValue={sp.minPrice ?? ""} placeholder="Min price" className="rounded border px-3 py-2" />
        <input name="maxPrice" defaultValue={sp.maxPrice ?? ""} placeholder="Max price" className="rounded border px-3 py-2" />
        <button className="rounded bg-blue-600 px-4 py-2 font-medium text-white">Filter</button>
      </form>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {apartments.map((apartment) => (
          <article key={apartment.id} className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <img
              src={resolveImageUrl(apartment.image)}
              alt={apartment.name}
              className="h-48 w-full object-cover"
            />
            <div className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">{apartment.name}</h2>
              <p className="text-sm text-slate-600">{apartment.location}</p>
              <p className="font-bold">{formatPesos(apartment.pricePerMonth.toString())} / month</p>
              <div className="flex items-center justify-between pt-2">
                <Link href={`/apartments/${apartment.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
                <Link href={`/bookings/new/${apartment.id}`} className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white">
                  Book
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <Link
            href={`/apartments?${buildQuery(sp, Math.max(1, page - 1))}`}
            className="rounded border px-3 py-1.5"
          >
            Prev
          </Link>
          <Link
            href={`/apartments?${buildQuery(sp, Math.min(totalPages, page + 1))}`}
            className="rounded border px-3 py-1.5"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
