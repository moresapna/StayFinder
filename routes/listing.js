const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    //Index Route
    .get (wrapAsync(listingController.index))
    //Create Route
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingController.create),
    ); 

//Search Route
router.get("/search", wrapAsync(listingController.search));

//Suggestions Route
router.get("/suggestions", wrapAsync(listingController.suggestions));

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
        upload.single('listing[image]'), 
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