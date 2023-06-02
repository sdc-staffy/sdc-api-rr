
const express = require('express');
const cors = require('cors');
//const logger = require('./logger');
const dbQuery = require('./dbFiles/dbRoutes.js')
//const { performance } = require('perf_hooks');


const app = express()

app.use(cors());
//app.use(logger);
app.use(express.json());


app.get('/reviews', (req, res) => {

  const product_id = Number.parseInt(req.query.product_id);
  //const count = req.query.count ? req.query.count : null;
  //const count = req.query.count || 5;

  dbQuery.getReviews(product_id)
    .then((data) => res.send(data))
    .catch((err)=> {
      console.log('error getting reviews')
      res.send(err)
    });




});

app.get('/reviews/meta', (req, res) => {
  const product_id = Number.parseInt(req.query.product_id);

  dbQuery.getReviewsMetadata(product_id)
    .then((data) => res.send(data));

  res.send('200 OK')
});

app.post('/reviews', (req, res) => {

  req = req.body;

  dbQuery.addReview(product_id=req.product_id, rating=req.rating, summary=req.summary, body=req.body, recommend=req.recommend, reviewer_name=req.name, reviewer_email=req.email, photos=null, characteristics=null)


  res.send("201 CREATED")
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  //increments helpfulness based on review_id

  const review_id = Number.parseInt(req.params.review_id);
  dbQuery.markReviewAsHelpful(review_id)
  res.send("Status: 204 NO CONTENT")

});

app.put('/reviews/:review_id/report', (req, res) => {
  //updates a review to show it was reported

  const review_id = Number.parseInt(req.params.review_id);
  dbQuery.reportReview(review_id)
  res.send("Status: 204 NO CONTENT")

});

app.get('/loaderio-2a401cd0e34d94166699036c58b6df18', (req, res) => {
  res.send('loaderio-2a401cd0e34d94166699036c58b6df18')
})

module.exports = app;