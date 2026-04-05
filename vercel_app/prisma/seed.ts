import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const adminPassword = await hash("password", 10);
  const userPassword = await hash("password", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      isAdmin: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Student User",
      email: "student@example.com",
      password: userPassword,
      isAdmin: false,
    },
  });

  const apartments = [
    {
      name: "Maple Hall Flat A",
      location: "North Campus",
      pricePerMonth: 500,
      description: "Cozy Apartment Living Room with Plants and Sofa",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      status: "available",
      maxTenants: 2,
    },
    {
      name: "Oak Residence 3B",
      location: "West Campus",
      pricePerMonth: 750,
      description: "Modern White Apartment Kitchen with Island",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
      status: "available",
      maxTenants: 3,
    },
    {
      name: "Pine Studio",
      location: "South Campus",
      pricePerMonth: 350,
      description: "Bright Modern Apartment Living Room with Yellow Chair",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      status: "available",
      maxTenants: 1,
    },
  ];

  for (const data of apartments) {
    const apartment = await prisma.apartment.upsert({
      where: { name: data.name },
      update: data,
      create: data,
    });

    await prisma.amenity.upsert({
      where: { apartmentId: apartment.id },
      update: {
        wifi: true,
        parking: false,
        airConditioning: true,
        furnished: true,
        gym: false,
      },
      create: {
        apartmentId: apartment.id,
        wifi: true,
        parking: false,
        airConditioning: true,
        furnished: true,
        gym: false,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
