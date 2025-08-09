'use client';

import NavBar from "@/components/NavBar";
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
    <NavBar />
    <div>Manger route</div>
    <button onClick={fetchApiData}>Fetch</button>
    </>
  )
}

export default page;