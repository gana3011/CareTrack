'use client';

import { FETCH_SHIFT_HISTORY } from '@/lib/graphql-operations';
import { useQuery } from '@apollo/client';
import { Table, Spin } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { TabContent } from 'reactstrap';

const ManagerTable = () => {
    const [dataSource, setDataSource] = useState(null);
    const today = dayjs().format("DD-MM-YY");
    const formattedToday = dayjs().format("YYYY-MM-DD");
  const {data, error, loading} = useQuery(FETCH_SHIFT_HISTORY,{
    variables:{date: formattedToday}
  });

  const fetchShifts = () =>{
    const shiftHistory = data.fetchShiftHistory.map((s)=>{
        return{
            key: s.user.id,
            name: s.user.name,
            clock_in: s.clock_in,
            clock_in_location: s.clock_in_location,
            clock_in_note: s?.clock_in_note || '',
            clock_out: s?.clock_out || '',
            clock_out_location: s?.clock_out_location || '',
            clock_out_note: s?.clock_out_note || ''
        }
    })
    setDataSource(shiftHistory);
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
  {
    title: 'Clock Out',
    dataIndex: 'clock_out',
    key: 'clock_out',
    render: (value, record) => {
        return value || '-'
    }
  },
  {
    title: 'Out Location',
    dataIndex: 'clock_out_location',
    key: 'clock_out_location',
    render: (value, record) => {
        return value || '-'
    }
  },
  {
    title: 'Out Note',
    dataIndex: 'clock_out_note',
    key: 'clock_out_note',
    render: (value, record) => {
        return value || '-'
    }
  },
];

useEffect(()=>{
    if(data?.fetchShiftHistory && !loading){
        fetchShifts();
    }
},[loading, data]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 py-4">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">{`Shift History for ${today}`}</h1>
      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={true}
          bordered
          size="middle"
          scroll={{ x: true }}
          className="w-full custom-blue-table"
          rowClassName={() => "hover:bg-blue-50"}
        />
      </Spin>
      <style jsx global>{`
        .custom-blue-table .ant-table-thead > tr > th {
          background-color: #1677ff;
          color: #fff;
        }
      `}</style>
    </div>
  )
}

export default ManagerTable