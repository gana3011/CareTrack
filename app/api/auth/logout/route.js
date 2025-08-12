// import { NextResponse } from "next/server";

// export async function GET(){
//   const auth0LogoutUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/oidc/logout`);
//   auth0LogoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID);
//   auth0LogoutUrl.searchParams.set('post_logout_redirect_uri', process.env.NEXT_BASE_URL);

//   const response = NextResponse.redirect(auth0LogoutUrl.toString());

//   response.cookies.set("userId", "", {
//     path: "/",
//     maxAge: 0,
//     httpOnly: true,
//     secure: false,
//     sameSite: "strict"
//   });
//   response.cookies.set("roles", "", {
//     path: "/",
//     maxAge: 0,
//     httpOnly: true,
//     secure: false,
//     sameSite: "strict"
//   });

//   return response;
// }

import { NextResponse } from "next/server";

export async function GET(request) {
 const { protocol, host } = new URL(request.url);

  // Build absolute URL for /logout page
  const logoutUrl = `${protocol}//${host}/auth/logout`;
 const response = NextResponse.redirect(logoutUrl);
  response.cookies.set("userId", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
  });
  response.cookies.set("roles", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
  });

  return response;
}
