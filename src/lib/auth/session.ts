import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db/prisma";
import type { SessionContext } from "./types";

const COOKIE = "jobflow_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function encode(userId: string) {
  const payload = `${userId}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

function decode(value: string) {
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, issuedAt, signature] = parts;
  const payload = `${userId}.${issuedAt}`;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const age = Date.now() - Number(issuedAt);
  if (!userId || !Number.isFinite(age) || age < 0 || age > MAX_AGE * 1000) return null;
  return userId;
}

export function createSessionToken(userId: string) {
  return encode(userId);
}

export async function createSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export const SESSION_COOKIE_NAME = COOKIE;
export const SESSION_COOKIE_MAX_AGE = MAX_AGE;

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<SessionContext | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const userId = decode(raw);
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      businessId: true,
      roleId: true,
      platformRole: true,
      status: true,
      business: { select: { status: true, archivedAt: true } },
    },
  });

  if (!user || !user.businessId || user.status !== "ACTIVE" || user.business?.archivedAt) return null;
  if (["CANCELED", "EXPIRED", "SUSPENDED"].includes(user.business?.status ?? "")) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
      businessId: user.businessId,
      roleId: user.roleId,
      platformRole: user.platformRole,
    },
  };
}
