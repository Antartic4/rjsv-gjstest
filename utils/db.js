import { MongoClient } from 'mongodb';
require('dotenv').config();

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // global instance
  client = new MongoClient(uri);
  clientPromise = client.connect();
} else {
  // many if not created.
  clientPromise = client ? clientPromise : new MongoClient(uri).connect();
}

export async function getClient() {
  await clientPromise;
  return client;
}
