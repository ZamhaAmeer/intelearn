const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'Yukkeshan25',
  host: 'localhost',
  port: 5432,
  database: 'postgres' // Connect to default database
});

async function createDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL default database.");
    await client.query('CREATE DATABASE "Learnora"');
    console.log("✅ Database 'Learnora' created successfully!");
  } catch (err) {
    if (err.code === '42P04') {
        console.log("✅ Database 'Learnora' already exists.");
    } else {
        console.error("❌ Error creating database:", err.message);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
