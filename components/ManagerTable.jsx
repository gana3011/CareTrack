'use client';

import { FETCH_ACTIVE_SHIFTS } from '@/lib/graphql-operations';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'

const ManagerTable = () => {
    const today = dayjs().format("DD-MM-YY");
      const formattedToday = dayjs().format("YYYY-MM-DD");
  const {data, error, isLoading} = useQuery(FETCH_ACTIVE_SHIFTS,{
    variables:{date: formattedToday}
  });

  useEffect(()=>{
    if(!isLoading)
    console.log(data);
  },[data,isLoading]);
  return (
    <>
    <h1>Manager</h1>
    </>
  )
}

export default ManagerTable