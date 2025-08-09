import { auth0 } from "@/lib/auth0";
import { requireAuth } from "@/lib/requireAuth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    console.log("Incoming request to worker API");

    const session = await auth0.getSession({ headers: req.headers });
    console.log("Session details:", session);

    if (!session) {
      console.error("Session not found");
      return NextResponse.json({ error: "Unauthorized: No session found" }, { status: 401 });
    }

    const auth = requireAuth(session, { roles: ["worker"] });
    console.log("Authorization details:", auth);

    if (!auth.authorized) {
      console.error("Authorization failed", auth);
      return NextResponse.json({ error: auth.reason }, { status: auth.reason === "unauthorized" ? 401 : 403 });
    }

    return NextResponse.json({ data: "worker data", message: "Welcome to worker dashboard!" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/worker route", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
