// src/lib/server/appwrite.js
"use server";

import { Client, Account, ID, Databases, Query, Storage, Users } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const VISIBILITY_TYPES = {
  EVERYONE: 'everyone',
  HIDDEN: 'hidden'
};

export const addToFavorites = async (type, item_id) => {
  const user = await getLoggedInUserProfile();

  const currentFavorites = user['favorite_' + type] || [];
  console.log(currentFavorites, "currentFavorites", "currentFavorites")
  let updatedFavorites;

  if (currentFavorites.find(network => network.$id === item_id)) {
    updatedFavorites = currentFavorites.filter(network => network.$id !== item_id);
  } else {
    updatedFavorites = [...currentFavorites, item_id];
  }
  console.log(updatedFavorites, "updatedFavorites", "updatedFavorites");
  const res = await updateDocument("main_db", "profiles", user.$id, {
    ['favorite_' + type]: updatedFavorites
  });

  return updatedFavorites.includes(item_id);
}

export async function updateRecoveryPassword(secret, user_id, password, anonym) {
  if (anonym) {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT);

    const account = new Account(client);

    await account.updateRecovery(
      user_id,
      secret,
      password
    );
  } else {
    const { account } = await createSessionClient();

    await account.updateRecovery(
      user_id,
      secret,
      password
    );
  }
}

export async function createAnonymousRecoveryPassword(email, redirectEmail) {

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT)


  const account = new Account(client);

  const res = await account.createRecovery(
    email,
    redirectEmail
  );

  if (res) {
    return true
  }

}

export async function createUserRecoveryPassword(redirectEmail) {
  const user = await getLoggedInUserProfile();

  const { account } = await createSessionClient();

  const res = await account.createRecovery(user.email, redirectEmail);
  if (res) {
    return true
  }

}

export async function getVisibleProfiles() {
  const currentUser = await getLoggedInUserProfile();

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

  const database = new Databases(client);

  const query = [
    Query.notEqual('$id', currentUser.$id),
    Query.equal('profile_visibility', VISIBILITY_TYPES.EVERYONE)
  ];

  try {
    const profiles = await database.listDocuments(
      "main_db",
      'profiles',
      query
    );

    return profiles.documents;
  } catch (error) {
    console.log('Error fetching visible profiles:', error);
    return [];
  }
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

  let session = await cookies();

  session = session.get("my-custom-session");

  if (!session) {
    console.log("NO SESSION");

    return {
      sessionExists: false
    }
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get storage() {
      return new Storage(client);
    },
    sessionExists: true
  };
}

export async function getLoggedInUserProfile() {
  try {
    const { sessionExists, account } = await createSessionClient();

    if (!sessionExists) return null;

    const session = await account.getSession('current');

    if (!session) {
      return false;
    }

    const user = await account.get();

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_PROJECT)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_SESSION_KEY);

    const databases = new Databases(client);

    const response = await databases.getDocument(
      "main_db",
      "profiles",
      user?.$id
    );

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }

}


export async function signInWithEmail(email, password) {
  const { account } = await createAdminClient();

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

}

export async function signUpWithEmail(email, password, name) {
  const uniqueId = ID.unique();
  const { account } = await createAdminClient();
  await account.create(uniqueId, email, password, name);
  return uniqueId;
}

export async function getDocument(db_id, collection_id, document_id) {

  try {
    const user = await getLoggedInUserProfile();

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
    const user = await getLoggedInUserProfile();

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
    console.log('Error updating profile:', error);
    throw error;
  }
}

export async function createDocument(db_id, collection_id, { document_id, body }) {

  try {
    // const user = await getLoggedInUserProfile();

    // if (!user) return null;

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
    console.log('Error updating profile:', error);
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
    console.log('Error updating profile:', error);
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
    console.log('Error updating profile:', error);
    throw error;
  }
}

export async function createFile(bucket_id, file_id, file) {
  const user = await getLoggedInUserProfile();

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
    console.log('Error updating profile:', error);
    throw error;
  }

}

