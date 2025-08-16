'use client';

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LocationMarker } from "./LocationMarker";
import IntegerStep from "./IntegerStep";
import { useMutation } from "@apollo/client";
import { ADD_GEOFENCE } from "@/lib/graphql-operations";
import { Button, Input, Card } from "antd";

export const LeafMap = () => {
  const [targetPosition, setTargetPosition] = useState(null); 
  const [circleRadius, setCircleRadius] = useState(1);
  const [name, setName] = useState('');
  const roadmap = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";
  const [addGeofence, { data, loading }] = useMutation(ADD_GEOFENCE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGeofence({
        variables: {
          name: name.trim(),
          center: {
            lat: targetPosition.lat,
            lng: targetPosition.lng,
          },
          radiusMeters: circleRadius * 1000,
        },
      });
      setName('');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Map container */}
      <div className="w-full h-[70vh] rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
        <MapContainer
          zoom={15}
          minZoom={5}
          zoomControl={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url={roadmap} />
          <ZoomControl position="topright" />
          <LocationMarker 
            circleRadius={circleRadius} 
            setTargetPosition={setTargetPosition} 
          />
        </MapContainer>
      </div>

      {/* Controls */}
      <Card className="shadow-sm rounded-xl border border-gray-100">
        <form 
          onSubmit={handleSubmit} 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
        >
          {/* Column 1: Slider + InputNumber */}
          <div className="w-full">
            <IntegerStep 
              circleRadius={circleRadius} 
              setCircleRadius={setCircleRadius} 
            />
          </div>

          {/* Column 2: Location Name Input */}
          <Input
            placeholder="Enter location name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md w-full"
          />

          {/* Column 3: Submit Button */}
          <Button
            htmlType="submit"
            type="primary"
            disabled={loading || !name || !targetPosition}
            className="rounded-md px-6 w-full md:w-auto"
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </form>

        {data?.addGeofence?.message && (
          <p className="text-green-600 text-sm mt-2">{data.addGeofence.message}</p>
        )}
      </Card>
    </div>
  );
};
