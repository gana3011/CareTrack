'use client'; 
import { memo, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LocationMarker } from "./LocationMarker";

const SelectedLocation = ({ center }) => {
  const map = useMap();
  map.panTo(center, { animate: true });
  return null;
};

export const LeafMap = () => {
  const [mapType, setMapType] = useState("roadmap");
  const getUrl = () => {
    const mapTypeUrls = {
      roadmap: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
      satellite: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
      hybrid: "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
      terrain: "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}",
    };
    return mapTypeUrls[mapType];
  };

  return (
    <>
      <div
        style={{
          height: "80vh",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={center}
          zoom={13}
          minZoom={5}
          zoomControl={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url={getUrl()} />
          <ZoomControl position="topright" />
          <LocationMarker />
        </MapContainer>
      </div>
      <div style={{ display: "flex", marginTop: "10px", gap: "20px" }}>
        <button onClick={() => setMapType("roadmap")}>roadmap</button>
        <button onClick={() => setMapType("satellite")}>satellite</button>
        <button onClick={() => setMapType("hybrid")}>hybrid</button>
        <button onClick={() => setMapType("terrain")}>terrain</button>
      </div>
    </>
  );
}