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
import IntegerStep from "./IntegerStep";
import { useMutation } from "@apollo/client";
import { ADD_GEOFENCE } from "@/lib/graphql-operations";
import { Button, Input } from "antd";

// Component to handle map click
// const ClickHandler = ({ setUserPosition }) => {
//   useMapEvents({
//     click(e) {
//       setUserPosition(e.latlng); // set marker position on click
//     },
//   });
//   return null;
// };


export const LeafMap = () => {
  const [targetPosition, setTargetPosition] = useState(null); 
  const [circleRadius, setCircleRadius] = useState(1);
  const [name, setName] = useState('');
  const roadmap = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";
  const [addGeofence, {data, loading, error}] = useMutation(ADD_GEOFENCE);

  const handleSubmit = async (e) =>{
  e.preventDefault();
  try{
    await addGeofence({
       variables: {
    name: name.trim(),
    center: {
      lat: targetPosition.lat,
      lng: targetPosition.lng,
    },
    radiusMeters: circleRadius * 1000,
  }}
    );
    setName('');
  }
  catch(err){
    console.error(err.message);
  }
}

  // Check if target is inside radius
  // useEffect(() => {
  //   if (userPosition && targetPosition) {
  //     const dist = L.latLng(targetPosition).distanceTo(L.latLng(userPosition));
  //     setIsInside(dist <= circleRadius*1000);
  //   }
  // }, [userPosition, targetPosition]);

  return (
    <>
      <div style={{ height: "60vh", borderRadius: "20px", overflow: "hidden"}}>
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
          {/* <ClickHandler setUserPosition={setUserPosition} /> */}

          {/* Render target marker if set */}
          {/* {userPosition && <Marker position={userPosition} />} */}
        </MapContainer>
      </div>
      <div>
       <IntegerStep circleRadius={circleRadius} setCircleRadius={setCircleRadius} />
       <form onSubmit={handleSubmit}>
      <Input placeholder="Enter location name" value={name} onChange={e=>setName(e.target.value)} />
      <Button htmlType="submit" type="primary" disabled={loading || !name || !targetPosition}>
        {loading ? 'Adding': 'Add'}
      </Button>
      {/* {targetPosition && <div>Lat:{targetPosition.lat} Long: {targetPosition.lng}</div>} */}
      {data?.addGeofence?.message && <p>{data.addGeofence.message}</p>}
    </form>
    </div>
    </>
  );
};
