import { auth0 } from "@/lib/auth0";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth0.getSession({ headers: req.headers });
    console.log(session);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const token = session.tokenSet.accessToken;
    const decoded = jwtDecode(token);
    console.log(decoded);
    const roles = decoded["https://healthcare.com/roles"] || [];
    console.log(roles);
    return NextResponse.json({ roles }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}