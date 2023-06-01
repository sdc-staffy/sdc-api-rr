
const express = require('express');
const cors = require('cors');
//const logger = require('./logger');
const dbQuery = require('./dbFiles/dbRoutes.js')


const app = express()

app.use(cors());
//app.use(logger);
app.use(express.json());


app.get('/reviews', (req, res) => {
  var start = performance.now();
  const product_id = Number.parseInt(req.query.product_id);
  //const count = req.query.count ? req.query.count : null;
  //const count = req.query.count || 5;

  dbQuery.getReviews(product_id)
    .then((data) => res.send(data));
  var end = performance.now();
  console.log('getReviews route:', Math.floor(end-start), "ms" )

});

app.get('/reviews/meta', (req, res) => {
  const product_id = Number.parseInt(req.query.product_id);

  dbQuery.getReviewsMetadata(product_id)
    .then((data) => res.send(data));

  res.send('200 OK')
});

app.post('/reviews', (req, res) => {
  var start = performance.now();
  req = req.body;
  var end;
  dbQuery.addReview(product_id=req.product_id, rating=req.rating, summary=req.summary, body=req.body, recommend=req.recommend, reviewer_name=req.name, reviewer_email=req.email, photos=null, characteristics=null)
    .then(()=>{end=performance.now()});
  //var end = performance.now();
  var difference = end-start;
  console.log(Math.floor(difference, "ms"));
  res.send("201 CREATED")
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  //increments helpfulness based on review_id
  var start = performance.now();
  const review_id = Number.parseInt(req.params.review_id);
  dbQuery.markReviewAsHelpful(review_id)
  res.send("Status: 204 NO CONTENT")
  var end = performance.now();
  var difference = Math.floor(end-start);
  console.log('mark review helpful route:', difference, "ms" )
});

app.put('/reviews/:review_id/report', (req, res) => {
  //updates a review to show it was reported
  var start = performance.now();
  const review_id = Number.parseInt(req.params.review_id);
  dbQuery.reportReview(review_id)
  res.send("Status: 204 NO CONTENT")
  var end = performance.now();
  var difference = Math.floor(end-start);
  console.log('finished')
  console.log('report review route:', difference, "ms" )
});

module.exports = app;