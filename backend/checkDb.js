const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'Yukkeshan25',
  host: 'localhost',
  port: 5432,
  database: 'Learnora'
});

async function checkTables() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public' AND table_type='BASE TABLE';
    `);
    console.log("Tables in Database:");
    console.table(res.rows);
    
    // Check if 'users' table exists and query it
    const hasUsers = res.rows.some(r => r.table_name.toLowerCase() === 'users');
    if (hasUsers) {
        const usersTable = res.rows.find(r => r.table_name.toLowerCase() === 'users').table_name;
        const users = await client.query(`SELECT id, full_name, email, role FROM "${usersTable}"`);
        console.log("Users Data:");
        console.table(users.rows);
    }
  } catch (err) {
    console.error("Error querying database:", err.message);
  } finally {
    await client.end();
  }
}

checkTables();
