import { auth0 } from "@/lib/auth0";
import { SYNC_USER } from "@/lib/graphql-operations";
import axios from "axios";
import { print } from "graphql";

import { NextResponse } from "next/server";


export async function POST(req) {
  console.log("in route");
  try {
    const { userId, name, email, picture, created_at, app_metadata } = await req.json();
    console.log('picture '+picture);
    const roles = app_metadata?.roles || null;

    //convert the gql object to string
    const query = print(SYNC_USER);

    const response = await axios.post(`${process.env.NEXT_BASE_URL}/api/graphql`,{
        query,
        variables: {userId, name, email, picture, roles , created_at,}
    });
    if (response.data.errors) {
    console.error('GraphQL errors:', response.data.errors);
    return new Response('GraphQL Error', { status: 500 });
}
    return new Response('Done', { status: 200 });
  } catch (err) {
    console.error('Error: ' + err);
    return new Response('Error', { status: 500 });
  }
}
