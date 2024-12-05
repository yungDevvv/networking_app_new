// src/lib/server/appwrite.js
"use server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSessionClient() {
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_PROJECT;
  
  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_ENDPOINT is not set");
  }

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_PROJECT is not set");
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT);

  let session = await cookies()
  session = session.get("my-custom-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_PROJECT;
  const apiKey = process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY;

  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_ENDPOINT is not set");
  }

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_PROJECT is not set");
  }

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_APPWRITE_SESSION_KEY is not set");
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function signInWithEmail(email, password) {
  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession(email, password);

  let a = await cookies();
  a.set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/dashboard");
}
