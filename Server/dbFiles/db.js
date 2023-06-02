const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});

db.connect()
  .then(()=> console.log('Connected to PostgreSQL, listening on port 5432'))
  .catch((err) => console.log('postgres connection error', err));




module.exports = db;