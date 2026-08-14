import { db } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "./password";
import { createSessionToken } from "./session";
import { PlanCode } from "@/generated/prisma/client";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "business";
}

async function uniqueSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  for (let i = 1; await db.business.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`;
  return slug;
}

export async function registerOwner(input: { businessName: string; firstName: string; lastName?: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("An account with this email already exists.");

  const passwordHash = await hashPassword(input.password);
  const slug = await uniqueSlug(input.businessName);
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const plan = await db.plan.findUnique({ where: { code: PlanCode.PROFESSIONAL } });
  if (!plan) throw new Error("Professional plan is not seeded.");

  const result = await db.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: input.businessName.trim(),
        slug,
        email,
        status: "TRIAL",
        trialEndsAt,
      },
    });
    const role = await tx.role.create({
      data: { businessId: business.id, name: "Owner", description: "Business owner", isSystemRole: true },
    });
    const user = await tx.user.create({
      data: {
        businessId: business.id,
        email,
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName?.trim() || null,
        roleId: role.id,
        status: "ACTIVE",
      },
    });
    await tx.subscription.create({
      data: {
        businessId: business.id,
        planId: plan.id,
        status: "TRIALING",
        billingInterval: "MONTHLY",
        trialStartsAt: now,
        trialEndsAt,
      },
    });
    return user;
  });

  return { userId: result.id, sessionToken: createSessionToken(result.id) };
}

export async function authenticate(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user?.passwordHash || user.status !== "ACTIVE" || !user.businessId) throw new Error("Invalid email or password.");
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password.");
  return { userId: user.id, sessionToken: createSessionToken(user.id) };
}
