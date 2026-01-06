const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

async function checkUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT id, email, role FROM "AdminUser"');
    console.log("AdminUsers found:", res.rows);
    await client.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkUsers();
