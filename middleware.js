// middleware.ts
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";
import { requireAuth } from "./lib/requireAuth";

export async function middleware(request) {
  const authRes = await auth0.middleware(request);
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/auth") || pathname === "/") {
    return authRes;
  }

  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login`);
  }

//   const token = session.tokenSet.accessToken;
//   if(token){
//     try{
//         const decoded = jwtDecode(token);
//         roles = decoded["https://healthcare.com/roles"] || [];
//         console.log(roles);
//     }
//     catch(err) {
//         console.error("Invalid token:",err);
//     }
//   }
  
  if(pathname.startsWith("/manager")){
    const auth = requireAuth(session, {roles:["manager"]});
    if(!auth.authorized){
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login`);
}
  }


  return authRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
