'use client';

import NavBar from '@/components/NavBar';
import { ADD_SHIFT } from '@/lib/graphql-operations';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react'

const page = () => {

  const [userLocation, setUserLocation] = useState(null);
  const [locError, setLocError] = useState(null);
  const [addShift, {data, loading, error}] = useMutation(ADD_SHIFT);

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!navigator.geolocation) {
    console.log("Geolocation not supported on this browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      console.log('lat:',position.coords.latitude);
       console.log('lng:',position.coords.longitude);
      try {
        const response = await addShift({
          variables: {
            userLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
        });
      } catch (err) {
        console.error(err.message);
      }
    },
    (err) => {
      console.error("Location error:", err.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 100000,
      maximumAge: 0,
    }
  );
};


  return (
    <>
    <NavBar />
    <form onSubmit={handleSubmit}>
      <button disabled = {loading}>
      {loading ?'Wait': 'Clock in'}
      </button>
    </form>
    {locError && <div>{locError}</div>}
    {error && <p>Error: {error.message}</p>}
    {data && (
    data.addShift.success ? (
    <div>Clocked in</div>
  ) : (
    <div>Outside Location. Cant clock in</div>
  )
)}
    </>
  )
}

export default page;