const Listing = require("../models/listing");

//Index Route
module.exports.index = async(req,res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
    res.render("listings/edit", { listing });
};

//Update Route
module.exports.update = async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.delete = async(req,res) =>{
    let { id } = req.params;
    let  deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};