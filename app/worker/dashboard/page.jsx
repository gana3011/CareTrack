'use client';

import NavBar from '@/components/NavBar';
import React, { useEffect, useState } from 'react'

const page = () => {

  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit =  (e) =>{
    e.preventDefault();
    if(!navigator.geolocation){
      console.log("Geolocation not supported on browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err)=>{
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 0,
      }
    )
  }

  return (
    <>
    <NavBar />
    <form onSubmit={handleSubmit}>
      <button>Clock in</button>
    </form>
    {userLocation && <div> Lat: {userLocation.lat}, Lng: {userLocation.lng}</div>}
    {error && <div>{error}</div>}
    </>
  )
}

export default page;