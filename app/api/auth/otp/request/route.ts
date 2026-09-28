import { NextResponse } from "next/server";
import { AuthError, requestOtp } from "@/lib/auth/backend";
import { normaliseIdentifier } from "@/lib/validators";

/** POST /api/auth/otp/request — sends a one-time code to a phone number or e-mail. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const channel = body?.channel === "email" ? "email" : body?.channel === "phone" ? "phone" : null;
  const purpose = body?.purpose === "register" ? "register" : "login";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : undefined;
  const identifier =
    channel && typeof body?.identifier === "string" ? normaliseIdentifier(channel, body.identifier) : null;

  if (!channel || !identifier) {
    return NextResponse.json({ message: "Enter a valid phone number or e-mail." }, { status: 400 });
  }
  if (purpose === "register" && !name) {
    return NextResponse.json({ message: "Enter your name." }, { status: 400 });
  }

  try {
    const result = await requestOtp({ channel, identifier, purpose, name });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 502;
    const message = err instanceof AuthError ? err.message : "Couldn't send the code. Please try again.";
    return NextResponse.json({ message }, { status });
  }
}
