import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) {
    return NextResponse.json({ error: "Email already used" }, { status: 409 });
  }

  const password = await hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password,
    },
  });

  return NextResponse.json({ ok: true });
}
