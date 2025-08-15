'use client';

import { AVG_HOURS_PER_DAY, FETCH_DASHBOARD_STATS, PEOPLE_CLOCKINGIN_PER_DAY } from '@/lib/graphql-operations';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

const DashBoard = () => {
   const today = dayjs().format("YYYY-MM-DD");
   const {data, error, loading} = useQuery(FETCH_DASHBOARD_STATS,{
    variables:{date:today}
   });
   if (loading) return <p>Loading...</p>;
   const avgHoursPerDay = data.avgHoursPerDay??[]
   const peopleClockingInPerDay = data.peopleClockingInPerDay??[]
   const totalHoursPerStaff = data.totalHoursPerStaff??[]
  return (
    <>
    <LineChart width={730} height={250} data={avgHoursPerDay}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="avg_hours" stroke="#82ca9d" />
</LineChart>
<BarChart width={730} height={250} data={peopleClockingInPerDay}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="people_count" fill="#82ca9d" />
</BarChart>
<BarChart width={730} height={250} layout={'vertical'} data={totalHoursPerStaff}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis type="number" /> 
  <YAxis dataKey="name" type="category" /> 
  <Tooltip />
  <Legend />
  <Bar dataKey="total_hours" fill="#82ca9d" />
</BarChart>
    </>
  )
}

export default DashBoard