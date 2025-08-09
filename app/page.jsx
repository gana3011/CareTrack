'use client';

import NavBar from '../components/NavBar';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { auth0 } from "@/lib/auth0";
import axios from 'axios';

export default function Index() {
  return (
    <>
      <NavBar />
    </>
  );
}
