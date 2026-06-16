const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Log the masked URI to confirm it was loaded correctly
console.log('Attempting to connect with URI:', uri.replace(/:([^@]+)@/, ':********@'));

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully');
  } catch (error) {
    console.error('Connection failed! Complete error object:');
    console.error(error);
  } finally {
    await client.close();
  }
}

main();
