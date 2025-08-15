'use client';

import React, { useEffect, useState } from 'react'
import { Button, message, Table } from "antd";
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@apollo/client';
import { CLOCK_IN, CLOCK_OUT, FETCH_USER_SHIFTS_BY_WEEK } from '@/lib/graphql-operations';


const WorkerTable = ({getLocation, userLocation}) => {
  const [clockIn, {clockInData, clockInError, clockInLoading}] = useMutation(CLOCK_IN);
  const [clockOut, {clockOutData, clockOutError, clockOutLoading} ] = useMutation(CLOCK_OUT)
  const [dataSource, setDataSource] = useState([]);
  const today = dayjs().format("DD-MM-YY");
  const formattedToday = dayjs().format("YYYY-MM-DD");
  const {data, error, isLoading} = useQuery(FETCH_USER_SHIFTS_BY_WEEK,{
    variables: { date: formattedToday},
    skip: !formattedToday
  });

  const generateWeekData = () => {
    const startOfWeek = dayjs().startOf('week').add(1,'days'); 
    return Array.from({ length: 7 }, (_, i) => {
      const date = startOfWeek.add(i, 'day');
      return {
        key: date.format('DD-MM-YY'),
        date: date.format('DD-MM-YY'),
        clock_in: '',
        clock_out: '',
      };
    });
  };

  const fetchWeekData = () => {
    const weekDates = generateWeekData();
    const mergedData = weekDates.map((weekDate) => {
  const existing = data.fetchUserShiftsByWeek.find((d) => d.date === weekDate.date);
  return {
    key: weekDate.date,
    date: weekDate.date,
    clock_in: existing?.clock_in || '',
    clock_out: existing?.clock_out || ''
  };
});

    setDataSource(mergedData);
  }
  useEffect(()=>{
  if(!isLoading && data){
    fetchWeekData();
  }
},[data,isLoading])
  
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


  // useEffect(()=>{
  //   setDataSource(generateWeekData());
  // },[]);

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
                    <Button type="primary" disabled={clockInLoading} onClick={()=>handleClockIn(record)}>
                        {clockInLoading?'Wait':'Clock In'}
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
            <Button type="primary" disabled = {clockOutLoading} onClick={()=>handleClockOut(record)}>
              {clockOutLoading? 'Wait' : 'Clock Out'}
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