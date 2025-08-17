'use client';

import Link from 'next/link';
import NavBar from '@/components/NavBar';
import CustomFooter from '@/components/CustomFooter';

export default function IndexPage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen text-gray-800 mt-50">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1677ff] mb-6">
            Welcome to CareTrack
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-700 mb-8 mx-auto text-center">
  Effortlessly manage staff, shifts, and locations with a secure, modern platform.
</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <button className="px-4 py-2 bg-[#1677ff] text-white font-medium 
                                 rounded-lg shadow hover:bg-blue-700 hover:shadow-md 
                                 transition-transform transform hover:scale-105">
                Get Started
              </button>
            </Link>

            <Link href="/auth/login">
              <button className="px-4 py-2 bg-white text-[#1677ff] font-medium 
                                 border border-[#1677ff] rounded-lg 
                                 hover:bg-blue-50 
                                 transition-transform transform hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>
        </section>
      </main>
      <CustomFooter />
    </>
  );
}
