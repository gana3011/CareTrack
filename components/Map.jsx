'use client';
import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect, useRef } from 'react'

const Map = () => {
  const mapRef = useRef(null);

  useEffect(()=>{
    const initMap = async()=>{
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
            version: 'weekly'
        });
        const { Map } = await loader.importLibrary('maps');

        const position = {
            lat: 43.642693,
            lng: -79.38171189
        }

        const mapOptions = {
            center: position,
            zoom: 17,
            
        }

        const map = new Map(mapRef.current, mapOptions);
    }
    initMap();
  },[])
  return (
    <div style={{height:'600px'}} ref={mapRef} />
  )
}

export default Map