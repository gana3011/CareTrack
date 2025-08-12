import { SYNC_USER } from "@/lib/graphql-operations";
import { message } from "antd";
import axios from "axios";
import { serialize } from "cookie";
import { print } from "graphql";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("in route");
  try {
    const { userId, name, email, picture, created_at, app_metadata } = await req.json();
    const roles = app_metadata?.roles || null;
    
    // Convert the gql object to string
    const query = print(SYNC_USER);
    const response = await axios.post(`${process.env.NEXT_BASE_URL}/api/graphql`, {
      query,
      variables: { userId, name, email, picture, roles, created_at }
    });
    
    const id = response.data.data.syncUser.id;
    
    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors);
      return new Response('GraphQL Error', { status: 500 });
    }

  //   const idCookie = serialize("id", id.toString(), {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   path: "/",
  //   maxAge: 60 * 60 * 24 * 7,
  // });
  
  // const rolesCookie = serialize("roles", JSON.stringify(roles), {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   path: "/",
  //   maxAge: 60 * 60 * 24 * 7,
  // });

  // return new Response("Done", {
  //   status: 200,
  //   headers: {
  //     "Set-Cookie": `${idCookie}; ${rolesCookie}`,
  //     "Content-Type": "text/plain",
  //   },
  // });

    // const nextResponse = NextResponse.json({message:"Done"});

    // try {
    //   // const cookieStore = await cookies();
      
    //   // Set cookies
    //   nextResponse.cookies.set("id", id.toString(), {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "Lax",
    //     path: "/",
    //     maxAge: 60 * 60 * 24 * 7 // 1 week
    //   });
      
    //   // Store roles (stringified since it's likely an array)
    //   nextResponse.cookies.set("roles", JSON.stringify(roles), {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "Lax",
    //     path: "/",
    //     maxAge: 60 * 60 * 24 * 7
    //   });
      
    // } catch (err) {
    //   console.error("Error setting cookies:", err);
    //   return new Response("Failed to set cookies", { status: 500 });
    // }
    return new Response('Done', { status: 200 });
  }catch (err) {
    console.error('Error: ' + err);
    return new Response('Error', { status: 500 });
  }
}