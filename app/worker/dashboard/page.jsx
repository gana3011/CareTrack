'use client';

import NavBar from '@/components/NavBar';
import WorkerTable from '@/components/WorkerTable';
import React, { useEffect, useState } from 'react'

const page = () => {

  const [userLocation, setUserLocation] = useState(null);
  const [locError, setLocError] = useState(null);
  

const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported on this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        console.error("Location error:", err.message);
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 0,
      }
    );
  });
};



  return (
    <>
    <NavBar />
    <WorkerTable getLocation={getLocation} userLocation={userLocation} />
    {/* <form onSubmit={handleSubmit}>
      <button disabled = {loading}>
      {loading ?'Wait': 'Clock in'}
      </button>
    </form> */}
    {locError && <div>{locError}</div>}
    {/* {data && (
    data.addShift.success ? (
    <div>Clocked in</div>
  ) : (
    <div>Outside Location. Cant clock in</div>
  )
)} */}
    </>
  )
}

export default page;