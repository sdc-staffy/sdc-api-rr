require('dotenv').config();

const app = require('./index.js');
const etl = require('../ETLpostgres.js');

app.listen(process.env.PORT);
console.log(`Server listening at http://localhost:${process.env.PORT}`);

//initial seed of postgres database
const resetPostgresDatabase = false;
if (resetPostgresDatabase) {
  etl.RR()
}
