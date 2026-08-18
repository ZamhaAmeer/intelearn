const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Connect to the default 'postgres' database to run the CREATE DATABASE query
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    console.log('Connected to default postgres database.');

    // Check if the 'intelearn' database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'intelearn'");
    if (res.rowCount === 0) {
      // Create the database
      await client.query("CREATE DATABASE intelearn");
      console.log("Database 'intelearn' created successfully.");
    } else {
      console.log("Database 'intelearn' already exists.");
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
  }
}

createDatabase();
