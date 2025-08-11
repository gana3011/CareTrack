'use client';
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LocationMarker } from "./LocationMarker";
import L from "leaflet";
import IntegerStep from "./IntegerStep";

// Component to handle map click
const ClickHandler = ({ setUserPosition }) => {
  useMapEvents({
    click(e) {
      setUserPosition(e.latlng); // set marker position on click
    },
  });
  return null;
};

export const LeafMap = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null); 
  const [circleRadius, setCircleRadius] = useState(1);
  const [isInside, setIsInside] = useState(false);
  const roadmap = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";

  // Check if target is inside radius
  useEffect(() => {
    if (userPosition && targetPosition) {
      const dist = L.latLng(targetPosition).distanceTo(L.latLng(userPosition));
      setIsInside(dist <= radius);
    }
  }, [userPosition, targetPosition]);

  return (
    <>
      <div style={{ height: "80vh", borderRadius: "20px", overflow: "hidden" }}>
        <MapContainer
          zoom={15}
          minZoom={5}
          zoomControl={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url={roadmap} />
          <ZoomControl position="topright" />

          <LocationMarker circleRadius={circleRadius} setTargetPosition={setTargetPosition} />

          {/* Detect clicks and set target marker */}
          <ClickHandler setUserPosition={setUserPosition} />

          {/* Render target marker if set */}
          {userPosition && <Marker position={userPosition} />}
        </MapContainer>
      </div>

      <div style={{ marginTop: "10px" }}>
        {userPosition
          ? isInside
            ? "Target is inside the circle"
            : "Target is outside the circle"
          : "Click on the map to place a marker"}
      </div>
       <IntegerStep circleRadius={circleRadius} setCircleRadius={setCircleRadius} />
    </>
  );
};
