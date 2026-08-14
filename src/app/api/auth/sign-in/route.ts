import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate } from "@/lib/auth/service";
const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const result = await authenticate(input.email, input.password);
    const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
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
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
