'use client';

import React, { useEffect } from 'react'

const page = () => {
    useEffect(() => {
    const auth0 = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_NEXT_BASE_URL;
    console.log(auth0,clientId,baseUrl);
    const logoutUrl = new URL(`https://${auth0}/oidc/logout`);
    logoutUrl.searchParams.set('client_id',clientId);
    logoutUrl.searchParams.set('post_logout_redirect_uri', baseUrl);

    window.location.href = logoutUrl.toString();
  }, []);
  return (
    <div>Logging out....</div>
  )
}

export default page