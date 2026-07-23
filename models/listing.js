const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { required } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: String,
    image: {
        filename: {
            type: String,

        },
        url: {
            type: String,
        },  
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Rooms",
            "Iconic Cities",
            "Mountains",
            "Castel",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic"
        ],
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;