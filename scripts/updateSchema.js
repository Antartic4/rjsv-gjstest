const { getClient } = require('./utils/db');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  const client = await getClient();

  if (!uri) {
    throw new Error('DATABASE_URL not set');
  }

  try {
    await client.connect();

    const db = client.db('rjsvgrapes');

    await db.createCollection('User');
    await db.collection('User').createIndex({ email: 1 }, { unique: true });

    console.log('Schema updated successfully.');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
