require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path')
const { from: copyFrom} = require('pg-copy-streams');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});



const createReviewsTable = `
    CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        product_id INT,
        rating INT DEFAULT 0,
        date BIGINT,
        summary VARCHAR,
        body VARCHAR,
        recommend VARCHAR,
        reported BOOL DEFAULT false,
        reviewer_name VARCHAR,
        reviewer_email VARCHAR,
        response VARCHAR,
        helpfulness INT DEFAULT 0
    );`;

const createCharacteristicsTable = `
    CREATE TABLE characteristics (
        id SERIAL PRIMARY KEY,
        product_id INT,
        name VARCHAR
    );`;

const createCharacteristicsReviewsTable = `
    CREATE TABLE characteristicsreviews (
        id SERIAL PRIMARY KEY,
        characteristic_id INT,
        review_id INT,
        value INT,
        FOREIGN KEY (characteristic_id) REFERENCES characteristics (id),
        FOREIGN KEY (review_id) REFERENCES reviews (review_id)
    );`;

const createPhotosTable = `
    CREATE TABLE photos (
        id SERIAL PRIMARY KEY,
        review_id INT,
        url VARCHAR

    );`;

    //FOREIGN KEY (review_id) REFERENCES reviews (review_id)



const setupAllTables = async () => {
  try {
    await client.query('DROP TABLE IF EXISTS photos');
    console.log('tables dropped');
    //await client.query(createReviewsTable);
    //await client.query(createCharacteristicsTable);
    //await client.query(createCharacteristicsReviewsTable);
    await client.query(createPhotosTable);
  } catch (err) {
    console.log("Error setting up tables", err);
  }
}

const reviewsPath = path.join(__dirname, './csvFiles', 'reviews.csv');
const characteristicsPath = path.join(__dirname, './csvFiles', 'characteristics.csv');
const characteristicsReviewsPath = path.join(__dirname, './csvFiles', 'characteristic_reviews.csv');
const photosPath = path.join(__dirname, './csvFiles', 'reviews_photos.csv');

const loadReviews = async () => {
  const stream = fs.createReadStream(reviewsPath);
  const query = `COPY reviews FROM STDIN WITH (FORMAT csv, HEADER true)`;
  const copyStream = client.query(copyFrom(query));

  return new Promise((resolve, reject) => {
      stream
          .pipe(copyStream)
          .on('finish', resolve)
          .on('error', reject)
  })
}


const loadCharacteristics = async () => {
  const stream = fs.createReadStream(characteristicsPath);
  const query = `COPY characteristics FROM STDIN WITH (FORMAT csv, HEADER true)`;
  const copyStream = client.query(copyFrom(query));

  return new Promise((resolve, reject) => {
      stream
          .pipe(copyStream)
          .on('finish', resolve)
          .on('error', reject)
  })
}

const loadCharacteristicsReviews = async () => {
  const stream = fs.createReadStream(characteristicsReviewsPath);
  const query = `COPY characteristicsreviews FROM STDIN WITH (FORMAT csv, HEADER true)`;
  const copyStream = client.query(copyFrom(query));

  return new Promise((resolve, reject) => {
      stream
          .pipe(copyStream)
          .on('finish', resolve)
          .on('error', reject)
  })
}

const loadPhotos = async () => {
  const stream = fs.createReadStream(photosPath);
  const query = `COPY photos FROM STDIN WITH (FORMAT csv, HEADER true)`;
  const copyStream = client.query(copyFrom(query));

  return new Promise((resolve, reject) => {
      stream
          .pipe(copyStream)
          .on('finish', resolve)
          .on('error', reject)
  })
}

const loadAllData = async () => {
  try {
    //await loadReviews();
    //console.log("---> reviews table created");
    //await loadCharacteristics();
    //console.log("---> characteristics table created");
   // await loadCharacteristicsReviews();
    //console.log("---> characteristicsReviews table created");
    await loadPhotos();
    console.log("---> photos table created");
    console.log("Database reset successfull");
  } catch (err) {
    console.log("Error loading tables", err);
  }
}




const RR = async () => {
  try {
    console.log('connecting to client')
    await client.connect();
    await setupAllTables();
    await loadAllData();
    await client.end();
  } catch (error) {
    console.log('there was an error:', error);
  } finally {
    await client.end();
  }
};

//RR()

module.exports = {RR: RR}