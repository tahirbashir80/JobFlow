import { NextResponse } from "next/server";
import { z } from "zod";
import { registerOwner } from "@/lib/auth/service";

const schema = z.object({
  businessName: z.string().trim().min(2).max(120),
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().max(80).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const result = await registerOwner(input);
    const response = NextResponse.json({ ok: true, redirectTo: "/onboarding/business" }, { status: 201 });
    response.cookies.set({
      name: "jobflow_session",
      value: result.sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    const message = error instanceof z.ZodError ? "Please check the form fields." : error instanceof Error ? error.message : "Unable to create account.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
