'use client';

import { FETCH_ACTIVE_SHIFTS } from '@/lib/graphql-operations';
import { useQuery } from '@apollo/client';
import { Table } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { TabContent } from 'reactstrap';

const ActiveShifts = () => {
    const [dataSource, setDataSource] = useState(null);
    const today = dayjs().format("DD-MM-YY");
    const formattedToday = dayjs().format("YYYY-MM-DD");
  const {data, error, loading} = useQuery(FETCH_ACTIVE_SHIFTS,{
    variables:{date: formattedToday}
  });

  const fetchShifts = () =>{
    const activeShifts = data.fetchActiveShifts.map((s)=>{
        return{
            key: s.user.id,
            name: s.user.name,
            clock_in: s.clock_in,
            clock_in_location: s.clock_in_location,
            clock_in_note: s?.clock_in_note || '',
        }
    })
    setDataSource(activeShifts);
  }
  
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Clock In',
    dataIndex: 'clock_in',
    key: 'clock_in',
  },
  {
    title: 'In Location',
    dataIndex: 'clock_in_location',
    key: 'clock_in_location'
  },
  {
    title: 'In Note',
    dataIndex: 'clock_in_note',
    key: 'clock_in_note',
    render: (value, record) => {
        return value || '-'
    }
  },
];

useEffect(()=>{
    if(data?.fetchActiveShifts && !loading){
        fetchShifts();
    }
},[loading, data]);

  return (
    <>
    <h1>{`Active Shifts for ${today}`}</h1>
    <Table dataSource={dataSource} columns={columns} />
    </>
  )
}

export default ActiveShifts