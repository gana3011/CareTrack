'use client';

import React, { useEffect, useState } from 'react'
import { Button, message, Table } from "antd";
import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { CLOCK_IN, CLOCK_OUT } from '@/lib/graphql-operations';


const WorkerTable = ({getLocation, userLocation}) => {
  const [clockIn] = useMutation(CLOCK_IN);
  const [clockOut ] = useMutation(CLOCK_OUT)
  const [dataSource, setDataSource] = useState([]);
  const today = dayjs().format("DD/MM/YY");
  
  const handleClockIn = async(record)=>{
    const location = await getLocation();
    console.log(location);
    const timestamp = dayjs().format('HH:mm:ss');
    try {
        const response = await clockIn({
          variables: {
            userLocation: {
              lat: location.lat,
              lng: location.lng,
            },
            date: dayjs().toISOString()
          },
        });
        setDataSource((prev) =>
        prev.map((row) =>
        row.key === record.key ? { ...row, clock_in: timestamp } : row
      )
    );
      message.success(`Clocked in at ${timestamp}`);
      } catch (err) {
        console.error(err.message);
      }
  }

  const handleClockOut = async(record)=>{
    const location = await getLocation();
    console.log(location);
    const timestamp = dayjs().format('HH:mm:ss');
    try {
        const response = await clockOut({
          variables: {
            userLocation: {
              lat: location.lat,
              lng: location.lng,
            },
            date: dayjs().toISOString()
          },
        });
        setDataSource((prev) =>
      prev.map((row) =>
        row.key === record.key ? { ...row, clock_out: timestamp } : row
      )
    );
        message.success(`Clocked out at ${timestamp}`);
      } catch (err) {
        console.error(err.message);
      }
  }

  const generateWeekData = () => {
    const startOfWeek = dayjs().startOf('week'); 
    return Array.from({ length: 7 }, (_, i) => {
      const date = startOfWeek.add(i, 'day');
      return {
        key: date.format('DD/MM/YY'),
        date: date.format('DD/MM/YY'),
        clock_in: '',
        clock_out: '',
      };
    });
  };

  useEffect(()=>{
    setDataSource(generateWeekData());
  },[]);

  const columns = [
    {title: 'Date', dataIndex: 'date', key: 'date'},
    {
        title: 'Clock In',
        dataIndex: 'clock_in',
        key: 'clock_in',
        render: (value, record) => {
            if(record.date == today){
                return value ? (
                    value
                ) : (
                    <Button type="primary" onClick={()=>handleClockIn(record)}>
                        Clock In
                    </Button>
                );
            }
            return value || '-';
        }
    },
    {
      title: 'Clock Out',
      dataIndex: 'clock_out',
      key: 'clock_out',
      render: (value, record) => {
        if (record.date === today && record.clock_in && !record.clock_out) {
          return (
            <Button danger onClick={()=>handleClockOut(record)}>
              Clock Out
            </Button>
          );
        }
        return value || '-';
      },
    },
  ]

  return (
    <>
    <Table dataSource={dataSource} columns={columns} />
    </>
  )

}
export default WorkerTable;