'use client';
import { useEffect, useState } from "react";
import { Circle, Marker, useMap, useMapEvents } from "react-leaflet"

export const LocationMarker = ({ circleRadius , setTargetPosition }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ enableHighAccuracy: true });

    map.on("locationfound", (e) => {
      setPosition(e.latlng);
      setTargetPosition(e.latlng); // send to parent
      map.setView(e.latlng, map.getZoom(), {animate: false});
    });

    map.on("locationerror", (err) => {
      console.error("Location access denied:", err);
    });

    return () => {
      map.off("locationfound");
      map.off("locationerror");
    };
  }, [map, setTargetPosition]);

useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  // Auto-adjust zoom based on circle radius
  useEffect(() => {
    if (position && circleRadius) {
      let zoomLevel;
      
      if(circleRadius==1) zoomLevel = 15;
      else if(circleRadius==2) zoomLevel = 14;
      else if(circleRadius>=3 && circleRadius<=5) zoomLevel = 13;
      else zoomLevel = 12;
      
      map.setView(position, zoomLevel, { animate: true }
);
    }
  }, [circleRadius, position, map]);

  return position === null ? null : (
    <>
      <Marker position={position} />
      <Circle center={position} radius={circleRadius*1000} pathOptions={{ color: "blue" }} />
    </>
  );
};