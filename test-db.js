const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

async function testConnection() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query("SELECT NOW()");
    console.log("Current time from DB:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

testConnection();
