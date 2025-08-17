
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { protocol, host } = new URL(request.url);

  // Build absolute URL for /logout page
  const logoutUrl = `${protocol}//${host}/auth/logout`;
  const response = NextResponse.redirect(logoutUrl);
  response.cookies.set('userId', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  response.cookies.set('roles', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return response;
}
