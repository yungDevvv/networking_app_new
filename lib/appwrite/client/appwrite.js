import { Client, Account } from 'appwrite';

export const client = new Client();

client
   .setEndpoint('https://appwrite.superman.fi/v1')
   .setProject('674fb3820038a4264099');

export const account = new Account(client);
export { ID } from 'appwrite';