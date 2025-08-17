'use client';

import CustomFooter from '@/components/CustomFooter';
import NavBar from '@/components/NavBar';
import WorkerTable from '@/components/WorkerTable';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported on this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        err => {
          console.error('Location error:', err.message);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 100000,
          maximumAge: 0
        }
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {contextHolder}
      <NavBar />

      <main className="flex-grow">
        <WorkerTable getLocation={getLocation} messageApi={messageApi} />
      </main>

      <CustomFooter />
    </div>
  );
};

export default Page;
