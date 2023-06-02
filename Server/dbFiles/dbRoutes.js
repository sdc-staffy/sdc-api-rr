const db = require('./db');




const getReviews = (product_id) => {
  console.log('get reviews request')
  return db.query(`SELECT * FROM reviews WHERE product_id = ${product_id}`)
    .then((response) => {
      var reviews = {};
      reviews.product = product_id;
      var resultsArr = [];
      response.rows.forEach((reviewObj) => {
        var newObj = {
          review_id: reviewObj.review_id.toString(),
          rating: reviewObj.rating,
          summary: reviewObj.summary,
          recommend: reviewObj.recommend,
          response: reviewObj.response,
          body: reviewObj.body,
          date: new Date(Number(reviewObj.date)),
          reviewer_name: reviewObj.reviewer_name,
          helpfulness: reviewObj.helpfulness
        }
        resultsArr.push(newObj);
      })
      reviews.results = resultsArr;
      return reviews;
    })
    .catch((err) => console.log('error getting reviews'));
}

const getReviewsMetadata = (product_id) => {
  //needs ratings
  //needs recommended
  //needs characteristics
}


const addReview = (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, photos, characteristics) => {
  var date = new Date().valueOf();
  var reported = false;
  var helpfulness = 0;
  var response = null;
  console.log("product id in addReview", product_id)
  return db.query(`INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
   VALUES ('${product_id}', '${rating}', '${date}', '${summary}', '${body}', '${recommend}', '${reported}', '${reviewer_name}', '${reviewer_email}', '${response}', '${helpfulness}');`)
     .then((response) => console.log('review added successfully'))
     .catch((err) => console.log('error adding review', err))
}


const markReviewAsHelpful = (review_id) => {

  //given a review_id, increment helpfulness
  return db.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${review_id};`)
    .then((response) => console.log('question marked helpful'))
    .catch((err) => console.log('error marking review as helpful', err))
}


const reportReview = (review_id) => {

  //given a review_id, set reported to true
  return db.query(`UPDATE reviews SET reported = true WHERE review_id = ${review_id};`)
    .then((response) => console.log('review reported'))
    .catch((err) => console.log('error reporting review', err))
}


module.exports.getReviews = getReviews;
module.exports.getReviewsMetadata = getReviewsMetadata;
module.exports.addReview = addReview;
module.exports.markReviewAsHelpful = markReviewAsHelpful;
module.exports.reportReview = reportReview;
