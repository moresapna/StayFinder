const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

router
    .route("/")
    //Index Route
    .get (wrapAsync(listingController.index))
    //Create Route
    .post(
        isLoggedIn,
        validateListing, 
        wrapAsync(listingController.create)
    );

//New Route
router.get("/new", isLoggedIn, listingController.new);

router
    .route("/:id")
    //Show Route
    .get(wrapAsync (listingController.show))
    //Update Route
    .put(
        isLoggedIn, 
        isOwner, 
        validateListing, 
        wrapAsync (listingController.update)
    )
    //Delete Route
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync (listingController.delete)
    );

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.edit));

module.exports = router;