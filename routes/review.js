const express = require("express");
const router = express.Router( { mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isAuthorReview } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Reviews POST Route
router.post("/" ,isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

//Reviews Delete Route
router.delete("/:reviewId",isLoggedIn, isAuthorReview, wrapAsync(reviewController.deleteReview));

module.exports = router;