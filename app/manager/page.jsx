'use client';
import { useEffect } from "react";
import axios from "axios";

const page = () => {
  const fetchApiData = async () =>{
    try {
      const res = await axios.get("/managers", {withCredentials: true});
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  }
  return (
    <>
    <div>Manger route</div>
    <button onClick={fetchApiData}>Fetch</button>
    </>
  )
}

export default page;