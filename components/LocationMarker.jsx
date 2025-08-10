'use client';
import { useEffect, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet"

export const LocationMarker = ()=> {
const [position, setPosition] = useState(null);
const map = useMap();

useEffect(()=>{
    map.locate({setView: true,enableHighAccuracy: true});
    map.on("locationfound",(e)=>{
        setPosition(e.latlng);
        map.flyTo(e.latlng,map.getZoom());
    });

    map.on("locationerror",(e)=>{
        console.error("Location access denied:", err);
    });

    return ()=>{
      map.off("locationfound");
      map.off("locationerror");
    }    
},[]);

useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);
  
  return position === null? null:(
    <Marker position={position}>
    </Marker>
  )
}