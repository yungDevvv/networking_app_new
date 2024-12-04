// src/lib/server/appwrite.js

import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";

// export async function createSessionClient() {
//   const client = new Client()
//     .setEndpoint("https://cloud.appwrite.io/v1")
//     .setProject('674f469c0008f2c1f139');

//   const session = await cookies().get("a_session_674f469c0008f2c1f139");

   
//   if (!session || !session.value) {
//     throw new Error("No session");
//   }

//   client.setSession(session.value);

//   return {
//     get account() {
//       return new Account(client);
//     },
//   };
// }



 const sdk = require('node-appwrite');

export const client = new sdk.Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_PROJECT)

export const account = new Account(client);
// export const users = new sdk.Users(client);

export async function getLoggedInUser() {
   try {
      return await account.get();
   } catch (error) {
     return null;
   }
 }