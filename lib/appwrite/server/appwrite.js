// src/lib/server/appwrite.js
"use server";
import { Client, Account, ID, Databases, Query, Storage, Users } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createDatabaseClient() {
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
    get databases() { return new Databases(client) }
  };
}

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

  const database = new Databases(client);
  return {
    get account() {
      return new Account(client);
    },
    database
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

export async function getLoggedInUserProfile() {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

    const user = await getLoggedInUser();

    const databases = new Databases(client);
    const response = await databases.getDocument(
      "main_db",
      "profiles",
      user?.$id
    );

    return response;
  } catch (error) {
    console.log('Error fetching profile:', error);
    return null;
  }
}

export async function signInWithEmail(email, password) {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();

    if (cookieStore) {
      cookieStore.set("my-custom-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
    }
  } catch (error) {
    console.log(error, "signInWithEmail signInWithEmail signInWithEmail")
  }

}

export async function signUpWithEmail(email, password, name) {

  const { account } = await createAdminClient();

  await account.create(ID.unique(), email, password, name);

}

export async function getDocument(db_id, collection_id, document_id) {
  console.log('getDocument ID', document_id)
  if (document_id === "asd") return null;
  try {
    const user = await getLoggedInUser();

    if (!user) return null;

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

    const databases = new Databases(client);

    const response = await databases.getDocument(
      db_id,
      collection_id,
      document_id
    );

    return response;
  } catch (error) {
    console.log('ERROR getDocument():', error);
    // throw error;
  }
}

export async function updateDocument(db_id, collection_id, document_id, values) {
  try {
    const user = await getLoggedInUser();

    if (!user) return null;

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

    const databases = new Databases(client);

    const response = await databases.updateDocument(
      db_id,
      collection_id,
      document_id,
      values
    );

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function createDocument(db_id, collection_id, { document_id, body }) {
  console.log('createDocument BODY', body)
  console.log('createDocument DOCUMENT_ID', document_id)
  try {
    const user = await getLoggedInUser();

    if (!user) return null;

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

    const databases = new Databases(client);
    console.log('createDocument ID.unique', ID.unique())
    const response = await databases.createDocument(
      db_id,
      collection_id,
      document_id || ID.unique(),
      {
        ...body
      }
    );

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function listDocuments(db_id, collection_id, query) {
  const queryArray = [];

  if (query) {
    query.forEach(element => {
      if (element.type === 'equal') {
        queryArray.push(Query.equal(element.name, element.value));
      }
      if (element.type === 'limit') {
        queryArray.push(Query.limit(element.value));
      }
    });

  }

  try {

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

    const databases = new Databases(client);

    const response = await databases.listDocuments(
      db_id,
      collection_id,
      [Query.orderDesc("$createdAt"), ...queryArray]
    );

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function deleteDocument(db_id, collection_id, document_id) {

  try {

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

    const databases = new Databases(client);

    const response = await databases.deleteDocument(
      db_id,
      collection_id,
      document_id
    );

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function createFile(bucket_id, file_id, file) {
  const user = await getLoggedInUser();

  if (!user) return null;

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

  const storage = new Storage(client);

  try {
    const response = await storage.createFile(bucket_id, file_id || ID.unique(), file);

    if (response) return response.$id

    return null;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

}