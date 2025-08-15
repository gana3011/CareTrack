'use client';

import { AVG_HOURS_PER_DAY, FETCH_DASHBOARD_STATS, PEOPLE_CLOCKINGIN_PER_DAY } from '@/lib/graphql-operations';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'

const DashBoard = () => {
   const today = dayjs().format("YYYY-MM-DD");
   const {data, error, loading} = useQuery(FETCH_DASHBOARD_STATS,{
    variables:{date:today}
   });
   useEffect(()=>{
    if(data && !loading) console.log(data);
   },[data,loading])
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard