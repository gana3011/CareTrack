'use client';

import NavBar from '../components/NavBar';

import { useUser } from '@auth0/nextjs-auth0';


export default function Index() {
  const { user, isLoading } = useUser();
  return (
    <>
      {/* {!isLoading && !user && (
                <a
                  href="/auth/login"
                  className="btn btn-primary btn-block"
                  tabIndex={0}
                  testId="navbar-login-mobile">
                  Log in
                </a>
      )}; */}
      <NavBar />
    </>
  );
}
