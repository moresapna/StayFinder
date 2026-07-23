const Listing = require("../models/listing");

//Index Route
module.exports.index = async (req, res) => {
    const { category } = req.query;
    let allListings;
    let error = null;
    if (!category) {
        allListings = await Listing.find({});
    } else {
        allListings = await Listing.find({ category });
        if (allListings.length === 0) {
            error = `No listings found in ${category}.`;
        }
    }
    res.render("listings/index", {
        allListings,
        selectedCategory: category || "",
        error
    });
};

//New Route
module.exports.new = (req,res) =>{
    res.render("listings/new");
};

//Show Route
module.exports.show = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if(! listing) {
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

//Create Route
module.exports.create = async(req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

//Edit Route
module.exports.edit = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(! listing) {
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/,w_250");
    res.render("listings/edit", { listing, originalImageUrl });
};

//Update Route
module.exports.update = async(req ,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (typeof req.file !==  "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();
        console.log(listing.image);
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.delete = async(req, res) =>{
    let { id } = req.params;
    let  deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

//Search Route
module.exports.search = async(req, res) => {
    const {search} = req.query;
    if(!search || search.trim() === ""){
        req.flash("error", "Please enter a destination!");
        return res.redirect("/listings");
    }
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: search, $options: "i"} },
            { location: { $regex: search, $options: "i"} },
            { country: { $regex: search, $options: "i"} },
        ]
    });
    if (allListings.length === 0) {
        req.flash("error", `No listings found for "${search}".`);
        return res.redirect("/listings");
    }
    res.render("listings/index", {allListings, selectedCategory: ""});
};

//Suggestions Route
module.exports.suggestions = async (req, res) => {
    const { search } = req.query;
    if (!search || search.trim() === "") {
        return res.json([]);
    }
    const regex = new RegExp(search, "i");
    const listings = await Listing.find({
        $or: [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ]
    }).select("title location country");
    const seen = new Set();
    const suggestions = [];
    for (const item of listings) {
        if (regex.test(item.title)) {
            const key = `title-${item.title.toLowerCase()}`;
            if (!seen.has(key)) {
                seen.add(key);
                suggestions.push({
                    _id: item._id,
                    type: "title",
                    value: item.title
                });
            }
        }
        if (regex.test(item.location)) {
            const key = `location-${item.location.toLowerCase()}`;
            if (!seen.has(key)) {
                seen.add(key);
                suggestions.push({
                    type: "location",
                    value: item.location
                });
            }
        }
        if (regex.test(item.country)) {
            const key = `country-${item.country.toLowerCase()}`;
            if (!seen.has(key)) {
                seen.add(key);
                suggestions.push({
                    type: "country",
                    value: item.country
                });
            }
        }
    }
    res.json(suggestions.slice(0, 8));
};